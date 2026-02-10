import React, { useState, useEffect } from 'react';
import { Home, Radio, MessageSquare, Plus, Menu, X, Settings, Layout, LogOut } from 'lucide-react';
import PrayerFeed from './components/PrayerFeed';
import AudioRooms from './components/AudioRooms';
import PrayerPartnerChat from './components/PrayerPartnerChat';
import ArchitectureView from './components/ArchitectureView';
import { Auth } from './components/Auth';
import { Prayer, AppView, AudioRoom } from './types';
import { moderatePrayerContent } from './services/geminiService';

const MOCK_PRAYERS: Prayer[] = [
  {
    id: '1',
    author: 'Grace L.',
    content: 'Please pray for my mother who is undergoing surgery tomorrow. We are trusting in God\'s healing hands.',
    tags: ['#Healing', '#Family'],
    likes: 24,
    prayingCount: 12,
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    location: 'Lagos, Nigeria'
  },
  {
    id: '2',
    author: 'David K.',
    content: 'Praying for peace in my community. There has been so much conflict lately. Lord, bring unity.',
    tags: ['#Peace', '#Community'],
    likes: 45,
    prayingCount: 30,
    timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    location: 'London, UK'
  },
  {
    id: '3',
    author: 'Maria S.',
    content: 'Thanking God for a new job opportunity! His provision is perfect.',
    tags: ['#Thanksgiving', '#Provision'],
    likes: 89,
    prayingCount: 5,
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
    location: 'Sao Paulo, Brazil',
    verified: true
  }
];

