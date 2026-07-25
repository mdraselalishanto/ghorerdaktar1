import React from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import {
  Stethoscope,
  PhoneCall,
  Mail,
  MapPin,
  MessageSquare,
  Facebook,
  ShieldCheck
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, siteSettings, setActivePage, setSelectedCategory } = useApp();

  return (
    <footer className="bg-[#0F172A] text-slate-300 font-hind pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Column 1: Brand Logo & About */}
          <div className="space-y-4">
            <Logo size="md" />

            <p className="text-xs text-slate-400 leading-relaxed">
              আপনার পরিবারের স্বাস্থ্যসেবার বিশ্বস্ত ঠিকানা। ১০০% অরিজিনাল অর্গানিক মধু, অলিভ অয়েল, চিকিৎসা সামগ্রী ও নিবন্ধিত বিশেষজ্ঞ ডাক্তার কনসালটেশন।
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={`https://wa.me/${siteSettings.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-[#22C55E]/20 text-[#22C55E] hover:bg-[#22C55E] hover:text-white flex items-center justify-center transition-colors duration-200"
              >
                <MessageSquare className="w-4 h-4" />
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-[#0A66C2]/20 text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white flex items-center justify-center transition-colors duration-200"
              >
                <Facebook className="w-4 h-4" />
              </a>

              <a
                href={`mailto:${siteSettings.email}`}
                className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-colors duration-200"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#0A66C2] pl-2 font-poppins">
              Quick Links (দ্রুত লিঙ্ক)
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActivePage('home')} className="hover:text-[#22C55E] transition-colors">
                  • {language === 'bn' ? 'হোম পেজ' : 'Home'}
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('shop')} className="hover:text-[#22C55E] transition-colors">
                  • {language === 'bn' ? 'সকল প্রোডাক্ট শপ' : 'All Shop Products'}
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('doctors')} className="hover:text-[#22C55E] transition-colors">
                  • {language === 'bn' ? 'ডাক্তার অ্যাপয়েন্টমেন্ট' : 'Doctor Consultation'}
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('about')} className="hover:text-[#22C55E] transition-colors">
                  • {language === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('contact')} className="hover:text-[#22C55E] transition-colors">
                  • {language === 'bn' ? 'যোগাযোগ করুন' : 'Contact Us'}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#22C55E] pl-2 font-poppins">
              Categories (ক্যাটাগরি)
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('organic');
                    setActivePage('shop');
                  }}
                  className="hover:text-[#22C55E] transition-colors"
                >
                  • Organic Products (অর্গানিক মধু ও কালোজিরা)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('medical');
                    setActivePage('shop');
                  }}
                  className="hover:text-[#0A66C2] transition-colors"
                >
                  • Medical Products (ডিভাইস ও বিপি মেশিন)
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('doctors')} className="hover:text-[#22C55E] transition-colors">
                  • MBBS Doctors Consultation
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('privacy')} className="hover:text-slate-200 transition-colors">
                  • Privacy Policy (গোপনীয়তা নীতি)
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('terms')} className="hover:text-slate-200 transition-colors">
                  • Terms & Conditions (শর্তাবলী)
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('refund')} className="hover:text-slate-200 transition-colors">
                  • Refund Policy (রিফান্ড পলিসি)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Bangladesh Address */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-amber-400 pl-2 font-poppins">
              Contact & Location
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                <span>{siteSettings.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <PhoneCall className="w-4 h-4 text-[#0A66C2] shrink-0" />
                <span className="font-poppins">{siteSettings.hotline}</span>
              </li>
              {siteSettings.email && siteSettings.email.trim() && (
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="font-poppins">{siteSettings.email}</span>
                </li>
              )}
              <li className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-[#22C55E] shrink-0" />
                <span className="font-poppins">WhatsApp: +{siteSettings.whatsappNumber}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Middle Payment Methods Strip */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
            <span>১০০% বিশ্বস্ত ও নিরাপদ ক্যাশ অন ডেলিভারি, বিকাশ ও নগদ পেমেন্ট</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-slate-800 px-2.5 py-1 rounded font-bold text-white text-[10px]">bKash</span>
            <span className="bg-slate-800 px-2.5 py-1 rounded font-bold text-amber-400 text-[10px]">Nagad</span>
            <span className="bg-slate-800 px-2.5 py-1 rounded font-bold text-violet-400 text-[10px]">Rocket</span>
            <span className="bg-slate-800 px-2.5 py-1 rounded font-bold text-[#0A66C2] text-[10px]">Visa / Mastercard</span>
            <span className="bg-emerald-900/60 text-emerald-300 px-2.5 py-1 rounded font-bold text-[10px]">Cash on Delivery</span>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-8 pt-6 border-t border-slate-800/60 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} ঘরের ডাক্তার (Ghorer Daktar). All Rights Reserved.</p>
          
          <div className="flex items-center gap-2.5 text-xs text-slate-400 flex-wrap justify-center">
            <button
              onClick={() => setActivePage('privacy')}
              className="hover:text-slate-200 transition-colors"
            >
              Privacy Policy
            </button>
            <span>|</span>
            <button
              onClick={() => setActivePage('terms')}
              className="hover:text-slate-200 transition-colors"
            >
              Terms & Conditions
            </button>
            <span>|</span>
            <button
              onClick={() => setActivePage('admin')}
              className="text-slate-500 hover:text-slate-300 transition-colors duration-200 text-xs font-normal cursor-pointer"
            >
              ME
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
