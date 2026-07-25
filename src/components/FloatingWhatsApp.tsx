import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquare, X, Stethoscope, ShoppingBag, PhoneCall } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const { siteSettings, language } = useApp();
  const [openTooltip, setOpenTooltip] = useState(false);

  const whatsappNum = siteSettings.whatsappNumber || '8801700000000';

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 font-hind">
      
      {/* Quick Action Popover */}
      {openTooltip && (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-72 animate-fade-in space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                ঘরের ডাক্তার - সাপোর্ট ডেস্ক
              </span>
            </div>
            <button
              onClick={() => setOpenTooltip(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300">
            আসসালামু আলাইকুম! আপনাকে কীভাবে সহযোগিতা করতে পারি?
          </p>

          <div className="space-y-2 pt-1">
            <a
              href={`https://wa.me/${whatsappNum}?text=Hello!%20I%20want%20to%20consult%20an%20MBBS%20Doctor.`}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 p-2.5 rounded-xl text-xs font-bold transition border border-emerald-200 dark:border-emerald-800"
            >
              <Stethoscope className="w-4 h-4 text-[#2EBD59]" />
              <span>১. ডাক্তার কনসালটেশন ইনকুয়েরি</span>
            </a>

            <a
              href={`https://wa.me/${whatsappNum}?text=Hello!%20I%20want%20to%20order%20Organic%20or%20Medical%20Products.`}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center gap-2 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-blue-800 dark:text-blue-300 p-2.5 rounded-xl text-xs font-bold transition border border-blue-200 dark:border-blue-800"
            >
              <ShoppingBag className="w-4 h-4 text-[#0A66C2]" />
              <span>২. পণ্য অর্ডার সংক্রান্ত তথ্য</span>
            </a>

            <a
              href={`tel:${siteSettings.hotline}`}
              className="w-full flex items-center gap-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 p-2.5 rounded-xl text-xs font-bold transition"
            >
              <PhoneCall className="w-4 h-4 text-emerald-600" />
              <span>সরাসরি কল দিন: {siteSettings.hotline}</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setOpenTooltip(!openTooltip)}
        className="relative group bg-[#2EBD59] hover:bg-[#24a24a] text-white p-3.5 sm:p-4 rounded-full shadow-2xl transition duration-300 flex items-center justify-center"
        title="WhatsApp Live Chat"
      >
        <span className="absolute -inset-1 rounded-full bg-[#2EBD59] opacity-40 group-hover:opacity-60 animate-ping"></span>
        <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 relative z-10" />
      </button>

    </div>
  );
};
