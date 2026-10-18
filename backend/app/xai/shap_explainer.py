import shap
import numpy as np
import io
import base64
import matplotlib.pyplot as plt
from PIL import Image

class ShapExplainer:
    def __init__(self, model):
        self.model = model
        self.explainer = None
        # We need a background dataset for DeepExplainer
        # Since we serve a single image, we can use a zero baseline or normal noise
        # A static small background (e.g. zeros) works for deep explainer API
        self.background = np.zeros((10, 224, 224, 3), dtype=np.float32)
        
    def explain(self, image: np.ndarray) -> str:
        """
        image shape: (224, 224, 3)
        Returns base64 encoded PNG of the SHAP plot.
        """
        if self.explainer is None:
            # SHAP GradientExplainer is more stable with TF2 and custom layers like DepthwiseConv2D
            self.explainer = shap.GradientExplainer(self.model, self.background)
        
        img_batch = np.expand_dims(image, axis=0).astype(np.float32)
        
        # Calculate shap values
        shap_values = self.explainer.shap_values(img_batch)
        
        # Plot
        fig = plt.figure()
        shap.image_plot(shap_values, img_batch.astype(int), show=False)
        
        # Save to base64
        buf = io.BytesIO()
        plt.savefig(buf, format='png', bbox_inches='tight')
        plt.close(fig)
        buf.seek(0)
        img_base64 = base64.b64encode(buf.read()).decode('utf-8')
        return img_base64
