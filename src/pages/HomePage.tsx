import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HeroSection } from '../components/HeroSection';
import { CategorySection } from '../components/CategorySection';
import { DoctorConsultationSection } from '../components/DoctorConsultationSection';
import { ProductCard } from '../components/ProductCard';
import { initialFAQs, initialTestimonials } from '../data/mockData';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  CheckCircle2,
  ChevronDown,
  Star,
  Send,
  Leaf,
  HeartPulse
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const {
    products,
    language,
    setActivePage,
    setSelectedCategory,
    showToast
  } = useApp();

  const [expandedFaq, setExpandedFaq] = useState<string | null>('faq-1');
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const organicProducts = products.filter(p => p.category === 'organic').slice(0, 4);
  const medicalProducts = products.filter(p => p.category === 'medical').slice(0, 4);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      showToast('ধন্যবাদ! আমাদের নিউজলেটারে সাবস্ক্রিপশন সম্পন্ন হয়েছে।', 'success');
      setNewsletterEmail('');
    }
  };

  return (
    <div className="space-y-12">
      {/* 1. Hero Banner */}
      <HeroSection />

      {/* 2. Category Section */}
      <CategorySection />

      {/* 3. Organic Products Showcase Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Leaf className="w-4 h-4 text-emerald-500" />
              <span>Category 1 • Organic Products</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-hind">
              {language === 'bn' ? '১০০% খাঁটি ও অর্গানিক ফুড আইটেম' : 'Featured Organic Products'}
            </h2>
          </div>

          <button
            onClick={() => {
              setSelectedCategory('organic');
              setActivePage('shop');
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A66C2] dark:text-blue-400 hover:underline"
          >
            <span>সবগুলো অর্গানিক আইটেম দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {organicProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Doctor Consultation Showcase */}
      <DoctorConsultationSection />

      {/* 5. Medical Devices & Healthcare Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-[#0A66C2] font-bold text-xs uppercase tracking-wider mb-1">
              <HeartPulse className="w-4 h-4 text-blue-500" />
              <span>Category 2 • Medical Devices</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-hind">
              {language === 'bn' ? 'মেডিকেল ডিভাইস ও হেলথকেয়ার সামগ্রী' : 'Medical Devices & Healthcare'}
            </h2>
          </div>

          <button
            onClick={() => {
              setSelectedCategory('medical');
              setActivePage('shop');
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A66C2] dark:text-blue-400 hover:underline"
          >
            <span>সবগুলো ডিভাইস দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {medicalProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Why Choose Us / Guarantees */}
      <section className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              কেন ঘরের ডাক্তার বেছে নেবেন?
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-hind">
              কেন আমরা বাংলাদেশের সবচেয়ে বিশ্বস্ত অনলাইন স্বাস্থ্যসেবা প্ল্যাটফর্ম?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold font-hind">১০০% অর্গানিক নিশ্চয়তা</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                সুন্দরবনের খাঁটি মধু, কালোজিরা ও প্রিমিয়াম অলিভ অয়েল কোনো ভেজাল ছাড়াই সরবরাহ করা হয়।
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold font-hind">রেজিস্টার্ড MBBS ডাক্তার</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                BMDC নিবন্ধিত অভিজ্ঞ বিশেষজ্ঞ ডাক্তারদের সাথে সরাসরি ভিডিও কনসালটেশন সার্ভিস।
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold font-hind">সমগ্র বাংলাদেশে হোম ডেলিভারি</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                ঢাকার মধ্যে ২৪ ঘণ্টায় এবং ঢাকার বাইরে ২-৩ দিনের মধ্যে হোম ডেলিভারি ক্যাশ অন সুবিধাসহ।
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold font-hind">সহজ রিটার্ন পলিসি</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                পণ্য গ্রহণে কোনো সমস্যা থাকলে ৭ দিনের মধ্যে সহজ এক্সচেঞ্জ বা মানি ব্যাক সুবিধা।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#0A66C2] uppercase tracking-wider">
            গ্রাহক রিভিউ
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-hind mt-1">
            আমাদের সেবা নিয়ে সুস্থ গ্রাহকদের অভিমত
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {initialTestimonials.map(t => (
            <div
              key={t.id}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-4"
            >
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic font-hind leading-relaxed">
                "{t.comment}"
              </p>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                <img
                  src={t.image}
                  alt={t.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-emerald-400"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white font-hind">
                    {t.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-hind">
                    {t.role} • {t.location}
                  </p>
                  <div className="flex text-amber-400 text-xs mt-0.5">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-[#2EBD59] uppercase tracking-wider">
            সাধারণ প্রশ্ন উত্তর (FAQ)
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-hind mt-1">
            আপনার মনে কি কোনো প্রশ্ন আছে?
          </h2>
        </div>

        <div className="space-y-3">
          {initialFAQs.map(faq => {
            const isOpen = expandedFaq === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs transition"
              >
                <button
                  onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between font-bold text-sm text-slate-900 dark:text-white font-hind"
                >
                  <span>{language === 'bn' ? faq.questionBn : faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-hind border-t border-slate-100 dark:border-slate-700/60 pt-3 leading-relaxed">
                    {language === 'bn' ? faq.answerBn : faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. Newsletter Subscription */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <div className="bg-gradient-to-r from-[#0A66C2] to-[#2EBD59] text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              অফার ও হেলথ টিপস
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-hind">
              আমাদের ফ্রি হেলথ নিউজলেটারে যুক্ত হোন
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 font-hind">
              প্রতি সপ্তাহে ডাক্তারদের স্বাস্থ্য পরামর্শ এবং নতুন অর্গানিক পণ্যের স্পেশাল ডিসকাউন্ট কোড পান ইমেইলে।
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={e => setNewsletterEmail(e.target.value)}
              placeholder="আপনার ইমেইল এড্রেস লিখুন..."
              className="px-4 py-3 rounded-xl text-slate-900 bg-white text-sm w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 shrink-0"
            >
              <span>সাবস্ক্রাইব</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
