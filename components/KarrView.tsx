
import React, { useState } from 'react';
import { 
  ArrowLeft, Bell, Clock, MapPin, Calendar, CreditCard, 
  ChevronRight, Car, Receipt, Plus, Home, User
} from 'lucide-react';

const COLORS = {
  lime: '#D2F669',
  purple: '#5D5D8D',
  darkPurple: '#46467A',
  teal: '#6CD3D3',
  bg: '#FDFDFD'
};

interface KarrViewProps {
  userName: string;
  userAvatar?: string;
}

export const KarrView: React.FC<KarrViewProps> = ({ userName, userAvatar }) => {
  const [screen, setScreen] = useState<'dashboard' | 'payment'>('dashboard');

  // --- DASHBOARD SCREEN ---
  const Dashboard = () => (
    <div className="flex flex-col h-full bg-[#FDFDFD] relative overflow-hidden font-sans">
      {/* Header */}
      <div className="px-6 pt-8 pb-4 flex justify-between items-start">
        <div>
          <h2 className="text-sm text-slate-500 mb-1">Welcome,</h2>
          <h1 className="text-xl font-bold text-slate-900">{userName || 'Crystal Ashitey'}!</h1>
        </div>
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md">
          <img 
            src={userAvatar || "https://images.unsplash.com/photo-1580489944761-15a19d654956?fit=crop&w=200&h=200"} 
            alt="Profile" 
            className="w-full h-full object-cover" 
          />
        </div>
      </div>

      {/* Vehicle Tag */}
      <div className="px-6 mb-6">
        <div className="inline-flex items-center gap-2 bg-[#D2F669] px-4 py-2 rounded-full shadow-sm">
          <span className="font-bold text-slate-900 text-sm">#HN69 HTV</span>
        </div>
      </div>

      {/* Main Cards Scroll */}
      <div className="pl-6 mb-8 overflow-x-auto hide-scrollbar flex gap-4 pb-4">
        {/* Parking Tickets Card */}
        <div className="min-w-[280px] bg-[#5D5D8D] rounded-[2.5rem] p-6 text-white shadow-xl relative overflow-hidden group cursor-pointer transition-transform hover:scale-[1.02]" onClick={() => setScreen('payment')}>
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
           
           <h3 className="text-2xl font-bold mb-2">Parking tickets</h3>
           <p className="text-indigo-100 text-sm mb-12 max-w-[80%]">Create new tickets and check status of all tickets</p>
           
           <div className="flex items-center gap-3">
             <button className="bg-[#D2F669] text-slate-900 px-5 py-2 rounded-full text-xs font-bold hover:bg-[#c2e858] transition-colors">Add New</button>
             <button className="bg-white/20 px-5 py-2 rounded-full text-xs font-bold hover:bg-white/30 transition-colors">View All</button>
           </div>
        </div>

        {/* Tolls Card */}
        <div className="min-w-[280px] bg-[#6CD3D3] rounded-[2.5rem] p-6 text-white shadow-xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-10 -mt-10 blur-2xl"></div>
           
           <h3 className="text-2xl font-bold mb-2">Tolls</h3>
           <p className="text-teal-50 text-sm mb-12 max-w-[80%]">Create and manage all your toll charges easily</p>
           
           <div className="flex items-center gap-3">
             <button className="bg-[#FFD66B] text-slate-900 px-5 py-2 rounded-full text-xs font-bold">Add New</button>
           </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="flex-1 bg-[#2C2C4E] rounded-t-[2.5rem] p-6 text-white overflow-hidden flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
         <div className="flex justify-between items-center mb-6 px-2">
            <h3 className="font-bold text-lg">Recent Activity</h3>
            <div className="flex gap-1 bg-white/10 p-1 rounded-full">
               <button className="px-4 py-1.5 bg-[#D2F669] text-slate-900 rounded-full text-xs font-bold shadow-sm">Recent Activity</button>
            </div>
         </div>

         <div className="space-y-4 overflow-y-auto pb-20">
            {/* Activity Item 1 */}
            <div className="flex items-center gap-4 p-2 hover:bg-white/5 rounded-xl transition-colors cursor-pointer" onClick={() => setScreen('payment')}>
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                <Receipt className="w-6 h-6" />
              </div>
              <div className="flex-1">
                 <div className="flex justify-between items-start">
                   <h4 className="font-semibold text-sm">Vehicle Details</h4>
                   <span className="text-[10px] text-slate-400">Paid</span>
                 </div>
                 <p className="text-xs text-slate-300 mt-0.5">#HN69 HTV</p>
                 <p className="font-medium text-sm mt-1">Parking Ticket</p>
              </div>
            </div>

             {/* Activity Item 2 */}
             <div className="flex items-center gap-4 p-2 hover:bg-white/5 rounded-xl transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#D2F669] flex items-center justify-center text-slate-900">
                <Car className="w-6 h-6" />
              </div>
              <div className="flex-1">
                 <div className="flex justify-between items-start">
                   <h4 className="font-semibold text-sm">Toll Charge in Dartford</h4>
                   <span className="text-[10px] text-slate-400">July 14, 24</span>
                 </div>
                 <p className="text-xs text-slate-300 mt-0.5">Received by: Dartford Crossing</p>
              </div>
              <div className="w-1 h-8 border-l border-dashed border-slate-600 mx-1"></div>
            </div>

            {/* Activity Item 3 */}
            <div className="flex items-center gap-4 p-2 hover:bg-white/5 rounded-xl transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#D2F669] flex items-center justify-center text-slate-900">
                <Receipt className="w-6 h-6" />
              </div>
              <div className="flex-1">
                 <div className="flex justify-between items-start">
                   <h4 className="font-semibold text-sm">Parking Ticket, Croydon</h4>
                   <span className="text-[10px] text-slate-400">March 24, 24</span>
                 </div>
                 <p className="text-xs text-slate-300 mt-0.5">Received by: Croydon Council</p>
              </div>
            </div>
         </div>
      </div>
      
      {/* Bottom Nav Simulation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-full px-6 py-3 shadow-2xl flex items-center gap-8 border border-slate-100">
         <button className="text-indigo-600 flex flex-col items-center gap-1">
            <Home className="w-5 h-5" />
            <span className="text-[9px] font-bold">Home</span>
         </button>
         <button className="w-10 h-10 bg-[#5D5D8D] text-white rounded-full flex items-center justify-center shadow-lg transform -translate-y-2">
            <Plus className="w-6 h-6" />
         </button>
         <button className="text-slate-400 flex flex-col items-center gap-1">
            <User className="w-5 h-5" />
            <span className="text-[9px] font-medium">Profile</span>
         </button>
      </div>
    </div>
  );

  // --- PAYMENT SCREEN ---
  const PaymentScreen = () => (
    <div className="flex flex-col h-full bg-[#FDFDFD] font-sans">
      {/* Header */}
      <div className="bg-[#5D5D8D] text-white p-6 pb-8 rounded-b-[2rem] shadow-lg relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => setScreen('dashboard')}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold">Payment</h2>
        </div>
        
        <h3 className="text-sm font-medium text-indigo-100 mb-4">Parking charge</h3>
        
        {/* Ticket Card */}
        <div className="bg-[#E9FFBD] rounded-2xl p-4 text-slate-900 shadow-xl relative overflow-hidden">
           <div className="flex justify-between items-start mb-4 border-b border-slate-900/10 pb-3">
             <div className="flex items-center gap-2">
               <span className="text-xs font-semibold text-slate-500">PCN :</span>
               <span className="font-bold text-sm">CR6476377</span>
             </div>
             <div className="flex items-center gap-1 text-xs font-medium text-red-500">
               <MapPin className="w-3 h-3" /> Croydon Council
             </div>
           </div>

           <div className="flex justify-between items-center">
             <div className="space-y-2">
               <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                 <Clock className="w-3 h-3" /> 08:30 - 09:00
               </div>
               <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                 <Car className="w-3 h-3" /> HN66 HTV
               </div>
               <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                 <Calendar className="w-3 h-3" /> Thursday, 2 Dec, 2024
               </div>
             </div>
             
             <div className="text-right">
               <span className="text-3xl font-bold text-[#00A86B]">£34</span>
             </div>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        
        {/* Details Input */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-900">Details</label>
          <input 
            type="text" 
            defaultValue="Mr Kyle Mico"
            className="w-full p-4 bg-white border border-slate-100 rounded-2xl text-slate-700 text-sm font-medium shadow-sm outline-none focus:ring-2 focus:ring-[#5D5D8D]"
          />
        </div>

        {/* Payment Method */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-900">Payment Method</label>
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
             <span className="text-xs text-slate-400">Credit/Debit Card</span>
             <div className="flex items-center gap-3">
                <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center text-[8px] text-white font-bold italic">VISA</div>
                <span className="font-mono text-sm text-slate-700">XXXX XXXX XXXX 5599</span>
             </div>
          </div>
        </div>

        {/* Price Detail */}
        <div className="space-y-2">
           <label className="text-sm font-bold text-slate-900">Price Detail</label>
           <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex justify-between text-xs text-slate-500">
                 <span>Parking fine x1</span>
                 <span>£34.00</span>
              </div>
              <div className="border-t border-slate-100 pt-2 flex justify-between text-sm font-bold text-slate-900">
                 <span>Total Price</span>
                 <span>£34.00</span>
              </div>
              
              {/* Barcode Simulation */}
              <div className="pt-4 flex justify-center">
                 <div className="h-12 w-full max-w-[200px] flex items-end justify-between gap-[2px] opacity-70">
                    {[...Array(30)].map((_,i) => (
                      <div key={i} className="bg-slate-900" style={{width: Math.random() > 0.5 ? '2px' : '4px', height: '100%'}}></div>
                    ))}
                 </div>
              </div>
              <p className="text-center text-[10px] text-slate-400 pt-1">Send Receipt to my email after payment</p>
           </div>
        </div>

      </div>

      {/* Footer Action */}
      <div className="p-6 pt-0 bg-[#FDFDFD]">
        <button className="w-full py-4 bg-[#5D5D8D] text-white font-bold rounded-2xl shadow-xl hover:bg-[#4d4d75] transition-colors flex justify-center items-center">
          Pay Now
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-full w-full bg-[#FDFDFD] max-w-md mx-auto shadow-2xl overflow-hidden border-x border-slate-100">
      {screen === 'dashboard' ? <Dashboard /> : <PaymentScreen />}
    </div>
  );
};
