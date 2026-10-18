import pytest
import numpy as np
from fastapi.testclient import TestClient
from PIL import Image
import os
import nibabel as nib

from app.main import app
from app.config import TEMP_DIR

client = TestClient(app)

@pytest.fixture(scope="module")
def setup_dummy_data():
    TEMP_DIR.mkdir(parents=True, exist_ok=True)
    
    # Create dummy PNG
    png_path = TEMP_DIR / "dummy.png"
    img = Image.fromarray(np.random.randint(0, 255, (224, 224, 3), dtype=np.uint8))
    img.save(png_path)

    # Note: Full pipeline test with NIFTI requires ANTs template downloading,
    # which takes time and internet. For smoke test, we test the PNG path primarily,
    # and mock or rely on unit tests for NIFTI if needed.
    
    yield {"png_path": str(png_path)}
    
    # Teardown
    if png_path.exists():
        os.remove(png_path)

def test_png_pipeline(setup_dummy_data):
    # Upload
    with open(setup_dummy_data["png_path"], "rb") as f:
        response = client.post("/api/upload", files={"file": ("dummy.png", f, "image/png")})
    assert response.status_code == 200
    data = response.json()
    assert data["is_png"] is True
    file_path = data["path"]

    # Preprocess
    response = client.post("/api/preprocess", json={"file_path": file_path, "is_nifti": False})
    assert response.status_code == 200
    p_data = response.json()
    assert "slice_png_path" in p_data

    # Predict (Note: this will load the keras model, may take a moment)
    response = client.post("/api/predict", json={"slice_png_path": p_data["slice_png_path"]})
    assert response.status_code == 200
    res_data = response.json()
    
    assert "predicted_class" in res_data
    assert "confidence_ad" in res_data
    assert "shap_image_base64" in res_data
    assert "lime_image_base64" in res_data
    assert "gradcam_images_base64" in res_data
