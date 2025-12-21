import tensorflow as tf
import numpy as np
from PIL import Image
from class_names import CLASS_NAMES


model = tf.keras.models.load_model("models/best_effnetb3.keras")


def predict_food(image_bytes):
    img = Image.open(image_bytes).resize((260,260))
    img = np.array(img) / 255.0
    img = np.expand_dims(img, axis=0)

    preds = model.predict(img)
    return CLASS_NAMES[np.argmax(preds)]
