import { PredictionInput, PredictionResult, CountryData } from '../types';
import { exchangeRatesData } from './repoCode';

// List of supported countries and metropolitan data
export const countriesData: CountryData[] = [
  {
    name: 'USA',
    currency: 'USD',
    symbol: '$',
    basePricePerSqft: 450,
    avgAge: 18,
    cities: [
      { name: 'New York', multiplier: 1.25 },
      { name: 'San Francisco', multiplier: 1.35 },
      { name: 'Austin', multiplier: 0.95 }
    ]
  },
  {
    name: 'India',
    currency: 'INR',
    symbol: '₹',
    basePricePerSqft: 144, // Equivalent to ~12,000 INR per sqft
    avgAge: 12,
    cities: [
      { name: 'Mumbai', multiplier: 1.30 },
      { name: 'Delhi', multiplier: 1.05 },
      { name: 'Bangalore', multiplier: 0.95 }
    ]
  },
  {
    name: 'UK',
    currency: 'GBP',
    symbol: '£',
    basePricePerSqft: 445,
    avgAge: 32,
    cities: [
      { name: 'London', multiplier: 1.30 },
      { name: 'Manchester', multiplier: 0.90 },
      { name: 'Edinburgh', multiplier: 0.95 }
    ]
  },
  {
    name: 'Canada',
    currency: 'CAD',
    symbol: 'C$',
    basePricePerSqft: 233,
    avgAge: 22,
    cities: [
      { name: 'Toronto', multiplier: 1.15 },
      { name: 'Vancouver', multiplier: 1.25 },
      { name: 'Calgary', multiplier: 0.85 }
    ]
  },
  {
    name: 'Australia',
    currency: 'AUD',
    symbol: 'A$',
    basePricePerSqft: 250,
    avgAge: 15,
    cities: [
      { name: 'Sydney', multiplier: 1.25 },
      { name: 'Melbourne', multiplier: 1.10 },
      { name: 'Brisbane', multiplier: 0.85 }
    ]
  },
  {
    name: 'UAE',
    currency: 'AED',
    symbol: 'د.إ',
    basePricePerSqft: 300,
    avgAge: 8,
    cities: [
      { name: 'Dubai', multiplier: 1.20 },
      { name: 'Abu Dhabi', multiplier: 1.10 },
      { name: 'Sharjah', multiplier: 0.80 }
    ]
  }
];

// Helper to generate a seed-based realistic dataset of 200 properties for plotting and static analysis on fly
const generateStaticDataset = () => {
  const dataset: Array<{
    id: string;
    area_sqft: number;
    bedrooms: number;
    bathrooms: number;
    property_age: number;
    parking: number;
    property_type: string;
    city: string;
    country: string;
    price: number; // in USD
  }> = [];

  const types = ['Apartment', 'Studio', 'Penthouse', 'Villa', 'Townhouse'];
  const typeP = [0.4, 0.15, 0.1, 0.2, 0.15];
  
  // Custom deterministic pseudo-random generator
  let seed = 12345;
  const random = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  const selectWeighted = (arr: any[], weights: number[]) => {
    const r = random();
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      sum += weights[i];
      if (r <= sum) return arr[i];
    }
    return arr[arr.length - 1];
  };

  for (let i = 0; i < 200; i++) {
    const countryObj = countriesData[Math.floor(random() * countriesData.length)];
    const cityObj = countryObj.cities[Math.floor(random() * countryObj.cities.length)];
    const type = selectWeighted(types, typeP);
    
    let area = Math.floor(600 + random() * 3400);
    if (type === 'Studio') area = Math.floor(350 + random() * 400);
    if (type === 'Villa') area = Math.floor(2200 + random() * 2800);
    if (type === 'Penthouse') area = Math.floor(1800 + random() * 2200);

    let bedrooms = 1;
    if (area > 2800) bedrooms = Math.floor(4 + random() * 2);
    else if (area > 1800) bedrooms = Math.floor(3 + random() * 2);
    else if (area > 1000) bedrooms = Math.floor(2 + random() * 2);
    else if (area > 600) bedrooms = Math.floor(1 + random() * 2);
    
    const bathrooms = Math.max(1, bedrooms + Math.floor(random() * 2) - (random() < 0.2 ? 1 : 0));
    const parking = type === 'Villa' || type === 'Penthouse' ? Math.floor(1 + random() * 3) : Math.floor(random() * 2);
    const age = Math.floor(random() * 50);

    // Baseline calculation to feed the mock plots with highly correlated pricing
    const basePerSqft = countryObj.basePricePerSqft;
    const cityCoef = cityObj.multiplier;
    const typeCoef = type === 'Villa' ? 1.5 : type === 'Penthouse' ? 1.35 : type === 'Townhouse' ? 1.1 : type === 'Studio' ? 0.75 : 0.9;
    
    const baseVal = area * basePerSqft * cityCoef * typeCoef;
    const bedsBonus = bedrooms * 9000;
    const bathsBonus = bathrooms * 12000;
    const ageDiscount = Math.pow(0.992, age); // 0.8% drop each year
    const parkingBonus = parking * 15000;

    const noise = 1 + (random() * 0.08 - 0.04); // +/- 4% noise
    const finalPrice = Math.floor((baseVal + bedsBonus + bathsBonus + parkingBonus) * ageDiscount * noise);

    dataset.push({
      id: `H-${0 + i}`,
      area_sqft: area,
      bedrooms,
      bathrooms,
      property_age: age,
      parking,
      property_type: type,
      city: cityObj.name,
      country: countryObj.name,
      price: finalPrice
    });
  }

  return dataset;
};

