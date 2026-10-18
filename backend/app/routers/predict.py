import numpy as np
from pathlib import Path
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ..models.ensemble_predictor import predictor
from ..preprocessing.slice_extraction import process_png_upload
from ..xai.shap_explainer import ShapExplainer
from ..xai.lime_explainer import LimeExplainer
from ..xai.gradcam_plusplus import GradCamPlusPlus
from ..schemas import PredictionResponse
from ..config import GRADCAM_TARGET_LAYERS

router = APIRouter()

class PredictRequest(BaseModel):
    slice_png_path: str

# Singleton Explainers
shap_explainer = None
lime_explainer = None
gradcam_explainers = {}

def init_explainers():
    global shap_explainer, lime_explainer, gradcam_explainers
    if predictor.model is None:
        predictor.load_model()
    if shap_explainer is None:
        shap_explainer = ShapExplainer(predictor.model)
    if lime_explainer is None:
        lime_explainer = LimeExplainer(predictor.model)
    if not gradcam_explainers:
        for branch, layer_name in GRADCAM_TARGET_LAYERS.items():
            gcam = GradCamPlusPlus(predictor.model, layer_name)
            if gcam.grad_model is not None:
                gradcam_explainers[branch] = gcam

@router.post("/predict", response_model=PredictionResponse)
async def predict_mri(request: PredictRequest):
    slice_path = Path(request.slice_png_path)
    if not slice_path.exists():
        raise HTTPException(status_code=404, detail="Slice image not found.")

    try:
        # Load and process PNG
        img_rgb = process_png_upload(str(slice_path))
        img_batch = np.expand_dims(img_rgb, axis=0) # shape (1, 224, 224, 3)

        # Predict
        results = predictor.predict(img_batch)[0]

        # Init explainers
        init_explainers()

        # Generate XAI
        shap_b64 = shap_explainer.explain(img_rgb)
        lime_b64 = lime_explainer.explain(img_rgb)
        
        gradcam_b64s = {}
        for branch, explainer in gradcam_explainers.items():
            b64 = explainer.explain(img_rgb)
            if b64:
                gradcam_b64s[branch] = b64

        return PredictionResponse(
            predicted_class=results["predicted_class"],
            confidence_ad=results["confidence_ad"],
            confidence_cn=results["confidence_cn"],
            shap_image_base64=shap_b64,
            lime_image_base64=lime_b64,
            gradcam_images_base64=gradcam_b64s
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
