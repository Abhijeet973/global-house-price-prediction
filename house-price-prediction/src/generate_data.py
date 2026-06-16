import os
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
