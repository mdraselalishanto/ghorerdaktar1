import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import {
  CheckCircle2,
  Home,
  ShoppingBag,
  MessageCircle,
  Clock,
  CreditCard,
  Truck,
  Check,
  ShieldCheck,
  Heart,
  PhoneCall,
  PackageCheck,
  Stethoscope,
  Calendar,
  User,
  Phone
} from 'lucide-react';

interface ThankYouPageProps {
  orderData?: any;
}

export const ThankYouPage: React.FC<ThankYouPageProps> = ({ orderData }) => {
  const { siteSettings, setActivePage, lastBookedAppointment } = useApp();

  // Trigger confetti burst on page load
  useEffect(() => {
    // Initial burst
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#0A66C2', '#2EBD59', '#38ef7d', '#11998e', '#ffffff']
    });

    // Secondary burst after a short delay
    const timer = setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#0A66C2', '#2EBD59']
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#0A66C2', '#2EBD59']
      });
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const whatsappNum = siteSettings.whatsappNumber || '8801700000000';
  const cleanWhatsapp = whatsappNum.replace(/[^0-9]/g, '');
  const orderId = orderData?.id || 'GD-' + Math.floor(1000 + Math.random() * 9000);
  const totalAmount = orderData?.total || null;
  const paymentMethodLabel = orderData?.paymentMethod === 'cod'
    ? 'Cash on Delivery (ক্যাশ অন ডেলিভারি)'
    : orderData?.paymentMethod
    ? `${orderData.paymentMethod.toUpperCase()} (অনলাইন পেমেন্ট)`
    : 'Cash on Delivery / Online Payment';

  const whatsappMessage = encodeURIComponent(
    `নমস্কার/হ্যালো! আমি ঘরের ডাক্তার ওয়েবসাইট থেকে একটি অর্ডার করেছি।\nঅর্ডার আইডি: #${orderId}\nঅনুগ্রহ করে অর্ডার আপডেট জানান।`
  );

  const isAppointment = !orderData && lastBookedAppointment;

  return (
    <div className="py-10 sm:py-16 bg-slate-50 dark:bg-slate-900 min-h-[88vh] flex items-center justify-center transition-colors px-4">
      <div className="max-w-2xl w-full">
        
        {/* Main Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-700/80 shadow-2xl relative overflow-hidden text-slate-800 dark:text-slate-100"
        >
          {/* Decorative Top Gradient Line */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0A66C2] via-[#2EBD59] to-blue-500"></div>

          {/* Large Green Checkmark with Animated Ripple Ring */}
          <div className="relative flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
              className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#2EBD59] to-emerald-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30"
            >
              <CheckCircle2 className="w-14 h-14 sm:w-16 sm:h-16 stroke-[2.2]" />
            </motion.div>
            
            {/* Soft Pulsing Backlight */}
            <div className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-emerald-400/20 dark:bg-emerald-500/20 blur-xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          </div>

          {isAppointment ? (
            /* ======================================================== */
            /* APPOINTMENT BOOKING THANK YOU CONTENT (NO WHATSAPP) */
            /* ======================================================== */
            <>
              <div className="text-center space-y-2 mb-8">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-hind leading-snug">
                  🎉 ধন্যবাদ! আপনার ডাক্তার কনসালটেশন বুকিং সফল হয়েছে।
                </h1>
                <p className="text-sm sm:text-base font-semibold text-[#0A66C2] dark:text-blue-400 font-hind">
                  আপনার পেমেন্ট ও অ্যাপয়েন্টমেন্ট তথ্য এডমিন প্যানেলে সফলভাবে নিবন্ধিত হয়েছে।
                </p>
                <div className="inline-block mt-1 bg-slate-100 dark:bg-slate-700/60 px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-600">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">অ্যাপয়েন্টমেন্ট আইডি: </span>
                  <strong className="text-xs font-bold text-[#0A66C2] font-poppins">#{lastBookedAppointment.id}</strong>
                  <span className="text-xs font-bold text-[#2EBD59] font-poppins ml-2">
                    (৳{lastBookedAppointment.consultationFee})
                  </span>
                </div>
              </div>

              {/* Customer Notice */}
              <div className="bg-gradient-to-br from-blue-50/70 to-emerald-50/70 dark:from-slate-900/80 dark:to-slate-900/60 p-5 sm:p-6 rounded-2xl border border-blue-100 dark:border-slate-700/80 mb-8 space-y-3 text-xs sm:text-sm font-hind text-slate-700 dark:text-slate-200 leading-relaxed">
                <p className="font-bold text-slate-900 dark:text-white text-base">
                  প্রিয় গ্রাহক,
                </p>
                <p className="font-medium text-slate-800 dark:text-slate-200">
                  ঘরের ডাক্তার-এর প্রতি আস্থা রাখার জন্য আন্তরিক ধন্যবাদ। 💙💚
                </p>
                <p>
                  আপনার পেমেন্ট ট্রানজেকশন আইডি (<strong className="font-poppins uppercase text-amber-600">{lastBookedAppointment.transactionId || 'N/A'}</strong>) এডমিন প্যানেলে যাচাই করার জন্য পাঠানো হয়েছে।
                </p>
                <p>
                  আমাদের এডমিন ও ডাক্তার সাপোর্ট টিম খুব শীঘ্রই আপনার দেওয়া মোবাইল নম্বরে (<strong className="font-poppins">{lastBookedAppointment.patientPhone}</strong>) যোগাযোগ করে কনসালটেশন সময় ও মাধ্যম নিশ্চিত করবেন।
                </p>
                <p className="font-bold text-[#0A66C2] dark:text-blue-300">
                  অনুগ্রহ করে আপনার মোবাইল ফোনটি সচল রাখুন।
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-xs">
                  যেকোনো প্রয়োজনে আমাদের হটলাইনে সরাসরি কল করতে পারেন অথবা এডমিন সাপোর্টে যোগাযোগ করতে পারেন।
                </p>
              </div>

              {/* Highlighted Information Box */}
              <div className="bg-slate-900 text-white dark:bg-slate-950 p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-md mb-8 space-y-3 font-hind">
                <h3 className="text-sm font-extrabold text-emerald-400 flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Stethoscope className="w-4 h-4 text-[#2EBD59]" />
                  <span>🩺 কনসালটেশন বিবরণ ও স্ট্যাটাস (Consultation Overview)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm pt-1">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#2EBD59] shrink-0" />
                    <span className="text-slate-300">Doctor Name:</span>
                    <strong className="text-white font-bold">{lastBookedAppointment.doctorName}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="text-slate-300">Patient:</span>
                    <strong className="text-white font-bold">{lastBookedAppointment.patientName} ({lastBookedAppointment.age}Y)</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-slate-300">Date & Slot:</span>
                    <strong className="text-amber-300 font-bold">{lastBookedAppointment.preferredDate} ({lastBookedAppointment.preferredTimeSlot})</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-slate-300">Payment Status:</span>
                    <strong className="text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md font-bold">Pending Verification</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons (No WhatsApp) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                <button
                  onClick={() => setActivePage('home')}
                  className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition shadow-xs"
                >
                  <Home className="w-4 h-4 text-[#0A66C2]" />
                  <span>🏠 হোম পেজ</span>
                </button>

                <button
                  onClick={() => setActivePage('doctors')}
                  className="flex items-center justify-center gap-2 bg-[#0A66C2] hover:bg-[#08529d] text-white py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition shadow-md"
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>👨‍⚕️ ডাক্তার ডিরেক্টরি</span>
                </button>

                <a
                  href={`tel:${siteSettings.hotline || siteSettings.whatsappNumber || '01700000000'}`}
                  className="flex items-center justify-center gap-2 bg-[#2EBD59] hover:bg-[#259c49] text-white py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition shadow-md"
                >
                  <Phone className="w-4 h-4" />
                  <span>📞 সরাসরি হটলাইনে কল করুন</span>
                </a>
              </div>
            </>
          ) : (
            /* ======================================================== */
            /* ORDER THANK YOU CONTENT */
            /* ======================================================== */
            <>
              {/* Headline & Subheading */}
              <div className="text-center space-y-2 mb-8">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-hind leading-snug">
                  🎉 ধন্যবাদ! আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে।
                </h1>
                <p className="text-sm sm:text-base font-semibold text-[#0A66C2] dark:text-blue-400 font-hind">
                  আপনার অর্ডারটি আমাদের সিস্টেমে সফলভাবে নিবন্ধিত হয়েছে।
                </p>
                {orderId && (
                  <div className="inline-block mt-1 bg-slate-100 dark:bg-slate-700/60 px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-600">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">অর্ডার নম্বর: </span>
                    <strong className="text-xs font-bold text-slate-900 dark:text-white font-poppins">#{orderId}</strong>
                    {totalAmount && (
                      <span className="text-xs font-bold text-[#2EBD59] font-poppins ml-2">
                        (৳{totalAmount})
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Customer Appreciation Message Box */}
              <div className="bg-gradient-to-br from-blue-50/70 to-emerald-50/70 dark:from-slate-900/80 dark:to-slate-900/60 p-5 sm:p-6 rounded-2xl border border-blue-100 dark:border-slate-700/80 mb-8 space-y-3 text-xs sm:text-sm font-hind text-slate-700 dark:text-slate-200 leading-relaxed">
                <p className="font-bold text-slate-900 dark:text-white text-base">
                  প্রিয় গ্রাহক,
                </p>
                <p className="font-medium text-slate-800 dark:text-slate-200">
                  ঘরের ডাক্তার-এর প্রতি আস্থা রাখার জন্য আন্তরিক ধন্যবাদ। 💙💚
                </p>
                <p>
                  আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। আমাদের প্রতিনিধি খুব শীঘ্রই আপনার দেওয়া মোবাইল নম্বরে যোগাযোগ করবেন অর্ডারটি নিশ্চিত করার জন্য।
                </p>
                <p>
                  অর্ডার নিশ্চিত হওয়ার পর দ্রুত আপনার ঠিকানায় নিরাপদভাবে ডেলিভারির জন্য পাঠিয়ে দেওয়া হবে।
                </p>
                <p className="font-bold text-[#0A66C2] dark:text-blue-300">
                  অনুগ্রহ করে আপনার মোবাইল ফোনটি সচল রাখুন।
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-xs">
                  যেকোনো প্রয়োজনে আমাদের WhatsApp অথবা Customer Support-এ যোগাযোগ করতে পারেন।
                </p>
              </div>

              {/* Highlighted Information Box */}
              <div className="bg-slate-900 text-white dark:bg-slate-950 p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-md mb-8 space-y-3 font-hind">
                <h3 className="text-sm font-extrabold text-emerald-400 flex items-center gap-2 border-b border-slate-800 pb-2">
                  <ShieldCheck className="w-4 h-4 text-[#2EBD59]" />
                  <span>অর্ডার স্ট্যাটাস ও ডেলিভারি তথ্য (Order Overview)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm pt-1">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#2EBD59] shrink-0" />
                    <span className="text-slate-300">Order Status:</span>
                    <strong className="text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md font-bold">Received (গৃহীত)</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="text-slate-300">Payment Method:</span>
                    <strong className="text-white font-bold">{paymentMethodLabel}</strong>
                  </div>

                  <div className="flex items-start gap-2 col-span-1 sm:col-span-2 mt-1 pt-2 border-t border-slate-800">
                    <Truck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#2EBD59]">✔</span>
                        <span className="text-slate-200">Delivery Time: <strong className="text-amber-300">১–৩ কার্যদিবস</strong> (ঢাকার ভিতরে)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#2EBD59]">✔</span>
                        <span className="text-slate-200">Delivery Time: <strong className="text-amber-300">২–৫ কার্যদিবস</strong> (ঢাকার বাইরে)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                <button
                  onClick={() => setActivePage('home')}
                  className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition shadow-xs"
                >
                  <Home className="w-4 h-4 text-[#0A66C2]" />
                  <span>🏠 হোম পেজে ফিরে যান</span>
                </button>

                <button
                  onClick={() => setActivePage('shop')}
                  className="flex items-center justify-center gap-2 bg-[#0A66C2] hover:bg-[#08529d] text-white py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>🛍️ আরও কেনাকাটা করুন</span>
                </button>

                <a
                  href={`https://wa.me/${cleanWhatsapp}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#2EBD59] hover:bg-[#259c49] text-white py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>💬 WhatsApp-এ যোগাযোগ করুন</span>
                </a>
              </div>
            </>
          )}

          {/* Footer Branding & Healthcare Message */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-700/80 text-center space-y-1.5 font-hind">
            <p className="text-base font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-1">
              <span className="text-rose-500">❤️</span>
              <span className="text-[#0A66C2]">ঘরের ডাক্তার</span>
            </p>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              আপনার পরিবারের স্বাস্থ্যসেবার বিশ্বস্ত ঠিকানা।
            </p>
            <p className="text-xs font-bold text-[#2EBD59] dark:text-emerald-400">
              সুস্থ থাকুন, নিরাপদ থাকুন। 🌿🏥
            </p>
          </div>

        </motion.div>

      </div>
    </div>
  );
};
