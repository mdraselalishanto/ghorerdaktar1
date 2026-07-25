import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShoppingBag,
  Stethoscope,
  MessageSquare,
  ShieldCheck,
  Truck,
  Award,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { language, siteSettings, setActivePage, setSelectedCategory } = useApp();

  return (
    <section className="relative overflow-hidden bg-white dark:bg-slate-900 py-12 lg:py-16 border-b border-[#E2E8F0] dark:border-slate-800">
      {/* Background Soft Blue and Green Gradient Accent Orbs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#0A66C2]/10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-[#22C55E]/10 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Hero Content Left */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-blue-900 text-[#0A66C2] dark:text-blue-300 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold shadow-xs">
              <Sparkles className="w-4 h-4 text-[#22C55E]" />
              <span>{language === 'bn' ? 'বাংলাদেশের নং ১ অনলাইন হেলথকেয়ার সেবা' : '#1 Online Healthcare in Bangladesh'}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A66C2] dark:text-white leading-tight font-hind tracking-tight">
              {siteSettings.heroHeadline || 'আপনার পরিবারের স্বাস্থ্যসেবার বিশ্বস্ত ঠিকানা'}
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-[#1E293B] dark:text-slate-300 leading-relaxed font-hind max-w-2xl mx-auto lg:mx-0 font-normal">
              {siteSettings.heroSubheadline || 'Organic Products, Medical Products এবং MBBS Doctor Consultation — সবকিছু এক প্ল্যাটফর্মে।'}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              {/* Primary Blue Button -> Green hover */}
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setActivePage('shop');
                }}
                className="flex items-center gap-2.5 bg-[#0A66C2] hover:bg-[#22C55E] text-white px-6 py-3.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-colors duration-200 text-sm sm:text-base"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>{language === 'bn' ? 'Shop Now (পণ্য দেখুন)' : 'Shop Now'}</span>
              </button>

              {/* Primary Green Button -> Dark Green hover */}
              <button
                onClick={() => setActivePage('doctors')}
                className="flex items-center gap-2.5 bg-[#22C55E] hover:bg-emerald-600 text-white px-6 py-3.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-colors duration-200 text-sm sm:text-base"
              >
                <Stethoscope className="w-5 h-5" />
                <span>{language === 'bn' ? 'Talk to Doctor (ডাক্তার দেখান)' : 'Talk to Doctor'}</span>
              </button>

              {/* Secondary WhatsApp Button */}
              <a
                href={`https://wa.me/${siteSettings.whatsappNumber}?text=Hello%20Ghorer%20Daktar,%20I%20need%20healthcare%20assistance`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-white border-2 border-[#0A66C2] text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white px-5 py-3 rounded-xl font-bold transition-colors duration-200 text-sm sm:text-base"
              >
                <MessageSquare className="w-5 h-5" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-[#E2E8F0] dark:border-slate-800 grid grid-cols-3 gap-2 sm:gap-4 text-left">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-[#0A66C2] dark:text-blue-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-[#1E293B] dark:text-white">১০০% অর্গানিক</p>
                  <p className="text-[10px] sm:text-xs text-slate-500">ল্যাব টেস্টেড খাঁটি পণ্য</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 text-[#22C55E] dark:text-emerald-400 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-[#1E293B] dark:text-white">MBBS ডাক্তার</p>
                  <p className="text-[10px] sm:text-xs text-slate-500">নিবন্ধিত বিশেষজ্ঞ</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-[#0A66C2] shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-[#1E293B] dark:text-white">সমগ্র বাংলাদেশে</p>
                  <p className="text-[10px] sm:text-xs text-slate-500">হোম ডেলিভারি</p>
                </div>
              </div>
            </div>

          </div>

          {/* Hero Illustration Right */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md lg:max-w-none">
              
              {/* Main Card Graphic */}
              <div className="relative z-10 bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-3xl shadow-xl border border-[#E2E8F0] dark:border-slate-700">
                <img
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80"
                  alt="Ghorer Daktar Healthcare Family"
                  referrerPolicy="no-referrer"
                  className="w-full h-64 sm:h-80 object-cover rounded-2xl shadow-xs"
                />

                {/* Floating Doctor Badge Overlay */}
                <div className="absolute -bottom-4 -left-4 bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-2xl shadow-lg border border-[#E2E8F0] dark:border-slate-700 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#22C55E] flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1E293B] dark:text-white">২৪/৭ অনলাইন কনসালটেশন</p>
                    <p className="text-[10px] text-[#22C55E] font-bold">১০,০০০+ বিশ্বস্ত রোগী</p>
                  </div>
                </div>

                {/* Floating Fast Delivery Badge */}
                <div className="absolute -top-4 -right-4 bg-[#0A66C2] text-white p-3.5 rounded-2xl shadow-lg flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#22C55E]" />
                  <div className="text-xs font-bold">
                    <p>ক্যাশ অন ডেলিভারি</p>
                    <p className="text-[10px] text-blue-100">ঢাকার ভেতরে ২৪ ঘণ্টায়</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
