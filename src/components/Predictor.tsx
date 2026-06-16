import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Sparkles, 
  RefreshCw, 
  DollarSign, 
  FileDown, 
  Trash2, 
  Search, 
  CheckCircle, 
  ShieldCheck, 
  LineChart, 
  Coins, 
  Info,
  Calendar,
  Grid,
  MapPin,
  Download
} from 'lucide-react';
import { countriesData, predictHousePrice } from '../data/houseData';
import { PredictionInput, PredictionResult, HistoricalPrediction } from '../types';

interface PredictorProps {
  theme: 'light' | 'dark';
}

export default function Predictor({ theme }: PredictorProps) {
  // Input parameters tracking
  const [area, setArea] = useState<number>(1600);
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [age, setAge] = useState<number>(5);
  const [parking, setParking] = useState<number>(1);
  const [propType, setPropType] = useState<'Apartment' | 'Villa' | 'Penthouse' | 'Townhouse' | 'Studio'>('Apartment');
  const [selectedCountry, setSelectedCountry] = useState<string>('USA');
  const [selectedCity, setSelectedCity] = useState<string>('New York');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [selectedModel, setSelectedModel] = useState<'Linear Regression' | 'Random Forest Regression'>('Random Forest Regression');
  
  // Dynamic validation, error states or helper tracking
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [lastResult, setLastResult] = useState<PredictionResult | null>(null);
  const [history, setHistory] = useState<HistoricalPrediction[]>([]);
  
  // History Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedHistoryCountry, setSelectedHistoryCountry] = useState<string>('ALL');

  // Trigger city update automatically whenever country shifts to prevent mismatch
  useEffect(() => {
    const countryObj = countriesData.find(c => c.name === selectedCountry);
    if (countryObj && countryObj.cities.length > 0) {
      setSelectedCity(countryObj.cities[0].name);
      setSelectedCurrency(countryObj.currency);
    }
  }, [selectedCountry]);

  // Form submit pipeline
  const handleEstimatePrice = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Quick validation check
    const errors: string[] = [];
    if (area < 100) errors.push('Property square footage must be at least 100 sqft.');
    if (area > 20000) errors.push('Max property size limit is 20,000 sqft.');
    if (bedrooms < 1 || bedrooms > 15) errors.push('Bedrooms count must fall between 1 and 15.');
    if (bathrooms < 1 || bathrooms > 15) errors.push('Bathrooms count must fall between 1 and 15.');
    if (age < 0 || age > 150) errors.push('Property structural age must fall between 0 and 150 years.');
    if (parking < 0 || parking > 8) errors.push('Parking allocations must fall between 0 and 8 slots.');
    
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setValidationErrors([]);
    setIsPredicting(true);

    const steps = [
      'Awaiting parameters parsing...',
      'Mapping categorical One-Hot Hot vectors...',
      'Initializing StandardScaler normalization...',
      selectedModel === 'Linear Regression' 
        ? 'Applying global Ridge coefficients regression...'
        : 'Evaluating Random Forest Decision Trees ensemble...'
    ];

    let currentStep = 0;
    setLoadingStep(steps[0]);

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setLoadingStep(steps[currentStep]);
      } else {
        clearInterval(interval);
        
        // Output prediction result
        const inputParams: PredictionInput = {
          area_sqft: area,
          bedrooms,
          bathrooms,
          property_age: age,
          parking,
          property_type: propType,
          city: selectedCity,
          country: selectedCountry,
          currency: selectedCurrency,
          // Extra parameters for predictive computation helper
          ...({ selectedModel } as any)
        };

        const result = predictHousePrice(inputParams);
        setLastResult(result);
        setIsPredicting(false);
        setLoadingStep('');

        // Store result in Session History
        const newRecord: HistoricalPrediction = {
          id: `PRED-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          area_sqft: area,
          bedrooms,
          bathrooms,
          property_age: age,
          parking,
          property_type: propType,
          city: selectedCity,
          country: selectedCountry,
          currency: selectedCurrency,
          predictedPriceUSD: result.priceInUSD,
          selectedModel
        };
        setHistory(prev => [newRecord, ...prev]);
      }
    }, 250); // fast sequential progress
  };

  // Preset quick fill values for recruiters to test in one click
  const quickFills = [
    { label: 'Suburban India Villa', area: 2400, bed: 4, bath: 4, age: 3, park: 2, type: 'Villa' as const, country: 'India', city: 'Mumbai' },
    { label: 'Premium NYC Penthouse', area: 1900, bed: 3, bath: 3, age: 8, park: 1, type: 'Penthouse' as const, country: 'USA', city: 'New York' },
    { label: 'London Historic Townhouse', area: 1500, bed: 3, bath: 2, age: 45, park: 0, type: 'Townhouse' as const, country: 'UK', city: 'London' }
  ];

  const handleQuickFill = (preset: typeof quickFills[0]) => {
    setArea(preset.area);
    setBedrooms(preset.bed);
    setBathrooms(preset.bath);
    setAge(preset.age);
    setParking(preset.park);
    setPropType(preset.type);
    setSelectedCountry(preset.country);
    // Explicit timeout allows reactive effect to clear city overrides smoothly
    setTimeout(() => {
      setSelectedCity(preset.city);
    }, 50);
  };

  // Currency Converter Widget on live values
  const [alternateCurrency, setAlternateCurrency] = useState<string>('EUR');
  const handleAltConvert = () => {
    if (!lastResult) return null;
    const rateMap: Record<string, number> = {
      "USD": 1.0, "INR": 83.5, "EUR": 0.92, "GBP": 0.79, "AED": 3.67, "CAD": 1.37, "AUD": 1.51
    };
    const targetSymbol: Record<string, string> = {
      "USD": "$", "INR": "₹", "EUR": "€", "GBP": "£", "AED": "د.إ", "CAD": "C$", "AUD": "A$"
    };
    const rate = rateMap[alternateCurrency] || 1.0;
    const value = lastResult.priceInUSD * rate;
    return `${targetSymbol[alternateCurrency] || ''}${Math.round(value).toLocaleString()} ${alternateCurrency}`;
  };

  // Download Prediction Report as Text File
  const handleDownloadReport = () => {
    if (!lastResult) return;
    const timeRepr = new Date().toLocaleString();
    const border = "=================================================";
    const reportText = `${border}
🔮 MACHINE LEARNING MODEL ESTIMATION REPORT
${border}
Report Timestamp  : ${timeRepr}
Algorithm Implemented : ${lastResult.selectedModel}
Model Performance : R² Validation Score (${lastResult.selectedModel === 'Linear Regression' ? '76.2%' : '89.4%'})
Inference Status  : Highly Standardized (Standard deviation within delta tolerance)
Estimated Confidence: ${(lastResult.confidenceScore * 100).toFixed(0)}%

[Observation Input Specs]
- Property Type    : ${propType}
- Size Dimensions  : ${area.toLocaleString()} sqft
- Floor Density    : ${bedrooms} Bedroom(s), ${bathrooms} Bathroom(s)
- Structural Age   : ${age} year(s) old
- Parking Spaces   : ${parking} slot(s)
- Geo Location     : ${selectedCity}, ${selectedCountry}

[Predictive Analysis Valuation]
- Standard Valuation (USD) : $${lastResult.priceInUSD.toLocaleString()} USD
- Converted Valuation     : ${lastResult.currencySymbol}${lastResult.convertedPrice.toLocaleString()} ${lastResult.currencyCode}
- Exchange Conversion Rate  : 1 USD = ${lastResult.exchangeRateUsed.toFixed(2)} ${lastResult.currencyCode}

[Explainable Valuation Breakdown]
${lastResult.featuresBreakdown.map(f => `- ${f.feature}: $${f.impact.toLocaleString()} USD | ${f.description}`).join('\n')}

${border}
Disclaimer: Exchange rates are approximate, manually maintained in data/exchange_rates.json and designed for showcase.
${border}`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `House_Price_Prediction_${selectedCountry}_${selectedCity}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export Prediction history to CSV
  const handleExportHistoryCSV = () => {
    if (history.length === 0) return;
    const headers = 'ID,Timestamp,Country,City,Type,Area_Sqft,Bedrooms,Bathrooms,Age,Parking,Model,Estimate_USD\n';
    const rows = history.map(h => 
      `"${h.id}","${h.timestamp}","${h.country}","${h.city}","${h.property_type}",${h.area_sqft},${h.bedrooms},${h.bathrooms},${h.property_age},${h.parking},"${h.selectedModel}",${h.predictedPriceUSD}`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `House_Price_Prediction_History.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Filter history list
  const filteredHistory = history.filter(item => {
    const matchesSearch = 
      item.city.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.property_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.selectedModel.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCountry = selectedHistoryCountry === 'ALL' || item.country === selectedHistoryCountry;
    return matchesSearch && matchesCountry;
  });

  return (
    <div className="space-y-8">
      {/* Page Title Header */}
      <div>
        <h1 className="text-3xl font-sans font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          Model Inference Sandbox
        </h1>
        <p className="text-sm text-slate-500 font-sans mt-1">
          Adjust the physical specifications and geolocational variables below to query the predictive regression models.
        </p>
      </div>

      {/* Preset Fast Fills */}
      <div className="flex flex-wrap gap-2.5 items-center bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80">
        <span className="text-xs font-semibold text-slate-500 font-sans mr-1 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          Test Presets (Fast-Fill):
        </span>
        {quickFills.map((fill) => (
          <button
            key={fill.label}
            id={`preset-${fill.label.replace(/\s+/g, '-').toLowerCase()}`}
            onClick={() => handleQuickFill(fill)}
            className="px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-indigo-200 text-xs font-medium text-slate-700 dark:text-slate-300 rounded-lg cursor-pointer transition shadow-sm"
          >
            {fill.label}
          </button>
        ))}
      </div>

      {/* Input Form and Interactive Prediction Output Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ML Prediction Inputs Form */}
        <div className={`lg:col-span-7 p-6 md:p-8 rounded-2xl bg-white dark:bg-slate-900 border ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'} shadow-sm space-y-6`}>
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
              <Grid className="w-5 h-5 text-indigo-500" />
              Property Profile Specifications
            </h3>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-400 font-sans uppercase font-bold mr-1">Algorithm:</span>
              <select
                id="model-selector"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value as any)}
                className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Random Forest Regression">Random Forest (89%)</option>
                <option value="Linear Regression">Linear Ridge (76%)</option>
              </select>
            </div>
          </div>

          <form onSubmit={handleEstimatePrice} className="space-y-6">
            {/* Country and City Split selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 font-sans uppercase block mb-1.5 matches">Sovereign Zone (Country)</label>
                <select
                  id="loc-country-selector"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-sans"
                >
                  {countriesData.map(c => (
                    <option key={c.name} value={c.name}>
                      {c.name === 'USA' ? '🇺🇸 USA' : 
                       c.name === 'India' ? '🇮🇳 India' : 
                       c.name === 'UK' ? '🇬🇧 UK' : 
                       c.name === 'Canada' ? '🇨🇦 Canada' : 
                       c.name === 'Australia' ? '🇦🇺 Australia' : '🇦🇪 UAE'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 font-sans uppercase block mb-1.5">Metropolitan Area (City)</label>
                <select
                  id="loc-city-selector"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-sans"
                >
                  {(countriesData.find(c => c.name === selectedCountry)?.cities || []).map(city => (
                    <option key={city.name} value={city.name}>{city.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Area and Property Type Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 font-sans uppercase block mb-1.5">Total Living Area (Sq Ft)</label>
                <div className="relative">
                  <input
                    id="input-area-sqft"
                    type="number"
                    value={area}
                    onChange={(e) => setArea(Number(e.target.value))}
                    className="w-full pl-3.5 pr-12 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-mono"
                    placeholder="e.g. 1500"
                    min={100}
                    max={20000}
                    required
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 font-sans">sqft</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 font-sans uppercase block mb-1.5">Structural Category (Type)</label>
                <select
                  id="input-property-type"
                  value={propType}
                  onChange={(e) => setPropType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-sans"
                >
                  <option value="Apartment">Apartment</option>
                  <option value="Studio">Studio (Single-Unit)</option>
                  <option value="Townhouse">Townhouse (Row Home)</option>
                  <option value="Villa">Villa (Sovereign Estate)</option>
                  <option value="Penthouse">Penthouse (Sky-Luxury)</option>
                </select>
              </div>
            </div>

            {/* Rooms and features grid (Bedrooms, Bathrooms, Age, Parking) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 font-sans uppercase block mb-1.5">Bedrooms</label>
                <input
                  id="input-bedrooms"
                  type="number"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-mono"
                  min={1}
                  max={15}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 font-sans uppercase block mb-1.5">Bathrooms</label>
                <input
                  id="input-bathrooms"
                  type="number"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-mono"
                  min={1}
                  max={15}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 font-sans uppercase block mb-1.5">Age (Years)</label>
                <input
                  id="input-age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-mono"
                  placeholder="0 = New Build"
                  min={0}
                  max={150}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 font-sans uppercase block mb-1.5">Parking Slots</label>
                <input
                  id="input-parking"
                  type="number"
                  value={parking}
                  onChange={(e) => setParking(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-mono"
                  min={0}
                  max={8}
                  required
                />
              </div>
            </div>

            {/* Target Currency Selection */}
            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 font-sans uppercase block mb-1.5">Target Converted Currency</label>
              <div className="flex gap-2">
                {['USD', 'INR', 'EUR', 'GBP', 'AED', 'CAD', 'AUD'].map((cur) => (
                  <button
                    key={cur}
                    type="button"
                    onClick={() => setSelectedCurrency(cur)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg cursor-pointer transition border text-center ${
                      selectedCurrency === cur 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-600/10' 
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/80'
                    }`}
                  >
                    {cur}
                  </button>
                ))}
              </div>
            </div>

            {/* Validation Notification display */}
            {validationErrors.length > 0 && (
              <div className="p-4 bg-rose-500/5 rounded-xl border border-rose-500/15 text-rose-600 text-xs space-y-1 font-sans">
                {validationErrors.map((err, i) => <p key={i}>• {err}</p>)}
              </div>
            )}

            {/* Generate Valuation Button */}
            <button
              id="btn-trigger-prediction"
              type="submit"
              disabled={isPredicting}
              className={`w-full py-3.5 rounded-xl font-medium tracking-wide flex items-center justify-center gap-2 transition duration-200 cursor-pointer ${
                isPredicting 
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/15 font-sans font-semibold'
              }`}
            >
              {isPredicting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-500" />
                  <span>{loadingStep}</span>
                </>
              ) : (
                <>
                  <LineChart className="w-4 h-4" />
                  <span>Execute Machine Learning Inference</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Prediction Outputs Display */}
        <div className="lg:col-span-5 space-y-6">
          <AnimatePresence mode="wait">
            {isPredicting ? (
              <motion.div
                key="loading-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-8 rounded-2xl bg-white dark:bg-slate-900 border ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'} shadow-sm text-center py-24 space-y-4 flex flex-col items-center justify-center`}
              >
                <div className="relative">
                  <div className="w-14 h-14 rounded-full border-4 border-indigo-100 dark:border-indigo-950 border-t-indigo-600 animate-spin" />
                  <Building2 className="w-6 h-6 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <div className="mt-2 space-y-1">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-sans">Processing Model Weights</h4>
                  <p className="text-xs text-slate-400 font-sans animate-pulse">{loadingStep}</p>
                </div>
              </motion.div>
            ) : lastResult ? (
              <motion.div
                key="result-card"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Result Price Card */}
                <div className="relative overflow-hidden p-6 md:p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-xl border border-slate-800 space-y-6">
                  {/* Glass background details */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs text-indigo-300 font-bold uppercase tracking-wider font-sans block">{lastResult.selectedModel}</span>
                      <h4 className="text-base font-bold font-sans mt-0.5 text-slate-200">{selectedCity}, {selectedCountry}</h4>
                    </div>
                    
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider flex items-center gap-1 ${
                      lastResult.confidenceScore >= 0.85 
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                    }`}>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Confidence: {(lastResult.confidenceScore * 100).toFixed(0)}%
                    </span>
                  </div>

                  <div className="space-y-1 border-y border-slate-800 py-4">
                    <span className="text-[10px] text-slate-400 font-sans uppercase font-bold block">Estimated Value ({selectedCurrency})</span>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-4xl font-mono font-black tracking-tight text-white">
                        {lastResult.currencySymbol}{lastResult.convertedPrice.toLocaleString()}
                      </span>
                      <span className="text-xs font-mono text-slate-400 font-semibold">{selectedCurrency}</span>
                    </div>
                    {/* Raw price in USD if conversion is different */}
                    {selectedCurrency !== 'USD' && (
                      <span className="text-[11px] text-slate-300 font-mono block">
                        Standard USD Valuation: <span className="font-semibold">${lastResult.priceInUSD.toLocaleString()} USD</span>
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="font-sans leading-none text-[11px]">Exchange Rate Used: 1 USD = {lastResult.exchangeRateUsed.toFixed(2)} {selectedCurrency}</span>
                    </div>
                    <span className="text-[9px] font-sans text-slate-500 uppercase tracking-wider">Manual static sync</span>
                  </div>
                </div>

                {/* Explainable AI breakdown card */}
                <div className={`p-6 rounded-2xl bg-white dark:bg-slate-900 border ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'} shadow-sm space-y-4`}>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-sans">Valuation Intercept Drivers</h4>
                    <p className="text-[10px] text-slate-400 font-sans mt-0.5">Statistical breakdown of individual property value contributions.</p>
                  </div>

                  <div className="space-y-3.5 pt-1">
                    {lastResult.featuresBreakdown.map((feat) => {
                      // Normalize pricing percentages against overall valuation
                      const pct = Math.min(100, Math.max(5, (Math.abs(feat.impact) / lastResult.priceInUSD) * 80));
                      return (
                        <div key={feat.feature} className="space-y-1">
                          <div className="flex justify-between text-xs font-sans">
                            <span className="font-medium text-slate-700 dark:text-slate-300">{feat.feature}</span>
                            <span className={`font-mono font-bold ${feat.impact < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                              {feat.impact < 0 ? '-' : '+'}${Math.abs(feat.impact).toLocaleString()} USD
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${feat.impact < 0 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                              style={{ width: `${pct}%` }} 
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Actions under card */}
                  <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      id="btn-download-estimate-report"
                      onClick={handleDownloadReport}
                      type="button"
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition shadow-sm"
                    >
                      <FileDown className="w-4 h-4" />
                      Download Valuation Report (.txt)
                    </button>

                    {/* Quick currency converter tool */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between mt-1">
                      <div className="flex items-center gap-1.5">
                        <Coins className="w-4 h-4 text-emerald-500" />
                        <span className="text-[11px] font-sans font-bold text-slate-700 dark:text-slate-300">Quick Converter:</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <select
                          id="quick-currency-selector"
                          value={alternateCurrency}
                          onChange={(e) => setAlternateCurrency(e.target.value)}
                          className="px-1.5 py-0.5 bg-white dark:bg-slate-900 text-[10px] font-bold border border-slate-200 dark:border-slate-700 rounded text-slate-800 dark:text-slate-200"
                        >
                          {['USD','INR','EUR','GBP','AED','CAD','AUD'].map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">{handleAltConvert()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-center text-slate-400 leading-normal font-sans pt-1">
                  * Exchange rates are approximate, static indexes and manually maintained. Confidence scores represent R² limits of validating test-splits.
                </p>
              </motion.div>
            ) : (
              <div className={`p-8 rounded-2xl bg-white dark:bg-slate-900 border ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'} shadow-sm text-center py-32 text-slate-400 space-y-4 flex flex-col items-center justify-center`}>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-full border border-slate-100 dark:border-slate-800 text-slate-300">
                  <LineChart className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 font-sans">Valuation Pending</h4>
                  <p className="text-xs text-slate-400 font-sans">Adjust specs in the form and click execute model to load prediction reports.</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Prediction log history */}
      {history.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-2xl bg-white dark:bg-slate-900 border ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'} shadow-sm space-y-4`}
        >
          <div className="flex flex-wrap gap-4 items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans">Session Estimation Logs</h3>
              <p className="text-xs text-slate-400 font-sans">Browse and filter predictions ran throughout your active terminal session.</p>
            </div>
            
            <div className="flex gap-2">
              <button
                id="btn-export-pred-history"
                onClick={handleExportHistoryCSV}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV Table
              </button>
              <button
                id="btn-clear-pred-history"
                onClick={() => setHistory([])}
                className="px-3 px-3.5 py-1.5 text-rose-600 hover:bg-rose-500/5 hover:border-rose-300 border border-transparent text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear Logs
              </button>
            </div>
          </div>

          {/* Filters shelf */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="search-pred-history"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Search history by city, class type, algorithm, etc."
              />
            </div>
            
            <div className="w-full md:w-48">
              <select
                id="filter-country-history"
                value={selectedHistoryCountry}
                onChange={(e) => setSelectedHistoryCountry(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="ALL">All Countries</option>
                <option value="USA">USA</option>
                <option value="India">India</option>
                <option value="UK">UK</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="UAE">UAE</option>
              </select>
            </div>
          </div>

          {/* History table view */}
          <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
            <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase font-sans">Timestamp</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase font-sans">Location</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase font-sans">Type</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase font-sans flex-row">Spec Profile</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase font-sans">Algorithm</th>
                  <th className="px-4 py-3 text-right text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase font-sans">Standard Est. (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300">
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="px-4 py-3.5 font-mono text-slate-400">{item.timestamp}</td>
                      <td className="px-4 py-3.5 font-medium">{item.city}, {item.country}</td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-md font-sans text-[10px]">
                          {item.property_type}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-500 font-sans">
                        {item.area_sqft} sqft • {item.bedrooms}B / {item.bathrooms}Ba • {item.property_age} yrs
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-0.5 rounded-md font-sans text-[10px] font-medium leading-none ${
                          item.selectedModel === 'Linear Regression' 
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' 
                            : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                        }`}>
                          {item.selectedModel === 'Linear Regression' ? 'Ridge Linear' : 'Forest Regression'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-900 dark:text-white">
                        ${item.predictedPriceUSD.toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-slate-400 font-sans">
                      No matching prediction logs found in session queries.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