interface User {
  name: string;
  email: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('let_us_pray_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentView, setCurrentView] = useState<AppView>(AppView.FEED);
  const [activeRoom, setActiveRoom] = useState<AudioRoom | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPrayerText, setNewPrayerText] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initialize prayers from localStorage or fallback to MOCK
  const [prayers, setPrayers] = useState<Prayer[]>(() => {
    const saved = localStorage.getItem('let_us_pray_prayers');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Rehydrate dates
        return parsed.map((p: any) => ({
          ...p,
          timestamp: new Date(p.timestamp)
        }));
      } catch (e) {
        console.error("Failed to load prayers from storage", e);
        return MOCK_PRAYERS;
      }
    }
    return MOCK_PRAYERS;
  });

  // Persist prayers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('let_us_pray_prayers', JSON.stringify(prayers));
  }, [prayers]);

  // Persist user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('let_us_pray_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('let_us_pray_user');
    }
  }, [user]);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView(AppView.FEED);
  };

  const handleInteract = (id: string, type: 'like' | 'pray') => {
    setPrayers(prev => prev.map(p => {
      if (p.id !== id) return p;

      if (type === 'like') {
        return { ...p, likes: (p.likes || 0) + 1 };
      }
      
      if (type === 'pray') {
        return { ...p, prayingCount: (p.prayingCount || 0) + 1 };
      }
      
      return p;
    }));
  };

  const handlePostPrayer = async () => {
    if (!newPrayerText.trim() || !user) return;
    setIsPosting(true);

    // AI Moderation Step
    const moderation = await moderatePrayerContent(newPrayerText);
    
    if (!moderation.safe) {
      alert(`Prayer cannot be posted: ${moderation.reason || "Content flagged as inappropriate."}`);
      setIsPosting(false);
      return;
    }

    const newPrayer: Prayer = {
      id: Date.now().toString(),
      author: user.name,
      content: newPrayerText,
      tags: moderation.suggestedTags || ['#Prayer'],
      likes: 0,
      prayingCount: 0,
      timestamp: new Date(),
      location: 'Unknown'
    };

    setPrayers([newPrayer, ...prayers]);
    setNewPrayerText('');
    setIsModalOpen(false);
    setIsPosting(false);
  };

  const renderContent = () => {
    switch (currentView) {
      case AppView.FEED:
        return <PrayerFeed prayers={prayers} onInteract={handleInteract} />;
      case AppView.ROOMS:
        return <AudioRooms activeRoom={activeRoom} onJoinRoom={setActiveRoom} onLeaveRoom={() => setActiveRoom(null)} />;
      case AppView.PARTNER:
        return <PrayerPartnerChat />;
      case AppView.ARCHITECTURE:
        return <ArchitectureView />;
      default:
        return <PrayerFeed prayers={prayers} onInteract={handleInteract} />;
    }
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 flex-col border-r border-slate-200 bg-white z-20">
        <div className="p-6">
          <h1 className="text-xl font-bold text-indigo-700 tracking-tight flex items-center gap-2">
            <span className="bg-indigo-600 text-white p-1 rounded">LP</span> LET US PRAY
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <SidebarItem 
            icon={<Home />} 
            label="Prayer Feed" 
            active={currentView === AppView.FEED} 
            onClick={() => setCurrentView(AppView.FEED)} 
          />
          <SidebarItem 
            icon={<Radio />} 
            label="Live Rooms" 
            active={currentView === AppView.ROOMS} 
            onClick={() => setCurrentView(AppView.ROOMS)} 
          />
          <SidebarItem 
            icon={<MessageSquare />} 
            label="AI Partner" 
            active={currentView === AppView.PARTNER} 
            onClick={() => setCurrentView(AppView.PARTNER)} 
          />
          <div className="pt-4 mt-4 border-t border-slate-100">
            <SidebarItem 
              icon={<Layout />} 
              label="Tech Specs" 
              active={currentView === AppView.ARCHITECTURE} 
              onClick={() => setCurrentView(AppView.ARCHITECTURE)} 
            />
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-3">
             <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
               {user.name.charAt(0)}
             </div>
             <div className="text-sm overflow-hidden">
               <p className="font-medium text-slate-900 truncate">{user.name}</p>
               <p className="text-slate-500 text-xs">Premium Member</p>
             </div>
             <Settings className="w-4 h-4 text-slate-400 ml-auto cursor-pointer hover:text-indigo-600" />
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-xs text-slate-500 hover:text-red-600 transition-colors px-1"
          >
            <LogOut className="w-3 h-3" /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-200 bg-white">
          <h1 className="text-lg font-bold text-indigo-700">LET US PRAY</h1>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-600">
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-200 shadow-xl z-50 p-4 space-y-2">
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-lg mb-4">
               <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                 {user.name.charAt(0)}
               </div>
               <div>
                 <p className="font-medium text-slate-900 text-sm">{user.name}</p>
                 <button onClick={handleLogout} className="text-xs text-red-500 font-medium">Sign Out</button>
               </div>
            </div>
            
            <SidebarItem 
              icon={<Home />} 
              label="Prayer Feed" 
              active={currentView === AppView.FEED} 
              onClick={() => { setCurrentView(AppView.FEED); setMobileMenuOpen(false); }} 
            />
            <SidebarItem 
              icon={<Radio />} 
              label="Live Rooms" 
              active={currentView === AppView.ROOMS} 
              onClick={() => { setCurrentView(AppView.ROOMS); setMobileMenuOpen(false); }} 
            />
             <SidebarItem 
              icon={<MessageSquare />} 
              label="AI Partner" 
              active={currentView === AppView.PARTNER} 
              onClick={() => { setCurrentView(AppView.PARTNER); setMobileMenuOpen(false); }} 
            />
            <SidebarItem 
              icon={<Layout />} 
              label="Tech Architecture" 
              active={currentView === AppView.ARCHITECTURE} 
              onClick={() => { setCurrentView(AppView.ARCHITECTURE); setMobileMenuOpen(false); }} 
            />
          </div>
        )}

        {/* View Content */}
        {renderContent()}

        {/* Floating Action Button (Only on Feed) */}
        {currentView === AppView.FEED && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="absolute bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-lg transition-transform hover:scale-105 z-30"
          >
            <Plus className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Post Prayer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-900">Post a Prayer Request</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <textarea
              value={newPrayerText}
              onChange={(e) => setNewPrayerText(e.target.value)}
              placeholder="What would you like the community to pray for?"
              className="w-full h-32 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none mb-4"
            />
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg"
              >
                Cancel
              </button>
              <button 
                onClick={handlePostPrayer}
                disabled={isPosting || !newPrayerText.trim()}
                className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
              >
                {isPosting ? 'Moderating...' : 'Post Prayer'}
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-4 text-center">
              Our AI moderation ensures a safe, encouraging environment for everyone.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

const SidebarItem: React.FC<{ icon: React.ReactNode; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      active ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-50'
    }`}
  >
    <div className={active ? 'text-indigo-600' : 'text-slate-400'}>{icon}</div>
    {label}
  </button>
);