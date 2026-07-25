import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, CheckCircle, Truck, ShieldCheck, Clock, Star, Phone, 
  MessageSquare, ChevronDown, ChevronUp, AlertCircle, ArrowRight, Zap,
  Sparkles, Gift, ThumbsUp, MapPin, Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LandingPageData, LandingPageOffer } from '../types';

interface LandingPageProps {
  slug?: string;
}

export const LandingPage: React.FC<LandingPageProps> = ({ slug }) => {
  const { currentLandingSlug, openProductLandingPage, siteSettings, showToast, setActivePage } = useApp();
  const targetSlug = slug || currentLandingSlug || '';

  const [loading, setLoading] = useState<boolean>(true);
  const [pageData, setPageData] = useState<LandingPageData | null>(null);
  const [selectedOfferIndex, setSelectedOfferIndex] = useState<number>(0);
  
  // Quick Order Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [deliveryArea, setDeliveryArea] = useState<'inside' | 'outside'>('inside');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState<any | null>(null);

  // Accordion state for FAQs
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Countdown Timer State (3 hours countdown)
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 2,
    minutes: 58,
    seconds: 45
  });

  // Recent order notification popup
  const [recentBuyer, setRecentBuyer] = useState<{ name: string; location: string; time: string } | null>(null);

  useEffect(() => {
    if (!targetSlug) return;
    setLoading(true);

    fetch(`/api/landing-pages/${encodeURIComponent(targetSlug)}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load landing page');
        return res.json();
      })
      .then(data => {
        setPageData(data);
        if (data.buyMoreOffers && data.buyMoreOffers.length > 1) {
          // Select popular offer by default
          const popIdx = data.buyMoreOffers.findIndex((o: LandingPageOffer) => o.isPopular);
          if (popIdx !== -1) setSelectedOfferIndex(popIdx);
        }
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [targetSlug]);

  // Timer interval
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Social Proof Live Notification
  useEffect(() => {
    const buyers = [
      { name: 'মোঃ রফিকুল ইসলাম', location: 'মিরপুর, ঢাকা', time: '২ মিনিট আগে' },
      { name: 'তানজিলা আকতার', location: 'উত্তরা, ঢাকা', time: '৪ মিনিট আগে' },
      { name: 'আব্দুল করিম', location: 'চট্টগ্রাম সদর', time: '৬ মিনিট আগে' },
      { name: 'নাসরিন সুলতানা', location: 'সিলেট পয়েন্ট', time: '৮ মিনিট আগে' },
      { name: 'মাহমুদুল হাসান', location: 'রাজশাহী', time: '১২ মিনিট আগে' }
    ];

    let count = 0;
    const popupInterval = setInterval(() => {
      setRecentBuyer(buyers[count % buyers.length]);
      count++;
      setTimeout(() => setRecentBuyer(null), 5000);
    }, 14000);

    return () => clearInterval(popupInterval);
  }, []);

  const scrollToOrderForm = () => {
    const formElement = document.getElementById('quick-order-section');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      showToast('অনুগ্রহ করে আপনার নাম লিখুন', 'error');
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 11) {
      showToast('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন', 'error');
      return;
    }
    if (!customerAddress.trim()) {
      showToast('আপনার ডেলিভারি ঠিকানা দিন', 'error');
      return;
    }

    setIsSubmitting(true);

    const product = pageData?.product;
    const activeOffer = pageData?.buyMoreOffers?.[selectedOfferIndex];
    const itemQty = activeOffer ? activeOffer.quantity : 1;
    const unitPrice = activeOffer ? Math.round(activeOffer.price / itemQty) : (product?.discountPrice || product?.price || 500);
    const productPrice = activeOffer ? activeOffer.price : unitPrice;

    const deliveryCharge = deliveryArea === 'inside'
      ? (siteSettings.deliveryChargeInsideDhaka || 60)
      : (siteSettings.deliveryChargeOutsideDhaka || 120);

    const totalPrice = productPrice + deliveryCharge;

    const orderPayload = {
      customerName,
      phone: customerPhone,
      address: `${customerAddress} (${deliveryArea === 'inside' ? 'ঢাকার ভেতরে' : 'ঢাকার বাইরে'})`,
      deliveryZone: deliveryArea === 'inside' ? 'Dhaka' : 'Outside Dhaka',
      items: [
        {
          id: product?.id || pageData?.productId || 'p1',
          name: product?.nameBn || pageData?.title || 'পণ্য',
          price: unitPrice,
          quantity: itemQty,
          image: pageData?.bannerUrl || product?.image || ''
        }
      ],
      subtotal: productPrice,
      shippingFee: deliveryCharge,
      discount: 0,
      total: totalPrice,
      paymentMethod: 'cod',
      status: 'Pending',
      notes: notes ? `ল্যান্ডিং পেজ থেকে অর্ডার: ${notes}` : 'ল্যান্ডিং পেজ থেকে দ্রুত অর্ডার'
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (!res.ok) throw new Error('Order creation failed');

      const data = await res.json();
      setOrderSuccessData(data);
      showToast('আপনার অর্ডারটি সফলভাবে গৃহীত হয়েছে!', 'success');

      // WhatsApp Redirect if enabled
      if (pageData?.whatsappRedirectEnabled && siteSettings.whatsappNumber) {
        const cleanWa = siteSettings.whatsappNumber.replace(/[^0-9]/g, '');
        const text = encodeURIComponent(
          `হ্যালো, আমি অর্ডার করেছি!\nঅর্ডার নম্বর: #${data.id}\nনাম: ${customerName}\nমোবাইল: ${customerPhone}\nপণ্য: ${pageData.title}\nপরিমাণ: ${itemQty} টি\nমোট মূল্য: ৳${totalPrice}`
        );
        setTimeout(() => {
          window.open(`https://wa.me/88${cleanWa}?text=${text}`, '_blank');
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      showToast('অর্ডার করতে সমস্যা হয়েছে, আবার চেষ্টা করুন', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 bg-white">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium">ল্যান্ডিং পেজ লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 bg-white text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-3" />
        <h2 className="text-2xl font-bold text-gray-800">ল্যান্ডিং পেজ পাওয়া যায়নি</h2>
        <p className="text-gray-600 mt-2">আকাঙ্ক্ষিত পৃষ্ঠাটি বিদ্যমান নেই অথবা নিষ্ক্রিয় করা হয়েছে।</p>
        <button
          onClick={() => setActivePage('home')}
          className="mt-6 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
        >
          হোম পেজে ফিরে যান
        </button>
      </div>
    );
  }

  const product = pageData.product;
  const regularPrice = product?.price || (pageData.buyMoreOffers?.[0]?.price ? Math.round(pageData.buyMoreOffers[0].price * 1.25) : 1000);
  const offerPrice = pageData.buyMoreOffers?.[selectedOfferIndex]?.price || product?.discountPrice || product?.price || 750;
  const discountAmount = regularPrice > offerPrice ? regularPrice - offerPrice : 0;
  const discountPercent = regularPrice > 0 ? Math.round((discountAmount / regularPrice) * 100) : 0;

  const currentDeliveryFee = deliveryArea === 'inside'
    ? (siteSettings.deliveryChargeInsideDhaka || 60)
    : (siteSettings.deliveryChargeOutsideDhaka || 120);

  // Render Thank You View if order is confirmed
  if (orderSuccessData) {
    return (
      <div className="min-h-[70vh] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-8 text-center text-white">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold mb-1">অর্ডার সফল হয়েছে!</h1>
            <p className="text-emerald-100 text-lg">ধন্যবাদ! আপনার অর্ডারটি গ্রহণ করা হয়েছে।</p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-800 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-emerald-600">অর্ডার ট্র্যাকিং আইডি</span>
                <p className="text-xl font-black text-emerald-900">#{orderSuccessData.id}</p>
              </div>
              <span className="px-3 py-1 bg-emerald-600 text-white font-semibold text-xs rounded-full">
                ক্যাশ অন ডেলিভারি
              </span>
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-3">
              <h3 className="font-bold text-gray-900 text-lg">কাস্টমার ও ডেলিভারি বিবরণ:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 bg-gray-50 p-4 rounded-xl">
                <div>
                  <p className="text-gray-500 text-xs">নাম</p>
                  <p className="font-semibold text-gray-900">{customerName}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">মোবাইল নম্বর</p>
                  <p className="font-semibold text-gray-900">{customerPhone}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-gray-500 text-xs">ঠিকানা</p>
                  <p className="font-semibold text-gray-900">{customerAddress}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <h3 className="font-bold text-gray-900 text-lg mb-3">অর্ডার সমারি:</h3>
              <div className="flex items-center justify-between py-2 border-b border-gray-100 text-sm">
                <span className="text-gray-600">{pageData.title}</span>
                <span className="font-bold text-gray-900">৳{offerPrice}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100 text-sm">
                <span className="text-gray-600">ডেলিভারি চার্জ</span>
                <span className="font-bold text-gray-900">৳{currentDeliveryFee}</span>
              </div>
              <div className="flex items-center justify-between py-3 text-base font-extrabold text-blue-900">
                <span>সর্বমোট পরিশোধযোগ্য</span>
                <span className="text-2xl text-emerald-600">৳{offerPrice + currentDeliveryFee}</span>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-900 text-sm flex items-start gap-3">
              <Truck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">আমাদের প্রতিনিধি আপনাকে ফোন করে অর্ডার কনফার্ম করবেন।</p>
                <p className="text-xs text-amber-700 mt-1">
                  পণ্য হাতে পেয়ে পুরোপুরি দেখে টাকা পরিশোধ করার সুবিধা রয়েছে।
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => setActivePage('home')}
                className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition text-center shadow-md"
              >
                আরো কেনাকাটা করুন
              </button>
              {siteSettings.whatsappNumber && (
                <a
                  href={`https://wa.me/88${siteSettings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition flex items-center justify-center gap-2 shadow-md"
                >
                  <MessageSquare className="w-5 h-5" />
                  হোয়াটসঅ্যাপ সাপোর্ট
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans pb-24 sm:pb-12">
      
      {/* TOP EMERGENCY NOTICE BANNER & COUNTDOWN */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white py-2.5 px-4 text-center shadow-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-xs sm:text-sm font-bold">
          <span className="flex items-center gap-1.5 animate-pulse">
            <Zap className="w-4 h-4 text-amber-300" />
            সীমিত সময়ের বিশেষ ধামাকা অফার!
          </span>
          <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
            <Clock className="w-4 h-4 text-amber-300" />
            <span>অফারের সময় বাকি:</span>
            <span className="bg-red-900 text-amber-300 px-1.5 py-0.5 rounded font-mono text-xs">
              {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="py-8 sm:py-12 bg-gradient-to-b from-blue-50/50 via-white to-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* HERO PRODUCT MEDIA (LEFT) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative group rounded-3xl overflow-hidden bg-white shadow-xl border border-gray-100 aspect-square">
                <img
                  src={pageData.bannerUrl || product?.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800'}
                  alt={pageData.title}
                  className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                />
                
                {discountPercent > 0 && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-sm sm:text-base px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                    <Sparkles className="w-4 h-4" />
                    {discountPercent}% ডিসকাউন্ট
                  </div>
                )}

                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 shadow-md flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  ১০০% আসল প্রোডাক্ট
                </div>
              </div>

              {/* GALLERY THUMBNAILS IF ANY */}
              {pageData.galleryImages && pageData.galleryImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {pageData.galleryImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPageData({ ...pageData, bannerUrl: imgUrl })}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                        pageData.bannerUrl === imgUrl ? 'border-blue-600 shadow-md scale-105' : 'border-gray-200 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* HERO PRODUCT DETAILS & BUY (RIGHT) */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                ইন-স্টক (ক্যাশ অন ডেলিভারি এভেলেবল)
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-snug">
                {pageData.headline || pageData.title}
              </h1>

              {pageData.subheadline && (
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                  {pageData.subheadline}
                </p>
              )}

              {/* RATING & STOCK STATUS */}
              <div className="flex flex-wrap items-center gap-4 text-sm border-y border-gray-100 py-3">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-1 text-gray-800 font-extrabold">4.9 / 5.0</span>
                  <span className="text-gray-500 font-normal">({pageData.reviews?.length || 18} রিভিউ)</span>
                </div>

                <div className="text-rose-600 font-extrabold text-xs sm:text-sm bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  মাত্র {pageData.stockCount || 12}টি স্টক আছে!
                </div>
              </div>

              {/* PRICING DISPLAY */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50/40 p-5 rounded-2xl border border-blue-100 space-y-2">
                <div className="text-xs uppercase font-bold text-blue-600 tracking-wider">
                  আজকের স্পেশাল অফার প্রাইস:
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-blue-900">৳{offerPrice}</span>
                  {regularPrice > offerPrice && (
                    <span className="text-lg sm:text-xl text-gray-400 line-through font-semibold">
                      ৳{regularPrice}
                    </span>
                  )}
                  {discountAmount > 0 && (
                    <span className="bg-red-600 text-white font-bold text-xs px-2.5 py-1 rounded-md">
                      ৳{discountAmount} সেভ
                    </span>
                  )}
                </div>
              </div>

              {/* CALL TO ACTION BUTTONS */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={scrollToOrderForm}
                  className="w-full py-4 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 text-white font-extrabold text-lg sm:text-xl rounded-2xl shadow-xl hover:shadow-2xl hover:brightness-110 active:scale-[0.99] transition flex items-center justify-center gap-3 group border border-emerald-500"
                >
                  <ShoppingBag className="w-6 h-6 group-hover:bounce" />
                  এখনই অর্ডার করুন (ক্যাশ অন ডেলিভারি)
                </button>

                {siteSettings.whatsappNumber && (
                  <a
                    href={`https://wa.me/88${siteSettings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`হ্যালো, আমি ${pageData.title} সম্পর্কে জানতে চাই`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 bg-emerald-50 border-2 border-emerald-500 text-emerald-800 font-bold rounded-2xl hover:bg-emerald-100 transition flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <MessageSquare className="w-5 h-5 text-emerald-600" />
                    হোয়াটসঅ্যাপে মেসেজ দিয়ে অর্ডার করুন
                  </a>
                )}
              </div>

              {/* BADGES ROW */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs font-semibold text-gray-700">
                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center gap-1">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <span>ক্যাশ অন ডেলিভারি</span>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center gap-1">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>১০০% অরিজিনাল</span>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center gap-1">
                  <ThumbsUp className="w-5 h-5 text-indigo-600" />
                  <span>চেক করে পেমেন্ট</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* MULTI-PACK SAVINGS OFFERS */}
      {pageData.buyMoreOffers && pageData.buyMoreOffers.length > 0 && (
        <section className="py-10 bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8">
              <span className="px-3 py-1 bg-amber-100 text-amber-800 font-extrabold text-xs rounded-full uppercase tracking-wider">
                স্মার্ট সেভিংস বান্ডেল
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
                একধিক প্যাক অর্ডার করুন এবং অতিরিক্ত টাকা বাঁচান!
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pageData.buyMoreOffers.map((offer, idx) => {
                const isSelected = selectedOfferIndex === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedOfferIndex(idx);
                      scrollToOrderForm();
                    }}
                    className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 shadow-lg ring-2 ring-blue-600/20 scale-[1.02]'
                        : 'border-gray-200 hover:border-blue-300 bg-white'
                    }`}
                  >
                    {offer.isPopular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xs px-3 py-0.5 rounded-full shadow">
                        মোস্ট পপুলার
                      </span>
                    )}

                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-extrabold text-gray-900 text-lg">{offer.label}</h3>
                        {offer.savingsLabel && (
                          <span className="inline-block mt-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                            {offer.savingsLabel}
                          </span>
                        )}
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
                      }`}>
                        {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-baseline justify-between">
                      <span className="text-xs text-gray-500">মূল্য:</span>
                      <span className="text-2xl font-black text-blue-900">৳{offer.price}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* PRODUCT BENEFITS & FEATURES */}
      {((pageData.benefits && pageData.benefits.length > 0) || (pageData.features && pageData.features.length > 0)) && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
            
            {/* BENEFITS */}
            {pageData.benefits && pageData.benefits.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-gray-900">
                    কেন এই প্রোডাক্টটি ব্যবহার করবেন? (উপকারিতা)
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pageData.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-gray-800 text-sm font-semibold">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FEATURES */}
            {pageData.features && pageData.features.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-100 text-blue-700 rounded-2xl">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-gray-900">
                    বিশেষ বৈশিষ্ট্যসমূহ
                  </h2>
                </div>

                <ul className="space-y-3">
                  {pageData.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-gray-800 text-sm font-medium">
                      <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </section>
      )}

      {/* WHY CHOOSE US / GUARANTEE */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              কেন 'ঘরের ডাক্তার' থেকে কেনাকাটা করবেন?
            </h2>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              আমরা সর্বোচ্চ শততা ও কোয়ালিটি নিয়ে আপনার পাশে আছি
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-6 bg-blue-50/60 rounded-2xl border border-blue-100 text-center space-y-2">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-gray-900 text-base">১০০% অরিজিনাল</h3>
              <p className="text-xs text-gray-600">খাঁটি উপাদান নিশ্চিত করে সরাসরি সরবরাহ করা হয়।</p>
            </div>

            <div className="p-6 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-gray-900 text-base">দ্রুত ডেলিভারি</h3>
              <p className="text-xs text-gray-600">ঢাকার ভেতরে ২৪-৪৮ ঘণ্টা, বাইরে ২-৩ দিনে হোম ডেলিভারি।</p>
            </div>

            <div className="p-6 bg-amber-50/60 rounded-2xl border border-amber-100 text-center space-y-2">
              <div className="w-12 h-12 bg-amber-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-gray-900 text-base">ক্যাশ অন ডেলিভারি</h3>
              <p className="text-xs text-gray-600">পণ্য হাতে পেয়ে পুরোপুরি দেখে তারপর টাকা দেবেন।</p>
            </div>

            <div className="p-6 bg-purple-50/60 rounded-2xl border border-purple-100 text-center space-y-2">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-gray-900 text-base">২৪/৭ সাপোর্ট</h3>
              <p className="text-xs text-gray-600">যেকোনো তথ্যে বা সহায়তায় আমাদের হেল্পলাইন খোলা।</p>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK ORDER FORM SECTION */}
      <section id="quick-order-section" className="py-12 bg-gradient-to-b from-blue-50 to-emerald-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          
          <div className="bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden">
            
            <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white p-6 sm:p-8 text-center">
              <span className="inline-block px-3 py-1 bg-amber-400 text-gray-900 font-extrabold text-xs rounded-full uppercase tracking-wider mb-2">
                সহজ ১-ক্লিক ফর্ম
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold">
                অর্ডার করতে নিচের ফর্মে আপনার তথ্য দিন
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                কোনো অগ্রিম টাকা দিতে হবে না! পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন।
              </p>
            </div>

            <form onSubmit={handleOrderSubmit} className="p-6 sm:p-8 space-y-6">
              
              {/* SELECT PACKAGE OFFER IF AVAILABLE */}
              {pageData.buyMoreOffers && pageData.buyMoreOffers.length > 0 && (
                <div className="space-y-3">
                  <label className="block text-sm font-extrabold text-gray-800">
                    ১. প্যাকেজ বাছাই করুন:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {pageData.buyMoreOffers.map((off, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setSelectedOfferIndex(idx)}
                        className={`p-3 text-left rounded-xl border-2 transition flex flex-col justify-between ${
                          selectedOfferIndex === idx
                            ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold ring-2 ring-blue-600/20'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        <span className="text-xs font-semibold">{off.label}</span>
                        <span className="text-lg font-black text-blue-900 mt-1">৳{off.price}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* CUSTOMER DETAILS */}
              <div className="space-y-4">
                <label className="block text-sm font-extrabold text-gray-800">
                  ২. আপনার ডেলিভারি তথ্য প্রদান করুন:
                </label>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    আপনার নাম <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: মোঃ সাদ্দাম হোসেন"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    মোবাইল নম্বর <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="যেমন: 01700000000"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    পূর্ণাঙ্গ ঠিকানা (হাউজ নম্বর, রোড, থানা, জেলা) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="যেমন: বাসা-১২, রোড-৪, মিরপুর ১০, ঢাকা"
                    value={customerAddress}
                    onChange={e => setCustomerAddress(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm transition resize-none"
                  ></textarea>
                </div>

                {/* DELIVERY AREA SELECT */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    ডেলিভারি এরিয়া সিলেক্ট করুন:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      onClick={() => setDeliveryArea('inside')}
                      className={`p-3 rounded-xl border-2 cursor-pointer flex items-center justify-between text-xs font-bold transition ${
                        deliveryArea === 'inside'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      <span>ঢাকার ভেতরে (৳{siteSettings.deliveryChargeInsideDhaka || 60})</span>
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryArea === 'inside'}
                        onChange={() => setDeliveryArea('inside')}
                        className="accent-emerald-600"
                      />
                    </label>

                    <label
                      onClick={() => setDeliveryArea('outside')}
                      className={`p-3 rounded-xl border-2 cursor-pointer flex items-center justify-between text-xs font-bold transition ${
                        deliveryArea === 'outside'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      <span>ঢাকার বাইরে (৳{siteSettings.deliveryChargeOutsideDhaka || 120})</span>
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryArea === 'outside'}
                        onChange={() => setDeliveryArea('outside')}
                        className="accent-emerald-600"
                      />
                    </label>
                  </div>
                </div>

              </div>

              {/* ORDER SUMMARY TOTAL BOX */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>পণ্য মূল্য:</span>
                  <span className="font-bold text-gray-900">৳{offerPrice}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>ডেলিভারি চার্জ:</span>
                  <span className="font-bold text-gray-900">৳{currentDeliveryFee}</span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between items-baseline font-black text-lg text-blue-900">
                  <span>সর্বমোট বিল:</span>
                  <span className="text-2xl text-emerald-600">৳{offerPrice + currentDeliveryFee}</span>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 text-white font-extrabold text-xl rounded-2xl shadow-xl hover:shadow-2xl hover:brightness-110 active:scale-[0.99] transition flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>অর্ডার প্রসেসিং হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-6 h-6" />
                    <span>অর্ডার কনফার্ম করুন (৳{offerPrice + currentDeliveryFee})</span>
                  </>
                )}
              </button>

              <div className="text-center text-xs text-gray-500 flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                আপনার তথ্যের শতভাগ নিরাপত্তা নিশ্চিত করা হয়।
              </div>

            </form>

          </div>

        </div>
      </section>

      {/* REVIEWS SECTION */}
      {pageData.reviews && pageData.reviews.length > 0 && (
        <section className="py-12 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 font-extrabold text-xs rounded-full uppercase tracking-wider">
                গ্রাহকদের অভিজ্ঞতা
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
                সন্তুষ্ট গ্রাহকদের রিভিউ ({pageData.reviews.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pageData.reviews.map((rev, idx) => (
                <div key={idx} className="p-5 bg-gray-50/80 rounded-2xl border border-gray-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 bg-blue-600 text-white font-bold rounded-full flex items-center justify-center text-sm">
                        {rev.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-gray-900 text-sm">{rev.name}</h4>
                        {rev.verified && (
                          <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
                            <CheckCircle className="w-3 h-3 text-emerald-600" /> ভেরিফাইড বায়ার
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm italic leading-relaxed">
                    "{rev.comment}"
                  </p>

                  {rev.date && (
                    <p className="text-[11px] text-gray-400 text-right">{rev.date}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ SECTION */}
      {pageData.faqs && pageData.faqs.length > 0 && (
        <section className="py-12 bg-gray-50 border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                সাধারণ জিজ্ঞাসাসমূহ (FAQ)
              </h2>
            </div>

            <div className="space-y-3">
              {pageData.faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={idx} className="bg-white rounded-2xl border border-gray-200 overflow-hidden transition">
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-4 text-left font-extrabold text-gray-900 flex items-center justify-between text-sm sm:text-base hover:bg-gray-50 transition"
                    >
                      <span>{faq.question}</span>
                      {isOpen ? <ChevronUp className="w-5 h-5 text-blue-600 shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-sm text-gray-600 border-t border-gray-100 pt-3 leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* RECENT BUYER SOCIAL PROOF POPUP */}
      {recentBuyer && (
        <div className="fixed bottom-20 left-4 z-50 bg-white p-3 sm:p-4 rounded-2xl shadow-2xl border border-blue-100 flex items-center gap-3 animate-fade-in max-w-xs">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <p className="font-extrabold text-gray-900">{recentBuyer.name}</p>
            <p className="text-gray-500">{recentBuyer.location} থেকে {pageData.title} অর্ডার করেছেন</p>
            <span className="text-[10px] text-emerald-600 font-semibold">{recentBuyer.time}</span>
          </div>
        </div>
      )}

      {/* STICKY BOTTOM ORDER NOW BUTTON FOR MOBILE */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-200 z-40 shadow-2xl flex items-center gap-2">
        <div className="flex-1">
          <p className="text-[10px] text-gray-500 font-bold uppercase">স্পেশাল অফার</p>
          <p className="text-lg font-black text-blue-900">৳{offerPrice}</p>
        </div>
        <button
          onClick={scrollToOrderForm}
          className="flex-2 py-3 px-6 bg-emerald-600 text-white font-extrabold text-sm rounded-xl shadow-lg active:scale-95 transition flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          এখনই অর্ডার করুন
        </button>
      </div>

    </div>
  );
};
