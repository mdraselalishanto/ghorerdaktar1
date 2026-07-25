import React from 'react';
import { useApp } from '../context/AppContext';
import { Stethoscope, ShieldCheck, Heart, Award, Users, Truck } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { siteSettings } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12 font-hind">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-[#0A66C2] uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 px-3.5 py-1 rounded-full">
          About Ghorer Daktar
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          ঘরের ডাক্তার (Ghorer Daktar) — আপনার স্বাস্থ্যসেবায় নিবেদিত
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
          আমাদের মূল লক্ষ্য প্রতিটি বাংলাদেশী পরিবারকে ভেজালমুক্ত প্রিমিয়াম অর্গানিক খাদ্যদ্রব্য, ডিজিটাল স্বাস্থ্য প্রযুক্তি ও নিবন্ধিত ডাক্তারদের কাছে দ্রুততম সময়ে পৌঁছানোর পথ সুগম করা।
        </p>
      </div>

      {/* Story & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            আমাদের লক্ষ্য ও উদ্দেশ্য (Our Mission)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            বাংলাদেশে বর্তমান সময়ে খাঁটি ও কেমিক্যাল মুক্ত খাবার খুঁজে পাওয়া এক বড় চ্যালেঞ্জ। সুন্দরবনের প্রাকৃতিক মধু, প্রথম চাপের কালোজিরা তেল ও প্রিমিয়াম এক্সট্রা ভার্জিন অলিভ অয়েলের মাধ্যমে আমরা মানুষের রোগ প্রতিরোধ ক্ষমতা বৃদ্ধির উদ্যোগ নিয়েছি।
          </p>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            পাশাপাশি, জরুরি কিংবা সাধারণ স্বাস্থ্য সমস্যায় গ্রামে বা শহরে ঘরে বসেই নিবন্ধিত MBBS ও FCPS ডাক্তারদের পরামর্শ গ্রহণের সুবিধা প্রদান করা হচ্ছে।
          </p>
        </div>

        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80"
            alt="Ghorer Daktar Healthcare Team"
            referrerPolicy="no-referrer"
            className="w-full h-72 object-cover rounded-2xl shadow-md"
          />
        </div>
      </div>

      {/* Stats Counter */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50 dark:bg-blue-950/40 p-6 rounded-2xl text-center border border-blue-200 dark:border-blue-800">
          <Users className="w-8 h-8 text-[#0A66C2] mx-auto mb-2" />
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-poppins">১৫,০০০+</h3>
          <p className="text-xs text-slate-500 font-bold">সুখী গ্রাহক ও রোগী</p>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-950/40 p-6 rounded-2xl text-center border border-emerald-200 dark:border-emerald-800">
          <Award className="w-8 h-8 text-[#2EBD59] mx-auto mb-2" />
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-poppins">১০০%</h3>
          <p className="text-xs text-slate-500 font-bold">খাঁটি অর্গানিক গ্যারান্টি</p>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/40 p-6 rounded-2xl text-center border border-amber-200 dark:border-amber-800">
          <Stethoscope className="w-8 h-8 text-amber-600 mx-auto mb-2" />
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-poppins">৫০+</h3>
          <p className="text-xs text-slate-500 font-bold">BMDC রেজিস্টার্ড ডাক্তার</p>
        </div>

        <div className="bg-purple-50 dark:bg-purple-950/40 p-6 rounded-2xl text-center border border-purple-200 dark:border-purple-800">
          <Truck className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-poppins">৬৪ জেলায়</h3>
          <p className="text-xs text-slate-500 font-bold">হোম ডেলিভারি সার্ভিস</p>
        </div>
      </div>

    </div>
  );
};
