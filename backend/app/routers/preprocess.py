import os
import io
import base64
from pathlib import Path
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from PIL import Image
try:
    import ants
except ImportError:
    pass

from ..config import TEMP_DIR
from ..preprocessing.mri_3d_preprocess import preprocess_mri_to_ants
from ..preprocessing.slice_extraction import extract_middle_slice

router = APIRouter()

class PreprocessRequest(BaseModel):
    file_path: str
    is_nifti: bool

@router.post("/preprocess")
async def preprocess(request: PreprocessRequest):
    """
    If NIFTI, runs 3D preprocessing + extracts slice.
    Returns download url for preprocessed 3D MRI and a base64 preview of the slice.
    """
    source_path = Path(request.file_path)
    if not source_path.exists():
        raise HTTPException(status_code=404, detail="Uploaded file not found.")

    if request.is_nifti:
        try:
            # 1. 3D Preprocessing
            normalized_img, _ = preprocess_mri_to_ants(str(source_path))
            
            # Save preprocessed NIFTI
            preprocessed_nii_path = source_path.with_name(f"preprocessed_{source_path.name}")
            if not preprocessed_nii_path.name.endswith(".nii.gz"):
                preprocessed_nii_path = preprocessed_nii_path.with_suffix(".nii.gz")
            ants.image_write(normalized_img, str(preprocessed_nii_path))
            
            # 2. Extract 2D Slice
            png_path = source_path.with_suffix(".png")
            slice_rgb = extract_middle_slice(str(preprocessed_nii_path), str(png_path))
            
            # Convert slice to base64 for preview
            pil_img = Image.fromarray(slice_rgb)
            buf = io.BytesIO()
            pil_img.save(buf, format="PNG")
            preview_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
            
            return {
                "message": "3D Preprocessing successful",
                "preprocessed_nii_path": str(preprocessed_nii_path),
                "slice_png_path": str(png_path),
                "preview_base64": preview_base64
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Preprocessing failed: {str(e)}")
    else:
        # It's already a PNG, slicing was skipped
        return {
            "message": "PNG ready for prediction",
            "slice_png_path": str(source_path)
        }
