
import React, { useState, useEffect, useRef } from 'react';
import { AudioRoom, UserRole, RoomParticipant, RoomMessage } from '../types';
import { 
  Mic, MicOff, Video, VideoOff, Monitor, PhoneOff, MessageSquare, 
  Users, Hand, MoreVertical, Smile, Send, X, LayoutGrid, 
  BadgeCheck, Shield, ShieldAlert, Plus, Globe, Clock, PlayCircle, ShieldCheck, Headphones, Heart
} from 'lucide-react';

interface AudioRoomsProps {
  rooms: AudioRoom[];
  activeRoom: AudioRoom | null;
  onJoinRoom: (room: AudioRoom) => void;
  onLeaveRoom: () => void;
  onCreateRoom: () => void;
}

interface Reaction {
  id: string;
  emoji: string;
  left: number; // percentage
}

// Mock Data for Participants
const MOCK_PARTICIPANTS: RoomParticipant[] = [
  { id: '1', name: 'Pastor John', role: 'prayer_leader', isMuted: false, isVideoOn: true, isHandRaised: false, isSpeaking: true, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=300&h=300' },
  { id: '2', name: 'Sarah Miller', role: 'moderator', isMuted: true, isVideoOn: true, isHandRaised: false, isSpeaking: false, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=300&h=300' },
  { id: '3', name: 'David Chen', role: 'user', isMuted: true, isVideoOn: false, isHandRaised: true, isSpeaking: false, avatar: 'https://ui-avatars.com/api/?name=David+Chen&background=random' },
  { id: '4', name: 'Grace L.', role: 'user', isMuted: false, isVideoOn: true, isHandRaised: false, isSpeaking: false, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fit=crop&w=300&h=300' },
  { id: '5', name: 'Michael R.', role: 'user', isMuted: true, isVideoOn: true, isHandRaised: false, isSpeaking: false, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=300&h=300' },
];

const MOCK_MESSAGES: RoomMessage[] = [
  { id: '1', senderId: '2', senderName: 'Sarah Miller', text: 'Welcome everyone! Please keep your mics muted during the prayer.', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
  { id: '2', senderId: '3', senderName: 'David Chen', text: 'Amen. The audio is very clear today.', timestamp: new Date(Date.now() - 1000 * 60 * 2) },
];

const AudioRooms: React.FC<AudioRoomsProps> = ({ rooms, activeRoom, onJoinRoom, onLeaveRoom, onCreateRoom }) => {
  // Local State for Active Room
  const [participants, setParticipants] = useState<RoomParticipant[]>(MOCK_PARTICIPANTS);
  const [messages, setMessages] = useState<RoomMessage[]>(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [reactions, setReactions] = useState<Reaction[]>([]);
  
  // Controls State
  const [isMicOn, setIsMicOn] = useState(false); // User starts muted
  const [isCamOn, setIsCamOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatOpen]);

  // Clean up old reactions
  useEffect(() => {
    if (reactions.length > 0) {
      const timer = setTimeout(() => {
        setReactions(prev => prev.slice(1));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [reactions]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const msg: RoomMessage = {
      id: Date.now().toString(),
      senderId: 'me',
      senderName: 'Me',
      text: newMessage,
      timestamp: new Date()
    };
    
    setMessages([...messages, msg]);
    setNewMessage('');
  };

  const triggerReaction = (emoji: string) => {
    const newReaction: Reaction = {
      id: Date.now().toString() + Math.random(),
      emoji,
      left: Math.random() * 80 + 10 // Random position between 10% and 90%
    };
    setReactions(prev => [...prev, newReaction]);
  };

  const VideoTile: React.FC<{ participant: RoomParticipant; isLarge?: boolean }> = ({ participant, isLarge }) => (
    <div className={`relative bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-lg group transition-all ${isLarge ? 'h-full' : 'aspect-video'}`}>
      <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
        {participant.isVideoOn ? (
           <img 
            src={participant.avatar} 
            alt={participant.name} 
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
             {participant.name.charAt(0)}
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-3 left-3 text-white text-sm font-medium flex items-center gap-2 drop-shadow-md">
        <span>{participant.name}</span>
        {participant.isMuted && <MicOff className="w-3 h-3 text-red-400" />}
        {participant.isHandRaised && <Hand className="w-3 h-3 text-yellow-400" />}
      </div>
      {participant.isSpeaking && !participant.isMuted && (
        <div className="absolute top-3 right-3 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]"></div>
      )}
    </div>
  );

  // ================= ACTIVE ROOM VIEW =================
  if (activeRoom) {
    return (
      <div className="flex h-full bg-slate-900 text-white overflow-hidden relative">
        
        {/* Floating Reactions Overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          {reactions.map(r => (
            <div 
              key={r.id} 
              className="absolute bottom-20 text-4xl animate-float-up opacity-0"
              style={{ left: `${r.left}%` }}
            >
              {r.emoji}
            </div>
          ))}
        </div>
        <style>{`
          @keyframes floatUp {
            0% { transform: translateY(0) scale(0.5); opacity: 0; }
            10% { opacity: 1; transform: translateY(-20px) scale(1.2); }
            100% { transform: translateY(-300px) scale(1); opacity: 0; }
          }
          .animate-float-up { animation: floatUp 2s ease-out forwards; }
        `}</style>

        <div className={`flex-1 flex flex-col transition-all duration-300 ${isChatOpen ? 'mr-80' : ''}`}>
          <div className="h-14 px-4 flex items-center justify-between z-10 shrink-0 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
             <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-red-600/20 text-red-500 px-2 py-1 rounded-md">
                   <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                   <span className="text-xs font-bold tracking-wider">LIVE</span>
                </div>
                <h2 className="text-sm font-medium text-slate-200">{activeRoom.title}</h2>
             </div>
             <div className="flex items-center gap-2">
                <div className="bg-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2 text-slate-400">
                   <Users className="w-4 h-4" />
                   <span className="text-xs font-bold">{participants.length + 1}</span>
                </div>
             </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
             {isScreenSharing ? (
                <div className="h-full flex flex-col gap-4">
                   <div className="flex-1 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-center relative overflow-hidden group">
                      <div className="text-center">
                         <Monitor className="w-16 h-16 text-indigo-500 mx-auto mb-4 opacity-50" />
                         <h3 className="text-xl font-medium text-slate-300">Screen Share Active</h3>
                         <button 
                            onClick={() => setIsScreenSharing(false)}
                            className="mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors"
                         >Stop Presenting</button>
                      </div>
                   </div>
                   <div className="h-32 flex gap-4 overflow-x-auto pb-2 shrink-0">
                      {participants.map(p => (
                         <div key={p.id} className="w-48 flex-shrink-0 h-full"><VideoTile participant={p} isLarge /></div>
                      ))}
                   </div>
                </div>
             ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full content-center">
                   <div className="relative bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-lg group aspect-video">
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-850">
                         {isCamOn ? (
                            <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?fit=crop&w=600&h=600" alt="Me" className="w-full h-full object-cover transform scale-x-[-1]" />
                         ) : <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center text-2xl font-bold text-white">You</div>}
                      </div>
                      <div className="absolute bottom-3 left-3 text-white text-sm font-medium flex items-center gap-2 drop-shadow-md">
                         <span>You</span>
                         {!isMicOn && <MicOff className="w-3 h-3 text-red-400" />}
                      </div>
                   </div>
                   {participants.map(p => <VideoTile key={p.id} participant={p} />)}
                </div>
             )}
          </div>

          <div className="h-24 flex items-center justify-center gap-4 px-4 mb-2 shrink-0">
             {/* Reaction Bar */}
             <div className="bg-slate-800/80 backdrop-blur rounded-full px-4 py-2 flex gap-2 border border-slate-700 mr-2">
                <button onClick={() => triggerReaction('❤️')} className="p-2 hover:bg-slate-700 rounded-full text-xl transition-transform hover:scale-125">❤️</button>
                <button onClick={() => triggerReaction('🙏')} className="p-2 hover:bg-slate-700 rounded-full text-xl transition-transform hover:scale-125">🙏</button>
                <button onClick={() => triggerReaction('🔥')} className="p-2 hover:bg-slate-700 rounded-full text-xl transition-transform hover:scale-125">🔥</button>
                <button onClick={() => triggerReaction('🕊️')} className="p-2 hover:bg-slate-700 rounded-full text-xl transition-transform hover:scale-125">🕊️</button>
             </div>

             <div className="bg-slate-800 rounded-full px-6 py-3 flex items-center gap-3 shadow-2xl border border-slate-700">
                <button onClick={() => setIsMicOn(!isMicOn)} className={`p-3 rounded-full transition-all ${isMicOn ? 'bg-slate-600 hover:bg-slate-500' : 'bg-red-500 hover:bg-red-600'}`}>{isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}</button>
                <button onClick={() => setIsCamOn(!isCamOn)} className={`p-3 rounded-full transition-all ${isCamOn ? 'bg-slate-600 hover:bg-slate-500' : 'bg-red-500 hover:bg-red-600'}`}>{isCamOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}</button>
                <button onClick={() => setIsHandRaised(!isHandRaised)} className={`p-3 rounded-full transition-all ${isHandRaised ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'}`}><Hand className="w-5 h-5" /></button>
                <button onClick={() => setIsScreenSharing(!isScreenSharing)} className={`p-3 rounded-full transition-all ${isScreenSharing ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'}`}><Monitor className="w-5 h-5" /></button>
                <button onClick={() => setIsChatOpen(!isChatOpen)} className={`p-3 rounded-full transition-all ${isChatOpen ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'}`}><MessageSquare className="w-5 h-5" /></button>
                <div className="w-px h-8 bg-slate-600 mx-2"></div>
                <button onClick={onLeaveRoom} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium flex items-center gap-2 transition-colors"><PhoneOff className="w-4 h-4" /><span className="hidden sm:inline">End</span></button>
             </div>
          </div>
        </div>

        <div className={`fixed right-0 top-0 h-full w-80 bg-white shadow-2xl transition-transform duration-300 z-50 flex flex-col border-l border-slate-200 ${isChatOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="h-14 px-4 flex items-center justify-between border-b border-slate-100 bg-slate-50 shrink-0">
             <h3 className="font-semibold text-slate-800 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-indigo-600" /> Live Chat</h3>
             <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500"><X className="w-4 h-4" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
             {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.senderId === 'me' ? 'items-end' : 'items-start'}`}>
                   <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-700">{msg.senderName}</span>
                      <span className="text-[10px] text-slate-400">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                   </div>
                   <div className={`px-4 py-2 rounded-2xl text-sm max-w-[85%] ${msg.senderId === 'me' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'}`}>{msg.text}</div>
                </div>
             ))}
             <div ref={chatEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 shrink-0">
             <div className="relative">
                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Say something..." className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-full text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                <button type="submit" disabled={!newMessage.trim()} className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50"><Send className="w-4 h-4" /></button>
             </div>
          </form>
        </div>
      </div>
    );
  }

  // ================= LIST VIEW =================
  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-8">
           <div>
             <h1 className="text-3xl font-bold text-slate-900 mb-2">Live Sanctuary</h1>
             <p className="text-slate-500">Real-time prayer, worship, and teaching.</p>
           </div>
           <button onClick={onCreateRoom} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"><Plus className="w-5 h-5" /> Go Live</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map(room => (
            <div key={room.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer" onClick={() => onJoinRoom(room)}>
              {/* Thumbnail */}
              <div className="h-40 bg-slate-800 relative">
                 <img src={`https://source.unsplash.com/random/800x600/?worship,church,light&sig=${room.id}`} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" alt="" />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
                 
                 <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> LIVE
                    </span>
                    <span className="bg-black/40 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 border border-white/10">
                      <Users className="w-3 h-3" /> {room.participants}
                    </span>
                 </div>
                 
                 <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-lg leading-tight mb-1 truncate">{room.title}</h3>
                    <div className="flex items-center gap-2 text-slate-300 text-xs">
                       <span className="truncate">with {room.host}</span>
                       {room.hostVerified && <BadgeCheck className="w-3 h-3 text-blue-400" />}
                    </div>
                 </div>
                 
                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[2px]">
                    <div className="bg-white/20 backdrop-blur-md rounded-full p-3 border border-white/40">
                       <PlayCircle className="w-8 h-8 text-white fill-white/20" />
                    </div>
                 </div>
              </div>

              {/* Details */}
              <div className="p-4 flex justify-between items-center">
                 <div className="flex gap-2">
                   {room.tags.slice(0, 2).map(t => (
                      <span key={t} className="text-[10px] font-medium bg-slate-50 text-slate-500 px-2 py-1 rounded-md uppercase tracking-wide">{t.replace('#', '')}</span>
                   ))}
                 </div>
                 <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                   <Clock className="w-3 h-3" /> {room.durationMinutes}m
                 </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AudioRooms;
