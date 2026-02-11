import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Camera, Sparkles, Eye, EyeOff, ArrowLeft } from 'lucide-react';

interface AuthProps {
  onLogin: (user: { name: string; email: string; bio?: string; profileImage?: string }) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [showIntro, setShowIntro] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API authentication delay
    setTimeout(() => {
      onLogin({
        name: name || email.split('@')[0] || 'Prayer Warrior',
        email,
        bio: bio || 'Here to pray and be prayed for.',
        profileImage: profileImage || undefined
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      alert(`If an account exists for ${email}, a reset link has been sent to your inbox.`);
      setIsLoading(false);
      setIsForgotPassword(false);
    }, 1500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setProfileImage(url);
    }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        name: 'Google User',
        email: 'google@example.com',
        bio: 'Joined via Google',
        profileImage: 'https://ui-avatars.com/api/?name=Google+User&background=random'
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="relative min-h-screen bg-slate-50 overflow-hidden">
      
      {/* ==================== INTRO VIDEO SCREEN ==================== */}
      <div 
        className={`fixed inset-0 z-50 bg-slate-900 text-white transition-transform duration-1000 cubic-bezier(0.8, 0, 0.2, 1) ${showIntro ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className="absolute inset-0">
          <video 
            className="w-full h-full object-cover opacity-80"
            autoPlay 
            muted 
            loop 
            playsInline
            poster="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2500"
          >
            {/* High quality cinematic nature video simulating Veo generation */}
            <source src="https://assets.mixkit.co/videos/preview/mixkit-foggy-forest-sunrise-1207-large.mp4" type="video/mp4" />
          </video>
          {/* Spiritual Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-indigo-900/30 to-transparent" />
        </div>
        
        <div className="relative h-full flex flex-col justify-end p-8 pb-20 max-w-md mx-auto">
          <div className={`transition-all duration-1000 delay-300 transform ${showIntro ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
               <span className="font-bold text-2xl tracking-tighter text-white">LUP</span>
            </div>
            
            <h1 className="text-6xl font-black tracking-tighter mb-6 text-white leading-[0.9]">
              Find<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-white">Peace.</span>
            </h1>
            
            <p className="text-lg text-slate-200 mb-10 leading-relaxed font-medium">
              Join a global community of believers. Share your heart, lift others up, and experience the power of prayer.
            </p>
            
            <button 
              onClick={() => setShowIntro(false)}
              className="w-full bg-white text-indigo-900 font-bold py-4 rounded-2xl shadow-xl hover:bg-indigo-50 active:scale-95 transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
            >
              <span className="relative z-10 text-lg">Get Started</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
            </button>
            
            <p className="text-center mt-6 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
              Trusted by 10,000+ Prayer Warriors
            </p>
          </div>
        </div>
      </div>

      {/* ==================== AUTH FORM LAYER ==================== */}
      <div className={`min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-all duration-1000 delay-500 ${showIntro ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        
        {/* Animated Blob Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
           <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
           <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
           <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <style>{`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob { animation: blob 7s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-4000 { animation-delay: 4s; }
        `}</style>

        <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          <div className="flex justify-center">
             <div className="bg-indigo-600 text-white p-3 rounded-xl text-2xl font-bold shadow-lg shadow-indigo-200">LUP</div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
            {isForgotPassword ? 'Reset Password' : (isLogin ? 'Welcome back' : 'Join the community')}
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-2xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-white/50">
            
            {isForgotPassword ? (
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div className="text-center mb-6">
                  <p className="text-sm text-slate-600">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Email address</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow outline-none"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-200 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 transition-all duration-200 transform active:scale-[0.98]"
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>

                <button
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                  className="w-full flex justify-center items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Sign In
                </button>
              </form>
            ) : (
              <>
                <button 
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 rounded-xl shadow-sm bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors mb-6 transform active:scale-[0.98] duration-150"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase tracking-wide font-semibold">
                    <span className="px-2 bg-slate-50 text-slate-400">Or continue with email</span>
                  </div>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  {!isLogin && (
                    <>
                      <div className="flex justify-center mb-4">
                        <div className="relative group">
                          <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                            {profileImage ? (
                              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                              <User className="h-10 w-10 text-slate-300" />
                            )}
                          </div>
                          <label className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-2 cursor-pointer hover:bg-indigo-700 transition-colors text-white shadow-lg group-hover:scale-110 duration-200">
                            <Camera className="w-4 h-4" />
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700">Full Name</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="mt-1 block w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow outline-none"
                          placeholder="John Doe"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Bio (Optional)</label>
                        <textarea
                          rows={2}
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          className="mt-1 block w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow outline-none resize-none"
                          placeholder="Tell us a bit about your spiritual journey..."
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-700">Email address</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-10 px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow outline-none"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700">Password</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-10 pr-10 px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow outline-none"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {isLogin && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setIsForgotPassword(true)}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-200 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 transition-all duration-200 transform active:scale-[0.98]"
                  >
                    {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                    {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-colors"
                  >
                    {isLogin ? 'New here? Create an account' : 'Already have an account? Sign in'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};