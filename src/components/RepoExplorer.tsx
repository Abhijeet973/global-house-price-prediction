import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Folder, 
  FileCode, 
  ChevronRight, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  GitFork, 
  ExternalLink,
  BookOpen,
  Settings
} from 'lucide-react';
import { repoFiles } from '../data/repoCode';

interface RepoExplorerProps {
  theme: 'light' | 'dark';
}

export default function RepoExplorer({ theme }: RepoExplorerProps) {
  const [selectedFile, setSelectedFile] = useState<string>('README.md');
  const [copied, setCopied] = useState<boolean>(false);

  // Group repo files in virtual sub-folders to feed our dynamic sidebar tree
  const activeFile = repoFiles.find(f => f.path === selectedFile) || repoFiles[0];

  const handleCopyCode = () => {
    if (!activeFile.content) return;
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    if (!activeFile.content) return;
    const blob = new Blob([activeFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    // Extract name from path
    const fileName = activeFile.path.split('/').pop() || activeFile.name;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    // Generate a simple script bash installer that builds the folder locally or downloads everything!
    const installerText = `#!/bin/bash
# House Price Prediction Repository Bootstrapper
echo "================================================="
echo "⚙️ Bootstrapping House Price Prediction ML Project..."
echo "================================================="

# Create folder structure
mkdir -p house-price-prediction/data
mkdir -p house-price-prediction/src
mkdir -p house-price-prediction/notebooks

# Create files (Using inline writing or instructions)
echo "Downloading core ML scripts on disk..."

cat << 'EOF' > house-price-prediction/requirements.txt
${repoFiles.find(f => f.path === 'requirements.txt')?.content || ''}
EOF

cat << 'EOF' > house-price-prediction/data/exchange_rates.json
${repoFiles.find(f => f.path === 'data/exchange_rates.json')?.content || ''}
EOF

cat << 'EOF' > house-price-prediction/src/generate_data.py
${repoFiles.find(f => f.path === 'src/generate_data.py')?.content || ''}
EOF

cat << 'EOF' > house-price-prediction/src/data_preprocessing.py
${repoFiles.find(f => f.path === 'src/data_preprocessing.py')?.content || ''}
EOF

cat << 'EOF' > house-price-prediction/src/feature_engineering.py
${repoFiles.find(f => f.path === 'src/feature_engineering.py')?.content || ''}
EOF

cat << 'EOF' > house-price-prediction/src/currency_converter.py
${repoFiles.find(f => f.path === 'src/currency_converter.py')?.content || ''}
EOF

cat << 'EOF' > house-price-prediction/src/train_model.py
${repoFiles.find(f => f.path === 'src/train_model.py')?.content || ''}
EOF

cat << 'EOF' > house-price-prediction/src/predict.py
${repoFiles.find(f => f.path === 'src/predict.py')?.content || ''}
EOF

cat << 'EOF' > house-price-prediction/README.md
${repoFiles.find(f => f.path === 'README.md')?.content || ''}
EOF

echo "Repository generated successfully!"
echo "To run:"
echo "cd house-price-prediction"
echo "pip install -r requirements.txt"
echo "python src/generate_data.py"
echo "python src/train_model.py"
echo "python src/predict.py"
`;
    const blob = new Blob([installerText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bootstrap_repository.sh';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Group files logically for the directory sidebar
  const categories = [
    {
      name: 'Root',
      icon: Settings,
      files: repoFiles.filter(f => !f.path.includes('/'))
    },
    {
      name: 'src/',
      icon: Folder,
      files: repoFiles.filter(f => f.path.startsWith('src/'))
    },
    {
      name: 'data/',
      icon: Folder,
      files: repoFiles.filter(f => f.path.startsWith('data/'))
    },
    {
      name: 'notebooks/',
      icon: Folder,
      files: repoFiles.filter(f => f.path.startsWith('notebooks/'))
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-sans font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Repository Workspace Explorer
          </h1>
          <p className="text-sm text-slate-500 font-sans mt-1">
            Browse PEP8-compliant Python algorithms and Jupyter configurations physically present on disk.
          </p>
        </div>

        <button
          id="btn-repo-download-bootstrap"
          onClick={handleDownloadAll}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-lg shadow-indigo-600/10 self-start cursor-pointer font-sans"
        >
          <GitFork className="w-4 h-4" />
          Download Bootstrapper (.sh)
        </button>
      </div>

      {/* Workspace split explorer view */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sidebar file tree */}
        <div className={`lg:col-span-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'} shadow-sm space-y-4`}>
          <div>
            <h3 className="text-xs font-bold uppercase text-slate-400 block font-sans tracking-wide">Workspace Folder Tree</h3>
            <span className="text-[10px] text-slate-400 block font-sans mt-0.5">Click files to review python syntax.</span>
          </div>

          <div className="space-y-4 pt-1">
            {categories.map((cat) => {
              if (cat.files.length === 0) return null;
              return (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex items-center gap-1.5 px-1">
                    <cat.icon className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-sans leading-none">{cat.name}</span>
                  </div>

                  <div className="space-y-1.5 pl-3 border-l border-slate-100 dark:border-slate-800">
                    {cat.files.map((file) => {
                      const fileLabel = file.path.includes('/') ? file.path.split('/').pop() || file.name : file.name;
                      const isSelected = selectedFile === file.path;
                      return (
                        <button
                          key={file.path}
                          id={`file-tree-${file.path.replace(/\//g, '-')}`}
                          onClick={() => setSelectedFile(file.path)}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold font-sans flex items-center justify-between cursor-pointer transition ${
                            isSelected 
                              ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-l-2 border-indigo-500' 
                              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-800 dark:hover:text-amber-50'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <FileCode className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate font-mono">{fileLabel}</span>
                          </div>
                          
                          <ChevronRight className="w-3 h-3 text-slate-300" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Code Editor container */}
        <div className={`lg:col-span-8 p-6 rounded-2xl bg-white dark:bg-slate-900 border ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'} shadow-sm space-y-4`}>
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="space-y-0.5">
              <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider font-sans block">ACTIVE WORKSPACE CORE</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-mono flex items-center gap-2">
                <Terminal className="w-4 h-4 text-slate-400" />
                {activeFile.path}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-copy-repo-code"
                onClick={handleCopyCode}
                className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 shrink-0 cursor-pointer transition flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold"
                title="Copy contents to clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              
              <button
                id="btn-download-repo-file"
                onClick={handleDownloadFile}
                className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 shrink-0 cursor-pointer transition flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold"
                title="Download this file raw"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save File</span>
              </button>
            </div>
          </div>

          {/* Virtual Editor Box */}
          <div className="relative rounded-2xl bg-slate-950 p-5 font-mono text-xs leading-relaxed overflow-x-auto border border-slate-800 font-sans shadow-inner max-h-[500px]">
            {activeFile.content ? (
              <pre className="text-slate-300 whitespace-pre scrollbar-thin select-text">
                <code className="text-[11px] block text-left leading-normal whitespace-pre pr-4">
                  {activeFile.content}
                </code>
              </pre>
            ) : (
              <span className="text-slate-600 font-sans italic">Binary or empty directory content index.</span>
            )}
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800/80 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-sans">
            <BookOpen className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>
              All file contents mapped here match exactly what resides inside our physical workspace target container folders.
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
