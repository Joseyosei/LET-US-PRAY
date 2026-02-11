
import React, { useState, useEffect } from 'react';
import { Home, Radio, Plus, Menu, Settings, Layout, LogOut, Mic, EyeOff, X, Video } from 'lucide-react';
import PrayerFeed from './components/PrayerFeed';
import AudioRooms from './components/AudioRooms';
import { SettingsView } from './components/SettingsView';
import { TestimonyStudio } from './components/TestimonyStudio';
import { TopNav } from './components/TopNav';
import { Auth } from './components/Auth';
import { Prayer, AppView, AudioRoom, User, UserRole } from './types';
import { moderatePrayerContent } from './services/geminiService';

const PRAYER_CATEGORIES = ['General', 'Healing', 'Peace', 'Family', 'Provision', 'Warfare', 'Thanksgiving', 'Salvation'];

const INITIAL_ROOMS: AudioRoom[] = [
  { 
    id: '1', 
    title: 'Morning Devotion & Praise', 
    host: 'Pastor John', 
    hostRole: 'prayer_leader',
    hostVerified: true,
    participants: 142, 
    tags: ['#Worship', '#Morning'], 
    isLive: true,
    language: 'English',
    durationMinutes: 45,
    description: 'Starting the day with scripture reading and worship songs.'
  },
  { 
    id: '2', 
    title: 'Oración de Sanidad', 
    host: 'Maria Gonzalez', 
    hostRole: 'church',
    hostVerified: false,
    participants: 56, 
    tags: ['#Healing', '#Intercession'], 
    isLive: true,
    language: 'Spanish',
    durationMinutes: 120,
    description: 'Interceding for the sick and brokenhearted.'
  },
  { 
    id: '3', 
    title: 'Youth Bible Study', 
    host: 'NextGen Ministry', 
    hostRole: 'moderator',
    hostVerified: true,
    participants: 28, 
    tags: ['#Youth', '#Study'], 
    isLive: true,
    language: 'English',
    durationMinutes: 15,
    description: 'Discussing the book of James.'
  },
];

const MOCK_PRAYERS: Prayer[] = [
  {
    id: '1',
    author: 'Grace L.',
    authorRole: 'prayer_leader',
    authorVerified: true,
    content: 'Please pray for my mother who is undergoing surgery tomorrow. We are trusting in God\'s healing hands.',
    tags: ['#Healing', '#Family'],
    likes: 24,
    prayingCount: 12,
    prayersRequested: 3,
    shareCount: 5,
    commentCount: 8,
    isAnonymous: false,
    category: 'Healing',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    location: 'Lagos, Nigeria'
  },
  {
    id: '2',
    author: 'David K.',
    authorRole: 'user',
    content: 'Praying for peace in my community. There has been so much conflict lately. Lord, bring unity.',
    tags: ['#Peace', '#Community'],
    likes: 45,
    prayingCount: 30,
    prayersRequested: 8,
    shareCount: 12,
    commentCount: 4,
    isAnonymous: false,
    category: 'Peace',
    timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    location: 'London, UK'
  },
  {
    id: '3',
    author: 'City Church Global',
    authorRole: 'church',
    authorVerified: true,
    content: 'Join us in thanking God for a new job opportunity! His provision is perfect.',
    tags: ['#Thanksgiving', '#Provision'],
    likes: 89,
    prayingCount: 5,
    prayersRequested: 0,
    shareCount: 20,
    commentCount: 15,
    isAnonymous: false,
    category: 'Provision',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
    location: 'Sao Paulo, Brazil',
    verified: true
  },
  {
    id: '4',
    author: 'Anonymous',
    authorRole: 'user',
    content: 'I am struggling with deep depression and feel very alone. Please pray for light in this darkness.',
    tags: ['#MentalHealth', '#Hope'],
    likes: 12,
    prayingCount: 45,
    prayersRequested: 0,
    shareCount: 2,
    commentCount: 22,
    isAnonymous: true,
    category: 'Healing',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    isSensitive: true
  }
];

