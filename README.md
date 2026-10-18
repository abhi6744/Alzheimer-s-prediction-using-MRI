# Alzheimer's Disease Detection Web App

This is a complete web application (FastAPI backend + React frontend) for detecting Alzheimer's Disease (AD) vs. Cognitively Normal (CN) from MRI scans.

It supports:
1. **Raw 3D NIFTI files (.nii, .nii.gz)**: Automatically skull-strips, registers to MNI152, normalizes, and extracts the middle axial slice.
2. **Preprocessed 2D Slices (.png)**: Instantly performs inference on pre-extracted slices.

It provides explainable AI (XAI) using SHAP, LIME, and Grad-CAM++ for each branch of the ensemble model.

## Setup Instructions

### 1. Place the Model
Make sure the Keras ensemble model is located at `project/models/best_ensemble_model (1).keras`.

### 2. Backend Setup
The backend requires Python 3.9+ and the dependencies in `requirements.txt`. Note: NIFTI preprocessing uses `antspyx` and `antspynet`.
```bash
cd backend
pip install -r requirements.txt
```

Run the backend server:
```bash
uvicorn app.main:app --reload
```
The API will be available at `http://localhost:8000`.

### 3. Frontend Setup
The frontend is a React application built with Vite, TypeScript, and Tailwind CSS.
```bash
cd frontend
npm install
npm run dev
```
The app will be available at `http://localhost:5173`.

### 4. Running Tests
You can run the backend smoke tests using pytest:
```bash
cd backend
pytest tests/
```
