import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Mail,
  Lock,
  Phone,
  LogOut,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  LogIn,
  UserPlus,
  ShieldCheck,
  Package,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase';

export const AuthPage: React.FC = () => {
  const { language, currentUser, userLogin, userLogout, setActivePage, showToast } = useApp();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // User Dashboard State
  const [myOrders, setMyOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (currentUser?.uid) {
      fetchMyOrders();
    }
  }, [currentUser]);

  const fetchMyOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch(`/api/orders?userId=${currentUser?.uid}`);
      if (res.ok) {
        const data = await res.json();
        setMyOrders(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'লগইন করতে ব্যর্থ হয়েছেন');
      }

      userLogin(data.user, data.token);
    } catch (err: any) {
      setErrorMsg(err.message || 'একটি সমস্যা দেখা দিয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে');
      }

      showToast(language === 'bn' ? 'অ্যাাকাউন্ট তৈরি সফল হয়েছে! এখন লগইন করুন।' : 'Account created! Please sign in.');
      setAuthMode('login');
      setPassword('');
    } catch (err: any) {
      setErrorMsg(err.message || 'রেজিস্ট্রেশন প্রক্রিয়ায় সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const user = result.user;

      // Register or sync user in database
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          name: user.displayName || 'Ghorer Daktar User',
          email: user.email || `${user.uid}@ghorerdaktar.com`,
          phone: user.phoneNumber || '',
        })
      });

      const data = await res.json();
      if (res.ok && data.user) {
        userLogin(data.user);
      } else {
        // Log in if user already exists
        userLogin({
          id: 1,
          uid: user.uid,
          name: user.displayName || 'Google User',
          email: user.email || '',
          phone: user.phoneNumber || '',
          role: 'user'
        });
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Google দিয়ে সাইন ইন ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  // If user is already logged in, show User Profile Dashboard
  if (currentUser) {
    return (
      <div className="py-12 bg-slate-50 dark:bg-slate-900 min-h-[80vh] transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          {/* Header */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0A66C2] to-blue-500 text-white font-bold text-2xl flex items-center justify-center shadow-md">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-hind">
                      {currentUser.name}
                    </h2>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 px-2 py-0.5 rounded-full font-bold">
                      {currentUser.role === 'admin' ? 'অ্যাডমিন (Admin)' : 'গ্রাহক (Customer)'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-poppins mt-0.5">
                    {currentUser.email} {currentUser.phone && `• ${currentUser.phone}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => setActivePage('admin')}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-[#0A66C2] hover:bg-[#08529d] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-xs transition"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>এডমিন প্যানেল</span>
                  </button>
                )}
                <button
                  onClick={userLogout}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-600 dark:text-rose-300 px-4 py-2.5 rounded-xl font-bold text-xs border border-rose-200 dark:border-rose-800 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>লগআউট করুন</span>
                </button>
              </div>
            </div>
          </div>

          {/* User Orders History */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-hind flex items-center gap-2">
                <Package className="w-5 h-5 text-[#0A66C2]" />
                <span>আমার অর্ডার সমূহ (My Orders)</span>
              </h3>
              <button
                onClick={() => setActivePage('shop')}
                className="text-xs font-bold text-[#0A66C2] dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>কেনাকাটা করতে যান</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {loadingOrders ? (
              <p className="text-center py-8 text-xs text-slate-500">অর্ডার লোড হচ্ছে...</p>
            ) : myOrders.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 font-hind">
                  আপনার পূর্বে কোনো অর্ডার পাওয়া যায়নি
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  অর্গানিক ও মেডিকেল প্রডাক্ট ক্রয় করে সুস্বাস্থ্য বজায় রাখুন
                </p>
                <button
                  onClick={() => setActivePage('shop')}
                  className="bg-[#2EBD59] hover:bg-[#259b48] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition"
                >
                  শপ পেজে যান
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myOrders.map(ord => (
                  <div key={ord.id} className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                      <div>
                        <span className="text-xs font-bold font-poppins text-slate-900 dark:text-white">
                          অর্ডার ID: #{ord.id}
                        </span>
                        <p className="text-[11px] text-slate-500 font-poppins">
                          {new Date(ord.createdAt).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>

                      <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                        ord.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                        ord.status === 'Processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                        'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {ord.status}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600 dark:text-slate-400">
                        পেমেন্ট পদ্ধতি: <strong className="text-slate-900 dark:text-white uppercase">{ord.paymentMethod}</strong>
                      </span>
                      <span className="font-bold text-[#0A66C2] font-poppins text-sm">
                        মোট: ৳{ord.total}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-900 min-h-[85vh] flex items-center justify-center transition-colors px-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-xl">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/50 px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-800 text-[#0A66C2] dark:text-blue-300 text-xs font-bold mb-3">
            <ShieldCheck className="w-4 h-4 text-[#2EBD59]" />
            <span>ঘরের ডাক্তার হেলথ পোর্টাল</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-hind">
            {authMode === 'login' ? 'আপনার অ্যাকাউন্টে লগইন করুন' : 'নতুন অ্যাকাউন্ট তৈরি করুন'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-hind mt-1">
            {authMode === 'login'
              ? 'সহজ ও নিরাপদ কেনাকাটা এবং ডাক্তার কনসালটেশন সার্ভিস পেতে লগইন করুন'
              : 'ঘরের ডাক্তার পরিবারের সাথে যুক্ত হতে সঠিক তথ্য প্রদান করুন'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl mb-6">
          <button
            onClick={() => { setAuthMode('login'); setErrorMsg(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition ${
              authMode === 'login'
                ? 'bg-[#0A66C2] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>লগইন (Sign In)</span>
          </button>

          <button
            onClick={() => { setAuthMode('register'); setErrorMsg(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition ${
              authMode === 'register'
                ? 'bg-[#2EBD59] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>রেজিস্ট্রেশন (Sign Up)</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 bg-rose-50 dark:bg-rose-950/50 p-3 rounded-xl border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {authMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4" autoComplete="off">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                ইমেইল এড্রেস (Email)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  autoComplete="off"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your.email@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-poppins font-medium focus:ring-2 focus:ring-[#0A66C2] outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                পাসওয়ার্ড (Password)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  autoComplete="off"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-poppins font-medium focus:ring-2 focus:ring-[#0A66C2] outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#0A66C2] hover:bg-[#08529d] text-white py-3 rounded-xl font-bold text-xs shadow-md transition disabled:opacity-50 mt-2"
            >
              <span>{loading ? 'যাচাই করা হচ্ছে...' : 'লগইন করুন'}</span>
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {authMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                আপনার পূর্ণ নাম (Full Name)
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="উদাঃ সাদ্দাম হোসেন"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-poppins font-medium focus:ring-2 focus:ring-[#2EBD59] outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                ইমেইল এড্রেস (Email Address)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your.email@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-poppins font-medium focus:ring-2 focus:ring-[#2EBD59] outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                মোবাইল নম্বর (Mobile Number)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="01712345678"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-poppins font-medium focus:ring-2 focus:ring-[#2EBD59] outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                পাসওয়ার্ড তৈরি করুন (Password)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="কমপক্ষে ৬ সংখ্যার পাসওয়ার্ড"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-poppins font-medium focus:ring-2 focus:ring-[#2EBD59] outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#2EBD59] hover:bg-[#259b48] text-white py-3 rounded-xl font-bold text-xs shadow-md transition disabled:opacity-50 mt-2"
            >
              <span>{loading ? 'প্রসেসিং হচ্ছে...' : 'রেজিস্ট্রেশন সম্পন্ন করুন'}</span>
            </button>
          </form>
        )}

        {/* Divider & Google Sign-In */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
          </div>
          <span className="relative bg-white dark:bg-slate-800 px-3 text-[11px] text-slate-400 font-bold">
            অথবা (OR)
          </span>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-800 dark:text-white py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 font-bold text-xs shadow-xs transition"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Google দিয়ে কন্টিনিউ করুন</span>
        </button>

      </div>
    </div>
  );
};
