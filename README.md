# BiteSmart: AI-Powered Food Recognition System

## 1. Project Overview

**BiteSmart** is an end-to-end AI-powered system designed to classify food images and instantly estimate their nutritional and caloric content. Built on a convolutional neural network (CNN) backbone and integrated with a modern web interface, BiteSmart seamlessly bridges deep learning with real-world dietary tracking.

The system is designed with real-world applicability in mind, demonstrating a robust architecture spanning from client-side image processing and intuitive UI to high-performance model inference on the backend. It serves as a comprehensive example of deploying computer vision models into production-level web applications.

---

## 2. Model Architecture

At the core of BiteSmart is a deep learning classification engine utilizing **EfficientNetB3** as its foundational architecture.

### Architecture
- **Base Model:** EfficientNetB3 (Convolutional Neural Network)
- **Methodology:** Transfer learning leveraging ImageNet pretrained weights to accelerate convergence and improve feature extraction.

### Training Strategy
- **Phase 1 (Feature Extraction):** Initial training was performed with a frozen base model to train the newly added classification head without destroying learned spatial features.
- **Phase 2 (Fine-Tuning):** The upper layers of the EfficientNet base were subsequently unfrozen and fine-tuned to adapt specifically to food-related textural and color patterns.
- **Data Augmentation:** To ensure robustness and prevent overfitting, the training pipeline heavily unlizes spatial and color augmentations including random flips, rotations, zooming, and contrast adjustments.

### Input & Output Specifications
- **Input:** Standardized image tensor of size `260 × 260` matching EfficientNetB3 requirements.
- **Output:** A customized dense layer applying a Softmax activation function to output a probability distribution across **101 distinct food classes**.

### Optimization & Regularization
- **Regularization:** Includes explicit Dropout (rate: 0.5) to prevent co-adaptation, Batch Normalization to stabilize internal covariate shifts, and Label Smoothing to calibrate model confidence boundaries.
- **Optimizer:** Adam optimizer paired with a dynamic learning rate scheduling policy to gently decay the learning rate upon plateauing.

---

## 3. Training Performance and Evaluation

The model was rigorously evaluated strictly on a holdout validation split to ensure accurate measurement of generalized performance. 

