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
