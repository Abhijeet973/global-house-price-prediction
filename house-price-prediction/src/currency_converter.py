import json
import os

class CurrencyConverter:
    """
    Thread-safe model translation interface supporting multiple country 
    currencies with static rates.
    """
    def __init__(self, rates_file='data/exchange_rates.json'):
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
