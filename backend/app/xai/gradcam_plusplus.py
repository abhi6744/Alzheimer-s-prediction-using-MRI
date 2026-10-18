import tensorflow as tf
import numpy as np
import cv2
import io
import base64
import matplotlib.pyplot as plt

class GradCamPlusPlus:
    def __init__(self, model, target_layer_name):
        self.model = model
        self.target_layer_name = target_layer_name
        self.grad_model = self._build_grad_model()

    def _build_grad_model(self):
        try:
            target_layer = self.model.get_layer(self.target_layer_name)
            return tf.keras.models.Model(
                [self.model.inputs],
                [target_layer.output, self.model.output]
            )
        except Exception as e:
            print(f"Layer {self.target_layer_name} not found in model.")
            return None

    def explain(self, image: np.ndarray) -> str:
        """
        image shape: (224, 224, 3)
        Returns base64 encoded PNG of Grad-CAM++ overlaid on the original image.
        """
        if self.grad_model is None:
            return ""

        img_array = np.expand_dims(image, axis=0).astype(np.float32)

        with tf.GradientTape() as tape:
            conv_outputs, predictions = self.grad_model(img_array)
            # Binary classification (sigmoid), take the score
            class_score = predictions[:, 0]

        # First, Second, and Third order derivatives
        grads = tape.gradient(class_score, conv_outputs)
        
        # Grad-CAM++ implementation
        first_derivative = tf.exp(class_score) * grads
        second_derivative = tf.exp(class_score) * grads * grads
        third_derivative = tf.exp(class_score) * grads * grads * grads

        global_sum = tf.reduce_sum(conv_outputs[0], axis=(0, 1))
        
        alpha_num = second_derivative[0]
        alpha_denom = second_derivative[0] * 2.0 + third_derivative[0] * global_sum
        alpha_denom = tf.where(alpha_denom != 0.0, alpha_denom, tf.ones_like(alpha_denom))
        alphas = alpha_num / alpha_denom

        weights = tf.maximum(first_derivative[0], 0.0)
        alpha_normalization_constant = tf.reduce_sum(alphas, axis=(0,1))
        alphas_normalized = alphas / tf.reshape(alpha_normalization_constant, [1,1,-1])

        deep_linearization_weights = tf.reduce_sum(weights * alphas_normalized, axis=(0,1))
        
        cam = tf.reduce_sum(deep_linearization_weights * conv_outputs[0], axis=-1)
        cam = tf.maximum(cam, 0)
        cam = cam / (tf.reduce_max(cam) + 1e-8)
        cam = cam.numpy()

        cam_resized = cv2.resize(cam, (image.shape[1], image.shape[0]))
        heatmap = cv2.applyColorMap(np.uint8(255 * cam_resized), cv2.COLORMAP_JET)
        heatmap = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB)
        
        superimposed_img = cv2.addWeighted(image.astype(np.uint8), 0.5, heatmap, 0.5, 0)

        fig, ax = plt.subplots()
        ax.imshow(superimposed_img)
        ax.axis('off')
        
        buf = io.BytesIO()
        plt.savefig(buf, format='png', bbox_inches='tight')
        plt.close(fig)
        buf.seek(0)
        return base64.b64encode(buf.read()).decode('utf-8')
