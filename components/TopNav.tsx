
import React, { useState } from 'react';
import { Search, Bell, Menu, X, ShieldCheck, Heart, Radio, MessageCircle } from 'lucide-react';
import { User } from '../types';

interface TopNavProps {
  user: User;
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

interface Notification {
  id: string;
  type: 'prayer' | 'live' | 'group';
  text: string;
  time: string;
  read: boolean;
  icon: React.ReactNode;
}

export const TopNav: React.FC<TopNavProps> = ({ user, onToggleMobileMenu, isMobileMenuOpen }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'prayer',
      text: "Grace L. prayed for your request.",
      time: "2m ago",
      read: false,
      icon: <Heart className="w-4 h-4 text-pink-500" />
    },
    {
      id: '2',
      type: 'live',
      text: "Pastor John is live: Morning Devotion",
      time: "5m ago",
      read: false,
      icon: <Radio className="w-4 h-4 text-red-500" />
    },
    {
      id: '3',
      type: 'group',
      text: "New message in 'Intercessors' group",
      time: "1h ago",
      read: true,
      icon: <MessageCircle className="w-4 h-4 text-indigo-500" />
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8">
      
      {/* Left: Mobile Menu & Search */}
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onToggleMobileMenu}
          className="md:hidden text-slate-600 p-1 hover:bg-slate-100 rounded-lg"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search prayers, people, or topics..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-3 sm:gap-6 relative">
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative text-slate-500 hover:text-indigo-600 transition-colors p-1.5 rounded-full ${showNotifications ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50'}`}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)}></div>
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                   <h3 className="font-semibold text-slate-900 text-sm">Notifications</h3>
                   {unreadCount > 0 && (
                     <button onClick={handleMarkAllRead} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                       Mark all read
                     </button>
                   )}
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${!n.read ? 'bg-blue-50/30' : ''}`}>
                       <div className="mt-1 flex-shrink-0">{n.icon}</div>
                       <div>
                         <p className={`text-sm ${!n.read ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>{n.text}</p>
                         <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                       </div>
                    </div>
                  ))}
                </div>
                <div className="p-2 text-center border-t border-slate-100">
                  <button className="text-xs font-medium text-slate-500 hover:text-slate-900">View All History</button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 leading-none flex items-center justify-end gap-1">
              {user.name}
              {user.isVerified && <ShieldCheck className="w-3 h-3 text-blue-500" />}
            </p>
            <p className="text-xs text-slate-500 mt-1 capitalize">{user.role.replace('_', ' ')}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold shadow-sm">
            {user.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};
