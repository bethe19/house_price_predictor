# House Price Predictor

A machine learning project that predicts house prices based on various features using regression models.

## Description

This project implements a price prediction model that analyzes housing data and predicts prices based on features such as location, size, number of rooms, and other characteristics. It uses regression algorithms to provide accurate price estimates.

## How to Run

### Prerequisites
- Python 3.8+
- pip

### Installation

1. Clone the repository:
```bash
git clone https://github.com/bethe19/house_price_predictor.git
cd house_price_predictor
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
- On Windows:
```bash
venv\Scripts\activate
```
- On macOS/Linux:
```bash
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

### Running the Application

1. To start the API server:
```bash
python run_api.py
```

The API will be available at `http://localhost:5000`

2. To access the frontend:
- Navigate to the `frontend` directory in your browser

### Making Predictions

1. Send a POST request to the API with housing features
2. The API will return the predicted price
3. Features required: square footage, number of bedrooms, number of bathrooms, location, etc.

## Project Structure

- `api/` - REST API for predictions
- `frontend/` - Web interface
- `models/` - Trained model files
- `training/` - Training data and scripts
- `Housing.csv` - Training dataset
- `run_api.py` - Entry point for the API server
