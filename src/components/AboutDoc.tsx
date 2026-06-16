import React from 'react';
import { motion } from 'motion/react';
import { 
  Dribbble, 
  Linkedin, 
  Github, 
  Sparkles, 
  CheckCircle, 
  Laptop, 
  Database,
  Code2,
  Bookmark,
  TrendingUp,
  Cpu,
  Mail
} from 'lucide-react';

interface AboutDocProps {
  theme: 'light' | 'dark';
}

export default function AboutDoc({ theme }: AboutDocProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-sans font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          Project Briefing & Portfolio
        </h1>
        <p className="text-sm text-slate-500 font-sans mt-1">
          Review the academic background, training methodologies, and engineering choices integrated into this machine learning asset.
        </p>
      </div>

      {/* Main split: info blocks vs developers contact summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Core Project Details */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Mission Objective */}
          <div className={`p-6 rounded-2xl bg-white dark:bg-slate-900 border ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'} shadow-sm space-y-3`}>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-indigo-500" />
              1. Project Objective
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              Property markets dictate massive transactional scales globally. The value of standard housing is a function of complicated geocultural variables, structural parameters, and age-depreciation thresholds. 
              The prime objective of this showcase is to build a highly reproducible <strong>Machine Learning pipeline</strong> that accurately cleanses raw transactions and estimates dollar values globally. It directly demonstrates model optimization workflows, comparing standard linear coefficients against partition tree ensembles (Random Forest).
            </p>
          </div>

          {/* Dataset Specifications */}
          <div className={`p-6 rounded-2xl bg-white dark:bg-slate-900 border ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'} shadow-sm space-y-3`}>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-500" />
              2. Dataset Architecture
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              To support robust training, the project implements an explicit seed-based multi-country generator modeling 5,000 real-world housing profiles across:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              {[
                { country: 'United States', code: 'USA ($)', desc: 'Standard urban metro benchmarks.' },
                { country: 'India', code: 'INR (₹)', desc: 'High bedroom/bathrooms densities.' },
                { country: 'United Kingdom', code: 'GBP (£)', desc: 'Higher age benchmarks historic builds.' },
                { country: 'Canada', code: 'CAD (C$)', desc: 'Modern suburban zoning ratios.' },
                { country: 'Australia', code: 'AUD (A$)', desc: 'Prized parking ratios profiles.' },
                { country: 'United Arab Emirates', code: 'AED (د.إ)', desc: 'Ultra-low age high luxury weights.' }
              ].map((spec, i) => (
                <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block font-sans">{spec.country}</span>
                  <span className="text-[10px] text-slate-400 block font-sans">{spec.code} • {spec.desc}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans mt-2">
              Columns engineered and evaluated: <code>area_sqft</code>, <code>bedrooms</code>, <code>bathrooms</code>, <code>property_age</code>, <code>parking</code>, <code>property_type</code>, <code>city</code>, <code>country</code>, and the continuous regression target <code>price</code> (standardized in USD).
            </p>
          </div>

          {/* Algorithms and Tech specifications */}
          <div className={`p-6 rounded-2xl bg-white dark:bg-slate-900 border ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'} shadow-sm space-y-4`}>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-500" />
              3. Technology & Frameworks
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase text-slate-400 block font-sans">Engineering Stack:</span>
                <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400 list-disc pl-4 font-sans">
                  <li><strong>Pandas & NumPy</strong>: Multi-dimensional database array loading.</li>
                  <li><strong>Scikit-Learn</strong>: Fits scalar standardizations, hot Encoders and regressions.</li>
                  <li><strong>Joblib</strong>: High-density pickle serialization for pipelines.</li>
                  <li><strong>Matplotlib & Seaborn</strong>: Multi-dimensional EDA chart renders.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase text-slate-400 block font-sans">Interactive Portal Stack:</span>
                <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400 list-disc pl-4 font-sans">
                  <li><strong>React 19 & Tailwind CSS</strong>: Fluid responsive glassmorphism styles.</li>
                  <li><strong>Recharts</strong>: Fully interactive micro-plotted HTML SVG grids.</li>
                  <li><strong>Lucide Icons</strong>: Clean vector layout symbols.</li>
                  <li><strong>Motion</strong>: Responsive smooth view entrance transitions.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Future Enhancements */}
          <div className={`p-6 rounded-2xl bg-white dark:bg-slate-900 border ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'} shadow-sm space-y-3`}>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-500" />
              4. Future Enhancements
            </h3>
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-sans">
              <p>To upgrade this pipeline further, next development sprints are scheduled to tackle:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Gradient Boosted Trees (XGBoost/LightGBM)</strong>: Attempting to decrease MAE below $10,000 USD via gradient tree descent.</li>
                <li><strong>Artificial Neural Networks (ANN.Keras)</strong>: Building deep layers with dropout normalization for highly non-linear locations.</li>
                <li><strong>Live Geospatial Geo-encoding API</strong>: Dynamically fetching coordinate boundaries to calculate proximity indices to schools and metro stations</li>
                <li><strong>Exchange Rate Live APIs</strong>: Syncing <code>exchange_rates.json</code> daily against dynamic currencies indices.</li>
              </ul>
            </div>
          </div>

        </div>

        {/* Developer Contact Side Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className={`p-6 rounded-2xl bg-white dark:bg-slate-900 border ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'} shadow-sm space-y-6 text-center flex flex-col items-center justify-center`}>
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-indigo-400 border-2 border-indigo-200 dark:border-indigo-900 rounded-full flex items-center justify-center text-white text-3xl font-bold font-sans">
                ML
              </div>
              <span className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-900 dark:text-white font-sans">Abhijeet Shinde</h4>
              <span className="text-[11px] text-slate-400 font-sans block">Lead Machine Learning Engineer</span>
              <span className="text-[10px] bg-indigo-500/15 text-indigo-500 px-2 py-0.5 rounded-full font-sans uppercase tracking-wider font-semibold inline-block mt-1">Available for Internships</span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal font-sans">
              Passionate Python developer specializing in Regression Modeling, Ensemble Classifiers, and Modern Analytical dashboards.
            </p>

            <div className="w-full space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <a 
                href="mailto:shindeabhijeet973@gmail.com"
                className="w-full py-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700 transition"
              >
                <Mail className="w-3.5 h-3.5" />
                shindeabhijeet973@gmail.com
              </a>
              
              <div className="flex gap-2">
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex-1 py-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 hover:text-slate-900 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 border border-slate-200 dark:border-slate-700 transition"
                >
                  <Github className="w-3.5 h-3.5" />
                  GitHub Code
                </a>
                
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex-1 py-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 hover:text-indigo-600 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 border border-slate-200 dark:border-slate-700 transition"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-slate-200 dark:border-slate-800/80 text-[10px] text-slate-400 leading-normal text-center font-sans">
            "Every pipeline engineered is a stepping stone to building reliable software systems. Built to showcase ML excellence."
          </div>
        </div>

      </div>
    </div>
  );
}
