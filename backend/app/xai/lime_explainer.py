import numpy as np
import io
import base64
import matplotlib.pyplot as plt
from lime import lime_image
from skimage.segmentation import mark_boundaries

class LimeExplainer:
    def __init__(self, model):
        self.model = model
        self.explainer = lime_image.LimeImageExplainer()
        
    def _predict_fn(self, images):
        # LIME requires [prob_0, prob_1] for each image
        preds = self.model.predict(images, verbose=0)
        # Convert single sigmoid output to [prob_0, prob_1]
        # Where 0 = AD (1-p) and 1 = CN (p)
        return np.hstack((1 - preds, preds))

    def explain(self, image: np.ndarray) -> str:
        """
        image shape: (224, 224, 3)
        Returns base64 encoded PNG of the LIME plot.
        """
        explanation = self.explainer.explain_instance(
            image.astype('double'),
            self._predict_fn,
            top_labels=1,
            hide_color=0,
            num_samples=1000
        )
        
        temp, mask = explanation.get_image_and_mask(
            explanation.top_labels[0], 
            positive_only=True, 
            num_features=5, 
            hide_rest=False
        )
        
        fig, ax = plt.subplots()
        ax.imshow(mark_boundaries(temp / 255.0, mask)) # normalize to 0-1 for plotting if temp is 0-255
        ax.set_title("LIME Explanation")
        ax.axis('off')
        
        buf = io.BytesIO()
        plt.savefig(buf, format='png', bbox_inches='tight')
        plt.close(fig)
        buf.seek(0)
        return base64.b64encode(buf.read()).decode('utf-8')
