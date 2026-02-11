
import React, { useState } from 'react';
import { Video, Wand2, Loader2, PlayCircle, Share2, AlertCircle, Film, Sparkles, Download } from 'lucide-react';
import { generateVeoVideo } from '../services/geminiService';

export const TestimonyStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    setVideoUrl(null);

    try {
      const url = await generateVeoVideo(prompt);
      setVideoUrl(url);
    } catch (err: any) {
      setError(err.message || "Failed to generate video. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-900 p-6 h-full">
      <div className="max-w-4xl mx-auto h-full flex flex-col md:flex-row gap-8">
        
        {/* Left: Controls */}
        <div className="flex-1 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/50">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Testimony Studio</h2>
                <p className="text-slate-400 text-sm">Create visual stories powered by Veo.</p>
              </div>
            </div>
            
            <p className="text-slate-300 mb-6 leading-relaxed">
              Share your testimony or a prayer request. Our AI will generate a beautiful, 
              cinematic background video to match your words. 
              <span className="block mt-2 text-xs text-slate-500 uppercase tracking-wider font-bold">
                <ShieldCheckIcon className="w-3 h-3 inline mr-1" /> Strict Moderation Active
              </span>
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 backdrop-blur-sm">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Your Testimony
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., After months of searching, I finally found a job. God is good! #Blessing"
              className="w-full h-32 bg-slate-900 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none mb-4 transition-all"
            />
            
            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-800/50 rounded-lg flex items-center gap-2 text-red-200 text-sm animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] flex items-center justify-center gap-2 group relative overflow-hidden"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="animate-pulse">Creating Masterpiece...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Generate Video
                </>
              )}
              {/* Shine effect */}
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
            </button>
            
            <p className="text-center text-xs text-slate-500 mt-4">
              Powered by Google Veo 3.1 • 720p HD Generation
            </p>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="flex-1 flex items-center justify-center">
           <div className="relative w-[320px] aspect-[9/16] bg-black rounded-3xl border-8 border-slate-800 overflow-hidden shadow-2xl shadow-black">
              {videoUrl ? (
                <div className="relative w-full h-full group">
                  <video 
                    src={videoUrl} 
                    className="w-full h-full object-cover" 
                    controls 
                    autoPlay 
                    loop 
                    playsInline
                  />
                  {/* Text Overlay Simulation */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
                     <p className="text-white font-medium text-shadow-sm line-clamp-4 leading-relaxed">
                       {prompt}
                     </p>
                     <div className="flex items-center gap-2 mt-3">
                        <div className="w-6 h-6 rounded-full bg-white/20" />
                        <span className="text-xs text-white/80">@User</span>
                     </div>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 p-8 text-center bg-slate-900/50">
                  {isGenerating ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin mx-auto" />
                      <p className="text-sm text-indigo-400 font-medium">Rendering pixels...</p>
                      <p className="text-xs text-slate-500">This may take 1-2 minutes</p>
                    </div>
                  ) : (
                    <>
                       <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                         <Film className="w-8 h-8 opacity-50" />
                       </div>
                       <p className="font-medium text-slate-500">Video Preview</p>
                       <p className="text-xs text-slate-600 mt-2">Your AI-generated testimony will appear here.</p>
                    </>
                  )}
                </div>
              )}
           </div>
           
           {videoUrl && (
             <div className="absolute bottom-8 right-8 flex flex-col gap-2">
                <button className="p-3 bg-white text-indigo-900 rounded-full shadow-lg hover:bg-slate-200 transition-colors" title="Download">
                  <Download className="w-5 h-5" />
                </button>
                <button className="p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors" title="Share to Feed">
                  <Share2 className="w-5 h-5" />
                </button>
             </div>
           )}
        </div>

      </div>
    </div>
  );
};

// Simple icon component helper
const ShieldCheckIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
