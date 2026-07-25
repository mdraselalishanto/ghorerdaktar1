import React from 'react';
import { useApp } from '../context/AppContext';
import { Doctor } from '../types';
import {
  Stethoscope,
  Star,
  Clock,
  Award,
  CalendarCheck,
  CheckCircle,
  Sparkles,
  Phone
} from 'lucide-react';

export const DoctorConsultationSection: React.FC = () => {
  const { doctors, language, siteSettings, setSelectedDoctorForBooking } = useApp();

  const handleBookNow = (doc: Doctor) => {
    setSelectedDoctorForBooking(doc);
  };

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-b from-slate-50 to-emerald-50/40 dark:from-slate-900 dark:to-slate-950 border-y border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#2EBD59]" />
            <span>Category 3 • Telemedicine</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-hind tracking-tight">
            MBBS Doctors Consultation
          </h2>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base font-hind">
            অভিজ্ঞ ও নিবন্ধিত বিশেষজ্ঞ ডাক্তারদের পরামর্শ নিন আপনার ঘরে বসেই। ভিডিও কলে অরিজিনাল ডিজিটাল প্রেসক্রিপশন পান।
          </p>
        </div>

        {/* 3 Featured Doctor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-10">
          {doctors.slice(0, 3).map((doc) => (
            <div
              key={doc.id}
              className="group bg-white dark:bg-slate-800 rounded-2xl p-6 border border-[#E2E8F0] dark:border-slate-700/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Top Doctor Badge */}
              <div className="absolute top-4 right-4 bg-emerald-50 dark:bg-emerald-950/60 text-[#22C55E] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-[#22C55E]" />
                <span>Verified BMDC</span>
              </div>

              <div>
                {/* Doctor Photo & Rating */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="relative">
                    <img
                      src={doc.photo}
                      alt={doc.name}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 rounded-2xl object-cover shadow-sm border-2 border-[#22C55E] group-hover:scale-105 transition duration-300"
                    />
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#22C55E] border-2 border-white rounded-full"></span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#0A66C2] dark:text-white font-hind group-hover:text-[#22C55E] transition-colors">
                      {language === 'bn' ? doc.nameBn : doc.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#1E293B] dark:text-blue-400 font-hind">
                      {language === 'bn' ? doc.degreeBn : doc.degree}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{doc.rating}</span>
                      <span className="text-slate-400 text-[10px]">({doc.totalConsultations}+ Patients)</span>
                    </div>
                  </div>
                </div>

                {/* Qualification & Details List */}
                <div className="space-y-2.5 bg-[#F8FAFC] dark:bg-slate-900/60 p-4 rounded-xl border border-[#E2E8F0] dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Specialty:</span>
                    <span className="font-bold text-[#1E293B] dark:text-white font-hind">
                      {language === 'bn' ? doc.specialtyBn : doc.specialty}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-[#0A66C2]" />
                      Experience:
                    </span>
                    <span className="font-bold text-[#1E293B] dark:text-white">
                      {doc.experienceYears} Years
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#22C55E]" />
                      Availability:
                    </span>
                    <span className="font-semibold text-[#22C55E] dark:text-emerald-400 text-[11px] font-hind">
                      {language === 'bn' ? doc.availabilityBn : doc.availability}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between">
                    <span className="text-slate-500 font-bold">Consultation Fee:</span>
                    <span className="text-base font-extrabold text-[#0A66C2] dark:text-blue-400 font-poppins">
                      ৳{doc.consultationFee}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button: Keep only one button: Book Now */}
              <div className="pt-1">
                <button
                  onClick={() => handleBookNow(doc)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#0A66C2] to-[#2EBD59] hover:from-[#08529d] hover:to-[#259b48] text-white py-3 px-4 rounded-xl font-extrabold text-sm shadow-md hover:shadow-lg transition-all duration-200 transform active:scale-95 group"
                >
                  <CalendarCheck className="w-4 h-4 group-hover:scale-110 transition" />
                  <span>{language === 'bn' ? 'অ্যাপয়েন্টমেন্ট বুক করুন (Book Now)' : 'Book Now'}</span>
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Doctor Consultation Support Banner (No WhatsApp) */}
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-[#0A66C2] dark:text-blue-400 flex items-center justify-center shrink-0">
              <Stethoscope className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white font-hind">
                জরুরি প্রয়োজনে কোনো ডাক্তারের সাথে কথা বলতে চান?
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-hind">
                আমাদের সাপোর্টে যোগাযোগ করুন। আমাদের মেডিকেল অ্যাসিস্ট্যান্ট আপনাকে সহযোগিতা করবেন।
              </p>
            </div>
          </div>

          <a
            href={`tel:${siteSettings.hotline || '01700000000'}`}
            className="flex items-center gap-2 bg-[#0A66C2] hover:bg-[#08529d] text-white px-6 py-3.5 rounded-xl font-extrabold text-xs sm:text-sm shadow-md transition shrink-0 group"
          >
            <Phone className="w-4 h-4 text-emerald-300 group-hover:scale-110 transition" />
            <span>সরাসরি হটলাইনে কল করুন (Call Hotline)</span>
          </a>
        </div>

      </div>
    </section>
  );
};
