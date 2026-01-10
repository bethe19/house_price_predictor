import pandas as pd
import numpy as np
import pickle
import json
import datetime
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from tensorflow import keras
from tensorflow.keras import layers

def preprocess_data(df):
    df_processed = df.copy()
    
    binary_cols = ['mainroad', 'guestroom', 'basement', 'hotwaterheating', 'airconditioning', 'prefarea']
    for col in binary_cols:
        df_processed[col] = df_processed[col].map({'yes': 1, 'no': 0})
    
    le = LabelEncoder()
    df_processed['furnishingstatus'] = le.fit_transform(df_processed['furnishingstatus'])
    
    return df_processed, le

def create_model(input_dim):
    model = keras.Sequential([
        layers.Dense(128, activation='relu', input_shape=(input_dim,)),
        layers.Dropout(0.3),
        layers.Dense(64, activation='relu'),
        layers.Dropout(0.3),
        layers.Dense(32, activation='relu'),
        layers.Dropout(0.2),
        layers.Dense(16, activation='relu'),
        layers.Dense(1)
    ])
    
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=0.001),
        loss='mse',
        metrics=['mae']
    )
    
    return model

def train_model():
    project_root = Path(__file__).parent.parent
    
    dataset_path = project_root / "Housing.csv"
    if not dataset_path.exists():
        raise FileNotFoundError(f"Dataset not found at {dataset_path}")
    
    print("Loading dataset...")
    df = pd.read_csv(dataset_path)
    print(f"Dataset shape: {df.shape}")
    
    print("Preprocessing data...")
    df_processed, label_encoder = preprocess_data(df)
    
    X = df_processed.drop('price', axis=1)
    y = df_processed['price']
    
    print("Splitting dataset...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    print("Scaling features...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    print("Creating model...")
    model = create_model(X_train_scaled.shape[1])
    
    print("Training model...")
    early_stopping = keras.callbacks.EarlyStopping(
        monitor='val_loss',
        patience=20,
        restore_best_weights=True
    )
    
    history = model.fit(
        X_train_scaled, y_train,
        validation_split=0.2,
        epochs=200,
        batch_size=32,
        verbose=1,
        callbacks=[early_stopping]
    )
    
    print("Evaluating model...")
    y_train_pred = model.predict(X_train_scaled, verbose=0)
    y_test_pred = model.predict(X_test_scaled, verbose=0)
    
    train_rmse = np.sqrt(mean_squared_error(y_train, y_train_pred))
    test_rmse = np.sqrt(mean_squared_error(y_test, y_test_pred))
    train_mae = mean_absolute_error(y_train, y_train_pred)
    test_mae = mean_absolute_error(y_test, y_test_pred)
    train_r2 = r2_score(y_train, y_train_pred)
    test_r2 = r2_score(y_test, y_test_pred)
    
    print(f"\n=== Model Performance ===")
    print(f"Training Set:")
    print(f"  RMSE: {train_rmse:,.2f}")
    print(f"  MAE:  {train_mae:,.2f}")
    print(f"  R²:   {train_r2:.4f}")
    print(f"\nTest Set:")
    print(f"  RMSE: {test_rmse:,.2f}")
    print(f"  MAE:  {test_mae:,.2f}")
    print(f"  R²:   {test_r2:.4f}")
    
    models_dir = project_root / "models"
    models_dir.mkdir(exist_ok=True)
    
    print("\nSaving model and preprocessing objects...")
    model_path = models_dir / "house_price_model.h5"
    model.save(model_path)
    
    scaler_path = models_dir / "scaler.pkl"
    with open(scaler_path, 'wb') as f:
        pickle.dump(scaler, f)
    
    label_encoder_path = models_dir / "label_encoder.pkl"
    with open(label_encoder_path, 'wb') as f:
        pickle.dump(label_encoder, f)
    
    feature_columns_path = models_dir / "feature_columns.pkl"
    with open(feature_columns_path, 'wb') as f:
        pickle.dump(X.columns.tolist(), f)
    
    model_info = {
        'version': '1.0.0',
        'trained_date': datetime.datetime.now().isoformat(),
        'algorithm': 'Neural Network Regression',
        'input_features': X.columns.tolist(),
        'furnishing_status_mapping': dict(zip(label_encoder.classes_, label_encoder.transform(label_encoder.classes_))),
        'metrics': {
            'train_rmse': float(train_rmse),
            'test_rmse': float(test_rmse),
            'train_mae': float(train_mae),
            'test_mae': float(test_mae),
            'train_r2': float(train_r2),
            'test_r2': float(test_r2)
        }
    }
    
    metrics_path = models_dir / "model_metrics.json"
    with open(metrics_path, 'w') as f:
        json.dump(model_info, f, indent=2)
    
    print(f"Model saved to: {model_path}")
    print(f"Scaler saved to: {scaler_path}")
    print(f"Label encoder saved to: {label_encoder_path}")
    print(f"Feature columns saved to: {feature_columns_path}")
    print(f"Metrics saved to: {metrics_path}")
    print("\nTraining completed successfully!")

if __name__ == "__main__":
    train_model()

