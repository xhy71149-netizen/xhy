import React from 'react';
import { ClipResult, FileWithPreview } from '../types';

interface ResultsViewProps {
  results: ClipResult[];
  clips: FileWithPreview[]; // changed from images to clips, expecting previewUrl to be the thumbnail
}

export const ResultsView: React.FC<ResultsViewProps> = ({ results, clips }) => {
  
  // Helper to find the matching preview for a result
  const getPreview = (originalName: string) => {
    const match = clips.find(c => c.file.name === originalName);
    return match ? match.previewUrl : null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="material-icons-round text-indigo-400">auto_awesome</span>
          分析结果
        </h2>
        <span className="text-sm text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
          已命名 {results.length} 个切片
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((result, idx) => {
          const previewUrl = getPreview(result.originalName);
          return (
            <div key={idx} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-600 transition-colors shadow-lg">
              {previewUrl && (
                <div className="aspect-video w-full bg-slate-900 relative overflow-hidden group">
                  <img 
                    src={previewUrl} 
                    alt={result.originalName} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-xs text-white px-2 py-1 rounded">
                    原名: {result.originalName}
                  </div>
                </div>
              )}
              
              <div className="p-4 space-y-3">
                <div>
                  <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">建议文件名</label>
                  <div className="flex items-center gap-2 mt-1 group">
                    <code className="bg-slate-900/50 text-green-400 px-3 py-1.5 rounded-lg text-sm font-mono flex-1 break-all border border-slate-700/50">
                      {result.suggestedName}
                    </code>
                    <button 
                        onClick={() => navigator.clipboard.writeText(result.suggestedName)}
                        className="text-slate-500 hover:text-white transition-colors p-1"
                        title="复制文件名"
                    >
                        <span className="material-icons-round text-sm">content_copy</span>
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">理由</label>
                  <p className="text-slate-300 text-sm mt-1 leading-relaxed">
                    {result.reasoning}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};