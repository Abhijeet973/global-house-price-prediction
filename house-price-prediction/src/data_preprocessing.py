import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer

def load_and_preprocess_data(file_path):
    """
    Loads raw CSV data, performs exploratory cleaning, separates targets,
    and isolates training parameters.
    """
    df = pd.read_csv(file_path)
    
    # 1. Basic Cleaning
    df = df.drop_duplicates()
    
    # Ensure numerical column integrity
    df['area_sqft'] = pd.to_numeric(df['area_sqft'], errors='coerce')
    df['price'] = pd.to_numeric(df['price'], errors='coerce')
    
    # Handle any nulls if present (median/mode replacement)
    num_cols = ['area_sqft', 'bedrooms', 'bathrooms', 'property_age', 'parking']
    for col in num_cols:
        if df[col].isnull().any():
            df[col] = df[col].fillna(df[col].median())
            
    cat_cols = ['property_type', 'city', 'country']
    for col in cat_cols:
        if df[col].isnull().any():
            df[col] = df[col].fillna(df[col].mode()[0])
            
    # X/y split
    X = df.drop(columns=['price'])
    y = df['price']
    
    return X, y

def get_preprocessor(categorical_features, numerical_features):
    """
    Creates a column transfer workflow that standardizes numerical
    data and one-hot-encodes categorical details.
    """
    numeric_transformer = StandardScaler()
    categorical_transformer = OneHotEncoder(drop='first', sparse_output=False, handle_unknown='ignore')
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numerical_features),
            ('cat', categorical_transformer, categorical_features)
        ])
    return preprocessor

if __name__ == '__main__':
    print("Preprocessing workflow successfully set up!")
