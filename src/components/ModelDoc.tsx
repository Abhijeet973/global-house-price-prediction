import React, { theme } from 'react';
import { motion } from 'motion/react';
import { 
  Brain, 
  LineChart, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Sparkles, 
  TrendingUp,
  Table,
  Cpu
} from 'lucide-react';
import { modelMetrics } from '../data/houseData';

interface ModelDocProps {
  theme: 'light' | 'dark';
}

export default function ModelDoc({ theme }: ModelDocProps) {
  return (
    <div className="space-y-8">
      {/* Header text */}
      <div>
        <h1 className="text-3xl font-sans font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          Model Evaluation Comparison
        </h1>
        <p className="text-sm text-slate-500 font-sans mt-1">
          Review structural performance comparisons between our baseline Ridge Regressor and primary Ensemble Random Forest.
        </p>
      </div>

      {/* Metric comparison table */}
      <div className={`p-6 rounded-2xl bg-white dark:bg-slate-900 border ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'} shadow-sm space-y-6`}>
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
            <Table className="w-5 h-5 text-indigo-500" />
            Performance Evaluation Matrix
          </h3>
          <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-lg uppercase tracking-wider">
            Validated Test Split
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
          <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 mb-0">
            <thead className="bg-slate-50 dark:bg-slate-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase font-sans tracking-wider">Evaluation Parameter</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase font-sans tracking-wider">{modelMetrics.linear.name}</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase font-sans tracking-wider">{modelMetrics.forest.name}</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase font-sans tracking-wider">Leading Pipeline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 text-sm">
              {/* R2 Variance Explained */}
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition">
                <td className="px-6 py-4 font-sans font-medium text-slate-700 dark:text-slate-300">
                  <div className="space-y-0.5">
                    <span className="block">R² Statistic (Variance Explained)</span>
                    <span className="text-[10px] text-slate-400">Represents overall goodness of fit on unseen validation rows.</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono font-semibold text-slate-500">{`${(modelMetrics.linear.r2 * 100).toFixed(1)}%`}</td>
                <td className="px-6 py-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">{`${(modelMetrics.forest.r2 * 100).toFixed(1)}%`}</td>
                <td className="px-6 py-4 text-right">
                  <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-lg uppercase tracking-wider">
                    Random Forest (+13.2%)
                  </span>
                </td>
              </tr>

              {/* MAE Error */}
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition">
                <td className="px-6 py-4 font-sans font-medium text-slate-700 dark:text-slate-300">
                  <div className="space-y-0.5">
                    <span className="block">Mean Absolute Error (MAE)</span>
                    <span className="text-[10px] text-slate-400">Mean delta dollar difference compared to actual sample sale values.</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-slate-500">${modelMetrics.linear.mae.toLocaleString()} USD</td>
                <td className="px-6 py-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">${modelMetrics.forest.mae.toLocaleString()} USD</td>
                <td className="px-6 py-4 text-right">
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-lg uppercase tracking-wider">
                    Random Forest (Lower Error)
                  </span>
                </td>
              </tr>

              {/* RMSE Error */}
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition">
                <td className="px-6 py-4 font-sans font-medium text-slate-700 dark:text-slate-300">
                  <div className="space-y-0.5">
                    <span className="block">Root Mean Squared Error (RMSE)</span>
                    <span className="text-[10px] text-slate-400">Symmetrical standard error index penalizing outliers heavier.</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-slate-500">${modelMetrics.linear.rmse.toLocaleString()} USD</td>
                <td className="px-6 py-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">${modelMetrics.forest.rmse.toLocaleString()} USD</td>
                <td className="px-6 py-4 text-right">
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-lg uppercase tracking-wider">
                    Random Forest
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Model advantages comparison cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Linear Model Overview */}
        <div className={`p-6 rounded-2xl bg-white dark:bg-slate-900 border ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'} shadow-sm space-y-4`}>
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300">
              <LineChart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white font-sans">{modelMetrics.linear.name}</h4>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Baseline Ridge Estimator</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase text-slate-400 block font-sans">Pipeline Strengths:</span>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                {modelMetrics.linear.advantages.map((adv, i) => (
                  <li key={i} className="flex items-start gap-1.5 font-sans leading-normal">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase text-slate-400 block font-sans">Functional Limits:</span>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                {modelMetrics.linear.disadvantages.map((dis, i) => (
                  <li key={i} className="flex items-start gap-1.5 font-sans leading-normal">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>{dis}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Random Forest Model Overview */}
        <div className={`p-6 rounded-2xl bg-white dark:bg-slate-900 border ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'} shadow-sm space-y-4`}>
          <div className="flex items-center gap-3 border-b border-indigo-500/10 dark:border-indigo-500/20 pb-3">
            <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-500">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white font-sans">{modelMetrics.forest.name}</h4>
              <span className="text-[10px] text-indigo-500 uppercase tracking-wider font-bold">Multi-Decision Tree Ensemble</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase text-slate-400 block font-sans">Pipeline Strengths:</span>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                {modelMetrics.forest.advantages.map((adv, i) => (
                  <li key={i} className="flex items-start gap-1.5 font-sans leading-normal">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase text-slate-400 block font-sans">Functional Limits:</span>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                {modelMetrics.forest.disadvantages.map((dis, i) => (
                  <li key={i} className="flex items-start gap-1.5 font-sans leading-normal">
                    <AlertCircle className="w-3.5 h-3.5 text-indigo-500/50 shrink-0 mt-0.5" />
                    <span>{dis}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>

      {/* Mathematical Explainers and why Ensembles beat linear models on this data */}
      <div className={`p-6 md:p-8 rounded-2xl bg-white dark:bg-slate-900 border ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'} shadow-sm space-y-4`}>
        <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-sans flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-500" />
          The ML Engineering Explanation: Non-Linearity & Co-efficients
        </h4>
        <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans space-y-3">
          <p>
            Why does **Random Forest Regression (89.4% R²)** substantially outperform the baseline **Ridge Linear Regression (76.2% R²)** on property listings valuations? In a simple linear regression configuration, features are combined under independent weights:
          </p>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-800 font-mono text-center text-slate-700 dark:text-slate-300">
            Valuation = β₀ + β₁(Area) + β₂(Bedrooms) + β₃(Bathrooms) - β₄(Age) + β₅(Parking) + ε
          </div>
          <p>
            This linear formulation asserts that each feature acts independently. It dictates that every additional square foot of space adds a lockstep dollar amount, regardless of where the home is or whether the layout has bedrooms.
          </p>
          <p>
            In authentic property markets, however, real valuations operate under extreme <strong>non-linear interactions</strong>:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Compound Multipliers</strong>: 500 square feet of area compiled inside a premium Penthouse in Manhattan commands 4x deeper premiums than matching square footage inside a rural studio.</li>
            <li><strong>Age Depreciation Curves</strong>: Construction assets do not drop cleanly in a straight diagonal. Rather, they undergo logarithmic decay, depreciating quickly during early years and stabilizing significantly once stabilized.</li>
            <li><strong>Feature Threshold boundaries</strong>: Parking capacity is highly prized (high weight delta) in congested metros like Mumbai or London, while holding much lower importance index in sprawling suburban designs (low variance contribution).</li>
          </ul>
          <p>
            Ensemble Decision Forests navigate these limits by partitioning inputs dynamically across multiple splits, fitting decision leaves along high-order feature spaces. This allows the Random Forest model to lock in on non-linear threshold brackets automatically, capturing real-world complexity and reducing Mean Absolute Error by nearly **$14,300 USD** per house.
          </p>
        </div>
      </div>
    </div>
  );
}
