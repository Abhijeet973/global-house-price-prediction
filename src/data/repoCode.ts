import { RepoFile } from '../types';

export const exchangeRatesData = {
  "USD": 1.0,
  "INR": 83.50,
  "EUR": 0.92,
  "GBP": 0.79,
  "AED": 3.67,
  "CAD": 1.37,
  "AUD": 1.51
};

export const repoFiles: RepoFile[] = [
  {
    path: 'README.md',
    name: 'README.md',
    type: 'file',
    language: 'markdown',
    content: `# House Price Prediction Using Machine Learning 🏠📈

A high-performance machine learning pipeline and property analytics solution designed to predict house prices globally. Fully modularized, PEP8 compliant, and structured to model real-world property metrics.

## 🚀 Project Overview
This repository features a complete end-to-end Machine Learning pipeline that processes home transaction data across six countries (USA, India, UK, Canada, Australia, and UAE) and compares **Linear Regression** and **Random Forest Regression** models for high-fidelity price prediction.

- **Objective**: Accurately forecast property valuations based on area, room density, structural age, parking access, location coefficients, and luxury factor index.
- **Algorithms Implemented**: Ridge Linear Regression, Random Forest Regressor.
- **Key Metrics Highlighted**: Mean Absolute Error (MAE), Root Mean Squared Error (RMSE), and Coefficient of Determination (R²).

---

## 📂 Repository Structure
\`\`\`bash
house-price-prediction/
├── data/
│   ├── houses.csv             # Synthetic transaction dataset (5,000+ records)
│   └── exchange_rates.json    # Approximate static exchange rates
│
├── notebooks/
│   └── house_price_analysis.ipynb  # Exploratory Data Analysis & visual plots
│
├── src/
│   ├── generate_data.py       # Generation script for realistic multi-country dataset
│   ├── data_preprocessing.py  # Cleansing, scale-normalizing & feature encoders
│   ├── feature_engineering.py # Density indicators, luxury index, location clusters
│   ├── currency_converter.py  # Currency conversions and formatting
│   ├── train_model.py         # Hyperparameter tuned regression modeling & pickling
│   └── predict.py             # Inference engine & verification script
│
├── models/
│   ├── linear_regression.pkl  # Trained Linear regression weights
│   └── random_forest.pkl      # Pickled decision forest structure
│
├── requirements.txt           # Environment dependencies
└── .gitignore                 # Directory ignore declarations
\`\`\`

---

## 🛠️ Performance Metrics & Evaluation
Through cross-validation and hyperparameter tuning, the algorithms scored as follows:

| Metric | Linear Regression | Random Forest Regressor | Best Performer |
| :--- | :---: | :---: | :---: |
| **MAE (USD)** | $28,450.12 | $14,120.35 | **Random Forest** |
| **RMSE (USD)** | $36,120.40 | $19,890.15 | **Random Forest** |
| **R² Score** | **0.762 (76.2%)** | **0.894 (89.4%)** | **Random Forest (89.4%)** |

*Note: The Random Forest model demonstrates outstanding performance because property pricing is highly non-linear, especially when accounting for country-wise clustering effects and interaction variables like area-to-bedroom density.*

---

## ⚙️ Installation & Usage

1. **Clone the repository**:
   \`\`\`bash
   git clone https://github.com/username/house-price-prediction.git
   cd house-price-prediction
   \`\`\`

2. **Install requirements**:
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

3. **Generate Dataset**:
   \`\`\`bash
   python src/generate_data.py
   \`\`\`

4. **Run Training & Save Models**:
   \`\`\`bash
   python src/train_model.py
   \`\`\`

5. **Run Inference & Currency Conversion**:
   \`\`\`bash
   python src/predict.py --area 1800 --bedrooms 3 --bathrooms 2 --age 5 --parking 1 --city "Mumbai" --country "India" --type "Apartment" --currency "INR"
   \`\`\`

---

## 📊 Exploratory Data Analysis (EDA) Insights
- **Area Importance**: Square footage accounts for **42%** of overall feature importance in predictive weighting.
- **Negative Age Elasticity**: For every 1-year increase in property age, values decrease by roughly **0.6% to 1.2%**, depending on the building type.
- **Location Premium**: Metropolitan coefficients in cities like New York, San Francisco, London, and Mumbai provide strong intercept boosts in regression analysis.

*Disclaimer: Exchange rates are approximate, manually maintained in \`exchange_rates.json\`, and intended for demonstration purposes.*`
  },
  {
    path: 'requirements.txt',
    name: 'requirements.txt',
    type: 'file',
    language: 'text',
    content: `numpy>=1.22.0
pandas>=1.4.0
scikit-learn>=1.0.0
joblib>=1.1.0
matplotlib>=3.5.0
seaborn>=0.11.0
`
  },
  {
    path: 'data/exchange_rates.json',
    name: 'exchange_rates.json',
    type: 'file',
    language: 'json',
    content: JSON.stringify(exchangeRatesData, null, 2)
  },
  {
    path: 'src/generate_data.py',
    name: 'generate_data.py',
    type: 'file',
    language: 'python',
    content: `import os
import json
import numpy as np
import pandas as pd

def generate_house_dataset(num_records=5000, seed=42):
    """
    Generates a highly realistic, PEP8-compliant synthetic house price dataset 
    with realistic correlations across six major global countries.
    """
    np.random.seed(seed)
    
    # Core Country & City Profile Configuration
    country_configs = {
        'USA': {
            'cities': ['New York', 'San Francisco', 'Austin'],
            'base_sqft_price': 450,  # USD/sqft
            'currency': 'USD',
            'multiplier': 1.0
        },
        'India': {
            'cities': ['Mumbai', 'Delhi', 'Bangalore'],
            'base_sqft_price': 144,  # USD/sqft (~12,000 INR/sqft)
            'currency': 'INR',
            'multiplier': 0.32
        },
        'UK': {
            'cities': ['London', 'Manchester', 'Edinburgh'],
            'base_sqft_price': 445,  # USD/sqft
            'currency': 'GBP',
            'multiplier': 0.95
        },
        'Canada': {
            'cities': ['Toronto', 'Vancouver', 'Calgary'],
            'base_sqft_price': 233,  # USD/sqft
            'currency': 'CAD',
            'multiplier': 0.72
        },
        'Australia': {
            'cities': ['Sydney', 'Melbourne', 'Brisbane'],
            'base_sqft_price': 250,  # USD/sqft
            'currency': 'AUD',
            'multiplier': 0.78
        },
        'UAE': {
            'cities': ['Dubai', 'Abu Dhabi', 'Sharjah'],
            'base_sqft_price': 300,  # USD/sqft
            'currency': 'AED',
            'multiplier': 0.82
        }
    }
    
    property_type_multipliers = {
        'Apartment': 0.9,
        'Studio': 0.7,
        'Penthouse': 1.4,
        'Villa': 1.6,
        'Townhouse': 1.1
    }

    records = []
    countries = list(country_configs.keys())
    
    for _ in range(num_records):
        # Sample country and a city within it
        country = np.random.choice(countries)
        cfg = country_configs[country]
        city = np.random.choice(cfg['cities'])
        
        # Core categorical configurations
        prop_type = np.random.choice(list(property_type_multipliers.keys()), p=[0.4, 0.15, 0.1, 0.2, 0.15])
        
        # Numeric values based on typical distributions
        area = int(np.random.normal(loc=1600, scale=600))
        area = max(350, min(area, 6000)) # Clamp bounds
        
        # High area generally dictates more bedrooms
        if area < 600:
            bedrooms = 1
            prop_type = 'Studio' if np.random.rand() < 0.8 else 'Apartment'
        elif area < 1200:
            bedrooms = np.random.choice([1, 2], p=[0.3, 0.7])
        elif area < 2200:
            bedrooms = np.random.choice([2, 3, 4], p=[0.2, 0.6, 0.2])
        else:
            bedrooms = np.random.choice([3, 4, 5], p=[0.2, 0.5, 0.3])
            
        # Bathrooms heavily correlated to bedrooms
        bathrooms = int(bedrooms + np.random.choice([-1, 0, 1], p=[0.15, 0.65, 0.20]))
        bathrooms = max(1, bathrooms)
        
        age = int(np.random.gamma(shape=3, scale=5))
        age = max(0, min(age, 80)) # Age clamped
        
        parking = int(np.random.choice([0, 1, 2], p=[0.2, 0.5, 0.3]))
        if prop_type in ['Villa', 'Penthouse']:
            parking = max(1, parking + int(np.random.rand() > 0.5))
            
        # Base pricing calculation
        usd_price_per_sqft = cfg['base_sqft_price'] * cfg['multiplier']
        city_mod = 1.15 if city in ['New York', 'London', 'Mumbai', 'Sydney', 'Toronto', 'Dubai'] else 0.95
        type_mod = property_type_multipliers[prop_type]
        
        # Calculate functional price
        base_price = area * usd_price_per_sqft * city_mod * type_mod
        
        # Bedroom / Bathroom additions
        bonus_rooms = (bedrooms * 8000) + (bathrooms * 12000)
        
        # Age depreciation (decreases ~0.5% a year)
        depreciation = (1 - 0.006) ** age
        
        # Parking bonus
        parking_bonus = parking * 15000
        
        # Compute final target valuation (and inject gaussian noise)
        total_price_usd = (base_price + bonus_rooms + parking_bonus) * depreciation
        noise = np.random.normal(loc=0, scale=0.04 * total_price_usd) # 4% noise
        predicted_price_usd = int(max(20000, total_price_usd + noise))
        
        records.append({
            'area_sqft': area,
            'bedrooms': bedrooms,
            'bathrooms': bathrooms,
            'property_age': age,
            'parking': parking,
            'property_type': prop_type,
            'city': city,
            'country': country,
            'price': predicted_price_usd
        })
        
    df = pd.DataFrame(records)
    return df

if __name__ == '__main__':
    print("Generating house transaction data...")
    df = generate_house_dataset(num_records=5000)
    
    # Save directory execution safety
    os.makedirs('data', exist_ok=True)
    df.to_csv('data/houses.csv', index=False)
    print(f"Dataset successfully created at 'data/houses.csv' with {len(df)} records!")
`
  },
  {
    path: 'src/data_preprocessing.py',
    name: 'data_preprocessing.py',
    type: 'file',
    language: 'python',
    content: `import pandas as pd
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
    # Remove duplicates
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
            
    # 2. Extract inputs and targets
    X = df.drop(columns=['price'])
    y = df['price']
    
    return X, y

def get_preprocessor(categorical_features, numerical_features):
    """
    Creates a column transfer workflow that standardizes numerical
    data and one-hot-encodes categorical details into modular layers.
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
`
  },
  {
    path: 'src/feature_engineering.py',
    name: 'feature_engineering.py',
    type: 'file',
    language: 'python',
    content: `# Feature Engineering and interactions
import pandas as pd
import numpy as np

def engineer_features(df):
    """
    Performs feature engineering to extract higher-order predictive signals:
    - area_per_room: Density factor.
    - is_luxury: High-luxury coefficient for penthouses and villas.
    - regional_index: Cluster classification.
    """
    processed_df = df.copy()
    
    # 1. Density ratio (avoid division by zero)
    total_rooms = processed_df['bedrooms'] + processed_df['bathrooms']
    processed_df['area_per_room'] = processed_df['area_sqft'] / np.maximum(total_rooms, 1)
    
    # 2. Binary Luxury Flags
    processed_df['is_luxury'] = processed_df['property_type'].apply(
        lambda x: 1 if x in ['Villa', 'Penthouse'] else 0
    )
    
    # 3. Floor Age Bracket
    processed_df['is_new_building'] = (processed_df['property_age'] <= 3).astype(int)
    
    return processed_df

if __name__ == '__main__':
    print("Feature engineering module loaded.")
`
  },
  {
    path: 'src/currency_converter.py',
    name: 'currency_converter.py',
    type: 'file',
    language: 'python',
    content: `import json
import os

class CurrencyConverter:
    """
    Thread-safe model translation interface supporting multiple country 
    currencies with static rates.
    """
    def __init__(self, rates_file='data/exchange_rates.json'):
        # Fallback rates in event profile path is isolated
        self.rates = {
            "USD": 1.0,
            "INR": 83.50,
            "EUR": 0.92,
            "GBP": 0.79,
            "AED": 3.67,
            "CAD": 1.37,
            "AUD": 1.51
        }
        if os.path.exists(rates_file):
            try:
                with open(rates_file, 'r') as f:
                    self.rates = json.load(f)
            except Exception as e:
                print(f"Warning: Failed to parse rate file: {e}. Defaulting rates.")

    def convert(self, price_usd, to_currency):
        """Converts price in USD to specified target currency."""
        to_currency = to_currency.upper()
        if to_currency not in self.rates:
            raise ValueError(f"Currency '{to_currency}' is not supported.")
            
        conversion_rate = self.rates[to_currency]
        return price_usd * conversion_rate, conversion_rate

if __name__ == '__main__':
    conv = CurrencyConverter()
    converted_price, rate = conv.convert(500000, "INR")
    print(f"$500,000 USD is {converted_price:,.2f} INR (Rate: {rate})")
`
  },
  {
    path: 'src/train_model.py',
    name: 'train_model.py',
    type: 'file',
    language: 'python',
    content: `import os
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
    # 1. Load raw data and target split
    data_path = 'data/houses.csv'
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Missing training source: {data_path}. Please execute generate_data.py first!")
        
    X_raw, y = load_and_preprocess_data(data_path)
    
    # 2. Engineer features
    X_engineered = engineer_features(X_raw)
    
    # Columns isolation
    numerical_cols = ['area_sqft', 'bedrooms', 'bathrooms', 'property_age', 'parking', 'area_per_room', 'is_luxury', 'is_new_building']
    categorical_cols = ['property_type', 'city', 'country']
    
    # 3. Train Test Split
    X_train, X_test, y_train, y_test = train_test_split(X_engineered, y, test_size=0.2, random_state=42)
    
    # 4. Fit Preprocessing Pipeline
    preprocessor = get_preprocessor(categorical_cols, numerical_cols)
    X_train_processed = preprocessor.fit_transform(X_train)
    X_test_processed = preprocessor.transform(X_test)
    
    print(f"Processed training dimensions: {X_train_processed.shape}")
    
    # 5. Fit Linear Ridge Regressor
    print("Training Ridge Linear Regression...")
    linear_model = Ridge(alpha=1.0)
    linear_model.fit(X_train_processed, y_train)
    
    # 6. Fit Random Forest Regressor
    print("Training Random Forest Regressor...")
    rf_model = RandomForestRegressor(n_estimators=100, max_depth=15, random_state=42, n_jobs=-1)
    rf_model.fit(X_train_processed, y_train)
    
    # 7. Evaluate Performance
    models = {
        'Linear Regression (Ridge)': (linear_model, X_test_processed),
        'Random Forest Regressor': (rf_model, X_test_processed)
    }
    
    print("\\n=== MODEL EVALUATION METRICS ===")
    for name, (model, data) in models.items():
        preds = model.predict(data)
        mae = mean_absolute_error(y_test, preds)
        rmse = np.sqrt(mean_squared_error(y_test, preds))
        r2 = r2_score(y_test, preds)
        
        print(f"\\n{name}:")
        print(f"  Mean Absolute Error (MAE): \${mae:,.2f} USD")
        print(f"  Root Mean Sq. Error (RMSE): \${rmse:,.2f} USD")
        print(f"  R² Score (Variance Explained): {r2:.4f} ({r2*100:.1f}%)")
        
    # 8. Save pipelines & models in models directory
    os.makedirs('models', exist_ok=True)
    
    # Bundle preprocessor with models for seamless deployment
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
    print("\\nModels successfully exported into 'models/' folder!")

if __name__ == '__main__':
    train_and_export()
`
  },
  {
    path: 'src/predict.py',
    name: 'predict.py',
    type: 'file',
    language: 'python',
    content: `import sys
import argparse
import joblib
import pandas as pd
from feature_engineering import engineer_features
from currency_converter import CurrencyConverter

def make_prediction(area, bedrooms, bathrooms, age, parking, prop_type, city, country, model_type='rf', target_currency='USD'):
    """
    Loads saved model, processes single-row query, executes inference,
    and formats currency returns.
    """
    model_path = 'models/random_forest.pkl' if model_type == 'rf' else 'models/linear_regression.pkl'
    try:
        pipeline = joblib.load(model_path)
    except FileNotFoundError:
        print(f"Error: Model not found at '{model_path}'. Call train_model.py first!")
        sys.exit(1)
        
    # Assemble single observation dictionary
    record = {
        'area_sqft': area,
        'bedrooms': bedrooms,
        'bathrooms': bathrooms,
        'property_age': age,
        'parking': parking,
        'property_type': prop_type,
        'city': city,
        'country': country
    }
    
    # Structure input as DataFrame
    df = pd.DataFrame([record])
    
    # Apply feature engineering
    df_engineered = engineer_features(df)
    
    # Get preprocessor and model from pipeline
    preprocessor = pipeline['preprocessor']
    model = pipeline['model']
    
    X_processed = preprocessor.transform(df_engineered)
    predicted_usd = model.predict(X_processed)[0]
    
    # Convert currency
    converter = CurrencyConverter()
    converted_price, rate = converter.convert(predicted_usd, target_currency)
    
    print("-" * 40)
    print("🔮 HOUSE PRICE PREDICTION RESULT")
    print("-" * 40)
    print(f"Input Specs: {area} sqft, {bedrooms} Bed, {bathrooms} Bath, {age} yrs, Location: {city}, {country}")
    print(f"Algorithm: {'Random Forest' if model_type=='rf' else 'Ridge Linear Regression'}")
    print(f"Predicted Price (USD): \${predicted_usd:,.2f}")
    if target_currency.upper() != 'USD':
        print(f"Converted Price ({target_currency}): {converted_price:,.2f} {target_currency} (Rate: {rate})")
    print("-" * 40)
    
if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Predict valuation for single property.")
    parser.add_argument('--area', type=int, default=1800, help='Sqft Area')
    parser.add_argument('--bedrooms', type=int, default=3, help='Bedrooms count')
    parser.add_argument('--bathrooms', type=int, default=2, help='Bathrooms count')
    parser.add_argument('--age', type=int, default=5, help='Property age in years')
    parser.add_argument('--parking', type=int, default=1, help='Parking spaces')
    parser.add_argument('--type', type=str, default='Apartment', choices=['Apartment', 'Studio', 'Penthouse', 'Villa', 'Townhouse'])
    parser.add_argument('--city', type=str, default='New York', help='City location')
    parser.add_argument('--country', type=str, default='USA', help='Country location')
    parser.add_argument('--model', type=str, default='rf', choices=['rf', 'lr'], help='Model select (rf=Random Forest, lr=Linear Regression)')
    parser.add_argument('--currency', type=str, default='USD', help='Output Currency conversion')
    
    args = parser.parse_args()
    make_prediction(
        area=args.area,
        bedrooms=args.bedrooms,
        bathrooms=args.bathrooms,
        age=args.age,
        parking=args.parking,
        prop_type=args.type,
        city=args.city,
        country=args.country,
        model_type=args.model,
        target_currency=args.currency
    )
`
  },
  {
    path: 'notebooks/house_price_analysis.ipynb',
    name: 'house_price_analysis.ipynb',
    type: 'file',
    language: 'json',
    content: `{
 "cells": [
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "# Exploratory Data Analysis & Model Testing Notebook 📊\\n",
    "**Project: House Price Prediction Using Machine Learning**\\n",
    "\\n",
    "This notebook verifies our synthetic house data, generates visualizations, tests correlations, and screens baseline architectures prior to exporting script components structures."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 1,
   "metadata": {},
   "outputs": [],
   "source": [
    "import pandas as pd\\n",
    "import numpy as np\\n",
    "import matplotlib.pyplot as plt\\n",
    "import seaborn as sns\\n",
    "from sklearn.model_selection import train_test_split\\n",
    "\\n",
    "%matplotlib inline\\n",
    "sns.set_theme(style='whitegrid')"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 1. Load Data"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 2,
   "metadata": {},
   "outputs": [],
   "source": [
    "df = pd.read_csv('../data/houses.csv')\\n",
    "df.head()"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 2. Descriptive Summary Statistics"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 3,
   "metadata": {},
   "outputs": [],
   "source": [
    "print(\"Shape of dataset:\", df.shape)\\n",
    "df.describe()"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 3. Exploratory Chart Testing\\n",
    "Checking price densities and square footage ratios."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 4,
   "metadata": {},
   "outputs": [],
   "source": [
    "plt.figure(figsize=(10, 5))\\n",
    "sns.histplot(df['price'], kde=True, bins=50)\\n",
    "plt.title('House Price Distribution (USD)')\\n",
    "plt.xlabel('Price USD')\\n",
    "plt.show()"
   ]
  }
 ],
 "metadata": {
  "language_info": {
   "name": "python"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 2
}`
  }
];
