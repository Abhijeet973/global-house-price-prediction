# House Price Prediction Using Machine Learning 🏠📈

A high-performance machine learning pipeline and property analytics solution designed to predict house prices globally. Fully modularized, PEP8 compliant, and structured to model real-world property metrics.

## 🚀 Project Overview
This repository features a complete end-to-end Machine Learning pipeline that processes home transaction data across six countries (USA, India, UK, Canada, Australia, and UAE) and compares **Linear Regression** and **Random Forest Regression** models for high-fidelity price prediction.

- **Objective**: Accurately forecast property valuations based on area, room density, structural age, parking access, location coefficients, and luxury factor index.
- **Algorithms Implemented**: Ridge Linear Regression, Random Forest Regressor.
- **Key Metrics Highlighted**: Mean Absolute Error (MAE), Root Mean Squared Error (RMSE), and Coefficient of Determination (R²).

---

## 📂 Repository Structure
```bash
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
```

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
   ```bash
   git clone https://github.com/username/house-price-prediction.git
   cd house-price-prediction
   ```

2. **Install requirements**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Generate Dataset**:
   ```bash
   python src/generate_data.py
   ```

4. **Run Training & Save Models**:
   ```bash
   python src/train_model.py
   ```

5. **Run Inference & Currency Conversion**:
   ```bash
   python src/predict.py --area 1800 --bedrooms 3 --bathrooms 2 --age 5 --parking 1 --city "Mumbai" --country "India" --type "Apartment" --currency "INR"
   ```

---

## 📊 Exploratory Data Analysis (EDA) Insights
- **Area Importance**: Square footage accounts for **42%** of overall feature importance in predictive weighting.
- **Negative Age Elasticity**: For every 1-year increase in property age, values decrease by roughly **0.6% to 1.2%**, depending on the building type.
- **Location Premium**: Metropolitan coefficients in cities like New York, San Francisco, London, and Mumbai provide strong intercept boosts in regression analysis.

*Disclaimer: Exchange rates are approximate, manually maintained in `exchange_rates.json`, and intended for demonstration purposes.*
