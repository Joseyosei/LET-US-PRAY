
import React, { useState } from 'react';
import { Play, Clock, Heart, Share2, MoreVertical, PlayCircle, Headphones, Video, BookOpen, Search, Filter, X } from 'lucide-react';

interface MediaItem {
  id: string;
  title: string;
  author: string;
  type: 'sermon' | 'worship' | 'podcast' | 'devotional';
  duration: string;
  thumbnail: string;
  views: string;
  date: string;
  tags: string[];
}

const MEDIA_CATEGORIES = [
  { id: 'all', label: 'All', icon: Video },
  { id: 'sermon', label: 'Sermons', icon: BookOpen },
  { id: 'worship', label: 'Worship', icon: Headphones },
  { id: 'podcast', label: 'Podcasts', icon: Filter }, // using Filter as icon placeholder
];

const MOCK_MEDIA: MediaItem[] = [
  {
    id: '1',
    title: "Walking in Faith",
    author: "Pastor Michael Todd",
    type: 'sermon',
    duration: "45:20",
    thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop",
    views: "1.2k",
    date: "2 days ago",
    tags: ["#Faith", "#Purpose"]
  },
  {
    id: '2',
    title: "Ocean of Grace (Live)",
    author: "Hillsong United",
    type: 'worship',
    duration: "08:15",
    thumbnail: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=800&auto=format&fit=crop",
    views: "5.4k",
    date: "1 week ago",
    tags: ["#Worship", "#Live"]
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
    tags: ["#Prayer", "#Morning"]
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
    tags: ["#MentalHealth", "#Peace"]
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
    tags: ["#Worship", "#HolySpirit"]
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
    tags: ["#Silence", "#GodsVoice"]
  }
];

export const MediaLibrary: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeMedia, setActiveMedia] = useState<MediaItem | null>(null);

  const filteredMedia = activeCategory === 'all' 
    ? MOCK_MEDIA 
    : MOCK_MEDIA.filter(m => m.type === activeCategory);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 h-full">
      
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
             <button className="bg-white text-slate-900 px-8 py-3.5 rounded-full font-bold text-sm flex items-center gap-3 hover:bg-slate-100 transition-colors shadow-xl active:scale-95 duration-200">
               <Play className="w-5 h-5 fill-slate-900" /> Watch Sermon
             </button>
             <button className="bg-white/10 backdrop-blur-md text-white px-8 py-3.5 rounded-full font-bold text-sm hover:bg-white/20 transition-colors border border-white/20">
               + Add to List
             </button>
           </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center sticky top-0 bg-slate-50/95 backdrop-blur-sm z-20 py-4 border-b border-slate-200">
          <div className="flex gap-2 overflow-x-auto w-full sm:w-auto hide-scrollbar pb-2 sm:pb-0">
             {MEDIA_CATEGORIES.map(cat => (
               <button
                 key={cat.id}
                 onClick={() => setActiveCategory(cat.id)}
                 className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
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

          <div className="relative w-full sm:w-64">
             <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
             <input 
               type="text" 
               placeholder="Search library..." 
               className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
             />
          </div>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMedia.map(item => (
            <div 
              key={item.id} 
              className="group bg-white rounded-xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full"
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

      {/* Video Player Modal */}
      {activeMedia && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-in fade-in">
           <div className="w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
              
              {/* Toolbar */}
              <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
                 <h2 className="text-white font-medium truncate pr-8">{activeMedia.title}</h2>
                 <button 
                   onClick={(e) => { e.stopPropagation(); setActiveMedia(null); }}
                   className="bg-white/10 hover:bg-white/20 p-2 rounded-full text-white backdrop-blur-sm transition-colors"
                 >
                    <X className="w-6 h-6" />
                 </button>
              </div>

              {/* Player Container */}
              <div className="aspect-video bg-black relative flex items-center justify-center">
                 {/* Simulated Video */}
                 <img src={activeMedia.thumbnail} className="w-full h-full object-cover opacity-50" alt="" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-110 transition-transform">
                       <Play className="w-8 h-8 fill-black text-black ml-1" />
                    </button>
                 </div>
              </div>

              {/* Info Panel */}
              <div className="p-6 bg-slate-900 text-white">
                 <div className="flex justify-between items-start">
                    <div>
                       <h1 className="text-2xl font-bold mb-1">{activeMedia.title}</h1>
                       <p className="text-slate-400 text-lg">{activeMedia.author}</p>
                    </div>
                    <div className="flex gap-3">
                       <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors">
                          <Heart className="w-6 h-6" />
                          <span className="text-[10px]">Save</span>
                       </button>
                       <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors">
                          <Share2 className="w-6 h-6" />
                          <span className="text-[10px]">Share</span>
                       </button>
                    </div>
                 </div>
                 <div className="mt-4 flex gap-2">
                    {activeMedia.tags.map(tag => (
                       <span key={tag} className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-300 border border-slate-700">
                         {tag}
                       </span>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};
