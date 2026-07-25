import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, FileText, RotateCcw } from 'lucide-react';

interface PolicyProps {
  type: 'privacy' | 'terms' | 'refund';
}

export const PolicyPages: React.FC<PolicyProps> = ({ type }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 font-hind space-y-6">
      
      {type === 'privacy' && (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-[#0A66C2]">
            <ShieldCheck className="w-6 h-6" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              প্রাইভেসি পলিসি (Privacy Policy)
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            ঘরের ডাক্তার (Ghorer Daktar) প্ল্যাটফর্মে আপনার ব্যক্তিগত ও মেডিকেল তথ্যের নিরাপত্তা ও গোপনীয়তা রক্ষা করা আমাদের সর্বোচ্চ অগ্রাধিকার।
          </p>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white pt-2">১. তথ্য সংগ্রহ ও ব্যবহার</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            আমরা গ্রাহকের নাম, মোবাইল নম্বর, ঠিকানা এবং ডাক্তার বুকিংয়ের প্রয়োজনে শারীরিক সমস্যার বিবরণ সংগ্রহ করি। এই তথ্য কেবলমাত্র অর্ডার ডেলিভারি ও ডাক্তার কনসালটেশনের সুবিধার জন্য ব্যবহৃত হয়।
          </p>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white pt-2">২. তথ্যের নিরাপত্তা</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            আপনার কোনো ব্যক্তিগত তথ্য কোনো তৃতীয় পক্ষের নিকট বিক্রয় বা শেয়ার করা হয় না।
          </p>
        </div>
      )}

      {type === 'terms' && (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-[#2EBD59]">
            <FileText className="w-6 h-6" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              শর্তাবলী (Terms & Conditions)
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            ঘরের ডাক্তার ওয়েবসাইট ব্যবহারের মাধ্যমে আপনি নিম্নে উল্লেখিত শর্তাবলী মেনে চলছেন বলে গণ্য হবে।
          </p>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white pt-2">১. ডাক্তার কনসালটেশন সেবা</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            অনলাইন ডাক্তার কনসালটেশন সাধারণ স্বাস্থ্য সমস্যা ও ফলো-আপের জন্য প্রযোজ্য। অত্যন্ত জরুরি বা আশঙ্কাজনক অবস্থায় নিকটস্থ হাসপাতালে সরাসরি যোগাযোগ করার অনুরোধ করা যাচ্ছে।
          </p>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white pt-2">২. অর্ডার কনফার্মেশন</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            ফোন কলের মাধ্যমে গ্রাহকের সাথে কথা বলে অর্ডার কনফার্ম করার পর ডেলিভারি কার্যক্রম শুরু হয়।
          </p>
        </div>
      )}

      {type === 'refund' && (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-rose-500">
            <RotateCcw className="w-6 h-6" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              রিফান্ড ও রিটার্ন পলিসি (Refund & Return Policy)
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            গ্রাহক সন্তুষ্টি আমাদের মূল চালিকাশক্তি। পণ্য প্রাপ্তির সময় কোনো ত্রুটি দেখা দিলে সহজ রিটার্ন সুবিধা প্রদান করা হয়।
          </p>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white pt-2">১. ৭ দিনের রিটার্ন গ্যারান্টি</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            পণ্য ক্ষতিগ্রস্ত বা অরিজিনাল না মনে হলে ডেলিভারি পাওয়ার ৭ দিনের মধ্যে আমাদের কাস্টমার কেয়ারে যোগাযোগ করে রিপ্লেসমেন্ট বা ফুল রিফান্ড নেওয়া যাবে।
          </p>
        </div>
      )}

    </div>
  );
};
