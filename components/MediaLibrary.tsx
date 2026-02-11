
import React, { useState, useRef, useEffect } from 'react';
import { Play, Clock, Heart, Share2, MoreVertical, PlayCircle, Headphones, Video, BookOpen, Search, Filter, X, Upload, Calendar, ChevronDown, Pause, Volume2, VolumeX, Maximize, FileVideo, Users, Quote } from 'lucide-react';

interface MediaItem {
  id: string;
  title: string;
  author: string;
  authorAvatar?: string;
  type: 'sermon' | 'worship' | 'podcast' | 'devotional' | 'testimony';
  duration: string;
  thumbnail: string;
  src?: string;
  views: string;
  date: string;
  timestamp: number;
  tags: string[];
  description: string;
}

const MEDIA_CATEGORIES = [
  { id: 'all', label: 'All Content', icon: Video },
  { id: 'testimony', label: 'Testimonies', icon: Users },
  { id: 'sermon', label: 'Sermons', icon: BookOpen },
  { id: 'worship', label: 'Worship', icon: Headphones },
  { id: 'podcast', label: 'Podcasts', icon: Filter },
];

const MOCK_MEDIA: MediaItem[] = [
  {
    id: 't1',
    title: "Love in God's Timing",
    author: "Rebecca & Thomas",
    authorAvatar: "https://images.unsplash.com/photo-1621621667797-2144d1887019?q=80&w=200&auto=format&fit=crop", 
    type: 'testimony',
    duration: "03:45",
    thumbnail: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop",
    src: "https://assets.mixkit.co/videos/preview/mixkit-couple-walking-in-a-field-of-wheat-4591-large.mp4",
    views: "12.4k",
    date: "Married 2 years",
    timestamp: Date.now(),
    tags: ["#Marriage", "#Faithfulness", "#Wait"],
    description: "We were both tired of the modern dating scene. Finding this community was a breath of fresh air. Knowing we shared the same boundaries from day one made everything easier. God's timing is truly perfect."
  },
  {
    id: 't2',
    title: "Respected & Cherished",
    author: "Emily & David",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    type: 'testimony',
    duration: "04:20",
    thumbnail: "https://images.unsplash.com/photo-1529634597503-139d372668e3?q=80&w=800&auto=format&fit=crop",
    src: "https://assets.mixkit.co/videos/preview/mixkit-couple-looking-at-the-sunset-4596-large.mp4",
    views: "8.9k",
    date: "Engaged",
    timestamp: Date.now() - 50000000,
    tags: ["#Purity", "#Respect", "#GodlyLove"],
    description: "I never thought I'd find someone who respected my choice to wait. This app didn't just find me a date; it found me my future husband. We are so grateful for a platform that honors Godly values."
  },
  {
    id: 't3',
    title: "Serious & Intentional",
    author: "Michael",
    authorAvatar: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=200&auto=format&fit=crop",
    type: 'testimony',
    duration: "02:15",
    thumbnail: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=800&auto=format&fit=crop",
    src: "https://assets.mixkit.co/videos/preview/mixkit-man-walking-in-the-snow-at-sunset-4164-large.mp4",
    views: "5.2k",
    date: "Member since 2023",
    timestamp: Date.now() - 200000000,
    tags: ["#Intentionality", "#Brotherhood", "#Waiting"],
    description: "The community here is different. It's respectful, serious, and intentional. Highly recommend for anyone serious about marriage and finding a partner who shares your walk with Christ."
  },
  {
    id: '1',
    title: "The Architecture of Peace",
    author: "Pastor Michael Todd",
    authorAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?fit=crop&w=150&h=150",
    type: 'sermon',
    duration: "45:20",
    thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop",
    src: "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4",
    views: "1.2k",
    date: "2 days ago",
    timestamp: Date.now() - 172800000,
    tags: ["#Peace", "#Structure"],
    description: "In this powerful sermon, Pastor Michael Todd explores how to build lasting peace in a chaotic world through the lens of scripture."
  },
  {
    id: '2',
    title: "Ocean of Grace (Live)",
    author: "Hillsong United",
    authorAvatar: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?fit=crop&w=150&h=150",
    type: 'worship',
    duration: "08:15",
    thumbnail: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=800&auto=format&fit=crop",
    src: "https://assets.mixkit.co/videos/preview/mixkit-sun-rays-in-a-forest-1180-large.mp4",
    views: "5.4k",
    date: "1 week ago",
    timestamp: Date.now() - 604800000,
    tags: ["#Worship", "#Grace"],
    description: "A live declaration of God's endless grace."
  }
];

