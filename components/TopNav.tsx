import React from 'react';
import { Search, Bell, Menu, X, ShieldCheck } from 'lucide-react';
import { User } from '../types';

interface TopNavProps {
  user: User;
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({ user, onToggleMobileMenu, isMobileMenuOpen }) => {
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
      <div className="flex items-center gap-3 sm:gap-6">
        <button className="relative text-slate-500 hover:text-indigo-600 transition-colors p-1.5 rounded-full hover:bg-slate-50">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

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