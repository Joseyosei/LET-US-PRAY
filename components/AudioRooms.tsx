import React, { useState, useEffect, useRef } from 'react';
import { AudioRoom } from '../types';
import { Mic, MicOff, Users, Headphones, Volume2, Hand } from 'lucide-react';

interface AudioRoomsProps {
  activeRoom: AudioRoom | null;
  onJoinRoom: (room: AudioRoom) => void;
  onLeaveRoom: () => void;
}

const ROOMS_DATA: AudioRoom[] = [
  { id: '1', title: 'Morning Devotion & Praise', host: 'Pastor John', participants: 142, tags: ['#Worship', '#Morning'], isLive: true },
  { id: '2', title: 'Global Healing Circle', host: 'Sarah M.', participants: 56, tags: ['#Healing', '#Intercession'], isLive: true },
  { id: '3', title: 'Youth Bible Study', host: 'NextGen Ministry', participants: 28, tags: ['#Youth', '#Study'], isLive: true },
];

const AudioRooms: React.FC<AudioRoomsProps> = ({ activeRoom, onJoinRoom, onLeaveRoom }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0); // For visualizing mic
  const intervalRef = useRef<number | null>(null);

  // Simulate mic activity
  useEffect(() => {
    if (!isMuted && activeRoom) {
      intervalRef.current = window.setInterval(() => {
        setVolumeLevel(Math.random() * 100);
      }, 100);
    } else {
      setVolumeLevel(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isMuted, activeRoom]);

  if (activeRoom) {
    return (
      <div className="flex-1 bg-slate-900 text-white p-6 flex flex-col items-center justify-between relative overflow-hidden">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/50 to-slate-900 pointer-events-none"></div>
        
        {/* Header */}
        <div className="w-full max-w-4xl flex justify-between items-center z-10">
           <button onClick={onLeaveRoom} className="text-slate-400 hover:text-white transition-colors">
             &larr; Leave Quietly
           </button>
           <div className="text-center">
             <h2 className="text-xl font-bold">{activeRoom.title}</h2>
             <span className="text-sm text-indigo-300">Hosted by {activeRoom.host}</span>
           </div>
           <div className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 animate-pulse">
             <span className="w-2 h-2 bg-red-500 rounded-full"></span> LIVE
           </div>
        </div>

        {/* Speakers Grid */}
        <div className="w-full max-w-4xl flex-1 flex flex-col items-center justify-center py-10 z-10 gap-8">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Host */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-24 h-24 rounded-full bg-indigo-500 border-4 border-indigo-400/30 flex items-center justify-center relative">
                   <span className="text-2xl font-bold">JD</span>
                   <div className="absolute -bottom-1 -right-1 bg-white text-indigo-600 rounded-full p-1">
                     <Mic className="w-4 h-4" />
                   </div>
                </div>
                <span className="font-medium text-sm">Pastor John (Host)</span>
              </div>

              {/* Participants */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col items-center gap-2 opacity-70">
                   <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center">
                      <span className="text-xl font-bold text-slate-400">P{i}</span>
                   </div>
                   <span className="font-medium text-sm text-slate-400">User {i}</span>
                </div>
              ))}
           </div>

           <div className="bg-slate-800/50 rounded-full px-6 py-2 text-sm text-slate-300 flex items-center gap-2">
              <Users className="w-4 h-4" />
              {activeRoom.participants} Listening...
           </div>
        </div>

        {/* Controls */}
        <div className="w-full max-w-md bg-slate-800 rounded-2xl p-4 flex items-center justify-around z-10 shadow-xl border border-slate-700">
           <button 
             onClick={() => setIsMuted(!isMuted)}
             className={`p-4 rounded-full transition-all ${isMuted ? 'bg-slate-700 text-white' : 'bg-white text-indigo-600 ring-4 ring-indigo-500/30'}`}
           >
             {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
           </button>
           
           {/* Mic Visualizer when unmuted */}
           {!isMuted && (
             <div className="flex gap-1 items-end h-8">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-1 bg-green-400 rounded-full transition-all duration-75" style={{ height: `${Math.max(10, volumeLevel * Math.random())}%` }}></div>
                ))}
             </div>
           )}

           <button 
             onClick={() => setIsHandRaised(!isHandRaised)}
             className={`p-4 rounded-full transition-all ${isHandRaised ? 'bg-yellow-500 text-black' : 'bg-slate-700 text-white'}`}
           >
             <Hand className="w-6 h-6" />
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Live Prayer Rooms</h2>
          <p className="text-slate-600">Join real-time audio spaces to pray and worship together.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ROOMS_DATA.map(room => (
            <div key={room.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                 <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                   <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span> LIVE
                 </span>
                 <span className="text-slate-400 text-xs flex items-center gap-1">
                   <Users className="w-3 h-3" /> {room.participants}
                 </span>
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-1">{room.title}</h3>
              <p className="text-sm text-slate-500 mb-4">Hosted by {room.host}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {room.tags.map(tag => (
                  <span key={tag} className="text-xs bg-slate-50 text-slate-500 px-2 py-1 rounded">{tag}</span>
                ))}
              </div>

              <button 
                onClick={() => onJoinRoom(room)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Headphones className="w-4 h-4" />
                Join Room
              </button>
            </div>
          ))}

          {/* Create Room Card */}
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-indigo-300 transition-colors cursor-pointer bg-slate-50/50">
             <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3">
               <Volume2 className="w-6 h-6" />
             </div>
             <h3 className="font-semibold text-slate-900">Start a Room</h3>
             <p className="text-sm text-slate-500 mt-1">Gather others for prayer</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioRooms;