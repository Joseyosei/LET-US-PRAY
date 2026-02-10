import React, { useState, useEffect } from 'react';
import { Prayer } from '../types';
import { Heart, MessageCircle, Share2, MapPin, CheckCircle, Loader2, ThumbsUp } from 'lucide-react';

interface PrayerFeedProps {
  prayers: Prayer[];
  onInteract: (id: string, type: 'like' | 'pray') => void;
  isLoading?: boolean;
}

// Custom styles for the pop animation
const style = document.createElement('style');
style.textContent = `
  @keyframes pop {
    0% { transform: scale(1); }
    50% { transform: scale(1.3); }
    100% { transform: scale(1); }
  }
  .pop-anim {
    animation: pop 0.3s ease-out forwards;
  }
`;
document.head.appendChild(style);

const PrayerCard: React.FC<{ prayer: Prayer; onInteract: (id: string, type: 'like' | 'pray') => void }> = ({ prayer, onInteract }) => {
  const [likeAnim, setLikeAnim] = useState(false);
  const [prayAnim, setPrayAnim] = useState(false);

  const handleLike = () => {
    setLikeAnim(true);
    onInteract(prayer.id, 'like');
  };

  const handlePray = () => {
    setPrayAnim(true);
    onInteract(prayer.id, 'pray');
  };

  // Reset animation states after they play
  useEffect(() => {
    if (likeAnim) {
      const timer = setTimeout(() => setLikeAnim(false), 300);
      return () => clearTimeout(timer);
    }
  }, [likeAnim]);

  useEffect(() => {
    if (prayAnim) {
      const timer = setTimeout(() => setPrayAnim(false), 300);
      return () => clearTimeout(timer);
    }
  }, [prayAnim]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:border-indigo-100 transition-all">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
            {prayer.author.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 flex items-center gap-1">
              {prayer.author}
              {prayer.verified && <CheckCircle className="w-3 h-3 text-blue-500" />}
            </h3>
            <div className="text-xs text-slate-500 flex items-center gap-1">
              {prayer.location && (
                <>
                  <MapPin className="w-3 h-3" />
                  {prayer.location} • 
                </>
              )}
              {new Date(prayer.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>

      <p className="text-slate-800 mb-4 leading-relaxed whitespace-pre-wrap">
        {prayer.content}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {prayer.tags.map(tag => (
          <span key={tag} className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-slate-50 pt-3 mt-2">
        <button 
          onClick={handleLike}
          className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors text-sm font-medium group"
        >
          <div className={`relative transition-transform duration-200 ${likeAnim ? 'pop-anim text-blue-600' : 'group-hover:scale-110'}`}>
              <ThumbsUp className={`w-5 h-5 ${prayer.likes > 0 ? 'fill-blue-50 text-blue-600' : ''}`} />
          </div>
          <span key={`likes-${prayer.likes}`} className={likeAnim ? 'pop-anim font-bold text-blue-600' : ''}>
            {prayer.likes} Likes
          </span>
        </button>

        <button 
          onClick={handlePray}
          className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 transition-colors text-sm font-medium group"
        >
          <div className={`relative transition-transform duration-200 ${prayAnim ? 'pop-anim text-indigo-600' : 'group-hover:scale-110'}`}>
              <Heart className={`w-5 h-5 ${prayer.prayingCount > 0 ? 'fill-indigo-50 text-indigo-600' : ''}`} />
          </div>
          <span key={`pray-${prayer.prayingCount}`} className={prayAnim ? 'pop-anim font-bold text-indigo-600' : ''}>
            {prayer.prayingCount} Praying
          </span>
        </button>
        
        <button className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 transition-colors text-sm font-medium hover:scale-105 active:scale-95 transform duration-150">
          <MessageCircle className="w-5 h-5" />
          <span>Encourage</span>
        </button>
        
        <button className="flex items-center gap-1.5 text-slate-500 hover:text-green-600 transition-colors text-sm font-medium hover:scale-105 active:scale-95 transform duration-150">
          <Share2 className="w-5 h-5" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};

const PrayerFeed: React.FC<PrayerFeedProps> = ({ prayers, onInteract, isLoading }) => {
  if (isLoading && prayers.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        {prayers.map((prayer) => (
          <PrayerCard key={prayer.id} prayer={prayer} onInteract={onInteract} />
        ))}
        
        {/* End of Feed */}
        <div className="text-center py-8 text-slate-400 text-sm">
          You are all caught up on prayers from around the world.
        </div>
      </div>
    </div>
  );
};

export default PrayerFeed;