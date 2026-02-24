
import React, { useState, useEffect, useRef } from 'react';
import { AudioRoom, UserRole, RoomParticipant, RoomMessage } from '../types';
import { 
  Mic, MicOff, Video, VideoOff, Monitor, PhoneOff, MessageSquare, 
  Users, Hand, MoreVertical, Smile, Send, X, LayoutGrid, 
  BadgeCheck, Info, MessageCircle, Settings, ClosedCaption, Grid3X3
} from 'lucide-react';

interface AudioRoomsProps {
  rooms: AudioRoom[];
  activeRoom: AudioRoom | null;
  onJoinRoom: (room: AudioRoom) => void;
  onLeaveRoom: () => void;
  onCreateRoom: () => void;
}

const MOCK_PARTICIPANTS: RoomParticipant[] = [
  { id: '1', name: 'Pastor Prince Nana Osei', role: 'prayer_leader', isMuted: true, isVideoOn: false, isHandRaised: false, isSpeaking: false, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=300&h=300' },
  { id: '2', name: 'ELIZABETH AGYEI', role: 'user', isMuted: true, isVideoOn: false, isHandRaised: false, isSpeaking: false },
  { id: '3', name: 'Kuma Osei-Bonsu', role: 'moderator', isMuted: false, isVideoOn: false, isHandRaised: false, isSpeaking: true },
  { id: '4', name: 'Ohema Ohema', role: 'user', isMuted: true, isVideoOn: false, isHandRaised: false, isSpeaking: false },
  { id: '5', name: 'troi bragg', role: 'user', isMuted: false, isVideoOn: false, isHandRaised: false, isSpeaking: false },
  { id: '6', name: 'Mary Ansah', role: 'user', isMuted: true, isVideoOn: false, isHandRaised: false, isSpeaking: false },
  { id: '7', name: 'Christiana', role: 'user', isMuted: true, isVideoOn: false, isHandRaised: false, isSpeaking: false },
  { id: '8', name: 'Joseph Osei-Bonsu', role: 'user', isMuted: true, isVideoOn: false, isHandRaised: false, isSpeaking: false },
  { id: '9', name: 'Hillary Osei Bonsu', role: 'user', isMuted: true, isVideoOn: false, isHandRaised: false, isSpeaking: false },
  { id: '10', name: 'Ivy Agyei', role: 'user', isMuted: true, isVideoOn: false, isHandRaised: false, isSpeaking: false },
];

const TILE_COLORS = [
  'bg-[#4a1a1a]', // Maroon
  'bg-[#1a4a3a]', // Emerald
  'bg-[#1a2a4a]', // Navy
  'bg-[#3a1a4a]', // Purple
  'bg-[#2d3436]', // Dark Gray
  'bg-[#3c6382]', // Blue
];

export const AudioRooms: React.FC<AudioRoomsProps> = ({ rooms, activeRoom, onJoinRoom, onLeaveRoom, onCreateRoom }) => {
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCamOn, setIsCamOn] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<'people' | 'chat'>('people');
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (activeRoom) {
    return (
      <div className="flex h-screen bg-[#121212] text-white overflow-hidden flex-col">
        {/* Main Workspace */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Participant Grid */}
          <div className="flex-1 p-4 grid grid-cols-2 md:grid-cols-4 gap-3 content-start overflow-y-auto">
            {MOCK_PARTICIPANTS.map((p, idx) => (
              <div 
                key={p.id} 
                className={`relative rounded-2xl ${TILE_COLORS[idx % TILE_COLORS.length]} border-2 ${p.isSpeaking ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-transparent'} aspect-video flex items-center justify-center overflow-hidden transition-all duration-300`}
              >
                {/* Avatar / Initial */}
                {p.avatar && p.id === '1' ? (
                  <img src={p.avatar} className="w-24 h-24 rounded-full object-cover border-2 border-white/20" alt="" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-blue-500/30 border border-white/20 flex items-center justify-center text-3xl font-bold shadow-xl">
                    {p.name.charAt(0)}
                  </div>
                )}

                {/* Status Bar */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <span className="text-xs font-semibold text-white drop-shadow-md tracking-tight">{p.name}</span>
                </div>

                {/* Mute Indicator */}
                <div className="absolute top-3 right-3">
                  {p.isMuted && (
                    <div className="bg-red-500 rounded-full p-1.5 shadow-lg">
                      <MicOff className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* "12 others" Tile */}
            <div className="relative rounded-2xl bg-[#333333] border-2 border-transparent aspect-video flex items-center justify-center overflow-hidden">
               <div className="flex -space-x-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-700 border-2 border-[#333333] flex items-center justify-center font-bold">S</div>
                  <div className="w-12 h-12 rounded-full bg-blue-700 border-2 border-[#333333] flex items-center justify-center font-bold">M</div>
               </div>
               <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] font-bold text-slate-300 uppercase tracking-widest">
                 12 others
               </div>
            </div>
          </div>

          {/* Right Sidebar (Google Meet Style) */}
          {showSidebar && (
            <div className="w-80 bg-white m-4 rounded-2xl flex flex-col text-slate-900 shadow-2xl animate-in slide-in-from-right duration-300">
               <div className="p-4 flex items-center justify-between border-b border-slate-100">
                  <h3 className="font-bold text-lg">{sidebarTab === 'people' ? 'People' : 'Chat'}</h3>
                  <button onClick={() => setShowSidebar(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                    <X className="w-5 h-5" />
                  </button>
               </div>

               {sidebarTab === 'people' ? (
                 <div className="flex-1 overflow-y-auto p-2">
                    {MOCK_PARTICIPANTS.map(p => (
                      <div key={p.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors group">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold overflow-hidden">
                              {p.avatar ? <img src={p.avatar} className="w-full h-full object-cover" /> : p.name.charAt(0)}
                           </div>
                           <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-800 line-clamp-1">{p.name}</span>
                              {p.id === '1' && <span className="text-[10px] text-slate-500 font-bold">Meeting host</span>}
                           </div>
                        </div>
                        <div className="flex items-center gap-1">
                           {p.isMuted ? <MicOff className="w-4 h-4 text-slate-400" /> : <Mic className="w-4 h-4 text-emerald-500" />}
                           <button className="p-1 hover:bg-slate-200 rounded text-slate-400 opacity-0 group-hover:opacity-100"><MoreVertical className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="flex-1 p-4 flex flex-col items-center justify-center text-slate-400 text-sm italic">
                    No messages yet...
                 </div>
               )}
            </div>
          )}
        </div>

        {/* Bottom Bar Controls (Standard Meeting Layout) */}
        <div className="h-20 px-6 flex items-center justify-between bg-[#121212] border-t border-white/5">
          
          {/* Left: Time & Code */}
          <div className="flex items-center gap-4 text-sm font-medium">
             <span className="text-white/90">{time}</span>
             <span className="text-white/30">|</span>
             <span className="text-white/60 tracking-wider">tqw-cjfg-ora</span>
          </div>

          {/* Center: Main Controls */}
          <div className="flex items-center gap-3">
             <button 
                onClick={() => setIsMicOn(!isMicOn)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isMicOn ? 'bg-[#3c4043] hover:bg-[#4c5053]' : 'bg-[#f28b82] text-[#3c4043]'}`}
             >
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
             </button>
             <button 
                onClick={() => setIsCamOn(!isCamOn)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isCamOn ? 'bg-[#3c4043] hover:bg-[#4c5053]' : 'bg-[#f28b82] text-[#3c4043]'}`}
             >
                {isCamOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
             </button>
             <button className="w-12 h-12 rounded-full bg-[#3c4043] hover:bg-[#4c5053] flex items-center justify-center">
                <Monitor className="w-5 h-5" />
             </button>
             <button className="w-12 h-12 rounded-full bg-[#3c4043] hover:bg-[#4c5053] flex items-center justify-center">
                <Smile className="w-5 h-5" />
             </button>
             <button className="w-12 h-12 rounded-full bg-[#3c4043] hover:bg-[#4c5053] flex items-center justify-center">
                <ClosedCaption className="w-5 h-5" />
             </button>
             <button 
                onClick={() => setIsHandRaised(!isHandRaised)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isHandRaised ? 'bg-indigo-600' : 'bg-[#3c4043] hover:bg-[#4c5053]'}`}
             >
                <Hand className="w-5 h-5" />
             </button>
             <button className="w-12 h-12 rounded-full bg-[#3c4043] hover:bg-[#4c5053] flex items-center justify-center">
                <Settings className="w-5 h-5" />
             </button>
             
             <button onClick={onLeaveRoom} className="px-6 h-12 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold flex items-center gap-2 ml-4">
                <PhoneOff className="w-5 h-5" />
             </button>
          </div>

          {/* Right: Info, People, Chat */}
          <div className="flex items-center gap-1">
             <button className="p-3 hover:bg-white/10 rounded-full text-white/80 transition-colors">
                <Info className="w-5 h-5" />
             </button>
             <button 
                onClick={() => { setShowSidebar(true); setSidebarTab('people'); }}
                className={`p-3 rounded-full transition-colors ${showSidebar && sidebarTab === 'people' ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-white/10 text-white/80'}`}
             >
                <Users className="w-5 h-5" />
             </button>
             <button 
                onClick={() => { setShowSidebar(true); setSidebarTab('chat'); }}
                className={`p-3 rounded-full transition-colors ${showSidebar && sidebarTab === 'chat' ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-white/10 text-white/80'}`}
             >
                <MessageCircle className="w-5 h-5" />
             </button>
             <button className="p-3 hover:bg-white/10 rounded-full text-white/80 transition-colors">
                <Grid3X3 className="w-5 h-5" />
             </button>
          </div>
        </div>
      </div>
    );
  }

  // --- List View remains consistent with app design ---
  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-8">
           <div>
             <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter uppercase">LIVE SANCTUARY</h1>
             <p className="text-slate-500 font-bold">Real-time intercession, teaching, and fellowship.</p>
           </div>
           <button onClick={onCreateRoom} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-3xl font-black flex items-center gap-3 shadow-2xl transition-all active:scale-95 uppercase tracking-tighter">
             <Mic className="w-6 h-6" /> Go Live Now
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map(room => (
            <div key={room.id} className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500 group cursor-pointer" onClick={() => onJoinRoom(room)}>
              <div className="h-48 bg-slate-800 relative">
                 <img src={`https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=800&auto=format&fit=crop`} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000" alt="" />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                 <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-2 shadow-xl tracking-widest">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span> LIVE
                    </span>
                    <span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/20">
                      <Users className="w-4 h-4" /> {room.participants}
                    </span>
                 </div>
                 <div className="absolute bottom-5 left-5 right-5">
                    <h3 className="text-white font-black text-xl leading-tight mb-2 truncate group-hover:text-indigo-400 transition-colors">{room.title}</h3>
                    <div className="flex items-center gap-2 text-slate-300 text-xs font-bold uppercase tracking-widest">
                       <span>{room.host}</span>
                       {room.hostVerified && <BadgeCheck className="w-4 h-4 text-blue-400 fill-blue-400/20" />}
                    </div>
                 </div>
              </div>
              <div className="p-6 flex justify-between items-center bg-white">
                 <div className="flex gap-2">
                   {room.tags.slice(0, 2).map(t => (
                      <span key={t} className="text-[10px] font-black bg-slate-50 text-slate-400 px-3 py-1.5 rounded-full border border-slate-100 uppercase tracking-widest">{t.replace('#', '')}</span>
                   ))}
                 </div>
                 <button className="bg-indigo-50 text-indigo-600 p-3 rounded-full hover:bg-indigo-600 hover:text-white transition-all">
                    <Send className="w-5 h-5" />
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
