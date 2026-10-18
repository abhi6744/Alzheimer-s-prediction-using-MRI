import numpy as np
import nibabel as nib
from PIL import Image
import cv2
from ..config import MIDDLE_AXIS, PNG_SIZE

def minmax_norm(arr: np.ndarray) -> np.ndarray:
    arr = np.nan_to_num(arr.astype(np.float32))
    vmin, vmax = float(arr.min()), float(arr.max())
    return (arr - vmin) / (vmax - vmin + 1e-8)

def to_uint8(arr: np.ndarray) -> np.ndarray:
    arr = minmax_norm(arr)
    return (arr * 255.0).clip(0, 255).astype(np.uint8)

def extract_middle_slice(nii_path: str, out_png_path: str = None) -> np.ndarray:
    """
    Exact middle slice extraction method from verify_3d / ml_project_AD notebook.
    Returns RGB formatted array as expected by the model.
    """
    img = nib.load(str(nii_path))
    data = img.get_fdata().astype(np.float32)
    data = np.nan_to_num(data)

    mid_idx = data.shape[MIDDLE_AXIS] // 2
    if MIDDLE_AXIS == 0:
        slice_2d = data[mid_idx, :, :]
    elif MIDDLE_AXIS == 1:
        slice_2d = data[:, mid_idx, :]
    else:
        slice_2d = data[:, :, mid_idx]

    slice_2d = np.rot90(slice_2d)
    slice_uint8 = to_uint8(slice_2d)

    # Resize to PNG_SIZE and convert to RGB (since color_mode="rgb" was used in dataset loading)
    pil_img = Image.fromarray(slice_uint8).convert("L").resize(PNG_SIZE)
    if out_png_path:
        pil_img.save(out_png_path)
    
    # Model expects RGB
    img_rgb = pil_img.convert("RGB")
    return np.array(img_rgb)

def process_png_upload(png_path: str) -> np.ndarray:
    """
    If the user uploads a PNG directly, validate and process it.
    """
    pil_img = Image.open(png_path)
    if pil_img.mode != "L" and pil_img.mode != "RGB":
        pil_img = pil_img.convert("L")
    pil_img = pil_img.resize(PNG_SIZE)
    img_rgb = pil_img.convert("RGB")
    return np.array(img_rgb)