export const sampleHouses = generateStaticDataset();

// Features weights (Simulated coefficients for Linear Regression vs Non-linear Random Forest trees)
export const featureImportances = [
  { feature: 'Property Area (sqft)', importance: 42, description: 'Single largest driver of valuation.' },
  { feature: 'Location Coefficient', importance: 28, description: 'Strong intercept adjustments for prime cities.' },
  { feature: 'Bathrooms Ratio', importance: 11, description: 'Value correlated to ensuite bathroom counts.' },
  { feature: 'Bedrooms Count', importance: 9, description: 'Total layout composition multiplier.' },
  { feature: 'Property Structural Age', importance: 6, description: 'Negative coefficient. Newer structures command primary premiums.' },
  { feature: 'Parking Spaces', importance: 4, description: 'Added convenience multiplier, heavily prized in urban metros.' }
];

// Linear Regression vs Random Forest Evaluation Metrics (Static constant display)
export const modelMetrics = {
  linear: {
    name: 'Linear Regression (Ridge)',
    mae: 28450.12,
    rmse: 36120.40,
    r2: 0.762,
    advantages: [
      'Extremely lightweight and fast execution',
      'Provides transparent coefficients for straight explanations',
      'Excellent baseline model with no overfitting'
    ],
    disadvantages: [
      'Cannot capture non-linear relationship (e.g. exponential age curves)',
      'Struggles with interactions (e.g., location value compounding with area)'
    ]
  },
  forest: {
    name: 'Random Forest Regression',
    mae: 14120.35,
    rmse: 19890.15,
    r2: 0.894,
    advantages: [
      'Successfully captures multi-variable interactive structures',
      'Models categorical non-linear trends seamlessly',
      'Highly robust against outliers and extreme data points'
    ],
    disadvantages: [
      'Heavier in file storage and execution latency',
      'Less transparent than direct coefficients (black box profile)'
    ]
  }
};

/**
 * Predict house price using mathematical modeling simulation
 */
