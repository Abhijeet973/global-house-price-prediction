import sys
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
    
    df = pd.DataFrame([record])
    df_engineered = engineer_features(df)
    
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
    print(f"Predicted Price (USD): ${predicted_usd:,.2f}")
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
