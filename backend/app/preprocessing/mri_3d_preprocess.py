import os
import numpy as np
import nibabel as nib
try:
    import ants
    import antspynet
    ANTS_AVAILABLE = True
except ImportError:
    ANTS_AVAILABLE = False
from ..config import BRAIN_EXTRACTION_MODALITY, REGISTRATION_TRANSFORM

def minmax_norm_3d(volume):
    volume = np.nan_to_num(
        np.asarray(volume, dtype=np.float32),
        nan=0.0,
        posinf=0.0,
        neginf=0.0,
    )
    vmin = float(volume.min())
    vmax = float(volume.max())
    if vmax - vmin <= 1e-8:
        return np.zeros_like(volume, dtype=np.float32)
    return ((volume - vmin) / (vmax - vmin)).astype(np.float32)

def preprocess_mri_to_ants(source_path: str):
    """
    Runs the exact ANTs preprocessing pipeline extracted from actual_1 notebook.
    Note: Requires MNI152 template.
    """
    if not ANTS_AVAILABLE:
        raise Exception("ANTs/antspynet is not installed due to Python compatibility. Please run with Python 3.10/3.11 for NIFTI processing.")
        
    source_img = ants.image_read(str(source_path))
    
    # Brain extraction
    brain_probability = antspynet.brain_extraction(
        source_img,
        modality=BRAIN_EXTRACTION_MODALITY,
    )
    brain_img = source_img * brain_probability
    
    # Fetch template
    template_path_on_disk = ants.get_ants_data("mni")
    template_img = ants.image_read(template_path_on_disk)
    
    # Registration
    registration = ants.registration(
        fixed=template_img,
        moving=brain_img,
        type_of_transform=REGISTRATION_TRANSFORM,
    )
    registered_img = registration["warpedmovout"]
    
    # Normalization
    registered_data = minmax_norm_3d(registered_img.numpy())
    
    normalized_img = ants.from_numpy(
        registered_data,
        origin=registered_img.origin,
        spacing=registered_img.spacing,
        direction=registered_img.direction,
    )
    
    return normalized_img, registered_data