export const predictHousePrice = (input: PredictionInput): PredictionResult => {
  const { area_sqft, bedrooms, bathrooms, property_age, parking, property_type, city, country, currency, selectedModel } = input as any;
  
  const countryObj = countriesData.find(c => c.name === country) || countriesData[0];
  const cityObj = countryObj.cities.find(c => c.name === city) || countryObj.cities[0];

  const basePerSqft = countryObj.basePricePerSqft;
  const cityCoef = cityObj.multiplier;
  
  // Property type multipliers
  const typeMultipliers: Record<string, number> = {
    'Apartment': 0.95,
    'Studio': 0.75,
    'Penthouse': 1.35,
    'Villa': 1.55,
    'Townhouse': 1.10
  };
  const typeCoef = typeMultipliers[property_type] || 1.0;

  let priceUSD = 0;
  let confidenceScore = 0.85;

  if (selectedModel === 'Linear Regression') {
    // Standard linear equation simulation: intercept + coeff1*area + coeff2*beds + coeff3*baths - coeff4*age + coeff5*parking
    const baseVal = area_sqft * basePerSqft * cityCoef * typeCoef;
    const bedsImpact = bedrooms * 8500;
    const bathsImpact = bathrooms * 11000;
    const ageImpact = -property_age * 1200; // Linear reduction
    const parkingImpact = parking * 12000;
    
    priceUSD = baseVal + bedsImpact + bathsImpact + ageImpact + parkingImpact;
    // Cap minimum floor
    if (priceUSD < 25000) priceUSD = 25000;
    confidenceScore = 0.76; // R2 represents standard linear accuracy
  } else {
    // Random forest with non-linear structures and interactions
    const baseVal = area_sqft * basePerSqft * cityCoef * typeCoef;
    
    // Non-linear combinations (e.g. beds together with bathrooms has compounding luxury value)
    const densityRatio = area_sqft / Math.max(bedrooms + bathrooms, 1);
    const roomBonus = (bedrooms * 9500) + (bathrooms * 13500);
    
    // Room density optimization penalty/bonus
    const premiumRatioBonus = densityRatio > 700 ? 15000 : densityRatio < 300 ? -12000 : 0;
    
    // Exponential decay age depreciation
    const ageMultiplier = Math.pow(0.991, property_age); // -0.9% compounded annually
    const parkingBonus = parking * 16500;
    
    // Compounding luxury factor (e.g. if Villa or Penthouse, parking and rooms are valued 15% higher)
    const luxuryCompounding = (property_type === 'Villa' || property_type === 'Penthouse') ? 1.15 : 1.0;

    priceUSD = ((baseVal + roomBonus + premiumRatioBonus + parkingBonus) * ageMultiplier) * luxuryCompounding;
    
    // Apply very minor local decision boundary noise to make predictions feel completely realistic
    // but stable for the same inputs (seed-based)
    const strRepr = `${area_sqft}-${bedrooms}-${bathrooms}-${property_age}`;
    let hash = 0;
    for (let j = 0; j < strRepr.length; j++) {
      hash = strRepr.charCodeAt(j) + ((hash << 5) - hash);
    }
    const noise = 1 + (((Math.abs(hash) % 100) / 100) * 0.04 - 0.02); // -2% to +2% stable variance
    priceUSD = priceUSD * noise;
    
    if (priceUSD < 20000) priceUSD = 20000;
    
    // RF is much more accurate and yields higher confidence score
    confidenceScore = 0.89 + (Math.abs(hash) % 5) / 100; // 0.89 to 0.93
  }

  // Currency Conversions
  const exCode = currency || 'USD';
  const rate = (exchangeRatesData as any)[exCode] || 1.0;
  const convertedPrice = priceUSD * rate;
  
  // Set up details of the features breakdown
  const featuresBreakdown = [
    {
      feature: 'Base Land/Structure Value',
      impact: Math.floor(area_sqft * basePerSqft * cityCoef * typeCoef),
      description: `Sqft area size (${area_sqft}) valued at country base rate plus local city coefficient (${cityCoef.toFixed(2)}x) and property modifier.`
    },
    {
      feature: 'Room Densities & Layout',
      impact: Math.floor((bedrooms * 9000) + (bathrooms * 12000)),
      description: `Composition factor modeling ${bedrooms} Bed(s) and ${bathrooms} Bath(s).`
    },
    {
      feature: 'Structural Age Adjustments',
      impact: Math.floor(selectedModel === 'Linear Regression' ? (-property_age * 1200) : (priceUSD - Math.floor(priceUSD / Math.pow(0.991, property_age)))),
      description: `Depreciation loss on construction materials over ${property_age} year(s).`
    },
    {
      feature: 'Parking & Conveniences',
      impact: Math.floor(parking * 15000),
      description: `Parking slots allocation (${parking}) with utility adjustments.`
    }
  ];

  return {
    priceInUSD: Math.round(priceUSD),
    predictedPrice: Math.round(priceUSD),
    convertedPrice: Math.round(convertedPrice),
    currencySymbol: countryObj.symbol,
    currencyCode: exCode,
    exchangeRateUsed: rate,
    confidenceScore: Math.round(confidenceScore * 100) / 100,
    selectedModel,
    featuresBreakdown
  };
};
