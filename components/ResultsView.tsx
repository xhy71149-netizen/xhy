import React from 'react';
import { ClipResult, FileWithPreview } from '../types';

interface ResultsViewProps {
  results: ClipResult[];
  clips: FileWithPreview[];
}

export const ResultsView: React.FC<ResultsViewProps> = ({ results, clips }) => {
  
  // Helper to find the matching preview for a result
  const getPreview = (originalName: string) => {
    const match = clips.find(c => c.file.name === originalName);
    return match ? match.previewUrl : null;
  };

  const copyNameList = () => {
    const list = results.map(r => r.suggestedName).join('\n');
    navigator.clipboard.writeText(list);
    alert('文件名列表已复制到剪贴板！');
  };

  const downloadScript = (type: 'bat' | 'sh') => {
    if (results.length === 0) return;

    let content = '';
    if (type === 'bat') {
      content = '@echo off\r\nchcp 65001\r\n'; // Use UTF-8 for Chinese characters
      content += results.map(r => `ren "${r.originalName}" "${r.suggestedName}"`).join('\r\n');
      content += '\r\npause';
    } else {
      content = '#!/bin/bash\n';
      content += results.map(r => `mv "${r.originalName}" "${r.suggestedName}"`).join('\n');
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rename_clips.${type}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <span className="material-icons-round text-indigo-400">auto_awesome</span>
            分析结果 ({results.length})
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            已生成详细的中文命名 (15字以内)
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={copyNameList}
            className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
            title="复制所有新文件名"
          >
            <span className="material-icons-round text-sm">content_copy</span>
            复制列表
          </button>
          
          <div className="h-8 w-px bg-slate-600 hidden md:block mx-1"></div>

          <button 
            onClick={() => downloadScript('bat')}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-200 border border-blue-500/30 rounded-lg text-sm transition-colors"
            title="下载 Windows 批处理重命名脚本"
          >
            <span className="material-icons-round text-sm">terminal</span>
            Win 脚本 (.bat)
          </button>
           <button 
            onClick={() => downloadScript('sh')}
            className="flex items-center gap-2 px-3 py-2 bg-slate-600/20 hover:bg-slate-600/40 text-slate-200 border border-slate-500/30 rounded-lg text-sm transition-colors"
            title="下载 Mac/Linux Shell 重命名脚本"
          >
            <span className="material-icons-round text-sm">code</span>
            Mac/Linux 脚本 (.sh)
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((result, idx) => {
          const previewUrl = getPreview(result.originalName);
          return (
            <div key={idx} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-600 transition-colors shadow-lg flex flex-col">
              {previewUrl && (
                <div className="aspect-video w-full bg-slate-900 relative overflow-hidden group">
                  <img 
                    src={previewUrl} 
                    alt={result.originalName} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-xs text-white px-2 py-1 rounded max-w-[80%] truncate">
                    {result.originalName}
                  </div>
                </div>
              )}
              
              <div className="p-4 space-y-3 flex-1 flex flex-col">
                <div>
                  <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">建议文件名</label>
                  <div className="flex items-center gap-2 mt-1 group">
                    <code className="bg-slate-900/50 text-green-400 px-3 py-2 rounded-lg text-sm font-mono flex-1 break-all border border-slate-700/50 leading-tight">
                      {result.suggestedName}
                    </code>
                    <button 
                        onClick={() => {
                          navigator.clipboard.writeText(result.suggestedName);
                          // Optional: visual feedback
                        }}
                        className="text-slate-500 hover:text-white transition-colors p-1"
                        title="复制此文件名"
                    >
                        <span className="material-icons-round text-sm">content_copy</span>
                    </button>
                  </div>
                </div>
                
                <div className="flex-1">
                  <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">场景分析</label>
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