const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const MediaLibrary: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(MOCK_MEDIA);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeMedia, setActiveMedia] = useState<MediaItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Player State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Filter and Sort Logic
  const filteredMedia = React.useMemo(() => {
    let items = mediaItems;
    if (activeCategory !== 'all') items = items.filter(m => m.type === activeCategory);
    if (searchQuery) {
      items = items.filter(m => 
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        m.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return [...items].sort((a, b) => sortOrder === 'newest' ? b.timestamp - a.timestamp : a.timestamp - b.timestamp);
  }, [mediaItems, activeCategory, searchQuery, sortOrder]);

  const relatedMedia = mediaItems
    .filter(m => m.id !== activeMedia?.id && (activeMedia ? m.type === activeMedia.type : true))
    .slice(0, 4);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(p);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = (parseFloat(e.target.value) / 100) * (videoRef.current?.duration || 0);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setProgress(parseFloat(e.target.value));
    }
  };

  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
    if (videoRef.current) videoRef.current.load();
  }, [activeMedia]);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 h-full relative" onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}>
      
      {isDragging && (
        <div className="absolute inset-0 z-50 bg-indigo-600/90 backdrop-blur-sm flex flex-col items-center justify-center text-white animate-in fade-in">
          <Upload className="w-16 h-16 animate-bounce mb-6" />
          <h2 className="text-3xl font-bold">Drop video to upload</h2>
        </div>
      )}

      {/* Featured Hero */}
      <div className="relative h-[450px] w-full bg-slate-900 group overflow-hidden">
         <img src="https://images.unsplash.com/photo-1519750292352-c9fc17322ed7?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-10000" alt="" />
         <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
         <div className="absolute bottom-0 left-0 p-12 w-full max-w-4xl">
           <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-6 inline-block shadow-xl">Editor's Pick</span>
           <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-[0.9] tracking-tighter">THE ARCHITECT<br/>OF PEACE</h1>
           <p className="text-slate-200 text-xl mb-10 max-w-2xl font-medium leading-relaxed">Explore how to build lasting internal and external peace in a chaotic world through scripture with Pastor Michael Todd.</p>
           <div className="flex flex-wrap gap-4">
             <button onClick={() => setActiveMedia(MOCK_MEDIA[3])} className="bg-white text-slate-900 px-10 py-4 rounded-full font-black text-sm flex items-center gap-3 hover:bg-indigo-50 transition-all shadow-2xl active:scale-95">
               <Play className="w-5 h-5 fill-slate-900" /> START WATCHING
             </button>
             <button className="bg-white/10 backdrop-blur-md text-white px-10 py-4 rounded-full font-black text-sm hover:bg-white/20 transition-all border border-white/20">LATER</button>
           </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto p-8 space-y-12 pb-32">
        {/* Controls */}
        <div className="flex flex-col xl:flex-row gap-6 justify-between items-center sticky top-0 bg-slate-50/95 backdrop-blur-sm z-20 py-6 border-b border-slate-200">
          <div className="flex gap-3 overflow-x-auto w-full xl:w-auto hide-scrollbar">
             {MEDIA_CATEGORIES.map(cat => (
               <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all whitespace-nowrap shadow-sm ${activeCategory === cat.id ? 'bg-slate-900 text-white shadow-xl' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-100'}`}>
                 <cat.icon className="w-4 h-4" /> {cat.label}
               </button>
             ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
            <div className="relative flex-1 sm:w-80">
               <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
               <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search sermons, testimonies..." className="w-full pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm" />
            </div>
            <button onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center gap-3 px-8 py-3.5 bg-indigo-600 text-white rounded-full text-sm font-black hover:bg-indigo-700 shadow-xl transition-all active:scale-95"><Upload className="w-5 h-5" /> UPLOAD</button>
            <input type="file" ref={fileInputRef} className="hidden" accept="video/*" />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredMedia.map(item => (
            <div key={item.id} className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col h-full animate-in fade-in slide-in-from-bottom-4" onClick={() => setActiveMedia(item)}>
              <div className="aspect-video relative overflow-hidden bg-slate-200">
                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                   <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-50 group-hover:scale-100 border border-white/30">
                      <Play className="w-6 h-6 fill-white text-white" />
                   </div>
                </div>
                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-black px-2 py-1 rounded tracking-widest">{item.duration}</div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${item.type === 'worship' ? 'bg-purple-100 text-purple-700' : item.type === 'testimony' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>
                    {item.type}
                  </span>
                  <button className="text-slate-300 hover:text-slate-600 transition-colors"><MoreVertical className="w-5 h-5" /></button>
                </div>
                
                {item.type === 'testimony' ? (
                   <div className="flex flex-col h-full">
                      <div className="flex items-center gap-4 mb-4">
                         <img src={item.authorAvatar} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-xl" alt="" />
                         <div>
                            <p className="text-sm font-black text-slate-900 leading-none mb-1">{item.author}</p>
                            <p className="text-xs font-bold text-slate-400">{item.date}</p>
                         </div>
                      </div>
                      <div className="relative bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50 italic mb-4 flex-1">
                        <Quote className="w-6 h-6 text-indigo-100 absolute -top-2 -left-2 fill-indigo-50" />
                        <p className="text-sm text-slate-600 font-medium leading-relaxed line-clamp-4 pl-2">"{item.description}"</p>
                      </div>
                   </div>
                ) : (
                  <>
                    <h3 className="font-black text-slate-900 text-lg leading-tight mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">{item.title}</h3>
                    <div className="flex items-center gap-3 mb-4">
                       <img src={item.authorAvatar || `https://ui-avatars.com/api/?name=${item.author}&background=random`} className="w-8 h-8 rounded-full border border-slate-100" alt="" />
                       <p className="text-sm font-bold text-slate-500">{item.author}</p>
                    </div>
                  </>
                )}
                
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                   <span className="flex items-center gap-2 text-xs font-black text-slate-400"><PlayCircle className="w-4 h-4" /> {item.views}</span>
                   <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">{item.type === 'testimony' ? 'Story' : item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Player Modal - REFINED DARK NAVY UI */}
      {activeMedia && (
        <div className="fixed inset-0 bg-slate-950/98 z-50 flex items-center justify-center animate-in fade-in duration-300 backdrop-blur-sm">
           <div className="w-full h-full md:h-[90vh] md:w-[95vw] max-w-[1600px] bg-slate-900 md:rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col md:flex-row">
              
              {/* Main Player Area */}
              <div className="flex-1 bg-black relative flex flex-col justify-center group overflow-hidden">
                 <button onClick={() => setActiveMedia(null)} className="absolute top-6 left-6 z-20 bg-white/10 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/20 transition-all border border-white/10 md:hidden"><X className="w-6 h-6" /></button>
                 <video ref={videoRef} src={activeMedia.src} className="w-full h-full object-contain" onTimeUpdate={handleTimeUpdate} poster={activeMedia.thumbnail} playsInline autoPlay />
                 
                 {/* Controls Overlay */}
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-8">
                    <div className="mb-6 relative group/seek">
                       <input type="range" min="0" max="100" value={progress} onChange={handleSeek} className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white group-hover/seek:h-2 transition-all" />
                    </div>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-8 text-white">
                          <button onClick={togglePlay} className="hover:scale-110 transition-transform">{isPlaying ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current" />}</button>
                          <div className="flex items-center gap-4">
                             <button onClick={() => videoRef.current && (videoRef.current.muted = !isMuted, setIsMuted(!isMuted))} className="text-white hover:text-blue-400 transition-colors">{isMuted ? <VolumeX className="w-7 h-7" /> : <Volume2 className="w-7 h-7" />}</button>
                             <span className="text-sm font-black tracking-widest text-white/80">{formatTime(videoRef.current?.currentTime || 0)} <span className="text-white/30">/</span> {formatTime(videoRef.current?.duration || 0)}</span>
                          </div>
                       </div>
                       <button onClick={() => videoRef.current?.requestFullscreen()} className="text-white hover:text-blue-400 transition-all"><Maximize className="w-7 h-7" /></button>
                    </div>
                 </div>
              </div>

              {/* Sidebar - Dark Navy (#0f172a / slate-950) */}
              <div className="w-full md:w-[400px] lg:w-[450px] bg-[#0f172a] border-l border-slate-800 flex flex-col h-full">
                 <div className="hidden md:flex justify-end p-6">
                    <button onClick={() => setActiveMedia(null)} className="p-3 text-slate-500 hover:text-white rounded-full hover:bg-slate-800 transition-all border border-transparent hover:border-slate-700">
                       <X className="w-6 h-6" />
                    </button>
                 </div>
                 <div className="flex-1 overflow-y-auto px-8 pb-12 space-y-10 custom-scrollbar">
                    <div className="space-y-6">
                       <div className="space-y-4">
                          <span className="bg-blue-500/10 text-blue-400 text-[10px] font-black tracking-[0.2em] px-3 py-1 rounded-full border border-blue-500/20 uppercase">{activeMedia.type}</span>
                          <h2 className="text-3xl font-black text-white leading-[1.1] tracking-tighter">{activeMedia.title}</h2>
                       </div>
                       <div className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-2xl border border-slate-800/50">
                          <img src={activeMedia.authorAvatar || `https://ui-avatars.com/api/?name=${activeMedia.author}&background=random`} className="w-12 h-12 rounded-full border-2 border-slate-700" alt="" />
                          <div>
                             <p className="text-sm font-black text-white leading-none mb-1">{activeMedia.author}</p>
                             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{activeMedia.date}</p>
                          </div>
                       </div>
                       <div className="flex gap-4">
                           <button className="flex-1 bg-white text-slate-950 py-4 rounded-2xl font-black text-sm hover:bg-slate-100 flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl"><Heart className="w-5 h-5" /> SAVE</button>
                           <button className="flex-1 bg-slate-800 text-white py-4 rounded-2xl font-black text-sm hover:bg-slate-700 flex items-center justify-center gap-3 transition-all active:scale-95 border border-slate-700"><Share2 className="w-5 h-5" /> SHARE</button>
                       </div>
                       <div className="space-y-3">
                          <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Description</h3>
                          <p className="text-slate-400 text-base leading-relaxed font-medium">{activeMedia.description}</p>
                       </div>
                    </div>
                    <div className="space-y-6">
                       <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] flex items-center gap-3">RECOMMENDED <div className="h-px flex-1 bg-slate-800/50"></div></h3>
                       <div className="space-y-4">
                          {relatedMedia.map(item => (
                             <div key={item.id} className="flex gap-4 p-3 rounded-2xl hover:bg-slate-900 cursor-pointer transition-all group border border-transparent hover:border-slate-800" onClick={() => setActiveMedia(item)}>
                                <div className="w-28 aspect-video bg-slate-800 rounded-xl overflow-hidden relative flex-shrink-0 shadow-lg">
                                   <img src={item.thumbnail} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="" />
                                   <div className="absolute bottom-1 right-1 bg-black/80 text-[8px] font-black text-white px-1.5 py-0.5 rounded tracking-widest">{item.duration}</div>
                                </div>
                                <div className="flex flex-col justify-center">
                                   <h4 className="text-sm font-black text-slate-300 line-clamp-2 group-hover:text-white mb-1 transition-colors leading-tight">{item.title}</h4>
                                   <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{item.author}</p>
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