- **Initial Validation Accuracy:** ~65% (Following initial frozen-base training)
- **Final Validation Accuracy:** ~82.8% (Following deep fine-tuning phase)
- **Top-1 Accuracy:** ~0.83 (The model's single highest-probability prediction perfectly matches the true label 83% of the time).
- **Top-5 Accuracy:** ~0.95 (The correct food class appears within the model's top 5 highest-probability predictions 95% of the time).

By achieving extremely high Top-5 accuracy, BiteSmart ensures that even in ambiguous edge-cases, the correct food option is actively surfaced to the user as a closely matched alternative.

---

## 4. Dataset

The system was trained leveraging the **Food-101** (adapted to Food-41 where necessary) dataset.

- **Scale:** Approximately 101,000 images distributed evenly across 101 diverse food classes.
- **Splits:** A strict 80-20 Train-Validation split was enforced to prevent data leakage.
- **Dataset Strengths:** The dataset is exceptionally large-scale and contains a wide variety of lighting, angles, and intra-class variances, forcing the model to learn deep semantic representations rather than superficial correlations.
- **Dataset Limitations & Bias:** The dataset skews heavily toward Western and general international cuisines. **Generalization to local, regional cuisines (e.g., specific Indian, Southeast Asian, or African cuisines) is inherently limited** entirely due to these dataset constraints.

---

## 5. System Architecture

The project employs a modern, decoupled microservice architecture:

- **Frontend (Presentation Layer):** A React single-page application built via Vite, providing a seamless file upload zone, instant image previews, and a sleek, animated results interface.
- **Backend (API Layer):** Built with FastAPI for high-throughput, async request handling to orchestrate model inference and database interactions.
- **ML Pipeline (Inference Layer):** Accepts encoded images, performs dynamic `260x260` tensor preprocessing, executes the EfficientNet Keras inference, and maps the output softmax array into Top-K predictions.
- **Data Layer (Nutritional Mapping):** A local CSV-based database utilizing offline fuzzy matching to rapidly map predicted string classes to approximate caloric profiles.

---

## 6. Tech Stack

**Frontend:**
- React 19 (Vite)
- Axios (HTTP client)
- Framer Motion (Animations)
- Fuse.js (Client-side fuzzy search)
- PapaParse (CSV Parsing)

**Backend:**
- Python 3.12 
- FastAPI
- Uvicorn
- SQLAlchemy (Database ORM)

**Machine Learning:**
- TensorFlow / Keras
- EfficientNetB3
- Pillow / NumPy (Data manipulation)

---

## 7. Functional Requirements

BiteSmart is guaranteed to execute the following core user flows:
1. Allow users to effortlessly upload a food image via drag-and-drop or file selection.
2. Accurately predict the dominant food category in the image.
3. Display clear metrics:
    - Primary **Top-1 prediction**.
    - **Top-5 alternatives** presented cleanly to the user.
    - Explicit **confidence scores** for full prediction transparency.
4. Retrieve and display corresponding calorie estimations via dynamic fuzzy mapping.
5. Provide graceful error handling for invalid files, unidentifiable objects ("uncertain" status), and API failures.

---

## 8. Non-Functional Requirements

- **Performance:** Ensure low latency inference for the end-user (sub-2 second roundtrip response).
- **Scalability:** The decoupled architecture must permit the FastAPI backend to scale horizontally to support concurrent users.
- **Usability:** Present an intuitive, premium, modern UI that requires zero onboarding to utilize.
- **Reliability:** The ML model must provide consistent predictions invariant to slight image rotations or lighting changes.

---

## 9. Trade-offs and Design Decisions

- **EfficientNetB3 over MobileNet:** We chose EfficientNetB3 to heavily favor accuracy and compound scaling over the sheer computational speed of lighter models, accepting the slightly increased parameter footprint as a worthwhile trade-off for an 82.8% top-1 accuracy.
- **Transfer Learning over Training from Scratch:** Utilizing ImageNet weights dramatically reduced required training epochs (faster training), though it potentially limited the model's domain adaptation solely to low-level texture extraction rather than deep food-specific structural biases.
- **CSV-Based Calorie System over External API:** Implementing an internal CSV structure offers unparalleled simplicity, offline capability, and zero external costs, trading off against the infinite scalability and automatic updates of a premium nutrition API.
- **Client-Side Fuzzy Matching:** Utilizing `Fuse.js` on the React frontend offloads processing from the ML server resulting in a snappier UI, but restricts the size of the calorie matrix we can reasonably ship to client browsers.

---

## 10. Scalability and Production Considerations

To evolve BiteSmart into an enterprise-ready system, the following optimizations are planned:

- **Model Optimization:** Convert the Keras model weights to TensorFlow Lite or ONNX formats, and deploy onto dedicated GPU-based inference environments (e.g., NVIDIA TensorRT).
- **Backend Infrastructure:** Dockerize the FastAPI/Uvicorn applications to orchestrate over Kubernetes with a dedicated Load Balancer managing asynchronous request queues.
- **Data Architecture:** Fully deprecate the in-memory CSV solution and migrate purely to a managed PostgreSQL or MongoDB database instance.
- **Frontend Delivery:** Continually optimize asset bundles and deploy globally via a CDN (e.g., Vercel or AWS CloudFront) to minimize latency for distributed users.

---

## 11. Limitations

- **Single Object Localization:** The current CNN architecture acts as an image classifier, not an object detector. It **cannot accurately detect or separate multiple food items** present in a single image.
- **No Volume Context:** The system lacks spatial awareness to estimate portion sizes or volumetric density.
- **Lookup Consistency:** Calorie estimations are fundamentally approximate and rely on static, string-based lookup maps.
- **Domain Bias:** As stated, generalization to complex regional cuisines (like Indian, Southeast Asian) is explicitly limited due to the Food-101 training distribution.

---

## 12. Future Improvements

- **Object Detection Integration:** Upgrade the pipeline from basic Classification to Object Detection (e.g., YOLOv8) to bound and identify multi-food plates.
- **Depth & Scale Estimation:** Integrate depth-map approximation alongside image capture metadata to mathematically estimate physical portion sizes.
- **Granular Nutritional Breakdown:** Expand the dataset beyond calories to track macros (Proteins, Fats, Carbs) and micronutrients.
- **User Ecosystem:** Build comprehensive user authentication, dietary tracking histories, and goal setting logic.
- **Mobile Capabilities:** Package the optimized TensorFlow Lite model directly into a React Native application for zero-latency, offline, on-device inference.

---

## 13. Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # (or venv\Scripts\activate on Windows)
   ```
3. Install dependencies: `pip install -r requirements.txt`
4. Configure environment: Ensure your `.env` file is properly seeded with `DATABASE_URL`.
5. Start the API Server: `uvicorn main:app --reload`

### Model Setup
- Ensure your trained Keras model (`best_effnetb3.keras`) is explicitly placed in the `backend/models/` directory prior to backend initialization.

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install npm packages: `npm install`
3. Launch the development server: `npm run dev`
4. Access the UI at `http://localhost:5173`

---

## 14. Conclusion

BiteSmart effectively demonstrates the immense power and utility of CNN-based approaches in applied computer vision. By rigidly controlling the training pipeline and heavily utilizing fine-tuning, the EfficientNetB3 backbone reliably achieved highly competitive validation numbers mapping directly to a smooth user experience. The surrounding system architecture was purposefully engineered with scalability in mind, firmly bridging the gap between an experimental ML notebook and a robust, production-capable software product.
