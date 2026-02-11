
import React, { useState, useRef } from 'react';
import { Video, Upload, X, Play, Pause, Sparkles, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { optimizeTestimony } from '../services/geminiService';

export const TestimonyStudio: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      setUploadSuccess(false);
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
      }
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

  const handleUpload = () => {
    if (!videoFile || !title || !description) return;
    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      // Reset form partially after success if needed
    }, 2000);
  };

  const clearVideo = () => {
    setVideoFile(null);
    setVideoPreview(null);
    setUploadSuccess(false);
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
          
          {/* Left Column: Video Uploader */}
          <div className="flex-1">
            <div 
              className={`bg-white rounded-2xl border-2 border-dashed transition-all relative overflow-hidden aspect-[9/16] max-h-[600px] flex flex-col items-center justify-center ${
                videoPreview ? 'border-transparent shadow-2xl' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {videoPreview ? (
                <div className="relative w-full h-full bg-black group">
                  <video 
                    src={videoPreview} 
                    className="w-full h-full object-cover" 
                    controls 
                    playsInline
                  />
                  <button 
                    onClick={clearVideo}
                    className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  {/* Overlay simulating how it looks in feed */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
                     <p className="text-white font-bold text-lg mb-1">{title || "Your Title Here"}</p>
                     <p className="text-white/80 text-sm line-clamp-2">{description || "Your description..."}</p>
                  </div>
                </div>
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
                           Uploading...
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
