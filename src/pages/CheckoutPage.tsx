import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { SearchableSelect } from '../components/SearchableSelect';
import {
  ShoppingBag,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Phone,
  User,
  MapPin,
  CreditCard,
  Building,
  Mail,
  Home,
  FileText,
  AlertCircle,
  Plus,
  Minus,
  Trash2
} from 'lucide-react';
import { ThankYouPage } from './ThankYouPage';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    siteSettings,
    districts,
    postOffices,
    clearCart,
    showToast,
    setActivePage,
    language,
    updateCartQuantity,
    removeFromCart
  } = useApp();

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedDistrictName, setSelectedDistrictName] = useState('Dhaka');
  const [thana, setThana] = useState('');
  const [postOfficeName, setPostOfficeName] = useState('');
  const [postCode, setPostCode] = useState('1205');
  const [villageRoad, setVillageRoad] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [deliveryNote, setDeliveryNote] = useState('');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad' | 'rocket' | 'card'>('cod');
  const [transactionId, setTransactionId] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // District options list
  const districtOptions = districts.map(d => {
    const isDhaka = d.name.toLowerCase() === 'dhaka' || d.isInsideDhaka;
    const charge = d.deliveryCharge || (isDhaka ? siteSettings.deliveryChargeInsideDhaka : siteSettings.deliveryChargeOutsideDhaka);
    return {
      value: d.name,
      label: `${d.nameBn} (${d.name})`,
      sublabel: d.division ? `${d.division} Division` : undefined,
      badge: isDhaka ? `ঢাকার ভেতরে ৳${charge}` : `ঢাকার বাইরে ৳${charge}`
    };
  });

  // Calculate current delivery charge
  const matchedDistrictObj = districts.find(
    d => d.name.toLowerCase() === selectedDistrictName.toLowerCase() || d.nameBn === selectedDistrictName
  );

  const isInsideDhaka = matchedDistrictObj
    ? matchedDistrictObj.isInsideDhaka || matchedDistrictObj.name.toLowerCase() === 'dhaka'
    : selectedDistrictName.toLowerCase() === 'dhaka';

  const deliveryCharge = matchedDistrictObj?.deliveryCharge
    ? matchedDistrictObj.deliveryCharge
    : isInsideDhaka
    ? siteSettings.deliveryChargeInsideDhaka
    : siteSettings.deliveryChargeOutsideDhaka;

  const totalAmount = cartSubtotal + deliveryCharge;

  // Filter Post Offices for selected district
  const availablePostOffices = postOffices.filter(
    po =>
      po.isEnabled &&
      (po.districtName.toLowerCase() === selectedDistrictName.toLowerCase() ||
        po.districtName === matchedDistrictObj?.name)
  );

  const postOfficeOptions = availablePostOffices.map(po => ({
    value: po.postOfficeName,
    label: `${po.postOfficeNameBn} (${po.postOfficeName}) - ${po.postCode}`,
    sublabel: `পোস্ট কোড: ${po.postCode}`,
    badge: po.postCode
  }));

  // When District Changes, auto set initial post office or post code
  const handleDistrictChange = (distVal: string) => {
    setSelectedDistrictName(distVal);
    setErrors(prev => ({ ...prev, district: '' }));

    // Reset post office / post code if not applicable
    const relevantPos = postOffices.filter(
      po => po.districtName.toLowerCase() === distVal.toLowerCase()
    );
    if (relevantPos.length > 0) {
      setPostOfficeName(relevantPos[0].postOfficeName);
      setPostCode(relevantPos[0].postCode);
    } else {
      setPostOfficeName('');
      setPostCode(distVal.toLowerCase() === 'dhaka' ? '1205' : '1000');
    }
  };

  // When Post Office selected from dropdown
  const handlePostOfficeSelect = (poVal: string, opt?: any) => {
    setPostOfficeName(poVal);
    setErrors(prev => ({ ...prev, postOffice: '' }));

    const matchedPo = postOffices.find(
      po =>
        po.postOfficeName === poVal &&
        po.districtName.toLowerCase() === selectedDistrictName.toLowerCase()
    );
    if (matchedPo) {
      setPostCode(matchedPo.postCode);
      setErrors(prev => ({ ...prev, postCode: '' }));
    }
  };

  // Validation
  const validateForm = () => {
    const errs: Record<string, string> = {};

    if (!customerName.trim()) {
      errs.customerName = 'আপনার নাম প্রদান করুন';
    }

    const cleanPhone = phone.trim().replace(/[^\d]/g, '');
    if (!cleanPhone) {
      errs.phone = 'মোবাইল নম্বর প্রদান করুন';
    } else if (!/^01[3-9]\d{8}$/.test(cleanPhone) && cleanPhone.length !== 11) {
      errs.phone = 'সঠিক ১১ ডিজিটের বিডি মোবাইল নম্বর প্রদান করুন (যেমনঃ 01700000000)';
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'সঠিক ইমেইল ঠিকানা লিখুন';
    }

    if (!selectedDistrictName) {
      errs.district = 'জেলা নির্বাচন করুন';
    }

    if (!postOfficeName.trim()) {
      errs.postOffice = 'পোস্ট অফিসের নাম প্রদান করুন';
    }

    const cleanPostCode = postCode.trim();
    if (!cleanPostCode) {
      errs.postCode = 'পোস্ট কোড প্রদান করুন';
    } else if (!/^\d{4}$/.test(cleanPostCode)) {
      errs.postCode = 'সঠিক ৪ ডিজিটের পোস্ট কোড লিখুন (যেমনঃ 1205)';
    }

    if (!fullAddress.trim()) {
      errs.fullAddress = 'পূর্ণাঙ্গ ডেলিভারি ঠিকানা প্রদান করুন';
    }

    if (paymentMethod !== 'cod' && !transactionId.trim()) {
      errs.transactionId = 'ট্রানজেকশন আইডি প্রদান করুন';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('ফর্মের লাল চিহ্ণিত ভুলগুলো সংশোধন করুন', 'error');
      return;
    }

    if (cart.length === 0) {
      showToast('আপনার কার্ট খালি!', 'error');
      return;
    }

    setPlacingOrder(true);
    try {
      // Compose clean full address string
      const constructedAddress = [
        villageRoad.trim() ? `গ্রাম/রোড/বাসা: ${villageRoad.trim()}` : '',
        fullAddress.trim(),
        thana.trim() ? `উপজেলা/থানা: ${thana.trim()}` : '',
        `পোস্ট অফিস: ${postOfficeName.trim()} (${postCode.trim()})`,
        `জেলা: ${selectedDistrictName}`
      ]
        .filter(Boolean)
        .join(', ');

      const orderData = {
        customerName: customerName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        district: selectedDistrictName,
        thana: thana.trim() || selectedDistrictName,
        postOffice: postOfficeName.trim(),
        postCode: postCode.trim(),
        villageRoad: villageRoad.trim() || undefined,
        address: constructedAddress,
        deliveryNote: deliveryNote.trim() || undefined,
        deliveryCharge,
        paymentMethod,
        transactionId: paymentMethod !== 'cod' ? transactionId.trim() : undefined,
        items: cart.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          productImage: item.product.image,
          price: item.product.discountPrice || item.product.price,
          quantity: item.quantity
        })),
        subtotal: cartSubtotal,
        discount: 0,
        total: totalAmount
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
        const newOrder = await res.json();
        setCompletedOrder(newOrder);
        clearCart();
        showToast('অভিনন্দন! আপনার অর্ডারটি সফলভাবে গৃহীত হয়েছে!', 'success');

        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } else {
        const errJson = await res.json().catch(() => ({}));
        showToast(errJson.error || 'অর্ডার সম্পন্ন করতে সমস্যা হয়েছে, পুনরায় চেষ্টা করুন', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('নেটওয়ার্ক সমস্যা, পুনরায় চেষ্টা করুন', 'error');
    } finally {
      setPlacingOrder(false);
    }
  };

  // Thank You Page View
  if (completedOrder) {
    return <ThankYouPage orderData={completedOrder} />;
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4 font-hind">
        <ShoppingBag className="w-16 h-16 mx-auto text-slate-300" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          আপনার কার্ট বর্তমানে খালি!
        </h2>
        <p className="text-xs text-slate-500">
          চেকআউট করতে প্রথমে পছন্দসই পণ্য কার্টে যোগ করুন।
        </p>
        <button
          onClick={() => setActivePage('shop')}
          className="bg-[#0A66C2] hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-xs shadow-md transition"
        >
          শপ পেজে যান
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-hind">
      {/* Page Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Truck className="w-7 h-7 text-[#0A66C2]" />
          <span>চেকআউট ও অর্ডার ডেলিভারি তথ্য (Checkout)</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          বাংলাদেশের যেকোনো জেলায় ক্যাশ অন ডেলিভারি এবং অনলাইন পেমেন্টে অর্ডার করুন।
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Address & Personal Details */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Customer Address Details Card */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
              <User className="w-5 h-5 text-[#0A66C2]" />
              <span>১. গ্রাহকের তথ্য ও পূর্ণাঙ্গ ঠিকানা (Address Form)</span>
            </h3>

            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  আপনার সম্পূর্ণ নাম (Full Name) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={e => {
                      setCustomerName(e.target.value);
                      setErrors(prev => ({ ...prev, customerName: '' }));
                    }}
                    placeholder="যেমনঃ মোঃ আব্দুল করিম"
                    className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-xs font-medium bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white ${
                      errors.customerName ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
                    }`}
                  />
                </div>
                {errors.customerName && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.customerName}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  মোবাইল নম্বর (Mobile Number) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => {
                      setPhone(e.target.value);
                      setErrors(prev => ({ ...prev, phone: '' }));
                    }}
                    placeholder="01712345678"
                    className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-xs font-medium bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white ${
                      errors.phone ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
                    }`}
                  />
                </div>
                {errors.phone && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.phone}</p>}
              </div>
            </div>

            {/* Email (Optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                ইমেইল এড্রেস (Email - ঐচ্ছিক)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    setErrors(prev => ({ ...prev, email: '' }));
                  }}
                  placeholder="yourname@example.com"
                  className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-xs font-medium bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white ${
                    errors.email ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
                  }`}
                />
              </div>
              {errors.email && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.email}</p>}
            </div>

            {/* District & Upazila/Thana */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <SearchableSelect
                  id="checkout-district-select"
                  label="জেলা (District)"
                  required
                  options={districtOptions}
                  value={selectedDistrictName}
                  onChange={val => handleDistrictChange(val)}
                  placeholder="জেলা নির্বাচন করুন (৬৪ জেলা)"
                  error={errors.district}
                />
                <p className="text-[10px] text-[#0A66C2] dark:text-blue-400 mt-1 font-medium flex items-center gap-1">
                  <Truck className="w-3 h-3" />
                  <span>
                    ডেলিভারি চার্জ: {isInsideDhaka ? `ঢাকার ভেতরে ৳${deliveryCharge}` : `ঢাকার বাইরে ৳${deliveryCharge}`}
                  </span>
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  উপজেলা / থানা (Upazila / Thana)
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={thana}
                    onChange={e => setThana(e.target.value)}
                    placeholder="যেমনঃ ধানমন্ডি / মিরপুর / সাভার"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Post Office & Post Code */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <SearchableSelect
                  id="checkout-postoffice-select"
                  label="পোস্ট অফিস (Post Office)"
                  required
                  options={postOfficeOptions}
                  value={postOfficeName}
                  onChange={(val, opt) => handlePostOfficeSelect(val, opt)}
                  placeholder="পোস্ট অফিস খুঁজুন বা টাইপ করুন..."
                  error={errors.postOffice}
                />
                {!postOfficeName && (
                  <input
                    type="text"
                    value={postOfficeName}
                    onChange={e => setPostOfficeName(e.target.value)}
                    placeholder="অথবা পোস্ট অফিসের নাম লিখুন"
                    className="mt-1.5 w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  পোস্ট কোড (Post Code) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={postCode}
                  onChange={e => {
                    setPostCode(e.target.value);
                    setErrors(prev => ({ ...prev, postCode: '' }));
                  }}
                  placeholder="যেমনঃ 1205"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white ${
                    errors.postCode ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
                  }`}
                />
                {errors.postCode && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.postCode}</p>}
              </div>
            </div>

            {/* Village / Road / House Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                গ্রাম / রোড নম্বর / বাসা নম্বর (Village / Road / House)
              </label>
              <div className="relative">
                <Home className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={villageRoad}
                  onChange={e => setVillageRoad(e.target.value)}
                  placeholder="যেমনঃ বাসা নং ২৪, রোড নং ১১, ব্লক সি"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium"
                />
              </div>
            </div>

            {/* Full Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                পূর্ণাঙ্গ ডেলিভারি ঠিকানা (Full Delivery Address) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <textarea
                  rows={2}
                  required
                  value={fullAddress}
                  onChange={e => {
                    setFullAddress(e.target.value);
                    setErrors(prev => ({ ...prev, fullAddress: '' }));
                  }}
                  placeholder="যে ঠিকানায় রাইডার পণ্য পৌঁছে দেবে (যেমনঃ ধানমন্ডি আবাসিক এলাকা, ২ নং রোডের মোড়ে...)"
                  className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-xs font-medium bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white ${
                    errors.fullAddress ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
                  }`}
                ></textarea>
              </div>
              {errors.fullAddress && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.fullAddress}</p>}
            </div>

            {/* Delivery Note (Optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                ডেলিভারি নোট / বিশেষ নির্দেশনা (Delivery Note - ঐচ্ছিক)
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={deliveryNote}
                  onChange={e => setDeliveryNote(e.target.value)}
                  placeholder="যেমনঃ বিকেলে ৩ টার পরে কল দিবেন / গেটের কাছে রেখে দিবেন"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium"
                />
              </div>
            </div>

          </div>

          {/* Payment Selection Card */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
              <CreditCard className="w-5 h-5 text-[#2EBD59]" />
              <span>২. পেমেন্ট পদ্ধতি নির্বাচন করুন (Payment Method)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-3 transition ${
                  paymentMethod === 'cod'
                    ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <p className="text-xs font-bold flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>ক্যাশ অন ডেলিভারি (COD)</span>
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">পণ্য হাতে পেয়ে টাকা বুঝিয়ে দিন</p>
                </div>
              </label>

              <label
                className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-3 transition ${
                  paymentMethod === 'bkash'
                    ? 'border-pink-500 bg-pink-50/60 dark:bg-pink-950/40 text-pink-900 dark:text-pink-200 ring-2 ring-pink-500/20'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'bkash'}
                  onChange={() => setPaymentMethod('bkash')}
                  className="text-pink-600 focus:ring-pink-500"
                />
                <div>
                  <p className="text-xs font-bold text-pink-600">bKash (বিকাশ মার্চেন্ট)</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">01700000000 নম্বর পেমেন্ট</p>
                </div>
              </label>

              <label
                className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-3 transition ${
                  paymentMethod === 'nagad'
                    ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 ring-2 ring-amber-500/20'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'nagad'}
                  onChange={() => setPaymentMethod('nagad')}
                  className="text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <p className="text-xs font-bold text-amber-600">Nagad (নগদ গেটওয়ে)</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">ইনস্ট্যান্ট বিকাশ/নগদ পে</p>
                </div>
              </label>

              <label
                className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-3 transition ${
                  paymentMethod === 'card'
                    ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <p className="text-xs font-bold text-blue-600">Credit / Debit Card</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Visa / Mastercard Ready</p>
                </div>
              </label>
            </div>

            {paymentMethod !== 'cod' && (
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  {paymentMethod.toUpperCase()} ট্রানজেকশন আইডি প্রদান করুনঃ <span className="text-red-500">*</span>
                </p>
                <input
                  type="text"
                  required
                  value={transactionId}
                  onChange={e => {
                    setTransactionId(e.target.value);
                    setErrors(prev => ({ ...prev, transactionId: '' }));
                  }}
                  placeholder="যেমনঃ Trx981249124"
                  className={`w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-slate-800 ${
                    errors.transactionId ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
                  }`}
                />
                {errors.transactionId && <p className="text-[11px] text-red-500 font-medium">{errors.transactionId}</p>}
              </div>
            )}
          </div>

        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-lg space-y-5 sticky top-24">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3 flex items-center justify-between">
              <span>অর্ডার সামারি</span>
              <span className="text-xs bg-blue-100 dark:bg-blue-950 text-[#0A66C2] dark:text-blue-300 px-2.5 py-1 rounded-full font-bold">
                {cart.length} টি আইটেম
              </span>
            </h3>

            {/* Cart Items List */}
            <div className="space-y-4 max-h-80 overflow-y-auto pr-1 divide-y divide-slate-100 dark:divide-slate-700/50">
              {cart.map(item => {
                const effectivePrice = item.product.discountPrice || item.product.price;
                return (
                  <div key={item.product.id} className="pt-3 first:pt-0 flex flex-col sm:flex-row gap-3 items-start sm:items-center text-xs">
                    <div className="flex items-center gap-3 w-full sm:w-auto flex-1 min-w-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-xl object-cover bg-slate-100 border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <p className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm truncate">
                          {language === 'bn' ? item.product.nameBn : item.product.name}
                        </p>
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="text-slate-500 dark:text-slate-400 font-medium">মূল্য:</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200 font-poppins">৳{effectivePrice}</span>
                          {item.product.discountPrice && (
                            <span className="text-[10px] text-slate-400 line-through font-poppins">৳{item.product.price}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quantity Selector & Item Subtotal */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-700/60">
                      <div className="flex items-center border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700/50 p-0.5">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-600 rounded transition active:scale-90"
                          title="কমান"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center font-bold font-poppins text-slate-800 dark:text-white text-xs">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-600 rounded transition active:scale-90"
                          title="বাড়ান"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <span className="block text-[10px] text-slate-400 sm:hidden">সাবটোটাল</span>
                          <span className="font-extrabold text-[#0A66C2] dark:text-blue-400 font-poppins text-sm shrink-0">
                            ৳{effectivePrice * item.quantity}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-slate-400 hover:text-red-500 p-1 rounded transition"
                          title="রিমুভ করুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cost Breakdown */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>পণ্যের সাবটোটাল:</span>
                <span className="font-bold font-poppins text-slate-900 dark:text-white">৳{cartSubtotal}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>
                  ডেলিভারি চার্জ ({selectedDistrictName}):
                  {isInsideDhaka ? (
                    <span className="ml-1 text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded-sm">
                      ঢাকার ভেতরে
                    </span>
                  ) : (
                    <span className="ml-1 text-[10px] text-blue-600 font-bold bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 rounded-sm">
                      ঢাকার বাইরে
                    </span>
                  )}
                </span>
                <span className="font-bold font-poppins text-slate-900 dark:text-white">৳{deliveryCharge}</span>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline font-extrabold text-[#0A66C2] dark:text-blue-400 text-base">
                <span>সর্বমোট পরিশোধযোগ্য:</span>
                <span className="text-2xl font-poppins text-emerald-600 dark:text-emerald-400">
                  ৳{totalAmount}
                </span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              disabled={placingOrder}
              className="w-full flex items-center justify-center gap-2 bg-[#2EBD59] hover:bg-[#24a24a] text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-500/20 transition disabled:opacity-50 active:scale-[0.99]"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>
                {placingOrder ? 'অর্ডার প্রসেস হচ্ছে...' : 'অর্ডার কনফার্ম করুন (Confirm Order)'}
              </span>
            </button>

            <div className="text-[11px] text-slate-500 text-center space-y-1 pt-1">
              <p className="flex items-center justify-center gap-1 text-slate-600 dark:text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>আপনার তথ্য ১০০% সুরক্ষিত থাকবে।</span>
              </p>
              <p>হেল্পলাইন: {siteSettings.hotline}</p>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
};
