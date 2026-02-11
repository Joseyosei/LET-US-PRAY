
import React, { useState, useRef, useEffect } from 'react';
import { Video, Upload, X, Play, Pause, Sparkles, Loader2, CheckCircle2, AlertCircle, Scissors, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { optimizeTestimony } from '../services/geminiService';

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0); // Will init to duration
  const [isTrimming, setIsTrimming] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Loop playback within trim range
    if (videoRef.current && !isTrimming && isPlaying) {
      if (currentTime >= trimEnd) {
        videoRef.current.currentTime = trimStart;
        videoRef.current.play();
      }
    }
  }, [currentTime, trimEnd, trimStart, isTrimming, isPlaying]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      setUploadSuccess(false);
      // Reset player state
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        setVideoFile(file);
        setVideoPreview(URL.createObjectURL(file));
        setUploadSuccess(false);
        // Reset player state
        setCurrentTime(0);
        setDuration(0);
        setIsPlaying(false);
      }
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
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        // If we are at the end of the trim, restart from trim start
        if (currentTime >= trimEnd) {
          videoRef.current.currentTime = trimStart;
        }
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
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
      alert("Could not optimize text. Please try again.");
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleUpload = async () => {
    if (!videoFile || !description) return;
    
    setIsUploading(true);

    try {
      if (!title) {
        try {
          const result = await optimizeTestimony(description);
          setTitle(result.title);
          setDescription(result.summary);
          setTags(result.tags);
        } catch (e) {
          console.error("Auto-optimization failed", e);
          setTitle("My Testimony");
        }
      }
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsUploading(false);
      setUploadSuccess(true);
    } catch (error) {
      console.error("Upload process failed", error);
      setIsUploading(false);
    }
  };

  const clearVideo = () => {
    setVideoFile(null);
    setVideoPreview(null);
    setUploadSuccess(false);
    setIsPlaying(false);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 h-full">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Share Your Story</h1>
          <p className="text-slate-600">Upload your video testimony. Authenticity changes lives.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Video Studio */}
          <div className="flex-1">
            <div 
              className={`bg-slate-900 rounded-2xl border-2 border-dashed transition-all relative overflow-hidden aspect-[9/16] max-h-[600px] flex flex-col items-center justify-center group ${
                videoPreview ? 'border-transparent shadow-2xl' : 'border-slate-300 hover:border-indigo-400 bg-white hover:bg-slate-50'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {videoPreview ? (
                <>
                  <video 
                    ref={videoRef}
                    src={videoPreview} 
                    className="w-full h-full object-contain" 
                    playsInline
                    onClick={togglePlay}
                    onLoadedMetadata={handleLoadedMetadata}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={() => setIsPlaying(false)}
                  />
                  
                  {/* Custom Controls Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                     
                     {/* Top Bar Actions */}
                     <div className="absolute top-4 right-4 flex gap-2">
                        <button onClick={clearVideo} className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors" title="Remove Video">
                          <X className="w-5 h-5" />
                        </button>
                     </div>

                     {/* Scrubber & Trimmer */}
                     <div className="mb-4 relative h-10 flex items-center">
                        {/* Trim Background Track */}
                        <div className="absolute inset-x-0 h-1 bg-white/20 rounded-full"></div>
                        
                        {/* Trim Active Zone */}
                        <div 
                          className="absolute h-1 bg-indigo-500/50 rounded-full"
                          style={{
                             left: `${(trimStart / duration) * 100}%`,
                             width: `${((trimEnd - trimStart) / duration) * 100}%`
                          }}
                        ></div>

                        {/* Playhead Scrubber */}
                        <input 
                          type="range" 
                          min={0} 
                          max={duration} 
                          value={currentTime} 
                          onChange={handleScrubberChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        />
                        <div 
                           className="absolute w-3 h-3 bg-white rounded-full shadow pointer-events-none z-10 transition-all duration-75"
                           style={{ left: `${(currentTime / duration) * 100}%`, transform: 'translateX(-50%)' }}
                        ></div>
                        
                        {/* Start Trim Handle (Visual only for now, would need range input logic for full drag) */}
                        <div 
                           className="absolute h-4 w-1 bg-yellow-400 z-10 cursor-ew-resize"
                           style={{ left: `${(trimStart / duration) * 100}%` }}
                        ></div>
                         {/* End Trim Handle */}
                        <div 
                           className="absolute h-4 w-1 bg-yellow-400 z-10 cursor-ew-resize"
                           style={{ left: `${(trimEnd / duration) * 100}%` }}
                        ></div>
                     </div>

                     {/* Trimming Inputs (Visible when Trim mode active) */}
                     {isTrimming && (
                        <div className="flex justify-between items-center bg-black/60 rounded-lg p-2 mb-2 backdrop-blur-sm animate-in slide-in-from-bottom-2">
                           <div className="flex flex-col">
                              <span className="text-[10px] text-yellow-400 uppercase font-bold">Start</span>
                              <span className="text-xs text-white font-mono">{formatTime(trimStart)}</span>
                              <input 
                                type="range" min={0} max={trimEnd - 1} step={0.1}
                                value={trimStart}
                                onChange={(e) => {
                                   const val = parseFloat(e.target.value);
                                   setTrimStart(val);
                                   if(currentTime < val) {
                                      videoRef.current!.currentTime = val;
                                      setCurrentTime(val);
                                   }
                                }}
                                className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer mt-1"
                              />
                           </div>
                           <div className="text-xs text-slate-400 font-mono">Trim Mode</div>
                           <div className="flex flex-col text-right">
                              <span className="text-[10px] text-yellow-400 uppercase font-bold">End</span>
                              <span className="text-xs text-white font-mono">{formatTime(trimEnd)}</span>
                              <input 
                                type="range" min={trimStart + 1} max={duration} step={0.1}
                                value={trimEnd}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value);
                                  setTrimEnd(val);
                                  if(currentTime > val) {
                                    videoRef.current!.currentTime = val;
                                    setCurrentTime(val);
                                  }
                                }}
                                className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer mt-1"
                              />
                           </div>
                        </div>
                     )}

                     {/* Control Bar */}
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <button onClick={togglePlay} className="text-white hover:text-indigo-400 transition-colors">
                              {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current" />}
                           </button>
                           <button onClick={toggleMute} className="text-white hover:text-indigo-400 transition-colors">
                              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                           </button>
                           <span className="text-xs font-mono text-white/80">
                              {formatTime(currentTime)} / {formatTime(duration)}
                           </span>
                        </div>
                        
                        <div className="flex gap-3">
                           <button 
                             onClick={() => setIsTrimming(!isTrimming)}
                             className={`p-2 rounded-full transition-colors ${isTrimming ? 'bg-yellow-500 text-slate-900' : 'bg-white/10 text-white hover:bg-white/20'}`}
                             title="Trim Video"
                           >
                              <Scissors className="w-4 h-4" />
                           </button>
                           <button 
                             onClick={() => { setTrimStart(0); setTrimEnd(duration); }}
                             className="p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
                             title="Reset Trim"
                           >
                              <RotateCcw className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                  </div>

                  {/* Big Play Button (Center) */}
                  {!isPlaying && (
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-16 h-16 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                           <Play className="w-8 h-8 text-white fill-white ml-1" />
                        </div>
                     </div>
                  )}
                </>
              ) : (
                <div className="text-center p-8">
                  <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Video className="w-10 h-10" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Upload Video</h3>
                  <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">
                    Drag and drop your MP4, MOV file here, or click to browse.
                    <br/><span className="text-xs text-slate-400 mt-2 block">Max size 500MB. 9:16 vertical recommended.</span>
                  </p>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    Select File
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="video/*" 
                    onChange={handleFileSelect}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Details & AI Assistant */}
          <div className="flex-1 space-y-6">
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
               <div className="flex items-center justify-between mb-4">
                 <h3 className="font-semibold text-slate-900">Details</h3>
                 <div className="flex items-center gap-2 text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">
                    <Sparkles className="w-3 h-3" /> AI Assistant Ready
                 </div>
               </div>

               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Raw Notes / Draft</label>
                   <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="I was feeling really down about my health, but then..."
                      className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                   />
                   <div className="flex justify-end mt-2">
                     <button 
                        onClick={handleOptimize}
                        disabled={isOptimizing || !description.trim()}
                        className="text-xs flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-medium disabled:opacity-50 transition-colors"
                     >
                        {isOptimizing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                        {isOptimizing ? 'Polishing...' : 'Polish with AI'}
                     </button>
                   </div>
                 </div>

                 <div className={`transition-all duration-500 ${isOptimizing ? 'opacity-50 blur-[1px]' : 'opacity-100'}`}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                      <input 
                          type="text" 
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. My Healing Journey"
                          className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-semibold text-slate-900"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Hashtags</label>
                      <div className="flex flex-wrap gap-2">
                         {tags.map((tag, i) => (
                           <span key={i} className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium border border-slate-200">
                             {tag}
                             <button onClick={() => setTags(tags.filter(t => t !== tag))} className="ml-1 hover:text-red-500">&times;</button>
                           </span>
                         ))}
                         <input 
                           type="text" 
                           placeholder="+ Add tag"
                           className="text-xs bg-transparent outline-none min-w-[60px] p-1"
                           onKeyDown={(e) => {
                             if (e.key === 'Enter') {
                               const val = e.currentTarget.value;
                               if (val) setTags([...tags, val.startsWith('#') ? val : `#${val}`]);
                               e.currentTarget.value = '';
                             }
                           }}
                         />
                      </div>
                    </div>
                 </div>
               </div>
            </div>

            {/* Upload Status / Actions */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
               {uploadSuccess ? (
                 <div className="text-center py-4">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 animate-in zoom-in">
                       <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-slate-900">Upload Successful!</h4>
                    <p className="text-sm text-slate-500 mb-4">Your testimony is being processed and will appear in the feed shortly.</p>
                    <button 
                       onClick={() => { setUploadSuccess(false); clearVideo(); setTitle(''); setDescription(''); setTags([]); }}
                       className="text-sm text-indigo-600 font-medium hover:underline"
                    >
                       Upload Another
                    </button>
                 </div>
               ) : (
                 <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-blue-50 text-blue-800 rounded-lg text-xs">
                       <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                       <p>Your video will be reviewed by our moderation team before it goes public to ensure a safe community.</p>
                    </div>
                    <button 
                      onClick={handleUpload}
                      disabled={!videoFile || isUploading}
                      className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                       {isUploading ? (
                         <>
                           <Loader2 className="w-5 h-5 animate-spin" />
                           {title ? 'Uploading...' : 'Polishing & Uploading...'}
                         </>
                       ) : (
                         <>
                           <Upload className="w-5 h-5" />
                           Post Testimony
                         </>
                       )}
                    </button>
                 </div>
               )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
