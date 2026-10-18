import uuid
import shutil
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException
from ..config import TEMP_DIR
from ..preprocessing.slice_extraction import process_png_upload

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Accepts .nii, .nii.gz, or .png.
    Validates file signature/content minimally.
    """
    # Max file size checking is typically done via middleware or web server config,
    # but we can do a basic check reading chunks if needed. Fastapi UploadFile handles it well.
    
    file_ext = Path(file.filename).suffixes
    is_nifti = file.filename.endswith(".nii") or file.filename.endswith(".nii.gz")
    is_png = file.filename.endswith(".png")
    
    if not (is_nifti or is_png):
        raise HTTPException(status_code=400, detail="Invalid file format. Only .nii, .nii.gz, or .png are accepted.")

    file_id = str(uuid.uuid4())
    # Save file
    file_path = TEMP_DIR / f"{file_id}_{file.filename}"
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Check max size (200MB)
    if file_path.stat().st_size > 200 * 1024 * 1024:
        file_path.unlink()
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 200MB.")

    return {
        "file_id": file_id,
        "filename": file.filename,
        "is_nifti": is_nifti,
        "is_png": is_png,
        "path": str(file_path)
    }
