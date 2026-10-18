from pydantic import BaseModel
from typing import Optional, Dict

class PredictionResponse(BaseModel):
    predicted_class: str
    confidence_ad: float
    confidence_cn: float
    shap_image_base64: str
    lime_image_base64: str
    gradcam_images_base64: Dict[str, str]

class PreprocessResponse(BaseModel):
    file_id: str
    message: str
    download_url: str
    preview_url: Optional[str] = None
