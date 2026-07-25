import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Doctor } from '../types';
import {
  Stethoscope,
  Search,
  Star,
  Award,
  Clock,
  CheckCircle2,
  CalendarCheck,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export const DoctorPage: React.FC = () => {
  const { doctors, language, siteSettings, setSelectedDoctorForBooking } = useApp();
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all');
  const [doctorSearch, setDoctorSearch] = useState<string>('');

  const filteredDoctors = doctors.filter(doc => {
    if (specialtyFilter !== 'all' && !doc.specialty.toLowerCase().includes(specialtyFilter.toLowerCase())) {
      return false;
    }
    if (doctorSearch.trim()) {
      const q = doctorSearch.toLowerCase();
      const matchName = doc.name.toLowerCase().includes(q) || doc.nameBn.includes(q);
      const matchSpec = doc.specialty.toLowerCase().includes(q) || doc.specialtyBn.includes(q);
      if (!matchName && !matchSpec) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-[#0A66C2] text-white p-8 sm:p-12 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="bg-white/20 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Telemedicine Portal BD
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-hind leading-tight">
            MBBS Doctors Consultation — ঘরের ডাক্তার
          </h1>
          <p className="text-sm text-emerald-100 font-hind">
            ঢাকা মেডিকেল ও বিএসএমএমইউ (পিজি) এর অভিজ্ঞ নিবন্ধিত বিশেষজ্ঞ ডাক্তারদের সাথে সরাসরি ভিডিও কনসালটেশন নিন। ডিজিটাল প্রেসক্রিপশন সাথে সাথেই পান।
          </p>
        </div>
      </div>

      {/* Specialty Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Specialty Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <button
              onClick={() => setSpecialtyFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
                specialtyFilter === 'all'
                  ? 'bg-[#2EBD59] text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              সকল ডাক্তার
            </button>

            <button
              onClick={() => setSpecialtyFilter('medicine')}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
                specialtyFilter === 'medicine'
                  ? 'bg-[#2EBD59] text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              মেডিসিন
            </button>

            <button
              onClick={() => setSpecialtyFilter('child')}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
                specialtyFilter === 'child'
                  ? 'bg-[#2EBD59] text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              শিশু বিশেষজ্ঞ
            </button>

            <button
              onClick={() => setSpecialtyFilter('skin')}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
                specialtyFilter === 'skin'
                  ? 'bg-[#2EBD59] text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              চর্ম ও যৌন
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={doctorSearch}
              onChange={e => setDoctorSearch(e.target.value)}
              placeholder="ডাক্তারের নাম বা ডিগ্রি দিয়ে খুঁজুন..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

        </div>

      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map(doc => (
          <div
            key={doc.id}
            className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition flex flex-col justify-between"
          >
            <div>
              {/* Doctor Header */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={doc.photo}
                  alt={doc.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
                />

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white font-hind">
                      {language === 'bn' ? doc.nameBn : doc.name}
                    </h3>
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="text-xs font-bold text-[#0A66C2] dark:text-blue-400 font-hind">
                    {language === 'bn' ? doc.degreeBn : doc.degree}
                  </p>
                  <p className="text-[11px] text-slate-500">BMDC Reg: {doc.bmdcReg || 'A-REG'}</p>
                </div>
              </div>

              {/* Specs Box */}
              <div className="space-y-2 bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-400">Specialty:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 font-hind">
                    {language === 'bn' ? doc.specialtyBn : doc.specialty}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Experience:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {doc.experienceYears} Years
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Time Slot:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-hind">
                    {language === 'bn' ? doc.availabilityBn : doc.availability}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline">
                  <span className="text-slate-500 font-bold">Consultation Fee:</span>
                  <span className="text-base font-extrabold text-[#0A66C2] dark:text-blue-400 font-poppins">
                    ৳{doc.consultationFee}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions: Keep only one button: Book Now */}
            <div className="pt-2">
              <button
                onClick={() => setSelectedDoctorForBooking(doc)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#0A66C2] to-[#2EBD59] hover:from-[#08529d] hover:to-[#259b48] text-white py-3.5 px-4 rounded-xl font-extrabold text-sm shadow-md hover:shadow-lg transition-all duration-200 transform active:scale-95 group"
              >
                <CalendarCheck className="w-4 h-4 group-hover:scale-110 transition" />
                <span>{language === 'bn' ? 'অ্যাপয়েন্টমেন্ট বুক করুন (Book Now)' : 'Book Now'}</span>
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
