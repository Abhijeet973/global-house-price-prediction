import os
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import Ridge
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# Self-defined module imports
from data_preprocessing import load_and_preprocess_data, get_preprocessor
from feature_engineering import engineer_features

def train_and_export():
    """
    Splits records into training/testing parameters, constructs Linear (Ridge) and
    Random Forest architectures, evaluates them side-by-side, and persists
    the optimized models.
    """
    data_path = 'data/houses.csv'
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Missing training source: {data_path}. Please execute generate_data.py first!")
        
    X_raw, y = load_and_preprocess_data(data_path)
    X_engineered = engineer_features(X_raw)
    
    numerical_cols = ['area_sqft', 'bedrooms', 'bathrooms', 'property_age', 'parking', 'area_per_room', 'is_luxury', 'is_new_building']
    categorical_cols = ['property_type', 'city', 'country']
    
    # Train Test Split
    X_train, X_test, y_train, y_test = train_test_split(X_engineered, y, test_size=0.2, random_state=42)
    
    # Fit Preprocessing Pipeline
    preprocessor = get_preprocessor(categorical_cols, numerical_cols)
    X_train_processed = preprocessor.fit_transform(X_train)
    X_test_processed = preprocessor.transform(X_test)
    
    print(f"Processed training dimensions: {X_train_processed.shape}")
    
    # Ridge model
    print("Training Ridge Linear Regression...")
    linear_model = Ridge(alpha=1.0)
    linear_model.fit(X_train_processed, y_train)
    
    # Random Forest model
    print("Training Random Forest Regressor...")
    rf_model = RandomForestRegressor(n_estimators=100, max_depth=15, random_state=42, n_jobs=-1)
    rf_model.fit(X_train_processed, y_train)
    
    models = {
        'Linear Regression (Ridge)': (linear_model, X_test_processed),
        'Random Forest Regressor': (rf_model, X_test_processed)
    }
    
    print("\n=== MODEL EVALUATION METRICS ===")
    for name, (model, data) in models.items():
        preds = model.predict(data)
        mae = mean_absolute_error(y_test, preds)
        rmse = np.sqrt(mean_squared_error(y_test, preds))
        r2 = r2_score(y_test, preds)
        
        print(f"\n{name}:")
        print(f"  Mean Absolute Error (MAE): ${mae:,.2f} USD")
        print(f"  Root Mean Sq. Error (RMSE): ${rmse:,.2f} USD")
        print(f"  R² Score (Variance Explained): {r2:.4f} ({r2*100:.1f}%)")
        
    os.makedirs('models', exist_ok=True)
    
    linear_pipeline = {
        'preprocessor': preprocessor,
        'model': linear_model,
        'features_num': numerical_cols,
        'features_cat': categorical_cols
    }
    rf_pipeline = {
        'preprocessor': preprocessor,
        'model': rf_model,
        'features_num': numerical_cols,
        'features_cat': categorical_cols
    }
    
    joblib.dump(linear_pipeline, 'models/linear_regression.pkl')
    joblib.dump(rf_pipeline, 'models/random_forest.pkl')
    print("\nModels successfully exported into 'models/' folder!")

if __name__ == '__main__':
    train_and_export()
