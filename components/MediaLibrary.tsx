
import React, { useState, useRef, useEffect } from 'react';
import { Play, Clock, Heart, Share2, MoreVertical, PlayCircle, Headphones, Video, BookOpen, Search, Filter, X, Upload, Calendar, ChevronDown, Pause, Volume2, VolumeX, Maximize, FileVideo } from 'lucide-react';

interface MediaItem {
  id: string;
  title: string;
  author: string;
  type: 'sermon' | 'worship' | 'podcast' | 'devotional';
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
  { id: 'all', label: 'All', icon: Video },
  { id: 'sermon', label: 'Sermons', icon: BookOpen },
  { id: 'worship', label: 'Worship', icon: Headphones },
  { id: 'podcast', label: 'Podcasts', icon: Filter },
];

const MOCK_MEDIA: MediaItem[] = [
  {
    id: '1',
    title: "Walking in Faith",
    author: "Pastor Michael Todd",
    type: 'sermon',
    duration: "45:20",
    thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop",
    src: "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4",
    views: "1.2k",
    date: "2 days ago",
    timestamp: Date.now() - 172800000,
    tags: ["#Faith", "#Purpose"],
    description: "In this powerful sermon, Pastor Michael Todd explores what it truly means to walk by faith and not by sight. Learn practical steps to trust God in uncertainty."
  },
  {
    id: '2',
    title: "Ocean of Grace (Live)",
    author: "Hillsong United",
    type: 'worship',
    duration: "08:15",
    thumbnail: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=800&auto=format&fit=crop",
    src: "https://assets.mixkit.co/videos/preview/mixkit-sun-rays-in-a-forest-1180-large.mp4",
    views: "5.4k",
    date: "1 week ago",
    timestamp: Date.now() - 604800000,
    tags: ["#Worship", "#Live"],
    description: "A spontaneous moment of worship captured live. Let the lyrics wash over you as we declare the endless grace of our Savior."
  },
  {
    id: '3',
    title: "Morning Prayer Guide",
    author: "LUP Originals",
    type: 'devotional',
    duration: "10:00",
    thumbnail: "https://images.unsplash.com/photo-1445445290350-16a63c6c0b92?q=80&w=800&auto=format&fit=crop",
    views: "890",
    date: "Yesterday",
    timestamp: Date.now() - 86400000,
    tags: ["#Prayer", "#Morning"],
    description: "Start your day right with this guided prayer session focused on gratitude and surrender."
  },
  {
    id: '4',
    title: "Overcoming Anxiety",
    author: "Joyce Meyer",
    type: 'sermon',
    duration: "28:45",
    thumbnail: "https://images.unsplash.com/photo-1629215037466-4c9c864b971c?q=80&w=800&auto=format&fit=crop",
    views: "2.1k",
    date: "3 days ago",
    timestamp: Date.now() - 259200000,
    tags: ["#MentalHealth", "#Peace"],
    description: "Anxiety doesn't have to rule your life. Discover biblical tools to find peace that surpasses all understanding."
  },
  {
    id: '5',
    title: "Spirit Break Out",
    author: "Elevation Worship",
    type: 'worship',
    duration: "12:30",
    thumbnail: "https://images.unsplash.com/photo-1514525253440-b393452e8d03?q=80&w=800&auto=format&fit=crop",
    views: "10k",
    date: "1 month ago",
    timestamp: Date.now() - 2592000000,
    tags: ["#Worship", "#HolySpirit"],
    description: "We invite the Holy Spirit to break out in our lives, our cities, and our nations."
  },
  {
    id: '6',
    title: "The Power of Silence",
    author: "Fr. Mike Schmitz",
    type: 'podcast',
    duration: "18:20",
    thumbnail: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop",
    views: "3.2k",
    date: "5 days ago",
    timestamp: Date.now() - 432000000,
    tags: ["#Silence", "#GodsVoice"],
    description: "In a noisy world, God often speaks in a whisper. Learn how to cultivate silence to hear His voice."
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
    
    // Filter by Category
    if (activeCategory !== 'all') {
      items = items.filter(m => m.type === activeCategory);
    }
    
    // Filter by Search
    if (searchQuery) {
      items = items.filter(m => 
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        m.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    return [...items].sort((a, b) => {
      if (sortOrder === 'newest') return b.timestamp - a.timestamp;
      return a.timestamp - b.timestamp;
    });
  }, [mediaItems, activeCategory, searchQuery, sortOrder]);

  const relatedMedia = mediaItems
    .filter(m => m.id !== activeMedia?.id && (activeMedia ? m.type === activeMedia.type : true))
    .slice(0, 3);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const videoUrl = URL.createObjectURL(file);
      
      const newItem: MediaItem = {
        id: Date.now().toString(),
        title: file.name.replace(/\.[^/.]+$/, ""),
        author: "Me",
        type: 'sermon', // Default category
        duration: "00:00", // Would need real metadata parsing
        thumbnail: "https://images.unsplash.com/photo-1610484826967-09c5720778c7?q=80&w=800&auto=format&fit=crop",
        src: videoUrl,
        views: "0",
        date: "Just now",
        timestamp: Date.now(),
        tags: ["#Upload"],
        description: "Uploaded content from local device."
      };
      
      setMediaItems([newItem, ...mediaItems]);
      setActiveMedia(newItem);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
       const file = e.dataTransfer.files[0];
       if (file.type.startsWith('video/')) {
           const videoUrl = URL.createObjectURL(file);
           const newItem: MediaItem = {
            id: Date.now().toString(),
            title: file.name.replace(/\.[^/.]+$/, ""),
            author: "Me",
            type: 'sermon',
            duration: "00:00",
            thumbnail: "https://images.unsplash.com/photo-1610484826967-09c5720778c7?q=80&w=800&auto=format&fit=crop",
            src: videoUrl,
            views: "0",
            date: "Just now",
            timestamp: Date.now(),
            tags: ["#Upload"],
            description: "Uploaded content from drag and drop."
          };
          setMediaItems([newItem, ...mediaItems]);
          setActiveMedia(newItem);
       }
    }
  };

  // Video Player Logic
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = (parseFloat(e.target.value) / 100) * (videoRef.current?.duration || 0);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setProgress(parseFloat(e.target.value));
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
      // If unmuting and volume is 0, set to 0.5
      if (!newMuted && volume === 0) {
        setVolume(0.5);
        videoRef.current.volume = 0.5;
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  // Reset player when media changes
  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [activeMedia]);

  return (
    <div 
      className="flex-1 overflow-y-auto bg-slate-50 h-full relative" 
      onDragOver={handleDragOver} 
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      
      {/* Drag & Drop Overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-50 bg-indigo-600/90 backdrop-blur-sm flex flex-col items-center justify-center text-white animate-in fade-in duration-200">
          <div className="bg-white/20 p-8 rounded-full mb-6 animate-bounce">
            <Upload className="w-16 h-16" />
          </div>
          <h2 className="text-3xl font-bold">Drop video to upload</h2>
        </div>
      )}

      {/* Featured Hero Section */}
      <div className="relative h-[400px] w-full bg-slate-900 group">
         <img 
           src="https://images.unsplash.com/photo-1519750292352-c9fc17322ed7?q=80&w=2000&auto=format&fit=crop" 
           className="w-full h-full object-cover opacity-60" 
           alt="Featured" 
         />
         <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
         
         <div className="absolute bottom-0 left-0 p-8 w-full max-w-4xl">
           <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block shadow-lg">
             Featured Series
           </span>
           <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
             The Architect of Peace
           </h1>
           <p className="text-slate-200 text-lg mb-8 max-w-2xl line-clamp-2">
             Join us for a transformational journey exploring how to build lasting peace in a chaotic world through the lens of scripture.
           </p>
           
           <div className="flex flex-wrap gap-4">
             <button onClick={() => setActiveMedia(MOCK_MEDIA[0])} className="bg-white text-slate-900 px-8 py-3.5 rounded-full font-bold text-sm flex items-center gap-3 hover:bg-slate-100 transition-colors shadow-xl active:scale-95 duration-200">
               <Play className="w-5 h-5 fill-slate-900" /> Watch Sermon
             </button>
             <button className="bg-white/10 backdrop-blur-md text-white px-8 py-3.5 rounded-full font-bold text-sm hover:bg-white/20 transition-colors border border-white/20">
               + Add to List
             </button>
           </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Controls Bar */}
        <div className="flex flex-col xl:flex-row gap-4 justify-between items-center sticky top-0 bg-slate-50/95 backdrop-blur-sm z-20 py-4 border-b border-slate-200">
          
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto w-full xl:w-auto hide-scrollbar pb-2 xl:pb-0">
             {MEDIA_CATEGORIES.map(cat => (
               <button
                 key={cat.id}
                 onClick={() => setActiveCategory(cat.id)}
                 className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                   activeCategory === cat.id 
                     ? 'bg-slate-900 text-white shadow-md' 
                     : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                 }`}
               >
                 <cat.icon className="w-4 h-4" />
                 {cat.label}
               </button>
             ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
               <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
               <input 
                 type="text" 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="Search library..." 
                 className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
               />
            </div>
            
            {/* Sort & Upload */}
            <div className="flex gap-2">
               <div className="relative group">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-sm text-slate-600 hover:bg-slate-50 font-medium">
                    <Calendar className="w-4 h-4" />
                    {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-100 rounded-xl shadow-xl hidden group-hover:block z-30 p-1">
                     <button onClick={() => setSortOrder('newest')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">Newest First</button>
                     <button onClick={() => setSortOrder('oldest')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">Oldest First</button>
                  </div>
               </div>

               <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-bold hover:bg-indigo-700 shadow-sm transition-colors whitespace-nowrap"
               >
                  <Upload className="w-4 h-4" /> Upload
               </button>
               <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept="video/*" 
               />
            </div>
          </div>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMedia.map(item => (
            <div 
              key={item.id} 
              className="group bg-white rounded-xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full animate-in fade-in zoom-in-95 duration-300"
              onClick={() => setActiveMedia(item)}
            >
              {/* Thumbnail */}
              <div className="aspect-video relative overflow-hidden bg-slate-200">
                <img 
                  src={item.thumbnail} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                   <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100">
                      <Play className="w-5 h-5 fill-white text-white" />
                   </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  {item.duration}
                </div>
                {item.date === "Just now" && (
                    <div className="absolute top-2 left-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      NEW
                    </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    item.type === 'worship' ? 'bg-purple-100 text-purple-700' : 
                    item.type === 'sermon' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.type}
                  </span>
                  <button className="text-slate-400 hover:text-slate-700">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                
                <h3 className="font-bold text-slate-900 leading-tight mb-1 group-hover:text-indigo-600 transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500 mb-3">{item.author}</p>
                
                <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-50 text-xs text-slate-400">
                   <span className="flex items-center gap-1"><PlayCircle className="w-3 h-3" /> {item.views}</span>
                   <span>{item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Player Modal (Detailed View) */}
      {activeMedia && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="w-full max-w-6xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row h-[90vh] md:h-[80vh]">
              
              {/* Left Side: Player */}
              <div className="flex-1 bg-black relative flex flex-col justify-center group">
                 <button 
                   onClick={() => setActiveMedia(null)}
                   className="absolute top-4 right-4 z-20 bg-black/50 p-2 rounded-full text-white hover:bg-black/80 md:hidden"
                 >
                    <X className="w-5 h-5" />
                 </button>

                 <div className="relative w-full aspect-video bg-black">
                     <video
                        ref={videoRef}
                        src={activeMedia.src}
                        className="w-full h-full object-contain"
                        onTimeUpdate={handleTimeUpdate}
                        onEnded={() => setIsPlaying(false)}
                        onClick={togglePlay}
                        poster={activeMedia.thumbnail}
                        playsInline
                     />
                     
                     {/* Custom Controls Overlay */}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                        <div className="mb-4">
                           <input 
                              type="range" 
                              min="0" 
                              max="100" 
                              value={progress} 
                              onChange={handleSeek}
                              className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-indigo-500 [&::-webkit-slider-thumb]:rounded-full hover:bg-white/40 transition-colors"
                           />
                        </div>
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-4 text-white">
                              <button onClick={togglePlay} className="hover:text-indigo-400 transition-colors">
                                 {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current" />}
                              </button>
                              
                              <div className="flex items-center gap-2 group/volume">
                                <button onClick={toggleMute} className="hover:text-indigo-400 transition-colors">
                                    {isMuted || volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                                </button>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="1" 
                                    step="0.05" 
                                    value={isMuted ? 0 : volume} 
                                    onChange={handleVolumeChange}
                                    className="w-0 overflow-hidden group-hover/volume:w-20 transition-all duration-300 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-indigo-500 [&::-webkit-slider-thumb]:rounded-full"
                                />
                              </div>

                              <span className="text-xs font-mono text-white/80 ml-2">
                                {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(videoRef.current?.duration || 0)}
                              </span>
                           </div>
                           <button onClick={toggleFullscreen} className="text-white hover:text-indigo-400 transition-colors">
                              <Maximize className="w-6 h-6" />
                           </button>
                        </div>
                     </div>

                     {!isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                           <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 shadow-lg">
                              <Play className="w-10 h-10 fill-white text-white ml-1.5" />
                           </div>
                        </div>
                     )}
                 </div>
              </div>

              {/* Right Side: Details & Related */}
              <div className="w-full md:w-[350px] lg:w-[400px] bg-slate-900 border-l border-slate-800 flex flex-col h-full overflow-hidden">
                 {/* Close Button Desktop */}
                 <div className="hidden md:flex justify-end p-2">
                    <button onClick={() => setActiveMedia(null)} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors">
                       <X className="w-5 h-5" />
                    </button>
                 </div>

                 <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div>
                       <h2 className="text-xl font-bold text-white mb-2 leading-snug">{activeMedia.title}</h2>
                       <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                          <span className="font-medium text-indigo-400">{activeMedia.author}</span>
                          <span>{activeMedia.date}</span>
                       </div>
                       
                       <div className="flex gap-4 mb-6 border-b border-slate-800 pb-6">
                           <button className="flex-1 bg-white text-slate-900 py-2.5 rounded-lg font-bold text-sm hover:bg-slate-100 flex items-center justify-center gap-2 transition-colors">
                              <Heart className="w-4 h-4" /> Save
                           </button>
                           <button className="flex-1 bg-slate-800 text-white py-2.5 rounded-lg font-bold text-sm hover:bg-slate-700 flex items-center justify-center gap-2 transition-colors">
                              <Share2 className="w-4 h-4" /> Share
                           </button>
                       </div>

                       <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</h3>
                       <p className="text-slate-300 text-sm leading-relaxed mb-4">
                          {activeMedia.description}
                       </p>
                       <div className="flex flex-wrap gap-2">
                          {activeMedia.tags.map(tag => (
                             <span key={tag} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400 border border-slate-700">
                                {tag}
                             </span>
                          ))}
                       </div>
                    </div>

                    <div>
                       <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                          <PlayCircle className="w-4 h-4 text-indigo-500" /> Up Next
                       </h3>
                       <div className="space-y-3">
                          {relatedMedia.length > 0 ? relatedMedia.map(item => (
                             <div 
                                key={item.id} 
                                className="flex gap-3 p-2 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors group"
                                onClick={() => setActiveMedia(item)}
                             >
                                <div className="w-24 aspect-video bg-slate-800 rounded-md overflow-hidden relative flex-shrink-0">
                                   <img src={item.thumbnail} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" alt="" />
                                   <div className="absolute bottom-1 right-1 bg-black/80 text-[8px] text-white px-1 rounded">
                                      {item.duration}
                                   </div>
                                </div>
                                <div>
                                   <h4 className="text-sm font-medium text-slate-200 line-clamp-2 group-hover:text-white mb-1 transition-colors">{item.title}</h4>
                                   <p className="text-xs text-slate-500">{item.author}</p>
                                </div>
                             </div>
                          )) : (
                             <p className="text-sm text-slate-600 italic">No related media found.</p>
                          )}
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
