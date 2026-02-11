import React, { useState } from 'react';
import { User as UserIcon, Bell, Shield, LogOut, Save, Mail, Globe, Lock, Loader2, BadgeCheck, Users } from 'lucide-react';
import { User, UserRole } from '../types';

interface SettingsViewProps {
  user: User;
  onUpdateUser: (data: Partial<User>) => void;
  onLogout: () => void;
}

const Toggle: React.FC<{ label: string; description?: string; checked: boolean; onChange: () => void }> = ({ 
  label, description, checked, onChange 
}) => (
  <div className="flex items-center justify-between py-4">
    <div>
      <h4 className="text-sm font-medium text-slate-900">{label}</h4>
      {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
    </div>
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? 'bg-indigo-600' : 'bg-slate-200'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

export const SettingsView: React.FC<SettingsViewProps> = ({ user, onUpdateUser, onLogout }) => {
  const [formData, setFormData] = useState({ 
    name: user.name, 
    email: user.email,
    role: user.role,
    isVerified: user.isVerified || false
  });
  const [isSaving, setIsSaving] = useState(false);
  const [notifications, setNotifications] = useState({
    prayerRequests: true,
    partners: true,
    reminders: false
  });
  const [privacy, setPrivacy] = useState({
    showLocation: true,
    publicProfile: true
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      onUpdateUser(formData);
      setIsSaving(false);
    }, 800);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
          <p className="text-slate-600">Manage your account preferences and profile.</p>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-slate-900">Public Profile</h3>
          </div>
          <div className="p-6">
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xl font-bold border-2 border-white shadow-sm">
                  {formData.name.charAt(0)}
                </div>
                <div className="space-y-1">
                  <button type="button" className="text-sm text-indigo-600 font-medium hover:text-indigo-700 block">
                    Change Avatar
                  </button>
                  <div className="text-xs text-slate-500">
                    Role: <span className="font-semibold capitalize">{user.role.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Display Name</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Admin Tools - Role Management */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                 <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                   <Shield className="w-4 h-4 text-slate-500" />
                   Admin Role Assignment (Demo)
                 </h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <label className="block text-xs font-medium text-slate-500 mb-1">User Role</label>
                     <select 
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value as UserRole})}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                     >
                       <option value="user">User</option>
                       <option value="prayer_leader">Prayer Leader</option>
                       <option value="church">Church Organization</option>
                       <option value="moderator">Moderator</option>
                       <option value="admin">Administrator</option>
                     </select>
                   </div>
                   <div className="flex items-center pt-5">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={formData.isVerified}
                          onChange={(e) => setFormData({...formData, isVerified: e.target.checked})}
                          className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-slate-700 flex items-center gap-1">
                          Verified Account <BadgeCheck className="w-3 h-3 text-blue-500" />
                        </span>
                      </label>
                   </div>
                 </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-indigo-700 transition-colors disabled:opacity-70"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-slate-900">Notifications</h3>
          </div>
          <div className="p-6 divide-y divide-slate-100">
            <Toggle 
              label="New Prayer Requests" 
              description="Notify me when someone posts a new prayer request in my topics."
              checked={notifications.prayerRequests}
              onChange={() => setNotifications(prev => ({ ...prev, prayerRequests: !prev.prayerRequests }))}
            />
            <Toggle 
              label="Prayer Partners" 
              description="Receive updates from your prayer connections."
              checked={notifications.partners}
              onChange={() => setNotifications(prev => ({ ...prev, partners: !prev.partners }))}
            />
            <Toggle 
              label="Daily Reminders" 
              description="Get a daily notification to take a moment for prayer."
              checked={notifications.reminders}
              onChange={() => setNotifications(prev => ({ ...prev, reminders: !prev.reminders }))}
            />
          </div>
        </div>

        {/* Privacy */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-slate-900">Privacy & Security</h3>
          </div>
          <div className="p-6 divide-y divide-slate-100">
             <Toggle 
              label="Show Location" 
              description="Display your city/country on your prayer posts."
              checked={privacy.showLocation}
              onChange={() => setPrivacy(prev => ({ ...prev, showLocation: !prev.showLocation }))}
            />
            <Toggle 
              label="Public Profile" 
              description="Allow other community members to find your profile."
              checked={privacy.publicProfile}
              onChange={() => setPrivacy(prev => ({ ...prev, publicProfile: !prev.publicProfile }))}
            />
             <div className="py-4 flex items-center justify-between">
               <div>
                  <h4 className="text-sm font-medium text-slate-900">Change Password</h4>
                  <p className="text-xs text-slate-500 mt-1">Update your login credentials.</p>
               </div>
               <button className="text-sm text-indigo-600 font-medium hover:underline">Update</button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="border border-red-200 rounded-xl overflow-hidden bg-red-50/50">
           <div className="p-6">
             <h3 className="text-red-800 font-semibold mb-2">Account Actions</h3>
             <div className="flex items-center justify-between">
               <p className="text-sm text-red-600/80">Sign out of your account on this device.</p>
               <button 
                onClick={onLogout}
                className="flex items-center gap-2 bg-white border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
               >
                 <LogOut className="w-4 h-4" /> Sign Out
               </button>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};