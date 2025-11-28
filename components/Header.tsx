import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 p-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="material-icons-round text-white">movie_edit</span>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              ClipName AI
            </h1>
            <p className="text-xs text-slate-500">Powered by Gemini 3 Pro</p>
          </div>
        </div>
        <div className="flex gap-4 text-sm font-medium text-slate-400">
            <div className="flex items-center gap-1">
                <span className="material-icons-round text-base text-green-400">check_circle</span>
                <span>多模态就绪</span>
            </div>
        </div>
      </div>
    </header>
  );
};