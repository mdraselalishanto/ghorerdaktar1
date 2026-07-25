import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, PhoneCall, MapPin, MessageSquare, Send, Clock, Building } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { siteSettings, showToast } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      showToast('অনুগ্রহ করে নাম, ফোন নম্বর ও মেসেজ ফিল্ডটি পূরণ করুন', 'error');
      return;
    }
    showToast('আপনার মেসেজটি আমাদের সাপোর্ট টিমে জমা হয়েছে! অতি শীঘ্রই যোগাযোগ করা হবে।', 'success');
    setName('');
    setPhone('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12 font-hind">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-[#0A66C2] uppercase tracking-wider">
          যোগাযোগ করুন
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          আমাদের সাথে যোগাযোগ ও সাপোর্ট
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          যেকোনো প্রশ্ন, অর্ডার ট্র্যাকিং বা ডাক্তার বুকিং সংক্রান্ত সহযোগিতার জন্য সরাসরি মেসেজ দিন বা কল করুন।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Contact Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b pb-3">
            সরাসরি মেসেজ পাঠান (Send Message)
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  আপনার নাম *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="যেমনঃ রাজিব হাসান"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  মোবাইল নম্বর *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                ইমেইল এড্রেস (ঐচ্ছিক)
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="example@mail.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                আপনার বার্তা / সমস্যা *
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="আপনার বিষয় সংক্ষেপে বিস্তারিত লিখুন..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#0A66C2] hover:bg-[#08529d] text-white py-3.5 rounded-xl font-bold text-xs shadow-md transition"
            >
              <Send className="w-4 h-4" />
              <span>মেসেজ সাবমিট করুন</span>
            </button>
          </form>
        </div>

        {/* Right Info Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl">
            <h3 className="text-lg font-bold border-b border-slate-700 pb-3">
              অফিসিয়াল যোগাযোগের ঠিকানা
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-300">অফিস এড্রেসঃ</p>
                  <p className="text-slate-200 mt-0.5">{siteSettings.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-300">হটলাইন ও ফোনঃ</p>
                  <p className="text-slate-200 font-poppins mt-0.5">{siteSettings.hotline}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-300">হোয়াটসঅ্যাপ অফিসিয়ালঃ</p>
                  <p className="text-slate-200 font-poppins mt-0.5">+{siteSettings.whatsappNumber}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-300">ইমেইল হেল্পডেস্কঃ</p>
                  <p className="text-slate-200 font-poppins mt-0.5">{siteSettings.email}</p>
                </div>
              </div>
            </div>

            <a
              href={`https://wa.me/${siteSettings.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#2EBD59] hover:bg-[#24a24a] text-white py-3.5 rounded-xl font-bold text-xs shadow-md transition"
            >
              <MessageSquare className="w-4 h-4" />
              <span>সরাসরি হোয়াটসঅ্যাপ চ্যাট শুরু করুন</span>
            </a>
          </div>
        </div>

      </div>

    </div>
  );
};
