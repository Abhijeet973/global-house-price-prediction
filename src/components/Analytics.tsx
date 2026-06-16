import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ScatterChart, 
  Scatter, 
  Cell,
  LineChart, 
  Line 
} from 'recharts';
import { 
  Info, 
  TrendingUp, 
  Coins, 
  BarChart3, 
  LayoutGrid, 
  Target,
  ArrowRight
} from 'lucide-react';
import { sampleHouses, featureImportances, countriesData } from '../data/houseData';

interface AnalyticsProps {
  theme: 'light' | 'dark';
}

export default function Analytics({ theme }: AnalyticsProps) {
  const [activeChart, setActiveChart] = useState<'distribution' | 'scatter' | 'countries' | 'rooms' | 'correlation' | 'importance'>('distribution');

  // 1. Compute Price Distribution (Histographic bins)
  const priceDistributionData = useMemo(() => {
    // Range $20,000 to $1,500,000
    // Let's create 8 bins
    const bins = [
      { range: '$0-150k', count: 0, min: 0, max: 150000 },
      { range: '$150k-300k', count: 0, min: 150000, max: 300000 },
      { range: '$300k-500k', count: 0, min: 300000, max: 500000 },
      { range: '$500k-700k', count: 0, min: 500000, max: 700000 },
      { range: '$700k-900k', count: 0, min: 700000, max: 900000 },
      { range: '$900k-1.1M', count: 0, min: 900000, max: 1100000 },
      { range: '$1.1M-1.3M', count: 0, min: 1100000, max: 1300000 },
      { range: '$1.3M+', count: 0, min: 1300000, max: 99999999 }
    ];

    sampleHouses.forEach(h => {
      for (let b of bins) {
        if (h.price >= b.min && h.price < b.max) {
          b.count++;
          break;
        }
      }
    });

    return bins;
  }, []);

  // 2. Continuous Scatter Plot Data (Sub-sampled to 80 points to draw beautiful, non-congested nodes)
  const scatterData = useMemo(() => {
    return sampleHouses.slice(0, 80).map(h => ({
      area: h.area_sqft,
      price: h.price,
      country: h.country,
      city: h.city
    }));
  }, []);

  // 3. Country-wise statistics averages
  const countryPriceAverages = useMemo(() => {
    return countriesData.map(c => {
      const matches = sampleHouses.filter(h => h.country === c.name);
      const avg = matches.reduce((sum, h) => sum + h.price, 0) / (matches.length || 1);
      return {
        country: c.name,
        averagePrice: Math.round(avg),
        count: matches.length
      };
    }).sort((a, b) => b.averagePrice - a.averagePrice);
  }, []);

  // 4. Bedroom counts vs Median Price Index
  const bedroomPriceData = useMemo(() => {
    const beds = [1, 2, 3, 4, 5];
    return beds.map(b => {
      const matches = sampleHouses.filter(h => h.bedrooms === b);
      const avg = matches.reduce((sum, h) => sum + h.price, 0) / (matches.length || 1);
      return {
        bedrooms: `${b} Bed`,
        averagePrice: Math.round(avg),
        count: matches.length
      };
    }).filter(item => item.count > 0);
  }, []);

  // 5. Features correlation statistics matrix
  // Simulating pandas df.corr() between Area, Beds, Baths, Age, Parking, Price
  const correlationMatrix = [
    { source: 'Area', target: 'Area', value: 1.00 },
    { source: 'Area', target: 'Bedrooms', value: 0.74 },
    { source: 'Area', target: 'Bathrooms', value: 0.68 },
    { source: 'Area', target: 'Age', value: -0.04 },
    { source: 'Area', target: 'Parking', value: 0.32 },
    { source: 'Area', target: 'Price', value: 0.81 },

    { source: 'Bedrooms', target: 'Area', value: 0.74 },
    { source: 'Bedrooms', target: 'Bedrooms', value: 1.00 },
    { source: 'Bedrooms', target: 'Bathrooms', value: 0.76 },
    { source: 'Bedrooms', target: 'Age', value: -0.02 },
    { source: 'Bedrooms', target: 'Parking', value: 0.28 },
    { source: 'Bedrooms', target: 'Price', value: 0.69 },

    { source: 'Bathrooms', target: 'Area', value: 0.68 },
    { source: 'Bathrooms', target: 'Bedrooms', value: 0.76 },
    { source: 'Bathrooms', target: 'Bathrooms', value: 1.00 },
    { source: 'Bathrooms', target: 'Age', value: -0.05 },
    { source: 'Bathrooms', target: 'Parking', value: 0.35 },
    { source: 'Bathrooms', target: 'Price', value: 0.72 },

    { source: 'Age', target: 'Area', value: -0.04 },
    { source: 'Age', target: 'Bedrooms', value: -0.02 },
    { source: 'Age', target: 'Bathrooms', value: -0.05 },
    { source: 'Age', target: 'Age', value: 1.00 },
    { source: 'Age', target: 'Parking', value: -0.08 },
    { source: 'Age', target: 'Price', value: -0.28 },

    { source: 'Parking', target: 'Area', value: 0.32 },
    { source: 'Parking', target: 'Bedrooms', value: 0.28 },
    { source: 'Parking', target: 'Bathrooms', value: 0.35 },
    { source: 'Parking', target: 'Age', value: -0.08 },
    { source: 'Parking', target: 'Parking', value: 1.00 },
    { source: 'Parking', target: 'Price', value: 0.44 },

    { source: 'Price', target: 'Area', value: 0.81 },
    { source: 'Price', target: 'Bedrooms', value: 0.69 },
    { source: 'Price', target: 'Bathrooms', value: 0.72 },
    { source: 'Price', target: 'Age', value: -0.28 },
    { source: 'Price', target: 'Parking', value: 0.44 },
    { source: 'Price', target: 'Price', value: 1.00 }
  ];

  // Helper custom tooltip for Scatter Chart
  const CustomScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3 bg-slate-900 border border-slate-800 text-white rounded-xl shadow-lg font-sans text-xs space-y-1">
          <p className="font-bold text-indigo-400">{data.city}, {data.country}</p>
          <p>Area: <span className="font-mono">{data.area.toLocaleString()} sqft</span></p>
          <p>Price: <span className="font-mono text-emerald-400">${data.price.toLocaleString()} USD</span></p>
        </div>
      );
    }
    return null;
  };

  // Helper Custom Tooltip for standard charts
  const CustomTooltipPrice = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-slate-900 border border-slate-800 text-white rounded-xl shadow-lg font-sans text-xs">
          <p className="font-bold text-indigo-300 block mb-1">{label}</p>
          <p>Avg Valuation: <span className="font-mono text-emerald-400">${Math.round(payload[0].value).toLocaleString()} USD</span></p>
        </div>
      );
    }
    return null;
  };

  // Helper Custom Tooltip for histographic bins
  const CustomTooltipBin = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-slate-900 border border-slate-800 text-white rounded-xl shadow-lg font-sans text-xs">
          <p className="font-bold text-indigo-300 block mb-1">Pricing Interval: {label}</p>
          <p>Count: <span className="font-bold">{payload[0].value} listings</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Chart selection sidebar navigation */}
      <div className="lg:col-span-3 space-y-4">
        <div className="p-1 rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-3 border border-slate-100 dark:border-slate-800">
          <div className="px-3 py-2 mb-3">
            <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 font-sans uppercase tracking-wider">EDA Navigation</h3>
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">Explore generated database properties patterns.</p>
          </div>
          
          <div className="space-y-1.5">
            {[
              { id: 'distribution', label: 'Price Distribution', desc: 'Histographic frequency bins.' },
              { id: 'scatter', label: 'Area vs Price Scatter', desc: 'Continuous scaling gradient.' },
              { id: 'countries', label: 'Country-Wise Medians', desc: 'Standardized regional prices.' },
              { id: 'rooms', label: 'Bedroom Price Index', desc: 'Layout size pricing impacts.' },
              { id: 'importance', label: 'Random Forest Weights', desc: 'ML model feature importance.' },
              { id: 'correlation', label: 'Pearson Heatmap', desc: 'Feature co-linear values.' }
            ].map((chart) => (
              <button
                key={chart.id}
                id={`chart-nav-${chart.id}`}
                onClick={() => setActiveChart(chart.id as any)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex flex-col gap-0.5 transition duration-200 cursor-pointer ${
                  activeChart === chart.id 
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/10' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{chart.label}</span>
                <span className={`text-[9px] block ${activeChart === chart.id ? 'text-indigo-200' : 'text-slate-400'}`}>{chart.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 bg-gradient-to-br from-indigo-500/5 to-emerald-500/5 rounded-xl border border-indigo-500/10 space-y-2">
          <span className="text-[10px] uppercase font-bold text-indigo-500 font-sans block tracking-wider flex items-center gap-1">
            <Coins className="w-3.5 h-3.5" />
            Exchange Integration Notice
          </span>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal font-sans">
            All prices visualized on these charts are computed and plotted in standard <strong>USD currency</strong> to sustain analytical alignment.
          </p>
        </div>
      </div>

      {/* Primary Chart Viewer Window */}
      <div className={`lg:col-span-9 p-6 md:p-8 rounded-2xl bg-white dark:bg-slate-900 border ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'} shadow-sm flex flex-col justify-between min-h-[550px]`}>
        
        {/* Dynamic Chart Header */}
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-6 flex flex-wrap gap-4 justify-between items-start">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-500" />
              {activeChart === 'distribution' && 'Property Price Distribution Bin Graph'}
              {activeChart === 'scatter' && 'Area-To-Price Scatter Continuous Model'}
              {activeChart === 'countries' && 'Country-Wide Real Estate Valuations'}
              {activeChart === 'rooms' && 'Bedroom Composition Pricing Indexes'}
              {activeChart === 'importance' && 'Ensemble Random Forest Feature Weightings'}
              {activeChart === 'correlation' && 'Interactive Feature Pearson Correlation Matrix'}
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              {activeChart === 'distribution' && 'Shows how listings stack across pricing bounds in our 5,000 synthetic transaction records.'}
              {activeChart === 'scatter' && 'Plots square footage dimension size (X) against price output (Y) showing a clear linear boundary.'}
              {activeChart === 'countries' && 'Compares the standardized average house transaction prices across our supported geolocations.'}
              {activeChart === 'rooms' && 'Demonstrates continuous upward price scaling aligned to overall layout bedrooms density.'}
              {activeChart === 'importance' && 'Shows relative feature importances (0-100%) calculated by fitting Random Forest classifiers.'}
              {activeChart === 'correlation' && 'Displays a heat correlation matrix grid of Pearson coefficients, illustrating directional trends.'}
            </p>
          </div>
        </div>

        {/* Dynamic Chart Area */}
        <div className="flex-1 w-full min-h-[350px] flex items-center justify-center">
          {activeChart === 'distribution' && (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={priceDistributionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                <XAxis dataKey="range" stroke="#94a3b8" fontSize={11} fontStyle="italic" />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip content={<CustomTooltipBin />} cursor={{ fill: theme === 'dark' ? '#1e293b' : '#f8fafc', opacity: 0.6 }} />
                <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]}>
                  {priceDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4f46e5' : '#6366f1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {activeChart === 'scatter' && (
            <ResponsiveContainer width="100%" height={350}>
              <ScatterChart margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                <XAxis type="number" dataKey="area" name="Area" unit=" sqft" stroke="#94a3b8" fontSize={11} />
                <YAxis type="number" dataKey="price" name="Price" unit=" USD" stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip content={<CustomScatterTooltip />} />
                <Scatter name="House Records" data={scatterData} fill="#4f46e5">
                  {scatterData.map((entry, index) => {
                    const countryColors: Record<string, string> = {
                      'USA': '#4f46e5', 'India': '#f97316', 'UK': '#0ea5e9',
                      'Canada': '#ef4444', 'Australia': '#10b981', 'UAE': '#d946ef'
                    };
                    return <Cell key={`cell-${index}`} fill={countryColors[entry.country] || '#6366f1'} />;
                  })}
                </Scatter>
                <Legend iconType="circle" payload={
                  Object.keys(countriesData.reduce((acc, c) => ({ ...acc, [c.name]: true }), {})).map(countryName => {
                    const colors: Record<string, string> = {
                      'USA': '#4f46e5', 'India': '#f97316', 'UK': '#0ea5e9',
                      'Canada': '#ef4444', 'Australia': '#10b981', 'UAE': '#d946ef'
                    };
                    return { value: countryName, type: 'circle', id: countryName, color: colors[countryName] || '#6366f1' };
                  })
                } />
              </ScatterChart>
            </ResponsiveContainer>
          )}

          {activeChart === 'countries' && (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={countryPriceAverages} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                <XAxis dataKey="country" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip content={<CustomTooltipPrice />} cursor={{ fill: theme === 'dark' ? '#1e293b' : '#f8fafc', opacity: 0.6 }} />
                <Bar dataKey="averagePrice" fill="#10b981" radius={[8, 8, 0, 0]}>
                  {countryPriceAverages.map((entry, index) => {
                    const colors = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'];
                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {activeChart === 'rooms' && (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={bedroomPriceData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                <XAxis dataKey="bedrooms" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip content={<CustomTooltipPrice />} />
                <Line type="monotone" dataKey="averagePrice" stroke="#4f46e5" strokeWidth={3} activeDot={{ r: 8 }} dot={{ r: 5, strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          )}

          {activeChart === 'importance' && (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={featureImportances} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                <YAxis type="category" dataKey="feature" stroke="#94a3b8" fontSize={11} width={130} />
                <Tooltip />
                <Bar dataKey="importance" fill="#4f46e5" radius={[0, 8, 8, 0]}>
                  {featureImportances.map((entry, index) => {
                    const colors = ['#3730a3', '#4338ca', '#4f46e5', '#6366f1', '#818cf8', '#93c5fd'];
                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {activeChart === 'correlation' && (
            <div className="w-full h-full max-w-lg mx-auto flex flex-col justify-center select-none font-sans mt-4">
              {/* correlation grid */}
              <div className="grid grid-cols-7 gap-1 border border-slate-200 dark:border-slate-800 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                {/* corner blank */}
                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 text-center flex items-center justify-center h-8">Var</div>
                {['Area', 'Beds', 'Baths', 'Age', 'Park', 'Price'].map(col => (
                  <div key={col} className="text-[10px] font-bold text-slate-400 dark:text-slate-500 text-center flex items-center justify-center font-semibold h-8">{col}</div>
                ))}

                {['Area', 'Bedrooms', 'Bathrooms', 'Age', 'Parking', 'Price'].map(row => {
                  const rowLabelShort = row === 'Bedrooms' ? 'Beds' : row === 'Bathrooms' ? 'Baths' : row === 'Parking' ? 'Park' : row;
                  return (
                    <React.Fragment key={row}>
                      <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 flex items-center justify-start pl-1 font-semibold h-8">{rowLabelShort}</div>
                      {['Area', 'Bedrooms', 'Bathrooms', 'Age', 'Parking', 'Price'].map(col => {
                        const cell = correlationMatrix.find(c => c.source === row && c.target === col);
                        const val = cell ? cell.value : 0;
                        
                        // Set up heatmap background opacity
                        let bgClass = 'bg-slate-200 text-slate-800';
                        if (val === 1) bgClass = 'bg-indigo-600 text-white font-bold';
                        else if (val > 0.70) bgClass = 'bg-indigo-500/80 text-white font-semibold';
                        else if (val > 0.40) bgClass = 'bg-indigo-500/50 text-indigo-950 dark:text-indigo-200';
                        else if (val > 0.20) bgClass = 'bg-indigo-500/20 text-indigo-950 dark:text-indigo-300';
                        else if (val < -0.20) bgClass = 'bg-rose-500/30 text-rose-800 dark:text-rose-300 font-semibold';
                        else if (val < 0) bgClass = 'bg-rose-500/10 text-rose-800 dark:text-rose-400';
                        else bgClass = 'bg-slate-100 dark:bg-slate-800 text-slate-400';

                        return (
                          <div 
                            key={col} 
                            title={`${row} to ${col}: ${val.toFixed(2)}`}
                            className={`text-[10px] font-mono rounded flex items-center justify-center p-1 cursor-help transition h-8 ${bgClass}`}
                          >
                            {val.toFixed(2)}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </div>
              <div className="flex justify-between text-[9px] text-slate-400 mt-3 px-1">
                <span>Highly Positive Corr (&gt;0.70)</span>
                <span>Negative Depreciation Corr (&lt;0)</span>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Chart Description Footers */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-sans">
            <Info className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>
              {activeChart === 'distribution' && 'Pricing distributions demonstrate clear clustering centered near standard residential valuations.'}
              {activeChart === 'scatter' && 'Scatter trends portray high homoscedastic linearity, supporting Ridge Linear Regression Baselines.'}
              {activeChart === 'countries' && 'UK and USA lead average dollar listings, followed by Australia and Canada benchmarks.'}
              {activeChart === 'rooms' && 'Adding layouts increases bedrooms, capturing corresponding area expansion and luxury intercepts.'}
              {activeChart === 'importance' && 'Square footage dominates weight vectors, followed closely by country location constraints.'}
              {activeChart === 'correlation' && 'Pearson coefficient grid illustrates the mutual directional linearity between inputs.'}
            </span>
          </div>

          <button
            id="eda-btn-to-predictor"
            onClick={() => setActiveChart('importance')}
            className={`text-xs font-bold font-sans text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 inline-flex items-center gap-1 cursor-pointer transition ${activeChart === 'importance' ? 'hidden' : 'inline'}`}
          >
            Check Feature Weights
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        
      </div>
    </div>
  );
}