export default function App() {
  // Enhanced User State with Role
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('let_us_pray_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...parsed, role: parsed.role || 'user' };
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [currentView, setCurrentView] = useState<AppView>(AppView.FEED);
  const [activeRoom, setActiveRoom] = useState<AudioRoom | null>(null);
  
  // Modal States
  const [isPrayerModalOpen, setIsPrayerModalOpen] = useState(false);
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);
  
  // Prayer Form State
  const [newPrayerText, setNewPrayerText] = useState('');
  const [newPrayerCategory, setNewPrayerCategory] = useState('General');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  
  // Room Form State
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [newRoomDesc, setNewRoomDesc] = useState('');
  const [newRoomLanguage, setNewRoomLanguage] = useState('English');
  const [newRoomDuration, setNewRoomDuration] = useState('60');

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initialize Data
  const [prayers, setPrayers] = useState<Prayer[]>(() => {
    const saved = localStorage.getItem('let_us_pray_prayers');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((p: any) => ({
          ...p,
          timestamp: new Date(p.timestamp),
          prayersRequested: p.prayersRequested || 0,
          shareCount: p.shareCount || 0,
          commentCount: p.commentCount || 0,
          isAnonymous: p.isAnonymous || false,
          category: p.category || 'General'
        }));
      } catch (e) {
        return MOCK_PRAYERS;
      }
    }
    return MOCK_PRAYERS;
  });

  const [rooms, setRooms] = useState<AudioRoom[]>(INITIAL_ROOMS);

  useEffect(() => {
    localStorage.setItem('let_us_pray_prayers', JSON.stringify(prayers));
  }, [prayers]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('let_us_pray_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('let_us_pray_user');
    }
  }, [user]);

  // Handle Login now accepts extended fields
  const handleLogin = (userData: { name: string; email: string; bio?: string; profileImage?: string }) => {
    setUser({
      id: Date.now().toString(),
      ...userData,
      role: 'user', // Default role
      isVerified: false,
      createdAt: new Date()
    });
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView(AppView.FEED);
  };

  const handleUpdateUser = (updatedData: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...updatedData });
  };

  const handleInteract = (id: string, type: 'like' | 'pray' | 'request_prayer') => {
    setPrayers(prev => prev.map(p => {
      if (p.id !== id) return p;
      if (type === 'like') return { ...p, likes: (p.likes || 0) + 1 };
      if (type === 'pray') return { ...p, prayingCount: (p.prayingCount || 0) + 1 };
      if (type === 'request_prayer') return { ...p, prayersRequested: (p.prayersRequested || 0) + 1 };
      return p;
    }));
  };

  const handlePostPrayer = async () => {
    if (!newPrayerText.trim() || !user) return;
    setIsPosting(true);

    const moderation = await moderatePrayerContent(newPrayerText);
    
    if (!moderation.safe) {
      alert(`Prayer cannot be posted: ${moderation.reason || "Content flagged as inappropriate."}`);
      setIsPosting(false);
      return;
    }

    const newPrayer: Prayer = {
      id: Date.now().toString(),
      author: user.name,
      authorRole: user.role,
      authorVerified: user.isVerified,
      authorAvatar: user.profileImage,
      content: newPrayerText,
      tags: moderation.suggestedTags || ['#Prayer'],
      likes: 0,
      prayingCount: 0,
      prayersRequested: 0,
      shareCount: 0,
      commentCount: 0,
      timestamp: new Date(),
      location: 'Unknown',
      isSensitive: false,
      category: newPrayerCategory,
      isAnonymous: isAnonymous
    };

    setPrayers([newPrayer, ...prayers]);
    setNewPrayerText('');
    setNewPrayerCategory('General');
    setIsAnonymous(false);
    setIsPrayerModalOpen(false);
    setIsPosting(false);
  };

  const handleCreateRoom = () => {
    if (!newRoomTitle.trim() || !user) return;
    
    const newRoom: AudioRoom = {
      id: Date.now().toString(),
      title: newRoomTitle,
      description: newRoomDesc,
      host: user.name,
      hostRole: user.role,
      hostVerified: user.isVerified,
      participants: 1,
      tags: ['#Live', '#Prayer'],
      isLive: true,
      language: newRoomLanguage,
      durationMinutes: parseInt(newRoomDuration) || 60
    };

    setRooms([newRoom, ...rooms]);
    setActiveRoom(newRoom); // Auto join
    
    // Reset form
    setNewRoomTitle('');
    setNewRoomDesc('');
    setIsCreateRoomModalOpen(false);
  };

  // Determine Context Aware FAB
  const getFloatingAction = () => {
    if (activeRoom || currentView === AppView.STUDIO) return null; // No FAB in rooms or studio
    
    if (currentView === AppView.ROOMS) {
      return (
        <button 
          onClick={() => setIsCreateRoomModalOpen(true)}
          className="absolute bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-lg transition-transform hover:scale-105 z-30 flex items-center gap-2"
        >
          <Mic className="w-6 h-6" />
        </button>
      );
    }

    if (currentView === AppView.FEED) {
      return (
         <button 
            onClick={() => setIsPrayerModalOpen(true)}
            className="absolute bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-lg transition-transform hover:scale-105 z-30"
          >
            <Plus className="w-6 h-6" />
          </button>
      );
    }
    return null;
  };

  const renderContent = () => {
    switch (currentView) {
      case AppView.FEED:
        return <PrayerFeed prayers={prayers} currentUserRole={user!.role} onInteract={handleInteract} />;
      case AppView.ROOMS:
        return (
          <AudioRooms 
            rooms={rooms}
            activeRoom={activeRoom} 
            onJoinRoom={setActiveRoom} 
            onLeaveRoom={() => setActiveRoom(null)} 
            onCreateRoom={() => setIsCreateRoomModalOpen(true)}
          />
        );
      case AppView.STUDIO:
        return <TestimonyStudio />;
      case AppView.SETTINGS:
        return <SettingsView user={user!} onUpdateUser={handleUpdateUser} onLogout={handleLogout} />;
      default:
        return <PrayerFeed prayers={prayers} currentUserRole={user!.role} onInteract={handleInteract} />;
    }
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      {/* Desktop Sidebar (Navigation Only) */}
      <div className="hidden md:flex w-64 flex-col border-r border-slate-200 bg-white z-40">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <h1 className="text-xl font-bold text-indigo-700 tracking-tight flex items-center gap-2">
            <span className="bg-indigo-600 text-white px-1.5 py-0.5 rounded text-sm">LUP</span> LET US PRAY
          </h1>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <SidebarItem 
            icon={<Home />} 
            label="Home" 
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
            icon={<Video />} 
            label="Testimony Studio" 
            active={currentView === AppView.STUDIO} 
            onClick={() => setCurrentView(AppView.STUDIO)} 
          />
          <div className="pt-6 mt-4 border-t border-slate-100">
             <p className="px-4 text-xs font-semibold text-slate-400 uppercase mb-2 tracking-wider">System</p>
            <SidebarItem 
              icon={<Settings />} 
              label="Settings" 
              active={currentView === AppView.SETTINGS} 
              onClick={() => setCurrentView(AppView.SETTINGS)} 
            />
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative w-full">
        
        {/* Top Navigation (Global) */}
        {!activeRoom && (
           <TopNav 
             user={user} 
             isMobileMenuOpen={mobileMenuOpen} 
             onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} 
           />
        )}

        {/* Mobile Navigation Menu Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-200 shadow-xl z-50 p-4 animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-1">
              <SidebarItem 
                icon={<Home />} 
                label="Home" 
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
                icon={<Video />} 
                label="Testimony Studio" 
                active={currentView === AppView.STUDIO} 
                onClick={() => { setCurrentView(AppView.STUDIO); setMobileMenuOpen(false); }} 
              />
               <SidebarItem 
                icon={<Settings />} 
                label="Settings" 
                active={currentView === AppView.SETTINGS} 
                onClick={() => { setCurrentView(AppView.SETTINGS); setMobileMenuOpen(false); }} 
              />
              <div className="border-t border-slate-100 mt-2 pt-2">
                 <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-600">
                   <LogOut className="w-4 h-4" /> Sign Out
                 </button>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic View Content */}
        {renderContent()}

        {/* Floating Action Button */}
        {getFloatingAction()}
      </div>

      {/* Post Prayer Modal */}
      {isPrayerModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl scale-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">New Prayer Request</h2>
              <button onClick={() => setIsPrayerModalOpen(false)} className="bg-slate-100 p-2 rounded-full text-slate-500 hover:text-slate-800 transition-colors">
                <X className="w-5 h-5" /> 
              </button>
            </div>
            
            <textarea
              value={newPrayerText}
              onChange={(e) => setNewPrayerText(e.target.value)}
              placeholder="What would you like the community to pray for today?"
              className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none mb-4 text-base"
            />
            
            <div className="grid grid-cols-2 gap-4 mb-6">
               <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Category</label>
                  <select 
                    value={newPrayerCategory}
                    onChange={(e) => setNewPrayerCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {PRAYER_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
               </div>
               
               <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Privacy</label>
                  <button 
                    onClick={() => setIsAnonymous(!isAnonymous)}
                    className={`w-full p-2.5 rounded-lg text-sm border flex items-center justify-center gap-2 transition-colors ${isAnonymous ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                  >
                     <EyeOff className="w-4 h-4" />
                     {isAnonymous ? 'Posting Anonymously' : 'Post as Myself'}
                  </button>
               </div>
            </div>

            <div className="flex justify-end gap-3 items-center">
              <span className="text-xs text-slate-400 mr-auto hidden sm:inline-block">
                AI moderation enabled.
              </span>
              <button 
                onClick={() => setIsPrayerModalOpen(false)}
                className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handlePostPrayer}
                disabled={isPosting || !newPrayerText.trim()}
                className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm transition-all active:scale-95"
              >
                {isPosting ? 'Posting...' : 'Share Prayer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Room Modal */}
      {isCreateRoomModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl scale-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Start a Live Room</h2>
              <button onClick={() => setIsCreateRoomModalOpen(false)} className="bg-slate-100 p-2 rounded-full text-slate-500 hover:text-slate-800 transition-colors">
                <X className="w-5 h-5" /> 
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Room Title</label>
                <input
                  type="text"
                  value={newRoomTitle}
                  onChange={(e) => setNewRoomTitle(e.target.value)}
                  placeholder="e.g. Morning Prayer & Worship"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description (Optional)</label>
                <textarea
                  value={newRoomDesc}
                  onChange={(e) => setNewRoomDesc(e.target.value)}
                  placeholder="What is this gathering about?"
                  rows={2}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Language</label>
                  <select
                    value={newRoomLanguage}
                    onChange={(e) => setNewRoomLanguage(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="Portuguese">Portuguese</option>
                    <option value="French">French</option>
                    <option value="Tagalog">Tagalog</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Duration</label>
                  <select
                    value={newRoomDuration}
                    onChange={(e) => setNewRoomDuration(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="15">15 mins</option>
                    <option value="30">30 mins</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
               <button 
                onClick={() => setIsCreateRoomModalOpen(false)}
                className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateRoom}
                disabled={!newRoomTitle.trim()}
                className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm transition-all active:scale-95"
              >
                <Mic className="w-4 h-4" /> Go Live
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const SidebarItem: React.FC<{ icon: React.ReactNode; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
      active ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    <div className={`transition-colors ${active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`}>{icon}</div>
    {label}
  </button>
);
