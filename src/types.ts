export interface PredictionInput {
  area_sqft: number;
  bedrooms: number;
  bathrooms: number;
  property_age: number;
  parking: number;
  property_type: 'Apartment' | 'Villa' | 'Penthouse' | 'Townhouse' | 'Studio';
  city: string;
  country: string;
  currency: string;
}

export interface PredictionResult {
  priceInUSD: number;
  predictedPrice: number;
  convertedPrice: number;
  currencySymbol: string;
  currencyCode: string;
  exchangeRateUsed: number;
  confidenceScore: number;
  selectedModel: 'Linear Regression' | 'Random Forest Regression';
  featuresBreakdown: {
    feature: string;
    impact: number;
    description: string;
  }[];
}

export interface HistoricalPrediction extends PredictionInput {
  id: string;
  timestamp: string;
  predictedPriceUSD: number;
  selectedModel: string;
}

export interface CountryData {
  name: string;
  currency: string;
  symbol: string;
  basePricePerSqft: number; // in USD
  cities: { name: string; multiplier: number }[];
  avgAge: number;
}

export interface RepoFile {
  path: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  language?: string;
}

export type Theme = 'light' | 'dark';

export type ActiveTab = 'dashboard' | 'predictor' | 'analytics' | 'comparison' | 'repo' | 'about';
