import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { UploadArea } from './components/UploadArea';
import { ResultsView } from './components/ResultsView';
import { AnalysisStatus, ClipResult, FileWithPreview, AnalysisError } from './types';
import { fileToBase64, createPreview, revokePreview, generateVideoThumbnail } from './services/fileUtils';
import { analyzeClips } from './services/api';

export default function App() {
  const [videoFile, setVideoFile] = useState<FileWithPreview | null>(null);
  const [clipFiles, setClipFiles] = useState<FileWithPreview[]>([]);
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [results, setResults] = useState<ClipResult[]>([]);
  const [error, setError] = useState<AnalysisError | null>(null);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (videoFile) revokePreview(videoFile.previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVideoSelect = (files: FileList) => {
    if (files[0]) {
      // Limit file size for browser safety (300MB as requested)
      // Note: Large Base64 conversion can be memory intensive
      if (files[0].size > 300 * 1024 * 1024) {
        setError({ message: "主视频文件过大。请使用 300MB 以下的文件。" });
        return;
      }
      
      const newVideo = {
        file: files[0],
        previewUrl: createPreview(files[0])
      };
      setVideoFile(newVideo);
      setError(null);
    }
  };

  const handleClipsSelect = async (files: FileList) => {
    setError(null);
    setStatus(AnalysisStatus.PREPARING); // Indicate processing
    
    try {
      const newClipsPromises = Array.from(files).map(async (file) => {
        // Generate thumbnail for each clip
        const thumbnailDataUrl = await generateVideoThumbnail(file);
        return {
          file,
          previewUrl: thumbnailDataUrl // Store the thumbnail as preview
        };
      });

      const newClips = await Promise.all(newClipsPromises);
      setClipFiles(prev => [...prev, ...newClips]);
      setStatus(AnalysisStatus.IDLE);
    } catch (err) {
      console.error(err);
      setError({ message: "无法生成部分视频的缩略图，请检查视频格式。" });
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const removeClip = (index: number) => {
    setClipFiles(prev => {
      const newClips = [...prev];
      newClips.splice(index, 1);
      return newClips;
    });
  };

  const startAnalysis = async () => {
    if (!videoFile || clipFiles.length === 0) return;

    setStatus(AnalysisStatus.PREPARING);
    setError(null);

    try {
      // 1. Convert main video
      const videoBase64 = await fileToBase64(videoFile.file);
      
      // 2. Prepare thumbnails for API
      const imagesPayload = clipFiles.map(clip => ({
        base64: clip.previewUrl.split(',')[1],
        mimeType: 'image/jpeg', // generateVideoThumbnail returns jpeg
        originalName: clip.file.name
      }));

      setStatus(AnalysisStatus.ANALYZING);

      // 3. Call API
      const analysisResults = await analyzeClips(
        videoBase64,
        videoFile.file.type,
        imagesPayload
      );

      setResults(analysisResults);
      setStatus(AnalysisStatus.COMPLETED);

    } catch (err: any) {
      console.error(err);
      setError({ message: err.message || "分析视频时出错。" });
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const reset = () => {
    setVideoFile(null);
    setClipFiles([]);
    setResults([]);
    setStatus(AnalysisStatus.IDLE);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Intro / Instructions */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">智能视频切片命名</h2>
          <p className="text-slate-400 text-lg">
            上传完整的源视频和分割出的 Clip 视频文件。
            Gemini 将提取每个 Clip 的画面，结合源视频上下文，自动为它们生成中文文件名。
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-200 max-w-3xl mx-auto">
            <span className="material-icons-round">error_outline</span>
            <p>{error.message}</p>
          </div>
        )}

        {status === AnalysisStatus.COMPLETED ? (
          <div className="space-y-8">
            <ResultsView results={results} clips={clipFiles} />
            <div className="flex justify-center pt-8">
              <button
                onClick={reset}
                className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all font-medium border border-slate-700"
              >
                <span className="material-icons-round">refresh</span>
                开始新的分析
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8 max-w-4xl mx-auto">
            {/* 1. Video Upload */}
            <section className="bg-slate-800/30 rounded-2xl p-6 border border-slate-800">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-indigo-500/20 text-indigo-400 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <h3 className="text-lg font-semibold text-white">完整源视频</h3>
              </div>
              
              {!videoFile ? (
                <UploadArea 
                  label="上传完整视频" 
                  subLabel="MP4, WebM (最大 300MB)" 
                  accept="video/*" 
                  icon="video_file" 
                  onFileSelect={handleVideoSelect}
                  disabled={status !== AnalysisStatus.IDLE && status !== AnalysisStatus.ERROR}
                />
              ) : (
                <div className="relative group bg-slate-900 rounded-xl overflow-hidden border border-slate-700">
                  <div className="aspect-video w-full bg-black flex items-center justify-center">
                    <video 
                        src={videoFile.previewUrl} 
                        className="h-full w-full object-contain" 
                        controls={false}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                            onClick={() => setVideoFile(null)}
                            className="bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-full backdrop-blur-sm transition-transform hover:scale-110"
                         >
                            <span className="material-icons-round">delete</span>
                         </button>
                    </div>
                  </div>
                  <div className="p-3 flex items-center justify-between bg-slate-800">
                    <div className="flex items-center gap-2 text-sm text-white">
                        <span className="material-icons-round text-indigo-400">movie</span>
                        <span className="truncate max-w-[200px]">{videoFile.file.name}</span>
                    </div>
                    <span className="text-xs text-slate-400">{(videoFile.file.size / (1024*1024)).toFixed(1)} MB</span>
                  </div>
                </div>
              )}
            </section>

            {/* 2. Clip Videos Upload */}
            <section className="bg-slate-800/30 rounded-2xl p-6 border border-slate-800">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-purple-500/20 text-purple-400 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <h3 className="text-lg font-semibold text-white">切片视频 (Clips)</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                {clipFiles.map((clip, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden bg-slate-900 border border-slate-700">
                        {/* Show generated thumbnail */}
                        <img src={clip.previewUrl} alt="Clip thumbnail" className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 inset-x-0 bg-black/70 p-2 text-xs text-white truncate">
                            {clip.file.name}
                        </div>
                        <button 
                            onClick={() => removeClip(idx)}
                            disabled={status !== AnalysisStatus.IDLE && status !== AnalysisStatus.ERROR}
                            className="absolute top-1 right-1 bg-black/60 hover:bg-red-500 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <span className="material-icons-round text-sm">close</span>
                        </button>
                    </div>
                ))}
                <UploadArea 
                  label="批量上传切片" 
                  accept="video/*" 
                  icon="video_library" 
                  multiple={true}
                  onFileSelect={handleClipsSelect}
                  disabled={status !== AnalysisStatus.IDLE && status !== AnalysisStatus.ERROR}
                />
              </div>
              <p className="text-sm text-slate-500 text-right">已选择 {clipFiles.length} 个切片</p>
            </section>

            {/* Action Area */}
            <div className="flex flex-col items-center gap-4 pt-4">
                {(status === AnalysisStatus.PREPARING || status === AnalysisStatus.ANALYZING) && (
                    <div className="flex flex-col items-center gap-3 animate-pulse">
                        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-indigo-300 font-medium">
                            {status === AnalysisStatus.PREPARING ? "正在提取切片封面..." : "Gemini 正在分析视频上下文..."}
                        </p>
                    </div>
                )}
                
                {(status === AnalysisStatus.IDLE || status === AnalysisStatus.ERROR) && (
                    <button
                        onClick={startAnalysis}
                        disabled={!videoFile || clipFiles.length === 0}
                        className={`
                            px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-indigo-500/20 flex items-center gap-3 transition-all
                            ${(!videoFile || clipFiles.length === 0)
                                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:scale-105 hover:shadow-indigo-500/40'
                            }
                        `}
                    >
                        <span className="material-icons-round">smart_button</span>
                        生成中文文件名
                    </button>
                )}
            </div>

          </div>
        )}
      </main>
    </div>
  );
}