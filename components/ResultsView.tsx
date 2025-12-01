import React, { useMemo, useState, useRef, useEffect } from 'react';
import { ClipResult, FileWithPreview } from '../types';
// @ts-ignore
import { FixedSizeList as List } from 'react-window';

interface ResultsViewProps {
  results: ClipResult[];
  clips: FileWithPreview[];
}

export const ResultsView: React.FC<ResultsViewProps> = ({ results, clips }) => {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Enforce ordering: Map results to the order of original clips
  const sortedResults = useMemo(() => {
    return clips.map(clip => {
      const result = results.find(r => r.originalName === clip.file.name);
      // Fallback if AI missed a file (preserves order)
      if (!result) {
        return {
          originalName: clip.file.name,
          suggestedName: clip.file.name.replace(/\.[^/.]+$/, "") + "_未命名.mp4",
          reasoning: "AI 未返回该切片的分析结果。",
          previewUrl: clip.previewUrl
        };
      }
      return { ...result, previewUrl: clip.previewUrl };
    });
  }, [results, clips]);

  // Handle Resize to update dimensions
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Calculate available height: Window height - top position - bottom padding
        // Ensure a minimum height of 500px
        const availableHeight = window.innerHeight - rect.top - 20;
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: Math.max(500, availableHeight) 
        });
      }
    };

    // Initial measure with a slight delay to ensure layout is settled
    const timer = setTimeout(handleResize, 100);
    window.addEventListener('resize', handleResize);
    
    return () => {
        window.removeEventListener('resize', handleResize);
        clearTimeout(timer);
    };
  }, [sortedResults.length]);

  const copyNameList = () => {
    const list = sortedResults.map(r => r.suggestedName).join('\n');
    navigator.clipboard.writeText(list);
    alert('文件名列表已复制到剪贴板！');
  };

  const downloadScript = (type: 'bat' | 'sh') => {
    if (sortedResults.length === 0) return;

    let content = '';
    if (type === 'bat') {
      content = '@echo off\r\nchcp 65001\r\n'; // Use UTF-8 for Chinese characters
      content += sortedResults.map(r => `ren "${r.originalName}" "${r.suggestedName}"`).join('\r\n');
      content += '\r\npause';
    } else {
      content = '#!/bin/bash\n';
      content += sortedResults.map(r => `mv "${r.originalName}" "${r.suggestedName}"`).join('\n');
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

  // Virtualization & Grid Logic
  const GAP = 24; // Gap between items
  
  const getGridConfig = (width: number) => {
    if (width < 640) return { cols: 1 };     // Mobile
    if (width < 1024) return { cols: 2 };    // Tablet
    return { cols: 3 };                      // Desktop
  };

  const { cols } = getGridConfig(containerSize.width);
  
  // Calculate Item Width
  // Total Width = (cols * itemWidth) + ((cols - 1) * GAP)
  const itemWidth = (containerSize.width - (cols - 1) * GAP) / cols;
  
  // Calculate Row Height
  // Image aspect ratio 16:9. 
  const imageHeight = itemWidth / (16/9);
  const contentHeight = 200; // Approx height for text content
  const itemHeight = imageHeight + contentHeight;
  const rowHeight = itemHeight + GAP; // Add gap to row height

  const rowCount = Math.ceil(sortedResults.length / cols);

  // The Row component for React-Window
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const startIndex = index * cols;
    const items = sortedResults.slice(startIndex, startIndex + cols);

    // style contains absolute positioning from react-window
    // We modify it to account for the GAP at the bottom manually by rendering inside a container of that height
    const rowStyle = {
        ...style,
        height: (style.height as number) - GAP, // Reduce height by gap size for the visual container
        width: '100%',
        display: 'flex',
        gap: GAP
    };

    return (
      <div style={rowStyle}>
        {items.map((result, i) => (
          <div 
            key={startIndex + i} 
            style={{ width: itemWidth }}
            className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-600 transition-colors shadow-lg flex flex-col h-full"
          >
            {/* Thumbnail */}
            <div className="aspect-video w-full bg-slate-900 relative overflow-hidden group shrink-0">
              <img 
                src={result.previewUrl} 
                alt={result.originalName} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-xs text-white px-2 py-1 rounded max-w-[80%] truncate">
                {result.originalName}
              </div>
            </div>
            
            {/* Content */}
            <div className="p-4 space-y-3 flex-1 flex flex-col min-h-0">
              <div className="shrink-0">
                <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">建议文件名</label>
                <div className="flex items-center gap-2 mt-1 group">
                  <code className="bg-slate-900/50 text-green-400 px-3 py-2 rounded-lg text-sm font-mono flex-1 break-all border border-slate-700/50 leading-tight truncate">
                    {result.suggestedName}
                  </code>
                  <button 
                      onClick={() => {
                        navigator.clipboard.writeText(result.suggestedName);
                      }}
                      className="text-slate-500 hover:text-white transition-colors p-1 shrink-0"
                      title="复制此文件名"
                  >
                      <span className="material-icons-round text-sm">content_copy</span>
                  </button>
                </div>
              </div>
              
              <div className="flex-1 min-h-0 overflow-hidden">
                <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">场景详情</label>
                <p className="text-slate-300 text-sm mt-1 leading-relaxed line-clamp-4" title={result.reasoning}>
                  {result.reasoning}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
      {/* Header & Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700 shrink-0">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <span className="material-icons-round text-indigo-400">auto_awesome</span>
            分析结果 ({sortedResults.length})
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            已生成详细的中文命名 (包含主语+动作，15字以内)
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={copyNameList}
            className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
            title="按视频顺序复制所有新文件名"
          >
            <span className="material-icons-round text-sm">content_copy</span>
            复制列表 (顺序)
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

      {/* Virtualized Grid Container */}
      <div ref={containerRef} className="flex-1 w-full" style={{ minHeight: '500px' }}>
        {containerSize.width > 0 && (
          <List
            height={containerSize.height}
            itemCount={rowCount}
            itemSize={rowHeight}
            width={containerSize.width}
            className="custom-scrollbar"
          >
            {Row}
          </List>
        )}
      </div>
    </div>
  );
};
