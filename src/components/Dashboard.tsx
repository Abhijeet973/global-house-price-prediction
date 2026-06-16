import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  MapPin, 
  Brain, 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight, 
  DollarSign, 
  Globe,
  Sliders,
  CheckCircle2,
  Info
} from 'lucide-react';
import { sampleHouses, modelMetrics, countriesData, predictHousePrice, featureImportances } from '../data/houseData';

interface DashboardProps {
  onNavigate: (tab: any) => void;
  theme: 'light' | 'dark';
}

export default function Dashboard({ onNavigate, theme }: DashboardProps) {
  // Aggregate statistics directly from our dynamic database
  const totalSubmitedProperties = 5000; 
  const samplesCached = sampleHouses.length;
  
  const avgPriceUSD = Math.round(
    sampleHouses.reduce((sum, h) => sum + h.price, 0) / sampleHouses.length
  );
  
  const totalCountries = countriesData.length;
  const bestModelR2 = `${(modelMetrics.forest.r2 * 100).toFixed(1)}%`;

  // Mini Quick Prediction form states inside Dashboard Bento
  const [quickCountry, setQuickCountry] = useState<string>('USA');
  const [quickCity, setQuickCity] = useState<string>('New York');
  const [quickArea, setQuickArea] = useState<number>(1800);
  const [quickBedrooms, setQuickBedrooms] = useState<number>(3);
  const [quickBathrooms, setQuickBathrooms] = useState<number>(2);
  const [quickModel, setQuickModel] = useState<'Linear Regression' | 'Random Forest'>('Random Forest');

  // Trigger quick prediction dynamically
  const quickPredictionResult = useMemo(() => {
    return predictHousePrice({
      area_sqft: quickArea,
      bedrooms: quickBedrooms,
      bathrooms: quickBathrooms,
      property_age: 10, // typical age base
      parking: 1,      // typical parking base
      property_type: 'Apartment',
      city: quickCity,
      country: quickCountry,
      currency: 'USD',
      selectedModel: quickModel as any
    } as any);
  }, [quickCountry, quickCity, quickArea, quickBedrooms, quickBathrooms, quickModel]);

  // Handle country switch & set first city available
  const handleCountryChange = (cName: string) => {
    setQuickCountry(cName);
    const cObj = countriesData.find(c => c.name === cName);
    if (cObj && cObj.cities.length > 0) {
      setQuickCity(cObj.cities[0].name);
    }
  };

  const selectedCountryObj = countriesData.find(c => c.name === quickCountry) || countriesData[0];

  return (
    <div className="space-y-6 lg:space-y-8 animate-fade-in font-sans">
      
      {/* SECTION 1: Standard 4-Column Metric Bento Slots */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[
          {
            title: 'Dataset Volume',
            value: totalSubmitedProperties.toLocaleString(),
            sub: `${samplesCached} validated training inputs`,
            icon: Building2,
            color: 'text-indigo-400',
            bg: 'bg-indigo-500/10'
          },
          {
            title: 'Global Avg Price (USD)',
            value: `$${avgPriceUSD.toLocaleString()}`,
            sub: 'Weighted mid-market valuation',
            icon: DollarSign,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10'
          },
          {
            title: 'Sovereign Zones',
            value: `${totalCountries} Countries`,
            sub: 'Standardized local currencies',
            icon: Globe,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10'
          },
          {
            title: 'Pipeline Max R²',
            value: bestModelR2,
            sub: 'Ensemble Random Forest regressor',
            icon: Brain,
            color: 'text-pink-400',
            bg: 'bg-pink-500/10'
          }
        ].map((stat, idx) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04, duration: 0.3 }}
            className={`p-5 lg:p-6 rounded-2xl bg-white dark:bg-slate-900 border ${
              theme === 'dark' ? 'border-slate-800' : 'border-slate-100'
            } shadow-sm flex items-center justify-between transition-all`}
          >
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{stat.title}</span>
              <h2 className="text-xl lg:text-2xl font-black tracking-tight text-slate-800 dark:text-white font-sans">{stat.value}</h2>
              <p className="text-[11px] text-slate-400">{stat.sub}</p>
            </div>
            <div className={`p-3 rounded-xl shrink-0 ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* SECTION 2: Dynamic Bento Hub Layout (Grid system) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        
        {/* Bento Cell A: Interactive ML Valuation Quick Predictor (cols 8) */}
        <div className={`lg:col-span-8 p-6 lg:p-8 rounded-3xl bg-white dark:bg-slate-900 border ${
          theme === 'dark' ? 'border-[1.5px] border-slate-800' : 'border-[1.5px] border-slate-100'
        } shadow-md flex flex-col justify-between relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-6">
            {/* Cell Indicator & Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-500" />
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-indigo-500">Fast Estimator Sandbox</span>
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-bold uppercase tracking-widest">
                Active Inference
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Estimate Property Values Locally</h3>
              <p className="text-xs text-slate-400">Interact with model benchmarks live on the dashboard panel.</p>
            </div>

            {/* Micro input layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800/60">
              
              {/* Country Selection */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400">Country Location</label>
                <select
                  value={quickCountry}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="w-full text-xs font-semibold px-2.5 py-2 bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-705 dark:text-slate-350 focus:outline-none focus:border-indigo-500 transition"
                >
                  {countriesData.map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* City Selection */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400">Metropolitan Area</label>
                <select
                  value={quickCity}
                  onChange={(e) => setQuickCity(e.target.value)}
                  className="w-full text-xs font-semibold px-2.5 py-2 bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-705 dark:text-slate-350 focus:outline-none focus:border-indigo-500 transition"
                >
                  {selectedCountryObj.cities.map(ct => (
                    <option key={ct.name} value={ct.name}>{ct.name}</option>
                  ))}
                </select>
              </div>

              {/* Space Area Area */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400">Total Area (sqft)</label>
                <input
                  type="number"
                  min={500}
                  max={5000}
                  value={quickArea}
                  onChange={(e) => setQuickArea(Math.max(100, parseInt(e.target.value) || 0))}
                  className="w-full text-xs font-semibold px-2.5 py-2 bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-705 dark:text-slate-350 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              {/* ML Model Choice */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400">Algorithm</label>
                <select
                  value={quickModel}
                  onChange={(e) => setQuickModel(e.target.value as any)}
                  className="w-full text-xs font-semibold px-2.5 py-2 bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-705 dark:text-slate-350 focus:outline-none focus:border-indigo-500 transition"
                >
                  <option value="Random Forest">Random Forest</option>
                  <option value="Linear Regression">Ridge Linear</option>
                </select>
              </div>

            </div>

            {/* Estimation Result Panel */}
            <div className="p-5 rounded-2xl bg-indigo-600/5 dark:bg-indigo-500/5 border border-indigo-500/10 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center md:text-left">
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest block">Inferred Price Estimation ({quickModel})</span>
                <div className="flex items-baseline justify-center md:justify-start gap-2">
                  <span className="text-3xl font-black text-slate-800 dark:text-slate-100 font-mono">
                    {selectedCountryObj.symbol}{(quickPredictionResult?.convertedPrice ?? 0).toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400 font-bold uppercase font-mono">
                    {selectedCountryObj.currency}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Converted from base ${(quickPredictionResult?.priceInUSD ?? 0).toLocaleString()} USD</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <button
                  id="bento-quickpredict-tune"
                  onClick={() => onNavigate('predictor')}
                  className="px-5 py-2.5 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Predictor Sandbox
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-6 flex items-center gap-2 text-[11px] text-slate-400">
            <Info className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>Predicted prices represent localized machine learning simulations mapped to dynamic regional multiplier models.</span>
          </div>

        </div>

        {/* Bento Cell B: Sovereign Country index (cols 4) */}
        <div className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border ${
          theme === 'dark' ? 'border-[1.5px] border-slate-800' : 'border-[1.5px] border-slate-100'
        } shadow-md space-y-6 flex flex-col justify-between`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400 block">Sovereign Index Weights</span>
              </div>
            </div>
            
            <div className="space-y-3">
              {countriesData.map((country) => {
                const countInCountry = sampleHouses.filter(h => h.country === country.name).length;
                const avgPriceCountry = Math.round(
                  sampleHouses.filter(h => h.country === country.name).reduce((sum, h) => sum + h.price, 0) / (countInCountry || 1)
                );
                return (
                  <div key={country.name} className="flex items-center justify-between border-b border-dashed border-slate-100 dark:border-slate-800/80 pb-2.5 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2">
                      <span className="text-base select-none">
                        {country.name === 'USA' ? '🇺🇸' : 
                         country.name === 'India' ? '🇮🇳' : 
                         country.name === 'UK' ? '🇬🇧' : 
                         country.name === 'Canada' ? '🇨🇦' : 
                         country.name === 'Australia' ? '🇦🇺' : '🇦🇪'}
                      </span>
                      <div className="leading-tight">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">{country.name}</span>
                        <span className="text-[9px] text-slate-400 font-mono font-medium">{country.currency} ({country.symbol})</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold font-mono text-slate-800 dark:text-slate-200">
                        ${avgPriceCountry.toLocaleString()}
                      </span>
                      <p className="text-[8px] text-slate-400 uppercase font-mono tracking-wider">Avg USD</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            id="dash-btn-view-analytics"
            onClick={() => onNavigate('analytics')}
            className="w-full py-2 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-[11px] rounded-xl text-center cursor-pointer transition border border-slate-100 dark:border-slate-800/40"
          >
            Check Geospatial Charts
          </button>
        </div>

        {/* Bento Cell C: Model Performance Benchmark Comparison (cols 5) */}
        <div className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border ${
          theme === 'dark' ? 'border-[1.5px] border-slate-800' : 'border-[1.5px] border-slate-100'
        } shadow-md space-y-6 flex flex-col justify-between lg:col-span-5`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-indigo-500" />
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400 block">Inference Performance</span>
              </div>
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase rounded-full border border-emerald-500/20">
                Forest Preferred
              </span>
            </div>

            <div className="space-y-4">
              
              {/* Ridge Regression */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-600 dark:text-slate-300">Ridge Linear Regression</span>
                  <span className="font-bold font-mono text-slate-500">R²: 0.762</span>
                </div>
                <div className="space-y-1.5">
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-400 h-full rounded-full" style={{ width: '76.2%' }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Validation Accuracy</span>
                    <span>76.2%</span>
                  </div>
                </div>
              </div>

              {/* Random Forest Classifiers */}
              <div className="p-4 rounded-2xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/10 dark:border-indigo-500/20 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">Random Forest Ensemble</span>
                  <span className="font-bold font-mono text-indigo-600 dark:text-indigo-400">R²: 0.894</span>
                </div>
                <div className="space-y-1.5">
                  <div className="w-full bg-slate-200/60 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full" style={{ width: '89.4%' }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-indigo-500 font-mono">
                    <span>Validation Accuracy</span>
                    <span>89.4%</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <button
            id="dash-btn-models"
            onClick={() => onNavigate('comparison')}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] rounded-xl text-center cursor-pointer transition shadow-md shadow-indigo-600/10"
          >
            Review Math Formula Weights
          </button>
        </div>

        {/* Bento Cell D: Feature Importances Radar Score (cols 7) */}
        <div className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border ${
          theme === 'dark' ? 'border-[1.5px] border-slate-800' : 'border-[1.5px] border-slate-100'
        } shadow-md space-y-5 flex flex-col justify-between lg:col-span-7`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400 block">Model Weight Variables (Feature Importances)</span>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Property Living Area (sqft)', percent: 42, color: 'bg-indigo-500', desc: 'Area dimensions dominate standard pipeline estimators.' },
                { label: 'Geospatial Location (Multiplier)', percent: 28, color: 'bg-purple-500', desc: 'Regional metro coefficients dictate localized base price.' },
                { label: 'Bathroom Composition Ratio', percent: 11, color: 'bg-indigo-400', desc: 'Direct correlation with ensuite bathroom and comfort layout.' },
                { label: 'Bedrooms Room Density', percent: 9, color: 'bg-teal-400', desc: 'Overall size and design capacity modifier.' },
                { label: 'Structural Property Age', percent: 6, color: 'bg-amber-400', desc: 'Depreciation factor, captures newer construction premiums.' },
                { label: 'Vehicle Parking Bay Spaces', percent: 4, color: 'bg-rose-400', desc: 'Convenience rating, high values in tight urban cores.' }
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">{item.label}</span>
                    <span className="font-bold font-mono text-slate-500">{item.percent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.percent}%` }} />
                  </div>
                  <p className="text-[9px] text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
