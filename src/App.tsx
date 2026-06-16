import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  LayoutDashboard, 
  LineChart, 
  BarChart3, 
  Brain, 
  GitFork, 
  Info, 
  Sun, 
  Moon,
  Github,
  MapPin,
  Menu,
  X
} from 'lucide-react';
import { ActiveTab, Theme } from './types';

// Component imports
import Dashboard from './components/Dashboard';
import Predictor from './components/Predictor';
import Analytics from './components/Analytics';
import ModelDoc from './components/ModelDoc';
import RepoExplorer from './components/RepoExplorer';
import AboutDoc from './components/AboutDoc';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [theme, setTheme] = useState<Theme>('light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Sync theme with container HTML tags
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Nav configuration
  const navigationItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'predictor' as const, label: 'Predictor', icon: LineChart },
    { id: 'analytics' as const, label: 'Data Analytics', icon: BarChart3 },
    { id: 'comparison' as const, label: 'Model Comparison', icon: Brain },
    { id: 'repo' as const, label: 'File Explorer', icon: GitFork },
    { id: 'about' as const, label: 'About Project', icon: Info }
  ];

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row transition-colors duration-200 antialiased ${
      theme === 'dark' 
        ? 'bg-slate-950 text-slate-100' 
        : 'bg-slate-50 text-slate-800'
    }`}>
      {/* Sidebar: ONLY visible on desktop displays lg and above */}
      <aside className={`w-64 shrink-0 flex flex-col border-r h-screen sticky top-0 hidden lg:flex transition-colors duration-200 ${
        theme === 'dark' 
          ? 'bg-slate-900 border-slate-800 text-slate-100' 
          : 'bg-slate-900 border-slate-950 text-slate-100'
      }`}>
        {/* Brand logo container */}
        <div className="p-6">
          <div className="flex items-center gap-2.5 text-indigo-400 font-bold text-lg mb-8">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-black shadow-md shadow-indigo-600/30">
              E
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-sans tracking-tight text-white">EstateML</span>
              <span className="text-[9px] text-indigo-400 uppercase tracking-widest font-black mt-0.5">Analytics</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold font-sans cursor-pointer transition ${
                    isSelected 
                      ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-inner' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Project Status Pill at structural footer */}
        <div className="mt-auto p-6">
          <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-800/50">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-2">ML Pipeline Status</p>
            <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Production Ready
            </div>
          </div>
        </div>
      </aside>

      {/* Main Layout Container (Right Column) */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className={`h-16 border-b backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-colors duration-200 ${
          theme === 'dark' 
            ? 'bg-slate-950/80 border-slate-900 text-white' 
            : 'bg-white/80 border-slate-200 text-slate-900'
        }`}>
          {/* Left: Mobile Nav Button & Dynamic Title */}
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className={`lg:hidden p-2 rounded-xl border cursor-pointer transition ${
                theme === 'dark' 
                  ? 'bg-slate-900 border-slate-800 text-slate-300' 
                  : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            {/* Title corresponding to active component tab */}
            <h1 className="text-sm md:text-base font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-sans">
              {activeTab === 'dashboard' && 'House Price Intelligence Dashboard'}
              {activeTab === 'predictor' && 'Price Prediction Sandbox'}
              {activeTab === 'analytics' && 'EDA Data Analytics'}
              {activeTab === 'comparison' && 'Model Performance evaluation'}
              {activeTab === 'repo' && 'Workspace File Explorer'}
              {activeTab === 'about' && 'About ML Project Briefing'}
            </h1>
          </div>

          {/* Right: Theme Toggler & Quick download actions */}
          <div className="flex items-center gap-3.5">
            {/* Header Theme Pills */}
            <div className={`p-1 rounded-xl flex items-center gap-0.5 border ${
              theme === 'dark' 
                ? 'bg-slate-900 border-slate-800' 
                : 'bg-slate-100 border-slate-200'
            }`}>
              <button 
                onClick={() => setTheme('light')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg font-sans transition cursor-pointer ${
                  theme === 'light' 
                    ? 'bg-white text-slate-800 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Light
              </button>
              <button 
                onClick={() => setTheme('dark')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg font-sans transition cursor-pointer ${
                  theme === 'dark' 
                    ? 'bg-slate-800 text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-600'
                }`}
              >
                Dark
              </button>
            </div>

            {/* Quick Repository Download action */}
            <button
              onClick={() => setActiveTab('repo')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/15 hidden sm:flex items-center gap-1.5 cursor-pointer transition font-sans"
            >
              Download Report
            </button>
          </div>
        </header>

        {/* Mobile Drawer Overlay Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`lg:hidden border-b transition-colors duration-200 ${
                theme === 'dark' 
                  ? 'bg-slate-950 border-slate-900 text-white' 
                  : 'bg-white border-slate-100 text-slate-900'
              }`}
            >
              <div className="px-4 py-4 space-y-1.5">
                {navigationItems.map((item) => {
                  const isSelected = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`mobile-nav-${item.id}`}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold font-sans flex items-center gap-2 cursor-pointer transition ${
                        isSelected 
                          ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400' 
                          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/60 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic page render layout stage */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-[1600px] w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === 'dashboard' && <Dashboard onNavigate={setActiveTab} theme={theme} />}
              {activeTab === 'predictor' && <Predictor theme={theme} />}
              {activeTab === 'analytics' && <Analytics theme={theme} />}
              {activeTab === 'comparison' && <ModelDoc theme={theme} />}
              {activeTab === 'repo' && <RepoExplorer theme={theme} />}
              {activeTab === 'about' && <AboutDoc theme={theme} />}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer information bar */}
        <footer className={`py-6 border-t text-center text-xs transition-colors duration-200 ${
          theme === 'dark' 
            ? 'bg-slate-950/30 border-slate-900 text-slate-500' 
            : 'bg-white border-slate-200 text-slate-400'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-1">
            <p className="font-sans">
              "House Price Prediction Using Machine Learning" — Created as a professional MLE portfolio showpiece.
            </p>
            <p className="text-[10px] font-sans">
              Standard global coefficients computed by Abhijeet Shinde • exchange rates relative to USD manually maintained.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
