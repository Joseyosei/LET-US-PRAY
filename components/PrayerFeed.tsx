
import React, { useState, useEffect } from 'react';
import { Prayer, UserRole } from '../types';
import { Heart, MessageCircle, MapPin, Loader2, ThumbsUp, Hand, MoreHorizontal, Flag, ShieldAlert, EyeOff, Trash2, BadgeCheck, Shield, Share2, User, Play, Headphones, Moon, Sun, BookOpen } from 'lucide-react';

interface PrayerFeedProps {
  prayers: Prayer[];
  currentUserRole: UserRole;
  onInteract: (id: string, type: 'like' | 'pray' | 'request_prayer') => void;
  isLoading?: boolean;
}

// Custom styles for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes pop {
    0% { transform: scale(1); }
    50% { transform: scale(1.3); }
    100% { transform: scale(1); }
  }
  @keyframes joyfulHop {
    0%, 100% { transform: translateY(0) scale(1); }
    40% { transform: translateY(-6px) scale(1.1); color: #4f46e5; }
    70% { transform: translateY(0) scale(1.1); }
    85% { transform: translateY(-2px) scale(1.05); }
  }
  .pop-anim {
    animation: pop 0.3s ease-out forwards;
  }
  .joyful-hop-anim {
    animation: joyfulHop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;
document.head.appendChild(style);

const CATEGORIES = [
  { id: 'all', label: 'For You', icon: SparklesIcon },
  { id: 'sleep', label: 'Sleep', icon: Moon },
  { id: 'anxiety', label: 'Anxiety', icon: Heart },
  { id: 'bible', label: 'Bible', icon: BookOpen },
  { id: 'meditate', label: 'Meditate', icon: Headphones },
];

const CONTENT_CARDS = [
  { id: 1, title: "Bedtime Psalms", author: "Pastor Rick", duration: "15 min", image: "https://images.unsplash.com/photo-1519681393798-3828fb4090bb?q=80&w=600&auto=format&fit=crop", type: "Sleep" },
  { id: 2, title: "Morning Gratitude", author: "Sarah Jakes", duration: "5 min", image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=600&auto=format&fit=crop", type: "Prayer" },
  { id: 3, title: "Overcoming Fear", author: "Dr. Tony Evans", duration: "22 min", image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=600&auto=format&fit=crop", type: "Sermon" },
];

function SparklesIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  )
}

const PrayerCard: React.FC<{ prayer: Prayer; currentUserRole: UserRole; onInteract: (id: string, type: 'like' | 'pray' | 'request_prayer') => void }> = ({ prayer, currentUserRole, onInteract }) => {
  const [likeAnim, setLikeAnim] = useState(false);
  const [prayAnim, setPrayAnim] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [isContentRevealed, setIsContentRevealed] = useState(false);

  const handleLike = () => {
    setLikeAnim(true);
    onInteract(prayer.id, 'like');
  };

  const handlePray = () => {
    setPrayAnim(true);
    onInteract(prayer.id, 'pray');
  };

  useEffect(() => {
    if (likeAnim) { const timer = setTimeout(() => setLikeAnim(false), 300); return () => clearTimeout(timer); }
  }, [likeAnim]);

  useEffect(() => {
    if (prayAnim) { const timer = setTimeout(() => setPrayAnim(false), 500); return () => clearTimeout(timer); }
  }, [prayAnim]);

  const getRoleBadge = (role?: UserRole) => {
    if (prayer.isAnonymous) return null;
    switch (role) {
      case 'church': return <BadgeCheck className="w-4 h-4 text-purple-600 ml-1" />;
      case 'prayer_leader': return <BadgeCheck className="w-4 h-4 text-indigo-600 ml-1" />;
      default: return prayer.authorVerified ? <BadgeCheck className="w-4 h-4 text-blue-500 ml-1" /> : null;
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 mb-4 transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
            {prayer.isAnonymous ? <User className="w-5 h-5 text-slate-400" /> : 
             prayer.authorAvatar ? <img src={prayer.authorAvatar} className="w-full h-full object-cover" alt="" /> : 
             <span className="font-bold text-slate-600">{prayer.author[0]}</span>}
          </div>
          <div>
            <div className="flex items-center">
              <h3 className="font-semibold text-slate-900 text-sm">{prayer.isAnonymous ? "Anonymous" : prayer.author}</h3>
              {getRoleBadge(prayer.authorRole)}
            </div>
            <p className="text-xs text-slate-500">{new Date(prayer.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {prayer.category}</p>
          </div>
        </div>
        <button onClick={() => setShowReport(!showReport)} className="text-slate-300 hover:text-slate-600"><MoreHorizontal className="w-5 h-5" /></button>
      </div>

      {/* Content */}
      {prayer.isSensitive && !isContentRevealed ? (
        <div className="bg-slate-50 rounded-lg p-6 flex flex-col items-center justify-center text-center gap-2 mb-3">
           <EyeOff className="w-6 h-6 text-slate-400" />
           <p className="text-xs font-medium text-slate-600">Sensitive Content</p>
           <button onClick={() => setIsContentRevealed(true)} className="text-xs text-indigo-600 font-semibold hover:underline">Show</button>
        </div>
      ) : (
        <p className="text-slate-800 text-[15px] leading-relaxed mb-3">{prayer.content}</p>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-slate-50 pt-3">
        <div className="flex gap-6">
          <button onClick={handlePray} className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 transition-colors group">
             <div className={prayAnim ? 'joyful-hop-anim' : ''}><Hand className={`w-5 h-5 ${prayer.prayingCount > 0 ? 'fill-indigo-50 text-indigo-600' : ''}`} /></div>
             <span className="text-sm font-medium">{prayer.prayingCount}</span>
          </button>
          <button onClick={handleLike} className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors">
             <div className={likeAnim ? 'pop-anim' : ''}><ThumbsUp className={`w-4 h-4 ${prayer.likes > 0 ? 'fill-blue-50 text-blue-600' : ''}`} /></div>
             <span className="text-sm font-medium">{prayer.likes}</span>
          </button>
          <button className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700">
             <MessageCircle className="w-4 h-4" />
             <span className="text-sm font-medium">{prayer.commentCount}</span>
          </button>
        </div>
        <button className="text-slate-400 hover:text-slate-600"><Share2 className="w-4 h-4" /></button>
      </div>
    </div>
  );
};

const PrayerFeed: React.FC<PrayerFeedProps> = ({ prayers, currentUserRole, onInteract, isLoading }) => {
  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 pb-20">
      
      {/* HERO SECTION (Pray.com style) */}
      <div className="relative h-72 w-full bg-slate-900 overflow-hidden">
         <div className="absolute inset-0">
           <img src="https://images.unsplash.com/photo-1436891620584-47fd0e565afb?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover opacity-60" alt="Hero" />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
           <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent"></div>
         </div>
         
         <div className="absolute bottom-0 left-0 p-6 w-full z-10">
           <span className="text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2 block">Verse of the Day</span>
           <h1 className="text-3xl font-serif text-white mb-2 leading-tight max-w-xl">"Be still, and know that I am God."</h1>
           <p className="text-slate-300 text-sm mb-6">Psalm 46:10</p>
           
           <div className="flex gap-3">
             <button className="bg-white text-slate-900 px-6 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2 hover:bg-slate-100 transition-colors shadow-lg">
               <Play className="w-4 h-4 fill-slate-900" /> Play Daily Prayer
             </button>
             <button className="bg-white/10 backdrop-blur-md text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-white/20 transition-colors">
               Read Devotional
             </button>
           </div>
         </div>
      </div>

      {/* CATEGORIES RAIL */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-20 shadow-sm">
        <div className="flex overflow-x-auto hide-scrollbar px-4 py-3 gap-2">
          {CATEGORIES.map(cat => (
            <button key={cat.id} className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-600 text-sm font-medium transition-colors whitespace-nowrap">
              <cat.icon className="w-4 h-4 text-indigo-500" />
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-8">
        
        {/* HORIZONTAL CONTENT RAIL (Meditations) */}
        <div>
          <div className="flex justify-between items-end mb-4 px-1">
            <h2 className="text-xl font-bold text-slate-900">Sleep & Meditation</h2>
            <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">See All</button>
          </div>
          <div className="flex overflow-x-auto hide-scrollbar gap-4 pb-4 -mx-4 px-4">
            {CONTENT_CARDS.map(card => (
              <div key={card.id} className="flex-shrink-0 w-48 group cursor-pointer">
                <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 shadow-md">
                   <img src={card.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={card.title} />
                   <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Play className="w-2 h-2 fill-white" /> {card.duration}
                   </div>
                </div>
                <h3 className="font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{card.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{card.author}</p>
              </div>
            ))}
             <div className="flex-shrink-0 w-48 flex items-center justify-center bg-slate-100 rounded-2xl border-2 border-dashed border-slate-200">
                <span className="text-sm font-medium text-slate-500">View More</span>
             </div>
          </div>
        </div>

        {/* COMMUNITY FEED */}
        <div>
           <div className="flex justify-between items-end mb-4 px-1">
            <h2 className="text-xl font-bold text-slate-900">Community Prayers</h2>
            <div className="flex gap-2 text-sm text-slate-500">
               <span className="text-slate-900 font-bold border-b-2 border-slate-900 cursor-pointer">Trending</span>
               <span className="hover:text-slate-800 cursor-pointer">Newest</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {isLoading && prayers.length === 0 ? (
               <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
            ) : (
               prayers.map(p => <PrayerCard key={p.id} prayer={p} currentUserRole={currentUserRole} onInteract={onInteract} />)
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PrayerFeed;
