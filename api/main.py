from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import pickle
from pathlib import Path
from tensorflow import keras
try:
    from api.utils import load_preprocessing_objects, preprocess_input
except ImportError:
    from utils import load_preprocessing_objects, preprocess_input

app = FastAPI(
    title="House Price Prediction API",
    description="REST API for house price prediction using Neural Network Regression",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

project_root = Path(__file__).parent.parent
model_path = project_root / "models" / "house_price_model.h5"

model = None
scaler = None
label_encoder = None
feature_columns = None

def load_model():
    global model, scaler, label_encoder, feature_columns
    
    if not model_path.exists():
        raise FileNotFoundError(
            f"Model not found at {model_path}. Please run training/train_model.py first."
        )
    
    model = keras.models.load_model(model_path)
    scaler, label_encoder, feature_columns = load_preprocessing_objects(project_root)
    
    print("Model and preprocessing objects loaded successfully!")

@app.on_event("startup")
async def startup_event():
    load_model()

class HouseFeatures(BaseModel):
    area: float
    bedrooms: int
    bathrooms: int
    stories: int
    mainroad: str
    guestroom: str
    basement: str
    hotwaterheating: str
    airconditioning: str
    parking: int
    prefarea: str
    furnishingstatus: str

class PricePredictionResponse(BaseModel):
    predicted_price: float
    features: dict

@app.get("/")
async def root():
    return {
        "message": "House Price Prediction API",
        "status": "running",
        "endpoints": {
            "predict": "/predict",
            "health": "/health",
            "docs": "/docs"
        }
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "features": feature_columns if feature_columns else None
    }

@app.post("/predict", response_model=PricePredictionResponse)
async def predict_price(features: HouseFeatures):
    if model is None or scaler is None or label_encoder is None:
        raise HTTPException(
            status_code=500,
            detail="Model not loaded. Please ensure the model files exist."
        )
    
    try:
        feature_dict = features.dict()
        
        if feature_dict['furnishingstatus'] not in label_encoder.classes_:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid furnishingstatus. Must be one of: {list(label_encoder.classes_)}"
            )
        
        processed_data = preprocess_input(feature_dict, scaler, label_encoder, feature_columns)
        
        prediction = model.predict(processed_data, verbose=0)[0][0]
        
        return PricePredictionResponse(
            predicted_price=float(prediction),
            features=feature_dict
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error during prediction: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

