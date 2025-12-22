import io
import numpy as np
import tensorflow as tf
from PIL import Image
from tensorflow.keras.applications.efficientnet import preprocess_input
from .class_names import CLASS_NAMES

# ------------------------
# Config (IMPORTANT)
# ------------------------
MODEL_PATH = "models/best_effnetb3.keras"
CONFIDENCE_THRESHOLD = 0.5
IMG_SIZE = (260, 260)  # ✅ EfficientNet standard

# ------------------------
# Load model ONCE
# ------------------------
model = tf.keras.models.load_model(MODEL_PATH)

# ------------------------
# Helper: Top-5 predictions
# ------------------------
def get_top5(preds):
    top5_idx = preds.argsort()[-5:][::-1]
    return [
        {
            "label": CLASS_NAMES[i],
            "confidence": float(preds[i])
        }
        for i in top5_idx
    ]

# ------------------------
# Main prediction function
# ------------------------
def predict_food(image_bytes):
    # 1️⃣ Read image
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    # 2️⃣ Resize
    img = img.resize(IMG_SIZE)

    # 3️⃣ Convert to array
    arr = np.array(img)

    # 4️⃣ Add batch dimension
    arr = np.expand_dims(arr, axis=0)

    # 5️⃣ ✅ CRITICAL FIX (THIS WAS MISSING)
    arr = preprocess_input(arr)

    # 🔍 Debug (keep temporarily)
    print("IMG SHAPE:", arr.shape)
    print("IMG MIN/MAX:", arr.min(), arr.max())

    # 6️⃣ Predict
    preds = model.predict(arr)[0]

    print("RAW PREDS:", preds)
    print("MAX CONF:", preds.max())
    print("CLASS INDEX:", preds.argmax())

    top1_idx = int(np.argmax(preds))
    top1_conf = float(preds[top1_idx])
    top1_label = CLASS_NAMES[top1_idx]

    # 7️⃣ Confidence threshold
    if top1_conf < CONFIDENCE_THRESHOLD:
        return {
            "status": "uncertain",
            "message": "Model not confident enough. Try another image.",
            "top_5": get_top5(preds)
        }

    # 8️⃣ Success
    return {
        "status": "success",
        "food": top1_label,
        "confidence": top1_conf,
        "top_5": get_top5(preds)
    }
