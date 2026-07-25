import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { initialCategories } from '../data/mockData';
import {
  Sparkles,
  ArrowRight,
  Leaf,
  Stethoscope,
  HeartPulse,
  ChevronRight,
  ShoppingBag
} from 'lucide-react';

export const CategorySection: React.FC = () => {
  const { language, setActivePage, setSelectedCategory, setSelectedSubcategory } = useApp();
  const [activeTab, setActiveTab] = useState<'organic' | 'medical' | 'doctor'>('organic');

  const organicCat = initialCategories.find(c => c.id === 'organic');
  const medicalCat = initialCategories.find(c => c.id === 'medical');

  return (
    <section className="py-12 bg-white dark:bg-slate-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-[#0A66C2] font-semibold text-xs tracking-wider uppercase mb-1">
              <Sparkles className="w-4 h-4 text-[#22C55E]" />
              <span>{language === 'bn' ? 'প্রধান ক্যাটাগরি সমূহ' : 'Main Categories'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1E293B] dark:text-white font-hind">
              {language === 'bn' ? 'আপনার প্রয়োজনীয় স্বাস্থ্যসেবা ক্যাটাগরি' : 'Explore Healthcare Categories'}
            </h2>
          </div>

          {/* Category Switcher Tabs */}
          <div className="flex bg-white dark:bg-slate-800 p-1.5 rounded-xl border border-[#E2E8F0] dark:border-slate-700 shadow-xs gap-1">
            <button
              onClick={() => setActiveTab('organic')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors duration-200 ${
                activeTab === 'organic'
                  ? 'bg-[#22C55E] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-[#0A66C2]'
              }`}
            >
              <Leaf className="w-4 h-4" />
              <span>1. Organic Products</span>
            </button>

            <button
              onClick={() => setActiveTab('medical')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors duration-200 ${
                activeTab === 'medical'
                  ? 'bg-[#0A66C2] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-[#0A66C2]'
              }`}
            >
              <HeartPulse className="w-4 h-4" />
              <span>2. Medical Products</span>
            </button>

            <button
              onClick={() => setActiveTab('doctor')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors duration-200 ${
                activeTab === 'doctor'
                  ? 'bg-[#22C55E] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-[#0A66C2]'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>3. Doctor Consultation</span>
            </button>
          </div>
        </div>

        {/* 3 Featured Category Cards Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* Card 1: Organic Products */}
          <div className="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 border border-[#E2E8F0] dark:border-slate-700 shadow-sm hover:shadow-md hover:border-[#22C55E] transition-all duration-200 hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#22C55E] flex items-center justify-center font-bold shadow-xs group-hover:bg-[#22C55E] group-hover:text-white transition-colors duration-200">
                <Leaf className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold bg-emerald-50 text-[#22C55E] dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-200">
                100% Organic
              </span>
            </div>
            <h3 className="text-xl font-bold text-[#1E293B] dark:text-white font-hind mb-2 group-hover:text-[#0A66C2] transition-colors">
              1. Organic Products (অর্গানিক ফুড)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
              সুন্দরবনের মধু, কালোজিরা, অলিভ অয়েল, ভেষজ চা ও প্রাকৃতিক হেলথ ফুড
            </p>
            <button
              onClick={() => {
                setSelectedCategory('organic');
                setSelectedSubcategory('all');
                setActivePage('shop');
              }}
              className="inline-flex items-center gap-2 bg-[#0A66C2] hover:bg-[#22C55E] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors duration-200 shadow-xs"
            >
              <span>Shop Organic</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Medical Products */}
          <div className="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 border border-[#E2E8F0] dark:border-slate-700 shadow-sm hover:shadow-md hover:border-[#22C55E] transition-all duration-200 hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0A66C2] flex items-center justify-center font-bold shadow-xs group-hover:bg-[#0A66C2] group-hover:text-white transition-colors duration-200">
                <HeartPulse className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold bg-blue-50 text-[#0A66C2] dark:bg-blue-950 dark:text-blue-300 px-2.5 py-1 rounded-full border border-blue-200">
                Medical Grade
              </span>
            </div>
            <h3 className="text-xl font-bold text-[#1E293B] dark:text-white font-hind mb-2 group-hover:text-[#0A66C2] transition-colors">
              2. Medical Products (মেডিকেল ডিভাইস)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
              বিপি মেশিন, ডায়াবেটিস কিট, থার্মোমিটার, স্কিনকেয়ার ও প্রয়োজনীয় ফার্স্ট এইড
            </p>
            <button
              onClick={() => {
                setSelectedCategory('medical');
                setSelectedSubcategory('all');
                setActivePage('shop');
              }}
              className="inline-flex items-center gap-2 bg-[#0A66C2] hover:bg-[#22C55E] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors duration-200 shadow-xs"
            >
              <span>Shop Medical Devices</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Doctor Consultation */}
          <div className="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 border border-[#E2E8F0] dark:border-slate-700 shadow-sm hover:shadow-md hover:border-[#22C55E] transition-all duration-200 hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#22C55E] flex items-center justify-center font-bold shadow-xs group-hover:bg-[#22C55E] group-hover:text-white transition-colors duration-200">
                <Stethoscope className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold bg-emerald-50 text-[#22C55E] dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-200">
                MBBS Doctors
              </span>
            </div>
            <h3 className="text-xl font-bold text-[#1E293B] dark:text-white font-hind mb-2 group-hover:text-[#0A66C2] transition-colors">
              3. Doctor Consultation (ডাক্তার দেখান)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
              মেডিসিন, শিশু রোগ ও চর্ম বিশেষজ্ঞ ডাক্তারদের সাথে সরাসরি ভিডিও কনসালটেশন
            </p>
            <button
              onClick={() => setActivePage('doctors')}
              className="inline-flex items-center gap-2 bg-[#22C55E] hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors duration-200 shadow-xs"
            >
              <span>Book Doctor Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Dynamic Subcategory Cards Display based on Tab */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-hind flex items-center gap-2">
              {activeTab === 'organic' && <Leaf className="w-5 h-5 text-emerald-500" />}
              {activeTab === 'medical' && <HeartPulse className="w-5 h-5 text-blue-500" />}
              {activeTab === 'doctor' && <Stethoscope className="w-5 h-5 text-emerald-500" />}
              <span>
                {activeTab === 'organic' && 'Organic Sub-Categories (অর্গানিক সাব-ক্যাটাগরি)'}
                {activeTab === 'medical' && 'Medical Sub-Categories (মেডিকেল সাব-ক্যাটাগরি)'}
                {activeTab === 'doctor' && 'Specialist Doctors Directory (বিশেষজ্ঞ ডাক্তার ডিরেক্টরি)'}
              </span>
            </h3>

            <button
              onClick={() => {
                if (activeTab === 'doctor') {
                  setActivePage('doctors');
                } else {
                  setSelectedCategory(activeTab);
                  setSelectedSubcategory('all');
                  setActivePage('shop');
                }
              }}
              className="text-xs font-bold text-[#0A66C2] dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>{language === 'bn' ? 'সবগুলো দেখুন' : 'View All'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Organic Subcategory Grid */}
          {activeTab === 'organic' && organicCat?.subcategories && (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
              {organicCat.subcategories.map(sub => (
                <button
                  key={sub.id}
                  onClick={() => {
                    setSelectedCategory('organic');
                    setSelectedSubcategory(sub.id);
                    setActivePage('shop');
                  }}
                  className="group bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 text-center transition flex flex-col items-center gap-2 shadow-xs hover:shadow-md"
                >
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-emerald-50 dark:bg-slate-700 relative flex items-center justify-center p-1">
                    <img
                      src={sub.image}
                      alt={sub.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-full group-hover:scale-110 transition duration-300"
                    />
                  </div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 font-hind line-clamp-1 group-hover:text-emerald-600 transition">
                    {language === 'bn' ? sub.nameBn : sub.name}
                  </p>
                  <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5">
                    <ShoppingBag className="w-2.5 h-2.5" />
                    <span>Shop</span>
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Medical Subcategory Grid */}
          {activeTab === 'medical' && medicalCat?.subcategories && (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
              {medicalCat.subcategories.map(sub => (
                <button
                  key={sub.id}
                  onClick={() => {
                    setSelectedCategory('medical');
                    setSelectedSubcategory(sub.id);
                    setActivePage('shop');
                  }}
                  className="group bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 text-center transition flex flex-col items-center gap-2 shadow-xs hover:shadow-md"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-50 dark:bg-slate-700 relative flex items-center justify-center p-1">
                    <img
                      src={sub.image}
                      alt={sub.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-full group-hover:scale-110 transition duration-300"
                    />
                  </div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 font-hind line-clamp-1 group-hover:text-blue-600 transition">
                    {language === 'bn' ? sub.nameBn : sub.name}
                  </p>
                  <span className="text-[10px] text-blue-600 font-medium flex items-center gap-0.5">
                    <ShoppingBag className="w-2.5 h-2.5" />
                    <span>Explore</span>
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Doctor Info Callout */}
          {activeTab === 'doctor' && (
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 rounded-2xl">
              <div>
                <span className="text-xs bg-emerald-800/80 px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
                  MBBS Doctors Consultation
                </span>
                <h4 className="text-xl sm:text-2xl font-bold font-hind mt-2">
                  অভিজ্ঞ MBBS ও বিশেষজ্ঞ ডাক্তারদের সাথে সরাসরি ভিডিও কথা বলুন
                </h4>
                <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl">
                  Dr. Sarah Rahman (Medicine Specialist), Dr. Tanvir Hasan (Child Specialist), Dr. Nusrat Jahan (Skin Specialist) সহ আরও অনেকেই উপলব্ধ আছেন।
                </p>
              </div>

              <button
                onClick={() => setActivePage('doctors')}
                className="bg-white text-emerald-800 hover:bg-emerald-50 px-6 py-3 rounded-xl font-bold text-sm shadow-md transition shrink-0"
              >
                ডাক্তার ডিরেক্টরি দেখুন →
              </button>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
