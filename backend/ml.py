import io
import numpy as np
import tensorflow as tf
from PIL import Image
from .class_names import CLASS_NAMES

MODEL_PATH = "models/best_effnetb3.keras"

# Load model ONCE
model = tf.keras.models.load_model(MODEL_PATH)

def predict_food(image_bytes):
    # Read image
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize((260, 260))

    # To numpy
    arr = np.array(img, dtype=np.float32)
    arr = np.expand_dims(arr, axis=0)

    # ✅ CORRECT preprocessing
    arr = tf.keras.applications.efficientnet.preprocess_input(arr)

    # Predict
    preds = model.predict(arr, verbose=0)[0]

    top5_idx = np.argsort(preds)[-5:][::-1]

    return [
        {
            "food": CLASS_NAMES[i],
            "confidence": round(float(preds[i]), 4)
        }
        for i in top5_idx
    ]
