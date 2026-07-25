import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  Stethoscope,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';

export const DoctorBookingModal: React.FC = () => {
  const {
    selectedDoctorForBooking,
    setSelectedDoctorForBooking,
    siteSettings,
    language,
    showToast,
    setLastBookedAppointment,
    setActivePage
  } = useApp();

  // Booking Flow Steps: 1 = Patient Info, 2 = Payment, 3 = Payment Success
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [age, setAge] = useState('30');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [problemDescription, setProblemDescription] = useState('');
  const [preferredDate, setPreferredDate] = useState(new Date().toISOString().split('T')[0]);
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('07:00 PM - 08:00 PM');

  // Payment Fields
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'rocket' | 'sslcommerz' | 'manual'>('bkash');
  const [transactionId, setTransactionId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);

  // Completed Appointment Result
  const [createdAppointment, setCreatedAppointment] = useState<any>(null);

  // Reset state when modal is closed or changed
  useEffect(() => {
    if (!selectedDoctorForBooking) {
      setStep(1);
      setTransactionId('');
      setCreatedAppointment(null);
    }
  }, [selectedDoctorForBooking]);

  // Confetti effect on Step 3
  useEffect(() => {
    if (step === 3) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0A66C2', '#2EBD59', '#38ef7d']
      });
    }
  }, [step]);

  if (!selectedDoctorForBooking) return null;

  const doc = selectedDoctorForBooking;
  const paymentPhone = siteSettings.hotline || siteSettings.whatsappNumber || '01700000000';

  // Step 1 -> Step 2 Validation
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      showToast('অনুগ্রহ করে রোগীর নাম প্রদান করুন', 'error');
      return;
    }
    if (!patientPhone.trim() || patientPhone.trim().length < 11) {
      showToast('অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন', 'error');
      return;
    }
    setStep(2);
  };

  // Step 2 -> Submit Payment & Create Appointment
  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    // Payment validation
    if (paymentMethod === 'bkash' || paymentMethod === 'nagad' || paymentMethod === 'rocket' || paymentMethod === 'manual') {
      if (!transactionId.trim()) {
        showToast('অনুগ্রহ করে পেমেন্ট ট্রানজেকশন আইডি (TrxID) লিখুন', 'error');
        return;
      }
    } else if (paymentMethod === 'sslcommerz') {
      if (!cardNumber || !cardExpiry || !cardCvc) {
        showToast('অনুগ্রহ করে কার্ডের তথ্য সঠিকভাবে প্রদান করুন', 'error');
        return;
      }
    }

    setSubmitting(true);
    try {
      const generatedTrx = transactionId.trim() || `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;

      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: doc.id,
          doctorName: doc.name,
          patientName,
          patientPhone,
          age: parseInt(age) || 30,
          gender,
          problemDescription: problemDescription || 'General Consultation',
          preferredDate,
          preferredTimeSlot,
          consultationFee: doc.consultationFee,
          paymentMethod,
          paymentStatus: 'Paid',
          transactionId: generatedTrx,
          status: 'Pending'
        })
      });

      if (res.ok) {
        const appointmentData = await res.json();
        setCreatedAppointment(appointmentData);
        setLastBookedAppointment(appointmentData);
        setStep(3);
        showToast('🎉 পেমেন্ট সফল হয়েছে! আপনার অ্যাপয়েন্টমেন্ট বুকড্‌।', 'success');
      } else {
        showToast('পেমেন্ট প্রক্রিয়াকরণে সমস্যা হয়েছে, পুনরায় চেষ্টা করুন', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('নেটওয়ার্ক সমস্যা, অনুগ্রহ করে পুনরায় চেষ্টা করুন', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const copyPaymentNumber = () => {
    navigator.clipboard.writeText(paymentPhone);
    setCopiedNumber(true);
    showToast('মোবাইল নম্বর কপি করা হয়েছে!', 'success');
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden relative max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0A66C2] via-teal-700 to-[#2EBD59] text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={() => setSelectedDoctorForBooking(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 p-1.5 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <img
              src={doc.photo}
              alt={doc.name}
              referrerPolicy="no-referrer"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-white/80 shadow-md shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  {step === 1 ? 'Step 1: Patient Details' : step === 2 ? 'Step 2: Consultation Payment' : 'Step 3: Confirmation'}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-hind mt-0.5">
                {language === 'bn' ? doc.nameBn : doc.name}
              </h3>
              <p className="text-xs text-blue-100 font-hind">
                {language === 'bn' ? doc.degreeBn : doc.degree} • <strong className="text-amber-300 font-poppins">৳{doc.consultationFee}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1">
          
          {/* STEP 1: PATIENT INFORMATION FORM */}
          {step === 1 && (
            <motion.form
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleProceedToPayment}
              className="space-y-4"
            >
              <div className="bg-blue-50/70 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-blue-100 dark:border-slate-700 flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
                <span className="font-bold font-hind">ডাক্তার কনসালটেশন ফি:</span>
                <span className="text-base font-extrabold text-[#0A66C2] dark:text-blue-400 font-poppins">
                  ৳{doc.consultationFee}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 font-hind">
                    রোগীর নাম (Patient Name) *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={patientName}
                      onChange={e => setPatientName(e.target.value)}
                      placeholder="যেমনঃ সাদ্দাম হোসেন"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-[#0A66C2]"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 font-hind">
                    মোবাইল নম্বর (Phone Number) *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={patientPhone}
                      onChange={e => setPatientPhone(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-[#0A66C2]"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 font-hind">
                    বয়স (Age)
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    placeholder="30"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm font-poppins"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 font-hind">
                    লিঙ্গ (Gender)
                  </label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm font-hind"
                  >
                    <option value="Male">পুরুষ (Male)</option>
                    <option value="Female">নারী (Female)</option>
                    <option value="Other">অন্যান্য (Other)</option>
                  </select>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 font-hind">
                    তারিখ (Preferred Date)
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={e => setPreferredDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 font-hind">
                  সময়সূচী (Time Slot)
                </label>
                <select
                  value={preferredTimeSlot}
                  onChange={e => setPreferredTimeSlot(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm font-hind"
                >
                  <option value="05:00 PM - 06:00 PM">বিকাল ০৫:০০ - ০৬:০০</option>
                  <option value="06:00 PM - 07:00 PM">সন্ধ্যা ০৬:০০ - ০৭:০০</option>
                  <option value="07:00 PM - 08:00 PM">সন্ধ্যা ০৭:০০ - ০৮:০০</option>
                  <option value="08:00 PM - 09:00 PM">রাত ০৮:০০ - ০৯:০০</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 font-hind">
                  সমস্যার সংক্ষিপ্ত বিবরণ (Problem Description)
                </label>
                <textarea
                  rows={2}
                  value={problemDescription}
                  onChange={e => setProblemDescription(e.target.value)}
                  placeholder="আপনার স্বাস্থ্য সমস্যা সংক্ষেপে লিখুন..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm font-hind"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#0A66C2] hover:bg-[#08529d] text-white py-3.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition duration-200 mt-2 font-hind"
              >
                <span>পেমেন্ট ধাপে এগিয়ে যান</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.form>
          )}

          {/* STEP 2: CONSULTATION PAYMENT PAGE */}
          {step === 2 && (
            <motion.form
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleConfirmPayment}
              className="space-y-5"
            >
              {/* Summary Box */}
              <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl space-y-2 font-hind text-xs sm:text-sm shadow-md">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-slate-400">ডাক্তার:</span>
                  <strong className="text-emerald-400 text-sm font-bold">{doc.name}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">রোগী:</span>
                  <span className="font-semibold text-slate-200">{patientName} ({patientPhone})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">তারিখ ও সময়:</span>
                  <span className="font-semibold text-slate-200">{preferredDate} ({preferredTimeSlot})</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                  <span className="text-slate-300 font-bold">মোট দেয় ফি (Consultation Fee):</span>
                  <span className="text-xl font-black text-[#2EBD59] font-poppins">৳{doc.consultationFee}</span>
                </div>
              </div>

              {/* Payment Methods Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 font-hind">
                  পেমেন্ট মেথড নির্বাচন করুন (Select Payment Method) *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'bkash', name: 'bKash', color: 'border-pink-500 bg-pink-50/50 dark:bg-pink-950/30' },
                    { id: 'nagad', name: 'Nagad', color: 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/30' },
                    { id: 'rocket', name: 'Rocket', color: 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/30' },
                    { id: 'sslcommerz', name: 'Card/SSL', color: 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30' },
                    { id: 'manual', name: 'Bank/Manual', color: 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30' }
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`p-2.5 rounded-xl border-2 text-center text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${
                        paymentMethod === method.id
                          ? `${method.color} text-slate-900 dark:text-white shadow-xs`
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 opacity-80" />
                      <span className="font-poppins">{method.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Banking Instructions (bKash, Nagad, Rocket, Manual) */}
              {(paymentMethod === 'bkash' || paymentMethod === 'nagad' || paymentMethod === 'rocket' || paymentMethod === 'manual') && (
                <div className="bg-emerald-50/80 dark:bg-slate-900 p-4 rounded-2xl border border-emerald-200 dark:border-slate-700 space-y-3 font-hind text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-3 rounded-xl border border-emerald-100 dark:border-slate-700">
                    <div>
                      <span className="block text-[10px] text-slate-500 font-bold uppercase">
                        {paymentMethod.toUpperCase()} Personal / Merchant Number:
                      </span>
                      <strong className="text-sm font-black text-slate-900 dark:text-white font-poppins">
                        {paymentPhone}
                      </strong>
                    </div>
                    <button
                      type="button"
                      onClick={copyPaymentNumber}
                      className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2.5 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-200 transition"
                    >
                      {copiedNumber ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedNumber ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                    </button>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400">
                    ১. আপনার <strong>{paymentMethod.toUpperCase()}</strong> অ্যাপ অথবা USSD মেনু থেকে উপরে দেওয়া নম্বরে <strong>৳{doc.consultationFee}</strong> সেন্ড মানি / ক্যাশ ইন করুন।<br />
                    ২. পেমেন্ট সফল হওয়ার পর প্রাপ্ত <strong>Transaction ID (TrxID)</strong> টি নিচের বক্সে দিন।
                  </p>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                      পেমেন্ট ট্রানজেকশন আইডি (Transaction ID / TrxID) *
                    </label>
                    <input
                      type="text"
                      required
                      value={transactionId}
                      onChange={e => setTransactionId(e.target.value)}
                      placeholder="যেমন: 8N7A6W9P1X"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-poppins font-bold text-sm tracking-wider uppercase focus:ring-2 focus:ring-[#2EBD59]"
                    />
                  </div>
                </div>
              )}

              {/* SSLCommerz Card Gateway */}
              {paymentMethod === 'sslcommerz' && (
                <div className="bg-blue-50/80 dark:bg-slate-900 p-4 rounded-2xl border border-blue-200 dark:border-slate-700 space-y-3 font-hind text-xs">
                  <span className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-[#0A66C2]" />
                    <span>SSLCommerz 256-bit Secure Gateway</span>
                  </span>

                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Card Number (4000 1234 5678 9010)"
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-poppins text-xs"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={e => setCardExpiry(e.target.value)}
                        className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-poppins text-xs"
                      />
                      <input
                        type="text"
                        placeholder="CVC"
                        value={cardCvc}
                        onChange={e => setCardCvc(e.target.value)}
                        className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-poppins text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs font-hind flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>পেছনে যান</span>
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#2EBD59] hover:bg-[#25a84b] text-white py-3.5 rounded-xl font-bold text-xs sm:text-sm shadow-lg transition duration-200 disabled:opacity-50 font-hind"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>
                    {submitting ? 'প্রসেস করা হচ্ছে...' : `৳${doc.consultationFee} পেমেন্ট সম্পন্ন ও বুকিং কনফার্ম করুন`}
                  </span>
                </button>
              </div>
            </motion.form>
          )}

          {/* STEP 3: PAYMENT SUCCESSFUL & APPOINTMENT CONFIRMED */}
          {step === 3 && createdAppointment && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-5 py-2 font-hind"
            >
              {/* Green Check Icon */}
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-[#2EBD59] to-emerald-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <CheckCircle2 className="w-12 h-12 stroke-[2.2]" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-snug font-hind">
                  🎉 অ্যাপয়েন্টমেন্ট বুকিং সফল হয়েছে! (Appointment Confirmed)
                </h3>
                <p className="text-sm font-bold text-[#0A66C2] dark:text-blue-400 font-hind">
                  Payment Verification in Progress: আপনার পেমেন্ট তথ্য এডমিন প্যানেলে যাচাই করার জন্য পাঠানো হয়েছে।
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold font-hind">
                  আমাদের এডমিন ও ডাক্তার টিম নির্ধারিত সময়ে আপনার সাথে যোগাযোগ করবেন।
                </p>
              </div>

              {/* Appointment Card Details */}
              <div className="bg-slate-50 dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2">
                <div className="flex justify-between items-center border-b pb-2 dark:border-slate-800">
                  <span className="text-slate-500">Appointment ID:</span>
                  <strong className="text-slate-900 dark:text-white font-poppins text-sm font-extrabold text-[#0A66C2]">
                    #{createdAppointment.id}
                  </strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Doctor Name:</span>
                  <strong className="text-slate-800 dark:text-slate-200">{doc.name}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Patient Name:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">{patientName} ({patientPhone})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Date & Time:</span>
                  <span className="text-slate-800 dark:text-slate-200">{preferredDate} ({preferredTimeSlot})</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t dark:border-slate-800">
                  <span className="text-slate-500 font-bold">Paid Fee:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold font-poppins text-sm">
                    ৳{doc.consultationFee} ({paymentMethod.toUpperCase()})
                  </span>
                </div>
              </div>

              {/* Go to Thank You Page Button */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => {
                    setSelectedDoctorForBooking(null);
                    setActivePage('thank-you');
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#0A66C2] to-[#2EBD59] hover:from-[#08529d] hover:to-[#259b48] text-white py-3.5 rounded-xl font-extrabold text-sm shadow-lg transition duration-200 transform active:scale-95"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>✅ ধন্যবাদ পেজে যান (Go to Thank You Page)</span>
                </button>

                <button
                  onClick={() => setSelectedDoctorForBooking(null)}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:underline font-semibold"
                >
                  বন্ধ করুন (Close)
                </button>
              </div>
            </motion.div>
          )}

        </div>

      </div>
    </div>
  );
};
