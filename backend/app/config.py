import os
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent.parent
MODEL_PATH = BASE_DIR / "models" / "best_ensemble_model (1).keras"
TEMP_DIR = BASE_DIR / "temp"

# Create temp directory if it doesn't exist
TEMP_DIR.mkdir(parents=True, exist_ok=True)

# Preprocessing Constants
TARGET_FULL = (96, 96, 96)
TARGET_ROI = (64, 64, 64)
ROI_FRAC = 0.5
BRAIN_EXTRACTION_MODALITY = "t1"
REGISTRATION_TRANSFORM = "SyN"

# Slicing Constants
MIDDLE_AXIS = 2
PNG_SIZE = (224, 224)

# Model Constants
INPUT_SHAPE = (224, 224, 3)
CLASSES = ['AD', 'CN']

# Grad-CAM target layers (last conv layers of the 4 branches)
GRADCAM_TARGET_LAYERS = {
    "resnet50": "conv5_block3_out",
    "efficientnetb0": "top_activation",
    "densenet121": "relu",
    "vgg16": "block5_conv3"
}
