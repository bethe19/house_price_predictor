import pandas as pd
import numpy as np
import pickle
from pathlib import Path

def load_preprocessing_objects(project_root):
    models_dir = project_root / "models"
    
    with open(models_dir / "scaler.pkl", 'rb') as f:
        scaler = pickle.load(f)
    
    with open(models_dir / "label_encoder.pkl", 'rb') as f:
        label_encoder = pickle.load(f)
    
    with open(models_dir / "feature_columns.pkl", 'rb') as f:
        feature_columns = pickle.load(f)
    
    return scaler, label_encoder, feature_columns

def preprocess_input(data, scaler, label_encoder, feature_columns):
    binary_cols = ['mainroad', 'guestroom', 'basement', 'hotwaterheating', 'airconditioning', 'prefarea']
    
    df = pd.DataFrame([data])
    
    for col in binary_cols:
        if col in df.columns:
            df[col] = df[col].map({'yes': 1, 'no': 0}) if isinstance(df[col].iloc[0], str) else df[col]
    
    if 'furnishingstatus' in df.columns:
        df['furnishingstatus'] = label_encoder.transform(df['furnishingstatus'])
    
    df = df[feature_columns]
    
    scaled_data = scaler.transform(df)
    
    return scaled_data

