
import React, { useState, useRef, useEffect } from 'react';
import { Video, Upload, X, Play, Pause, Sparkles, Loader2, CheckCircle2, AlertCircle, Scissors, RotateCcw, Volume2, VolumeX, Maximize2, Wand2, Key } from 'lucide-react';
import { optimizeTestimony, generateVideoTestimony } from '../services/geminiService';

const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const TestimonyStudio: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  
  // Video Player State
  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  // Trimming State
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [draggingHandle, setDraggingHandle] = useState<'start' | 'end' | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [videoGenProgress, setVideoGenProgress] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggingHandle || !timelineRef.current || !duration) return;
      e.preventDefault();
      const rect = timelineRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      const newTime = percentage * duration;
      const minDuration = 1;

      if (draggingHandle === 'start') {
        const maxStart = Math.max(0, trimEnd - minDuration); 
        const validStart = Math.min(Math.max(0, newTime), maxStart);
        setTrimStart(validStart);
        if (videoRef.current) { videoRef.current.currentTime = validStart; setCurrentTime(validStart); }
      } else {
        const minEnd = Math.min(duration, trimStart + minDuration);
        const validEnd = Math.max(Math.min(duration, newTime), minEnd);
        setTrimEnd(validEnd);
        if (videoRef.current) { videoRef.current.currentTime = validEnd; setCurrentTime(validEnd); }
      }
    };
    const handleMouseUp = () => setDraggingHandle(null);
    if (draggingHandle) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingHandle, duration, trimEnd, trimStart]);

  useEffect(() => {
    if (videoRef.current && isPlaying && !draggingHandle) {
      if (currentTime >= trimEnd) {
        videoRef.current.currentTime = trimStart;
        videoRef.current.play();
      }
    }
  }, [currentTime, trimEnd, trimStart, isPlaying, draggingHandle]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      setUploadSuccess(false);
      setIsPlaying(false);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const vidDuration = videoRef.current.duration;
      setDuration(vidDuration);
      setTrimEnd(vidDuration);
      setTrimStart(0);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && !draggingHandle) setCurrentTime(videoRef.current.currentTime);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else { if (currentTime >= trimEnd - 0.1) videoRef.current.currentTime = trimStart; videoRef.current.play(); }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAIComposeVideo = async () => {
    if (!description.trim()) { alert("Please write a description first."); return; }
    
    // @ts-ignore - Check for key selection per Veo rules
    if (typeof window.aistudio !== 'undefined') {
      // @ts-ignore
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
        return; // Proceed after key is selected
      }
    }

    setIsGeneratingVideo(true);
    setVideoGenProgress('Igniting the spark of your story...');
    
    try {
      const messages = [
        "Crafting cinematic lighting...",
        "Applying emotional textures...",
        "Polishing every frame...",
        "God is in the details...",
        "Finalizing your testimony video..."
      ];
      let msgIdx = 0;
      const interval = setInterval(() => {
        setVideoGenProgress(messages[msgIdx % messages.length]);
        msgIdx++;
      }, 8000);

      const videoUrl = await generateVideoTestimony(description);
      clearInterval(interval);
      setVideoPreview(videoUrl);
      setUploadSuccess(false);
    } catch (e) {
      console.error(e);
      alert("Testimony generation failed. Ensure your API key has billing enabled.");
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const handleOptimize = async () => {
    if (!description.trim()) return;
    setIsOptimizing(true);
    try {
      const result = await optimizeTestimony(description);
      setTitle(result.title);
      setDescription(result.summary);
      setTags(result.tags);
    } catch (e) {
      console.error(e);
      alert("Could not optimize text.");
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleUpload = async () => {
    if (!videoPreview || !description) return;
    setIsUploading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setUploadSuccess(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-8 h-full">
      <div className="max-w-6xl mx-auto pb-32">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tighter uppercase">TESTIMONY STUDIO</h1>
          <p className="text-slate-500 font-bold text-lg">Bring your story to life with AI cinematic generation or upload your own.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column: Player */}
          <div className="flex-1">
            <div className={`bg-slate-900 rounded-[2.5rem] border-4 border-slate-200 transition-all relative overflow-hidden aspect-[9/16] max-h-[700px] flex flex-col items-center justify-center group shadow-2xl ${videoPreview ? 'border-indigo-600/20' : 'bg-white hover:bg-slate-50 border-dashed'}`}>
              
              {isGeneratingVideo && (
                <div className="absolute inset-0 z-40 bg-slate-900/90 backdrop-blur-xl flex flex-col items-center justify-center p-12 text-center animate-in fade-in">
                  <div className="w-24 h-24 bg-indigo-600/20 rounded-full flex items-center justify-center mb-8 relative">
                     <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 border-indigo-500/10 animate-spin"></div>
                     <Sparkles className="w-10 h-10 text-indigo-400 animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4 tracking-tight uppercase">VEO GENERATING...</h3>
                  <p className="text-indigo-200 text-lg font-bold animate-pulse">{videoGenProgress}</p>
                  <p className="text-slate-500 text-sm mt-8 max-w-xs">Cinematic generation takes a few moments. We're crafting something special for your story.</p>
                </div>
              )}

              {videoPreview ? (
                <>
                  <video ref={videoRef} src={videoPreview} className="w-full h-full object-contain" playsInline onClick={togglePlay} onLoadedMetadata={handleLoadedMetadata} onTimeUpdate={handleTimeUpdate} onEnded={() => setIsPlaying(false)} />
                  <div className={`absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-8 transition-all duration-500 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}>
                     <div className="absolute top-6 right-6 flex gap-3">
                        <button onClick={() => { setVideoFile(null); setVideoPreview(null); }} className="p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all backdrop-blur-md border border-white/20" title="Remove Video"><X className="w-6 h-6" /></button>
                     </div>
                     <div ref={timelineRef} className="mb-6 relative h-10 flex items-center select-none cursor-pointer">
                        <div className="absolute inset-x-0 h-2 bg-white/10 rounded-full backdrop-blur-sm"></div>
                        <div className="absolute h-2 bg-indigo-500 rounded-full opacity-80" style={{ left: `${(trimStart / duration) * 100}%`, width: `${((trimEnd - trimStart) / duration) * 100}%` }}></div>
                        <div className="absolute h-2 bg-indigo-300 rounded-full" style={{ left: `${(trimStart / duration) * 100}%`, width: `${(Math.max(0, currentTime - trimStart) / duration) * 100}%` }}></div>
                        <input type="range" min={0} max={duration} step={0.01} value={currentTime} onChange={(e) => { const t = parseFloat(e.target.value); if (videoRef.current) { videoRef.current.currentTime = t; setCurrentTime(t); } }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                        <div className="absolute w-4 h-4 bg-white rounded-full shadow-2xl z-20 border-2 border-indigo-500" style={{ left: `${(currentTime / duration) * 100}%`, transform: 'translateX(-50%)' }}></div>
                        <div className="absolute h-10 w-4 -ml-2 top-1/2 -translate-y-1/2 z-30 cursor-ew-resize flex items-center justify-center" style={{ left: `${(trimStart / duration) * 100}%` }} onMouseDown={() => setDraggingHandle('start')}>
                            <div className="w-2 h-8 bg-yellow-400 rounded-full shadow-xl"></div>
                        </div>
                        <div className="absolute h-10 w-4 -ml-2 top-1/2 -translate-y-1/2 z-30 cursor-ew-resize flex items-center justify-center" style={{ left: `${(trimEnd / duration) * 100}%` }} onMouseDown={() => setDraggingHandle('end')}>
                             <div className="w-2 h-8 bg-yellow-400 rounded-full shadow-xl"></div>
                        </div>
                     </div>
                     <div className="flex items-center justify-between">
                        <button onClick={togglePlay} className="text-white hover:text-indigo-400 transition-all transform active:scale-90">{isPlaying ? <Pause className="w-12 h-12 fill-current" /> : <Play className="w-12 h-12 fill-current" />}</button>
                        <div className="flex gap-4">
                           <button onClick={() => { setTrimStart(0); setTrimEnd(duration); }} className="px-5 py-2.5 bg-white/10 text-white text-xs font-black rounded-full hover:bg-white/20 transition-all backdrop-blur-md border border-white/20 uppercase tracking-widest flex items-center gap-2"><RotateCcw className="w-4 h-4" /> RESET</button>
                           <div className="px-5 py-2.5 bg-indigo-600/90 text-white text-xs font-black rounded-full flex items-center gap-2 backdrop-blur-md border border-indigo-400/50 uppercase tracking-widest"><Scissors className="w-4 h-4" /> {formatTime(trimEnd - trimStart)}</div>
                        </div>
                     </div>
                  </div>
                </>
              ) : (
                <div className="text-center p-12">
                  <div className="w-24 h-24 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner"><Video className="w-12 h-12" /></div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">BRING YOUR STORY TO LIFE</h3>
                  <p className="text-slate-500 font-bold mb-10 max-w-xs mx-auto text-lg leading-tight">Write your story and let AI generate a professional cinematic video, or upload your own.</p>
                  <button onClick={() => fileInputRef.current?.click()} className="w-full mb-4 px-10 py-5 bg-indigo-600 text-white font-black rounded-3xl hover:bg-indigo-700 transition-all shadow-2xl active:scale-95 uppercase tracking-widest">SELECT VIDEO FILE</button>
                  <input type="file" ref={fileInputRef} className="hidden" accept="video/*" onChange={handleFileSelect} />
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="flex-1 space-y-8">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 relative overflow-hidden">
               <div className="flex items-center justify-between mb-8">
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">DETAILS</h3>
                 <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100 uppercase tracking-widest"><Sparkles className="w-4 h-4" /> AI POWERED</div>
               </div>

               <div className="space-y-6">
                 <div>
                   <label className="block text-xs font-black text-slate-400 mb-3 uppercase tracking-widest">What did God do in your life?</label>
                   <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Type your rough draft here..." className="w-full h-48 p-6 bg-slate-50 border border-slate-200 rounded-3xl text-lg font-medium focus:ring-4 focus:ring-indigo-500/20 outline-none resize-none transition-all placeholder:text-slate-300" />
                   <div className="flex flex-col sm:flex-row gap-4 mt-6">
                     <button onClick={handleOptimize} disabled={isOptimizing || !description.trim()} className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 transition-all shadow-xl"><Wand2 className="w-4 h-4" /> POLISH TEXT</button>
                     <button onClick={handleAIComposeVideo} disabled={isGeneratingVideo || !description.trim()} className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-xl shadow-indigo-200"><Sparkles className="w-4 h-4" /> VEO GENERATE</button>
                   </div>
                   <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                     <AlertCircle className="w-3 h-3" /> Requires billing enabled API key
                   </div>
                 </div>

                 <div className={`transition-all duration-500 space-y-6 ${isOptimizing ? 'opacity-30 blur-sm' : 'opacity-100'}`}>
                    <div>
                      <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">ENGAGING TITLE</label>
                      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Wait for AI or type here..." className="w-full p-4 bg-white border border-slate-300 rounded-2xl text-lg font-black tracking-tight focus:ring-4 focus:ring-indigo-500/20 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">SPIRITUAL HASHTAGS</label>
                      <div className="flex flex-wrap gap-2">
                         {tags.map((tag, i) => (
                           <span key={i} className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-xs font-black border border-indigo-100 flex items-center gap-1">
                             {tag} <button onClick={() => setTags(tags.filter(t => t !== tag))} className="ml-1 opacity-50 hover:opacity-100"><X className="w-3 h-3" /></button>
                           </span>
                         ))}
                         <input type="text" placeholder="+ TAG" className="text-xs font-black bg-transparent outline-none min-w-[80px] p-2 uppercase tracking-widest text-indigo-600" onKeyDown={(e) => { if (e.key === 'Enter') { const val = e.currentTarget.value; if (val) setTags([...tags, val.startsWith('#') ? val : `#${val}`]); e.currentTarget.value = ''; } }} />
                      </div>
                    </div>
                 </div>
               </div>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
               {uploadSuccess ? (
                 <div className="text-center py-6 animate-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-100"><CheckCircle2 className="w-10 h-10" /></div>
                    <h4 className="text-2xl font-black text-slate-900 tracking-tight mb-2 uppercase">PUBLISHED!</h4>
                    <p className="text-slate-500 font-bold text-lg mb-8">God's light is shining through your story.</p>
                    <button onClick={() => { setUploadSuccess(false); setVideoPreview(null); setTitle(''); setDescription(''); setTags([]); }} className="text-indigo-600 font-black uppercase tracking-widest hover:underline text-sm">SHARE ANOTHER TESTIMONY</button>
                 </div>
               ) : (
                 <div className="space-y-6">
                    <button onClick={handleUpload} disabled={!videoPreview || isUploading} className="w-full py-6 bg-slate-900 text-white font-black text-lg rounded-3xl shadow-2xl hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 uppercase tracking-tighter">
                       {isUploading ? <><Loader2 className="w-6 h-6 animate-spin" /> UPLOADING...</> : <><CheckCircle2 className="w-6 h-6" /> POST TESTIMONY</>}
                    </button>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-4">
                       <AlertCircle className="w-5 h-5 text-slate-400 shrink-0 mt-1" />
                       <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-widest">Every story is reviewed by our community team to ensure a safe, Christ-centered environment for all users.</p>
                    </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
