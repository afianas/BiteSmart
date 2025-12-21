# 🍽️ BiteSmart – AI Food Recognition & Nutrition Assistant

BiteSmart is an AI-powered food recognition system that identifies food items from images, estimates their calorie content, and suggests healthier alternatives. The project uses deep learning with EfficientNet and is deployed using FastAPI.

## 🚀 Features
- Image-based food recognition
- Top-5 food predictions with confidence scores
- Approximate calorie estimation
- Healthier food suggestions
- User authentication (login & register)
- REST API built with FastAPI

## 🧠 Model
- Architecture: EfficientNetB3 (Transfer Learning)
- Dataset: Food-41 / Food-101
- Accuracy: ~82–83% validation accuracy 
- Model file is excluded from the repo due to size

## 📈 Evaluation Metrics

- Top-1 Accuracy: ~0.83  
- Top-5 Accuracy: ~0.95  

Evaluation was performed on the validation split of the Food-41 / Food-101 dataset using categorical cross-entropy loss with label smoothing.


📦 **Model download:**  
https://drive.google.com/file/d/1Nz9kdW7M2VcIPts6RZf3gSTpqpbmUaEZ/view?usp=sharing 

## 🛠 Tech Stack
- TensorFlow / Keras
- FastAPI
- SQLite
- Python
- HTML / CSS / JavaScript

## ⚠️ Disclaimer
Calorie estimates are approximate and based on standard nutritional references.
