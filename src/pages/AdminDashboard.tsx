import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Doctor, Order, Appointment, SiteSettings, LandingPageData } from '../types';
import { AdminOrderManagement } from '../components/AdminOrderManagement';
import { AdminDeliveryAreaManagement } from '../components/AdminDeliveryAreaManagement';
import { Logo } from '../components/Logo';
import {
  ShieldCheck,
  LogOut,
  LayoutDashboard,
  ShoppingBag,
  Stethoscope,
  ClipboardList,
  Settings,
  Plus,
  Trash2,
  Edit,
  DollarSign,
  Users,
  CheckCircle2,
  AlertCircle,
  Phone,
  MessageSquare,
  RefreshCw,
  Sparkles,
  Save,
  Globe,
  ExternalLink,
  Copy,
  Layers,
  Eye,
  Truck,
  Share2
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    isAdmin,
    adminLogin,
    adminLogout,
    siteSettings,
    updateSiteSettingsState,
    products,
    doctors,
    landingPages,
    fetchProducts,
    fetchDoctors,
    fetchLandingPages,
    openProductLandingPage,
    showToast,
    language
  } = useApp();

  // Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'doctors' | 'orders' | 'appointments' | 'settings' | 'landing-pages' | 'delivery-areas'>('dashboard');

  // Landing Page Modal / Form State
  const [showLandingModal, setShowLandingModal] = useState(false);
  const [editingLandingId, setEditingLandingId] = useState<string | null>(null);
  const [landingForm, setLandingForm] = useState({
    productId: '',
    slug: '',
    title: '',
    headline: '',
    subheadline: '',
    bannerUrl: '',
    galleryImagesText: '',
    videoUrl: '',
    benefitsText: '',
    featuresText: '',
    faqsText: '',
    reviewsText: '',
    buyMoreOffersText: '',
    countdownMinutes: 180,
    stockCount: 15,
    whatsappRedirectEnabled: true,
    isActive: true,
    seoTitle: '',
    seoDescription: '',
    fbPixelId: '',
    gtmId: ''
  });

  // Admin Data States
  const [stats, setStats] = useState<any>({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    totalDoctors: 0,
    pendingAppointments: 0,
    totalCustomers: 0
  });

  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [appointmentsList, setAppointmentsList] = useState<Appointment[]>([]);

  // Product Modal / Form State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    nameBn: '',
    category: 'organic' as 'organic' | 'medical',
    subcategory: 'organic-honey',
    price: 500,
    discountPrice: 420,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=600&q=80',
    description: '',
    descriptionBn: '',
    isOrganic: true,
    isBestSeller: false,
    isFeatured: true
  });

  // Doctor Modal / Form State
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    nameBn: '',
    degree: '',
    degreeBn: '',
    specialty: '',
    specialtyBn: '',
    experienceYears: 10,
    consultationFee: 700,
    availability: 'Sat - Thu: 6:00 PM - 9:00 PM',
    availabilityBn: 'শনি - বৃহঃ সন্ধ্যা ৬:০০ - রাত ৯:০০',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=500&q=80',
    bmdcReg: 'A-45892'
  });

  // Site Settings Form
  const [settingsForm, setSettingsForm] = useState<SiteSettings>({ ...siteSettings });

  // Load Admin Data when authenticated
  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  const loadAdminData = async () => {
    try {
      const [resStats, resOrders, resApts] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/orders'),
        fetch('/api/appointments')
      ]);

      if (resStats.ok) setStats(await resStats.json());
      if (resOrders.ok) setOrdersList(await resOrders.json());
      if (resApts.ok) setAppointmentsList(await resApts.json());
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  };

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        adminLogin(data.token);
      } else {
        showToast(data.error || 'ভুল ইমেইল বা পাসওয়ার্ড! (Invalid credentials)', 'error');
      }
    } catch (err) {
      showToast('লগইন সার্ভার ত্রুটি', 'error');
    } finally {
      setLoginLoading(false);
    }
  };

  // PRODUCT CRUD HANDLERS
  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      nameBn: '',
      category: 'organic',
      subcategory: 'organic-honey',
      price: 500,
      discountPrice: 450,
      stock: 50,
      image: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=600&q=80',
      description: 'High quality organic product',
      descriptionBn: 'উচ্চমানের প্রিমিয়াম পণ্য',
      isOrganic: true,
      isBestSeller: false,
      isFeatured: true
    });
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setProductForm({
      name: p.name,
      nameBn: p.nameBn,
      category: p.category,
      subcategory: p.subcategory,
      price: p.price,
      discountPrice: p.discountPrice || p.price,
      stock: p.stock,
      image: p.image,
      description: p.description,
      descriptionBn: p.descriptionBn,
      isOrganic: !!p.isOrganic,
      isBestSeller: !!p.isBestSeller,
      isFeatured: !!p.isFeatured
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingProductId ? `/api/products/${editingProductId}` : '/api/products';
      const method = editingProductId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productForm)
      });

      if (res.ok) {
        showToast(editingProductId ? 'পণ্য আপডেট হয়েছে!' : 'নতুন পণ্য যোগ করা হয়েছে!', 'success');
        setShowProductModal(false);
        fetchProducts();
        loadAdminData();
      } else {
        showToast('পণ্য সংরক্ষণ ব্যর্থ হয়েছে', 'error');
      }
    } catch (err) {
      showToast('সার্ভার ত্রুটি', 'error');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই পণ্যটি মুছে ফেলতে চান?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('পণ্যটি সফলভাবে মুছে ফেলা হয়েছে', 'info');
        fetchProducts();
        loadAdminData();
      }
    } catch (err) {
      showToast('মুছে ফেলা ব্যর্থ হয়েছে', 'error');
    }
  };

  // DOCTOR CRUD HANDLERS
  const handleOpenAddDoctor = () => {
    setEditingDoctorId(null);
    setDoctorForm({
      name: 'Dr. New Specialist',
      nameBn: 'ডাঃ নতুন স্পেশালিস্ট',
      degree: 'MBBS, FCPS',
      degreeBn: 'এমবিবিএস, এফসিপিএস',
      specialty: 'Medicine Specialist',
      specialtyBn: 'মেডিসিন বিশেষজ্ঞ',
      experienceYears: 8,
      consultationFee: 700,
      availability: 'Sat - Thu: 5:00 PM - 8:00 PM',
      availabilityBn: 'শনি - বৃহঃ বিকাল ৫:০০ - রাত ৮:০০',
      photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=500&q=80',
      bmdcReg: 'A-60124'
    });
    setShowDoctorModal(true);
  };

  const handleOpenEditDoctor = (d: Doctor) => {
    setEditingDoctorId(d.id);
    setDoctorForm({
      name: d.name,
      nameBn: d.nameBn,
      degree: d.degree,
      degreeBn: d.degreeBn,
      specialty: d.specialty,
      specialtyBn: d.specialtyBn,
      experienceYears: d.experienceYears,
      consultationFee: d.consultationFee,
      availability: d.availability,
      availabilityBn: d.availabilityBn,
      photo: d.photo,
      bmdcReg: d.bmdcReg || 'A-REG'
    });
    setShowDoctorModal(true);
  };

  const handleSaveDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingDoctorId ? `/api/doctors/${editingDoctorId}` : '/api/doctors';
      const method = editingDoctorId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doctorForm)
      });

      if (res.ok) {
        showToast(editingDoctorId ? 'ডাক্তারের তথ্য আপডেট হয়েছে!' : 'নতুন ডাক্তার যোগ করা হয়েছে!', 'success');
        setShowDoctorModal(false);
        fetchDoctors();
        loadAdminData();
      } else {
        showToast('সংরক্ষণ ব্যর্থ হয়েছে', 'error');
      }
    } catch (err) {
      showToast('সার্ভার ত্রুটি', 'error');
    }
  };

  const handleDeleteDoctor = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই ডাক্তার প্রোফাইলটি মুছে ফেলতে চান?')) return;
    try {
      const res = await fetch(`/api/doctors/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('ডাক্তার প্রোফাইলটি মুছে ফেলা হয়েছে', 'info');
        fetchDoctors();
        loadAdminData();
      }
    } catch (err) {
      showToast('মুছে ফেলা ব্যর্থ হয়েছে', 'error');
    }
  };

  // LANDING PAGE HANDLERS
  const handleOpenAddLandingPage = () => {
    setEditingLandingId(null);
    const defaultProduct = products[0];
    const defaultProductId = defaultProduct ? defaultProduct.id : 'p1';
    const defaultProductName = defaultProduct ? (defaultProduct.nameBn || defaultProduct.name) : 'অর্গানিক মধু';
    const defaultSlug = defaultProduct ? (defaultProduct.id.toLowerCase().replace(/[^a-z0-9]+/g, '-')) : 'organic-honey';

    setLandingForm({
      productId: defaultProductId,
      slug: defaultSlug,
      title: defaultProductName,
      headline: `🔥 ১০০% অরিজিনাল ও সেরা মানের ${defaultProductName} - অফার মূল্যে সরাসরি অর্ডার করুন!`,
      subheadline: 'আজই অর্ডার করুন এবং বিশেষ ডিসকাউন্ট মূল্যে ক্যাশ অন ডেলিভারিতে হোম ডেলিভারি গ্রহণ করুন।',
      bannerUrl: defaultProduct?.image || '',
      galleryImagesText: defaultProduct?.image || '',
      videoUrl: '',
      benefitsText: "১০০% খাঁটি, বিএসটিআই টেস্টেড ও কেমিক্যাল-মুক্ত\nশরীরের ইমিউনিটি বৃদ্ধিতে অত্যন্ত কার্যকর\nসারাদেশে ক্যাশ অন ডেলিভারি সুবিধা",
      featuresText: "প্রিমিয়াম এয়ার-টাইট সেফটি প্যাক\n২৪ ঘণ্টার মধ্যে রিটার্ন সুবিধা",
      faqsText: "কীভাবে অর্ডার করব? = ফর্মে নাম ও ঠিকানা লিখে কনফার্ম করুন\nডেলিভারি চার্জ কত? = ঢাকা ৬০, বাইরে ১২০ টাকা",
      reviewsText: "তানভীর আহমেদ | 5 | দুর্দান্ত কোয়ালিটি!\nসাদিয়া | 5 | ১০০% অরিজিনাল প্রোডাক্ট",
      buyMoreOffersText: "১টি প্যাক = 500 = নিয়মিত প্রাইস\n২টি প্যাক (অফার) = 900 = ৳100 ছাড়\n৩টি প্যাক (ফ্যামিলি) = 1300 = ৳200 ছাড়",
      countdownMinutes: 180,
      stockCount: 15,
      whatsappRedirectEnabled: true,
      isActive: true,
      seoTitle: `${defaultProductName} - বিশেষ ডিসকাউন্ট অফার`,
      seoDescription: `${defaultProductName} অফার মূল্যে সরাসরি অনলাইন অর্ডার করুন।`,
      fbPixelId: '',
      gtmId: ''
    });
    setShowLandingModal(true);
  };

  const handleOpenEditLandingPage = (lp: LandingPageData) => {
    setEditingLandingId(lp.id);

    const benefitsText = Array.isArray(lp.benefits) ? lp.benefits.join('\n') : '';
    const featuresText = Array.isArray(lp.features) ? lp.features.join('\n') : '';
    const galleryImagesText = Array.isArray(lp.galleryImages) ? lp.galleryImages.join('\n') : '';
    const faqsText = Array.isArray(lp.faqs) ? lp.faqs.map(f => `${f.question} = ${f.answer}`).join('\n') : '';
    const reviewsText = Array.isArray(lp.reviews) ? lp.reviews.map(r => `${r.name} | ${r.rating || 5} | ${r.comment}`).join('\n') : '';
    const buyMoreOffersText = Array.isArray(lp.buyMoreOffers) ? lp.buyMoreOffers.map(o => `${o.label} = ${o.price} = ${o.savingsLabel || ''}`).join('\n') : '';

    setLandingForm({
      productId: lp.productId,
      slug: lp.slug,
      title: lp.title,
      headline: lp.headline,
      subheadline: lp.subheadline || '',
      bannerUrl: lp.bannerUrl || '',
      galleryImagesText,
      videoUrl: lp.videoUrl || '',
      benefitsText,
      featuresText,
      faqsText,
      reviewsText,
      buyMoreOffersText,
      countdownMinutes: lp.countdownMinutes || 180,
      stockCount: lp.stockCount || 15,
      whatsappRedirectEnabled: lp.whatsappRedirectEnabled !== false,
      isActive: lp.isActive !== false,
      seoTitle: lp.seoTitle || '',
      seoDescription: lp.seoDescription || '',
      fbPixelId: lp.fbPixelId || '',
      gtmId: lp.gtmId || ''
    });
    setShowLandingModal(true);
  };

  const handleSaveLandingPage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const benefits = landingForm.benefitsText.split('\n').map(s => s.trim()).filter(Boolean);
      const features = landingForm.featuresText.split('\n').map(s => s.trim()).filter(Boolean);
      const galleryImages = landingForm.galleryImagesText.split('\n').map(s => s.trim()).filter(Boolean);

      const faqs = landingForm.faqsText.split('\n').map(line => {
        const parts = line.split('=');
        return {
          question: parts[0]?.trim() || '',
          answer: parts[1]?.trim() || ''
        };
      }).filter(f => f.question);

      const reviews = landingForm.reviewsText.split('\n').map((line, idx) => {
        const parts = line.split('|');
        return {
          id: `rev-${idx + 1}`,
          name: parts[0]?.trim() || 'গ্রাহক',
          rating: Number(parts[1]?.trim()) || 5,
          comment: parts[2]?.trim() || 'খুব ভালো প্রোডাক্ট',
          verified: true
        };
      }).filter(r => r.name);

      const buyMoreOffers = landingForm.buyMoreOffersText.split('\n').map((line, idx) => {
        const parts = line.split('=');
        const priceNum = Number(parts[1]?.trim()) || 500;
        return {
          quantity: idx + 1,
          label: parts[0]?.trim() || `${idx + 1}টি প্যাক`,
          price: priceNum,
          savingsLabel: parts[2]?.trim() || '',
          isPopular: idx === 1
        };
      }).filter(o => o.label);

      const payload = {
        productId: landingForm.productId,
        slug: landingForm.slug.toLowerCase().trim(),
        title: landingForm.title,
        headline: landingForm.headline,
        subheadline: landingForm.subheadline,
        bannerUrl: landingForm.bannerUrl,
        galleryImages,
        videoUrl: landingForm.videoUrl,
        benefits,
        features,
        faqs,
        reviews,
        buyMoreOffers,
        countdownMinutes: landingForm.countdownMinutes,
        stockCount: landingForm.stockCount,
        whatsappRedirectEnabled: landingForm.whatsappRedirectEnabled,
        isActive: landingForm.isActive,
        seoTitle: landingForm.seoTitle,
        seoDescription: landingForm.seoDescription,
        fbPixelId: landingForm.fbPixelId,
        gtmId: landingForm.gtmId
      };

      const url = editingLandingId ? `/api/landing-pages/${editingLandingId}` : '/api/landing-pages';
      const method = editingLandingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast(editingLandingId ? 'ল্যান্ডিং পেজ আপডেট হয়েছে!' : 'নতুন ল্যান্ডিং পেজ তৈরি করা হয়েছে!', 'success');
        setShowLandingModal(false);
        fetchLandingPages();
      } else {
        showToast('সংরক্ষণ করতে সমস্যা হয়েছে', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('সার্ভার ত্রুটি', 'error');
    }
  };

  const handleDeleteLandingPage = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই ল্যান্ডিং পেজটি মুছে ফেলতে চান?')) return;
    try {
      const res = await fetch(`/api/landing-pages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('ল্যান্ডিং পেজটি মুছে ফেলা হয়েছে', 'info');
        fetchLandingPages();
      }
    } catch (err) {
      showToast('মুছে ফেলা ব্যর্থ হয়েছে', 'error');
    }
  };

  const handleDuplicateLandingPage = async (id: string) => {
    try {
      const res = await fetch(`/api/landing-pages/${id}/duplicate`, { method: 'POST' });
      if (res.ok) {
        showToast('ল্যান্ডিং পেজটি ডুপ্লিকেট করা হয়েছে!', 'success');
        fetchLandingPages();
      }
    } catch (err) {
      showToast('ডুপ্লিকেট করা যায়নি', 'error');
    }
  };

  const handleToggleLandingPageStatus = async (lp: LandingPageData) => {
    try {
      const res = await fetch(`/api/landing-pages/${lp.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !lp.isActive })
      });
      if (res.ok) {
        showToast(`ল্যান্ডিং পেজটি ${!lp.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'} করা হয়েছে`, 'info');
        fetchLandingPages();
      }
    } catch (err) {
      showToast('স্ট্যাটাস আপডেট ব্যর্থ', 'error');
    }
  };

  // ORDER STATUS UPDATE
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        showToast(`অর্ডার #${orderId} স্টেটাস স্ট্যাটাস পরিবর্তন হয়েছে`, 'success');
        loadAdminData();
      }
    } catch (err) {
      showToast('স্টেটাস আপডেট ব্যর্থ হয়েছে', 'error');
    }
  };

  // APPOINTMENT STATUS UPDATE
  const handleUpdateAppointmentStatus = async (aptId: string, status: string) => {
    try {
      const res = await fetch(`/api/appointments/${aptId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        showToast(`অ্যাপয়েন্টমেন্ট #${aptId} স্টেটাস আপডেট হয়েছে`, 'success');
        loadAdminData();
      }
    } catch (err) {
      showToast('আপডেট ব্যর্থ হয়েছে', 'error');
    }
  };

  // SITE SETTINGS SAVE (WHATSAPP NUMBER UPDATE)
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm)
      });
      if (res.ok) {
        const updated = await res.json();
        updateSiteSettingsState(updated);
        showToast('ওয়েবসাইট সেটিংস ও হোয়াটসঅ্যাপ নম্বর আপডেট সম্পন্ন!', 'success');
      } else {
        showToast('সেটিংস সংরক্ষণ ব্যর্থ হয়েছে', 'error');
      }
    } catch (err) {
      showToast('সার্ভার ত্রুটি', 'error');
    }
  };

  // 1. IF NOT ADMIN, SHOW ADMIN LOGIN SCREEN
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 font-hind">
        <div className="bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl space-y-6 relative overflow-hidden">
          {/* Subtle Green & Blue Top Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0A66C2] to-[#2EBD59]" />

          {/* Website Logo & Title */}
          <div className="text-center space-y-3 pt-2">
            <div className="flex justify-center">
              <Logo size="lg" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-2">
              Admin Login
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              এডমিন প্যানেলে প্রবেশ করুন (Secure Portal)
            </p>
          </div>

          <form onSubmit={handleAdminLoginSubmit} className="space-y-4 pt-2" autoComplete="off">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Username or Email
              </label>
              <input
                type="text"
                required
                autoComplete="off"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ইউজারনেম বা ইমেইল লিখুন"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm font-poppins font-medium focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent outline-hidden transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                autoComplete="off"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm font-poppins font-medium focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent outline-hidden transition"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => showToast('পাসওয়ার্ড রিকভারি করতে প্রধান সিস্টেম অ্যাডমিনিস্ট্রেটরের সাথে যোগাযোগ করুন।', 'info')}
                className="text-xs font-bold text-[#0A66C2] dark:text-blue-400 hover:text-[#2EBD59] transition cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#0A66C2] to-[#2EBD59] hover:from-[#08529d] hover:to-[#259b48] text-white py-3.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition disabled:opacity-50 mt-2 cursor-pointer"
            >
              <span>{loginLoading ? 'যাচাই করা হচ্ছে...' : 'Login'}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-hind">
      
      {/* Top Bar Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Control Center
            </span>
            <h1 className="text-2xl font-bold font-hind">
              ঘরের ডাক্তার এডমিন ড্যাশবোর্ড
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Admin Profile Badge */}
          <div className="flex items-center gap-2.5 bg-slate-800/90 border border-slate-700/80 px-3.5 py-2 rounded-xl text-xs">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0A66C2] to-[#2EBD59] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
              A
            </div>
            <div className="text-left leading-tight">
              <span className="block font-bold text-slate-100">System Admin</span>
              {siteSettings.email && siteSettings.email.trim().length > 0 && (
                <span className="block text-[11px] text-emerald-400 font-poppins">{siteSettings.email}</span>
              )}
            </div>
          </div>

          <button
            onClick={loadAdminData}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold transition"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4 text-emerald-400" />
            <span>রিফ্রেশ</span>
          </button>

          <button
            onClick={adminLogout}
            className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>লগআউট</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto bg-white dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition ${
            activeTab === 'dashboard'
              ? 'bg-[#0A66C2] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>ড্যাশবোর্ড ওভারভিউ</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition ${
            activeTab === 'products'
              ? 'bg-[#0A66C2] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>পণ্য ম্যানেজমেন্ট ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('landing-pages')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition ${
            activeTab === 'landing-pages'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>ল্যান্ডিং পেজসমূহ ({landingPages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('doctors')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition ${
            activeTab === 'doctors'
              ? 'bg-[#2EBD59] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>ডাক্তার ডিরেক্টরি ({doctors.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition ${
            activeTab === 'orders'
              ? 'bg-[#0A66C2] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>অর্ডারসমূহ ({ordersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('delivery-areas')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition ${
            activeTab === 'delivery-areas'
              ? 'bg-[#0A66C2] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Truck className="w-4 h-4 text-emerald-500" />
          <span>ডেলিভারি এরিয়া ও চার্জ</span>
        </button>

        <button
          onClick={() => setActiveTab('appointments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition ${
            activeTab === 'appointments'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>ডাক্তার অ্যাপয়েন্টমেন্ট ({appointmentsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition ${
            activeTab === 'settings'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>ওয়েবসাইট সেটিংস (WhatsApp/Hotline)</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-[#2EBD59]">
                <DollarSign className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold">মোট সেলস রেভিনিউ</p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-poppins">
                  ৳{stats.totalRevenue}
                </h3>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-[#0A66C2]">
                <ClipboardList className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold">মোট অর্ডার সংখ্যা</p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-poppins">
                  {stats.totalOrders}
                </h3>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold">পেন্ডিং অর্ডার</p>
                <h3 className="text-2xl font-extrabold text-amber-600 font-poppins">
                  {stats.pendingOrders}
                </h3>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600">
                <Stethoscope className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold">ডাক্তার অ্যাপয়েন্টমেন্ট</p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-poppins">
                  {appointmentsList.length}
                </h3>
              </div>
            </div>
          </div>

          {/* Recent Orders Preview */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              সাম্প্রতিক অর্ডারসমূহ (Recent Orders)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 font-bold">
                    <th className="p-3">আইডি</th>
                    <th className="p-3">গ্রাহকের নাম</th>
                    <th className="p-3">ফোন নম্বর</th>
                    <th className="p-3">ঠিকানা</th>
                    <th className="p-3">মূল্য</th>
                    <th className="p-3">স্টেটাস</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {ordersList.slice(0, 5).map(o => (
                    <tr key={o.id}>
                      <td className="p-3 font-bold text-[#0A66C2] font-poppins">{o.id}</td>
                      <td className="p-3 font-bold">{o.customerName}</td>
                      <td className="p-3 font-poppins">{o.phone}</td>
                      <td className="p-3 truncate max-w-xs">{o.address} ({o.district})</td>
                      <td className="p-3 font-extrabold font-poppins text-[#0A66C2]">৳{o.total}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          o.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : o.status === 'Pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              পণ্যসমূহ তালিকা ({products.length})
            </h2>
            <button
              onClick={handleOpenAddProduct}
              className="flex items-center gap-1.5 bg-[#0A66C2] hover:bg-[#08529d] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন পণ্য যোগ করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(p => {
              const lp = landingPages.find(l => l.productId === p.id);
              const slug = lp?.slug || p.subcategory || `product-${p.id}`;
              const fullUrl = `${window.location.origin}/product/${slug}`;

              return (
              <div
                key={p.id}
                className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col gap-3 shadow-xs"
              >
                <div className="flex gap-4 items-center justify-between">
                  <img
                    src={p.image}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover bg-slate-100 shrink-0"
                  />
                  <div className="flex-1 space-y-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                      {p.nameBn || p.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 uppercase font-bold">{p.category} • {p.subcategory}</p>
                    <p className="text-xs font-extrabold text-[#0A66C2] font-poppins">৳{p.discountPrice || p.price}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleOpenEditProduct(p)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* LANDING PAGE LINK & FB ADS CONVERSION URL (Requirement 5 & 6) */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-[#2EBD59]" />
                      <span>ল্যান্ডিং পেজ (FB Ads Link):</span>
                    </span>
                    <a
                      href={`/product/${slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#0A66C2] dark:text-blue-400 hover:underline flex items-center gap-0.5 font-poppins font-bold"
                      title="ওপেন করুন"
                    >
                      <span>ভিজিট</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900/80 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                    <code className="text-[10px] font-poppins text-slate-600 dark:text-slate-300 truncate flex-1 select-all">
                      {fullUrl}
                    </code>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 pt-1">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(fullUrl);
                        showToast("ল্যান্ডিং পেজ লিংক কপি করা হয়েছে! Facebook Ads-এ ব্যবহার করুন।", "success");
                      }}
                      className="bg-[#0A66C2] hover:bg-[#08529d] text-white py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 shadow-xs transition active:scale-95 col-span-3 sm:col-span-1"
                      title="Copy Landing Page Link"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>লিংক কপি</span>
                    </button>
                    <button
                      onClick={() => {
                        if (lp) {
                          handleOpenEditLandingPage(lp);
                        } else {
                          const targetLp = {
                            id: `lp-${p.id}`,
                            productId: p.id,
                            slug: slug,
                            title: p.nameBn || p.name,
                            headline: `🔥 ১০০% অরিজিনাল ও সেরা মানের ${p.nameBn || p.name} - সরাসরি অফার মূল্যে অর্ডার করুন!`,
                            subheadline: "আজই অর্ডার করুন এবং বিশেষ ডিসকাউন্ট মূল্যে ক্যাশ অন ডেলিভারিতে হোম ডেলিভারি গ্রহণ করুন।",
                            bannerUrl: p.image,
                            galleryImagesText: p.image,
                            videoUrl: "",
                            benefitsText: "১০০% খাঁটি, বিএসটিআই টেস্টেড ও কেমিক্যাল-মুক্ত প্রাকৃতিক পণ্য\nশরীরের সার্বিক সুস্থতা ও ইমিউনিটি বৃদ্ধিতে অত্যন্ত কার্যকর\nস্বচ্ছ প্যাকেজিং ও ডেলিভারিম্যানের সামনে দেখে চেক করার সুযোগ\nসারাদেশে দ্রুততম সময়ে নিশ্চিত ক্যাশ অন ডেলিভারি সুবিধা",
                            featuresText: "প্রিমিয়াম এয়ার-টাইট সেফটি প্যাক\nঅরিজিনাল ব্র্যান্ডের গুণগত মান নিশ্চিত\nপণ্য অপছন্দ হলে ২৪ ঘণ্টার মধ্যে রিটার্ন সুবিধা",
                            faqsText: "প্রশ্ন: কীভাবে অর্ডার করব? | উত্তর: নিচের অর্ডার ফর্মে আপনার নাম, মোবাইল নম্বর এবং সঠিক ঠিকানা দিয়ে \"অর্ডার কনফার্ম করুন\" বাটনে চাপুন।\nপ্রশ্ন: ডেলিভারি চার্জ কত এবং কতদিনে পাব? | উত্তর: ঢাকার ভেতর ৬০ টাকা (১-২ দিন) এবং ঢাকার বাইরে ১২০ টাকা (২-৩ দিন)।",
                            reviewsText: "আব্দুল করিম | 5 | খুবই ভালো মানের পণ্য, প্যাকেজিং খুব সুন্দর ছিল এবং সময়মতো ডেলিভারি পেয়েছি। | true\nফারজানা ইয়াসমিন | 5 | অরিজিনাল কোয়ালিটির জন্য ধন্যবাদ। পরিবারের সবাই খুব পছন্দ করেছে। | true",
                            buyMoreOffersText: "১ পিস | 0 | রেগুলার অফার | false\n২ পিস (জনপ্রিয় অফার) | 100 | মোস্ট পপুলার | true\n৩ পিস (সুপার সেভার) | 200 | বেস্ট ভ্যালু | false",
                            countdownMinutes: 180,
                            stockCount: p.stock || 15,
                            whatsappRedirectEnabled: false,
                            isActive: true,
                            seoTitle: `${p.nameBn || p.name} - ক্যাশ অন ডেলিভারিতে অর্ডার করুন`,
                            seoDescription: `${p.nameBn || p.name} কিনুন সেরা দামে। ১০০% অরিজিনাল কোয়ালিটি নিশ্চিত。`,
                            fbPixelId: "",
                            gtmId: ""
                          };
                          handleOpenEditLandingPage(targetLp);
                        }
                      }}
                      className="bg-[#2EBD59] hover:bg-[#259b48] text-white py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 shadow-xs transition active:scale-95"
                      title="Edit Landing Page"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>পেজ এডিট</span>
                    </button>
                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: p.nameBn || p.name,
                            text: `বিশেষ ছাড়ে অর্ডার করুন: ${p.nameBn || p.name}`,
                            url: fullUrl
                          }).catch(() => {});
                        } else {
                          navigator.clipboard.writeText(fullUrl);
                          showToast("শেয়ার করার জন্য লিংক কপি করা হয়েছে!", "success");
                        }
                      }}
                      className="bg-slate-700 hover:bg-slate-800 text-white py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 shadow-xs transition active:scale-95"
                      title="Share Landing Page"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>শেয়ার</span>
                    </button>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      )}
      {/* TAB 3: DOCTORS MANAGEMENT */}
      {activeTab === 'doctors' && (
        <div className="space-y-6 font-hind">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-[#2EBD59]" />
                <span>ডাক্তার ডিরেক্টরি ও কনসালটেশন ফি ম্যানেজমেন্ট ({doctors.length})</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                প্রতিটি ডাক্তারের কনসালটেশন ফি আলাদাভাবে পরিবর্তন করুন অথবা নতুন ডাক্তার যোগ করুন।
              </p>
            </div>
            <button
              onClick={handleOpenAddDoctor}
              className="flex items-center gap-1.5 bg-[#2EBD59] hover:bg-[#24a24a] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন ডাক্তার যোগ করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map(d => (
              <div
                key={d.id}
                className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 shadow-xs hover:shadow-md transition"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={d.photo}
                    alt={d.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-xs shrink-0"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{d.nameBn || d.name}</h4>
                    <p className="text-xs text-[#0A66C2] font-bold">{d.degreeBn || d.degree}</p>
                    <p className="text-[11px] text-emerald-600 font-bold">{d.specialtyBn || d.specialty}</p>
                  </div>
                </div>

                {/* Individual Editable Consultation Fee */}
                <div className="bg-emerald-50/70 dark:bg-slate-900 p-3 rounded-xl border border-emerald-200/60 dark:border-slate-700 space-y-1">
                  <span className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">
                    কনসালটেশন ফি (Consultation Fee):
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-[#0A66C2] font-poppins">৳</span>
                    <input
                      type="number"
                      defaultValue={d.consultationFee}
                      onBlur={async (e) => {
                        const newFee = parseInt(e.target.value);
                        if (newFee > 0 && newFee !== d.consultationFee) {
                          try {
                            const res = await fetch(`/api/doctors/${d.id}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ ...d, consultationFee: newFee })
                            });
                            if (res.ok) {
                              showToast(`${d.name}-এর ফি ৳${newFee} আপডেট হয়েছে!`, 'success');
                              fetchDoctors();
                            }
                          } catch (err) {
                            showToast('ফি আপডেট করা সম্ভব হয়নি', 'error');
                          }
                        }
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-poppins font-extrabold text-sm"
                    />
                  </div>
                  <span className="block text-[10px] text-slate-400 italic">
                    (বক্সে ফি টাইপ করে বাইরে ক্লিক করলে অটোমেটিক সেভ হবে)
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-500 font-poppins pt-1">
                  <span>Exp: <strong className="text-slate-800 dark:text-slate-200">{d.experienceYears} Yrs</strong></span>
                  <span>BMDC: <strong className="text-slate-800 dark:text-slate-200">{d.bmdcReg || 'A-REG'}</strong></span>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                  <button
                    onClick={() => handleOpenEditDoctor(d)}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 px-2.5 py-1.5 rounded-lg font-bold transition"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>সম্পাদনা</span>
                  </button>

                  <button
                    onClick={() => handleDeleteDoctor(d.id)}
                    className="flex items-center gap-1 text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 px-2.5 py-1.5 rounded-lg font-bold transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>মুছুন</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <AdminOrderManagement
          orders={ordersList}
          onRefresh={loadAdminData}
          showToast={showToast}
        />
      )}

      {/* TAB 8: DELIVERY AREAS MANAGEMENT */}
      {activeTab === 'delivery-areas' && (
        <AdminDeliveryAreaManagement />
      )}

      {/* TAB 5: APPOINTMENTS & PAID CONSULTATION HISTORY */}
      {activeTab === 'appointments' && (
        <div className="space-y-6 font-hind">
          {/* Top Appointment Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-bold">পেইড কনসালটেশন ইনকাম</p>
                <p className="text-2xl font-black text-[#2EBD59] font-poppins">
                  ৳{appointmentsList.reduce((sum, a) => sum + (a.consultationFee || 0), 0)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-bold">মোট বুকড অ্যাপয়েন্টমেন্ট</p>
                <p className="text-2xl font-black text-[#0A66C2] font-poppins">{appointmentsList.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950 text-[#0A66C2] flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-bold">সম্পন্ন কনসালটেশন</p>
                <p className="text-2xl font-black text-amber-600 font-poppins">
                  {appointmentsList.filter(a => a.status === 'Completed').length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-[#0A66C2]" />
                <span>ডাক্তার অ্যাপয়েন্টমেন্ট ও পেমেন্ট হিস্ট্রি ({appointmentsList.length})</span>
              </h2>
            </div>

            <div className="space-y-4">
              {appointmentsList.map(apt => (
                <div
                  key={apt.id}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs shadow-2xs"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-[#0A66C2] font-poppins text-sm">#{apt.id}</span>
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{apt.doctorName}</span>
                      <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                        পেমেন্ট: {apt.paymentStatus || 'Paid'} ({apt.paymentMethod?.toUpperCase() || 'BKASH'})
                      </span>
                    </div>

                    <p>
                      রোগীঃ <strong className="text-slate-900 dark:text-white font-bold">{apt.patientName}</strong> ({apt.age} Yrs, {apt.gender})
                    </p>
                    <p>
                      মোবাইলঃ <span className="font-poppins font-bold text-slate-800 dark:text-slate-200">{apt.patientPhone}</span>
                    </p>
                    <p>
                      তারিখ ও স্লটঃ <span className="font-bold text-blue-600 dark:text-blue-400">{apt.preferredDate} ({apt.preferredTimeSlot})</span>
                    </p>
                    {apt.transactionId && (
                      <p>
                        TrxID: <span className="font-poppins font-black text-amber-600 uppercase">{apt.transactionId}</span>
                      </p>
                    )}
                    <p className="text-slate-500 italic">সমস্যাঃ {apt.problemDescription || 'General Consultation'}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="block text-[10px] text-slate-400 font-bold uppercase">কনসালটেশন ফি</span>
                      <span className="font-black text-[#2EBD59] font-poppins text-lg">৳{apt.consultationFee}</span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] font-bold text-slate-500">স্ট্যাটাস:</span>
                        <select
                          value={apt.status}
                          onChange={e => handleUpdateAppointmentStatus(apt.id, e.target.value)}
                          className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-xs font-bold rounded-xl p-1.5 focus:ring-2 focus:ring-[#0A66C2]"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>

                      {/* Quick Action Buttons */}
                      <div className="flex items-center gap-1">
                        {apt.status !== 'Completed' && (
                          <button
                            onClick={() => handleUpdateAppointmentStatus(apt.id, 'Completed')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg transition"
                          >
                            Mark Completed
                          </button>
                        )}
                        {apt.status !== 'Cancelled' && (
                          <button
                            onClick={() => handleUpdateAppointmentStatus(apt.id, 'Cancelled')}
                            className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg transition"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: WEBSITE SETTINGS (CHANGE WHATSAPP NUMBER) */}
      {activeTab === 'settings' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-6">
          <div className="border-b pb-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-amber-500" />
              <span>ওয়েবসাইট সেটিংস ও হোয়াটসঅ্যাপ নম্বর পরিবর্তন</span>
            </h2>
            <p className="text-xs text-slate-500">
              এখান থেকে খুব সহজেই সাইটের অফিশিয়াল হোয়াটসঅ্যাপ নম্বর, হেল্পলাইন নম্বর ও ডেলিভারি চার্জ পরিবর্তন করতে পারবেন।
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  হোয়াটসঅ্যাপ নম্বর (WhatsApp Number) *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={settingsForm.whatsappNumber}
                    onChange={e => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                    placeholder="8801700000000"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white font-poppins font-bold"
                  />
                  <MessageSquare className="w-4 h-4 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">কন্ট্রি কোড সহ লিখুন (যেমনঃ 8801700000000)</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  হটলাইন নম্বর (Hotline Phone) *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={settingsForm.hotline}
                    onChange={e => setSettingsForm({ ...settingsForm, hotline: e.target.value })}
                    placeholder="+880 1700-000000"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white font-poppins font-bold"
                  />
                  <Phone className="w-4 h-4 text-blue-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ঢাকার ভেতরে ডেলিভারি চার্জ (৳)
                </label>
                <input
                  type="number"
                  value={settingsForm.deliveryChargeInsideDhaka}
                  onChange={e => setSettingsForm({ ...settingsForm, deliveryChargeInsideDhaka: parseInt(e.target.value) || 60 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs font-poppins font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ঢাকার বাইরে ডেলিভারি চার্জ (৳)
                </label>
                <input
                  type="number"
                  value={settingsForm.deliveryChargeOutsideDhaka}
                  onChange={e => setSettingsForm({ ...settingsForm, deliveryChargeOutsideDhaka: parseInt(e.target.value) || 120 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs font-poppins font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                এডমিন / অফিসিয়াল ইমেইল (Admin Email)
              </label>
              <input
                type="email"
                value={settingsForm.email || ''}
                onChange={e => setSettingsForm({ ...settingsForm, email: e.target.value })}
                placeholder=""
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs font-poppins"
              />
              <p className="text-[11px] text-slate-400 mt-1 font-hind">
                ইমেইলটি ফাঁকা রাখলে এডমিন প্যানেলে কোনো ইমেইল দেখানো হবে না। এডমিন থেকে ইমেইল যোগ করলে তা এখানে ও ড্যাশবোর্ড হেডারে প্রদর্শিত হবে।
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                অফিসের ঠিকানা (Bangladesh Address)
              </label>
              <input
                type="text"
                value={settingsForm.address}
                onChange={e => setSettingsForm({ ...settingsForm, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs font-hind"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                টপ ব্যানার নোটিশ
              </label>
              <input
                type="text"
                value={settingsForm.noticeBanner}
                onChange={e => setSettingsForm({ ...settingsForm, noticeBanner: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs font-hind"
              />
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 bg-[#2EBD59] hover:bg-[#24a24a] text-white px-6 py-3 rounded-xl font-bold text-xs shadow-md transition"
            >
              <Save className="w-4 h-4" />
              <span>সেটিংস পরিবর্তনগুলো সেভ করুন</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 6: LANDING PAGES MANAGEMENT */}
      {activeTab === 'landing-pages' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-600" />
                সিঙ্গেল প্রডাক্ট ল্যান্ডিং পেজসমূহ ({landingPages.length})
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                প্রতিটি পণ্যের জন্য হাই-কনভার্টিং ল্যান্ডিং পেজ তৈরি, এডিট, ডুপ্লিকেট ও পরিচালনা করুন।
              </p>
            </div>
            <button
              onClick={handleOpenAddLandingPage}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন ল্যান্ডিং পেজ তৈরি করুন</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white uppercase font-bold">
                  <tr>
                    <th className="p-4">পণ্য ও শিরোনাম</th>
                    <th className="p-4">ইউআরএল স্লগ</th>
                    <th className="p-4">স্ট্যাটাস</th>
                    <th className="p-4">অফার প্যাকেজ</th>
                    <th className="p-4 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {landingPages.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">
                        কোনো ল্যান্ডিং পেজ পাওয়া যায়নি। নতুন একটি তৈরি করতে উপরের বাটনে ক্লিক করুন।
                      </td>
                    </tr>
                  ) : (
                    landingPages.map((lp) => (
                      <tr key={lp.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={lp.bannerUrl || lp.product?.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=100'}
                              alt={lp.title}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white text-sm">{lp.title}</p>
                              <p className="text-[11px] text-slate-500 line-clamp-1">{lp.headline}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-mono font-bold text-purple-600 dark:text-purple-400">
                          /product/{lp.slug}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleLandingPageStatus(lp)}
                            className={`px-3 py-1 rounded-full text-[11px] font-bold transition ${
                              lp.isActive
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                            }`}
                          >
                            {lp.isActive ? '● সক্রিয় (Active)' : '○ নিষ্ক্রিয় (Disabled)'}
                          </button>
                        </td>
                        <td className="p-4 font-poppins text-xs font-semibold">
                          {lp.buyMoreOffers && lp.buyMoreOffers.length > 0
                            ? `${lp.buyMoreOffers.length} টি অফার বান্ডেল`
                            : 'স্ট্যান্ডার্ড প্রাইস'}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openProductLandingPage(lp.slug)}
                              title="লাইভ প্রিভিউ দেখুন"
                              className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-slate-700 rounded-lg font-bold transition"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleOpenEditLandingPage(lp)}
                              title="এডিট করুন"
                              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg font-bold transition"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDuplicateLandingPage(lp.id)}
                              title="ডুপ্লিকেট করুন"
                              className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-700 rounded-lg font-bold transition"
                            >
                              <Copy className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDeleteLandingPage(lp.id)}
                              title="মুছে ফেলুন"
                              className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-700 rounded-lg font-bold transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT MODAL (ADD / EDIT) */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 w-full max-w-xl rounded-3xl p-6 shadow-2xl border space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold border-b pb-2">
              {editingProductId ? 'পণ্য সম্পাদনা করুন' : 'নতুন পণ্য যোগ করুন'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Product Name (EN)</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">পণ্যের নাম (বাংলা)</label>
                  <input
                    type="text"
                    required
                    value={productForm.nameBn}
                    onChange={e => setProductForm({ ...productForm, nameBn: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">ক্যাটাগরি</label>
                  <select
                    value={productForm.category}
                    onChange={e => setProductForm({ ...productForm, category: e.target.value as any })}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="organic">Organic Products</option>
                    <option value="medical">Medical Products</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">সাব-ক্যাটাগরি</label>
                  <input
                    type="text"
                    value={productForm.subcategory}
                    onChange={e => setProductForm({ ...productForm, subcategory: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold mb-1">রেগুলার প্রাইস (৳)</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={e => setProductForm({ ...productForm, price: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">ডিসকাউন্ট প্রাইস (৳)</label>
                  <input
                    type="number"
                    value={productForm.discountPrice}
                    onChange={e => setProductForm({ ...productForm, discountPrice: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">স্টক পরিমাণ</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={e => setProductForm({ ...productForm, stock: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">ছবি ইউআরএল (Image URL)</label>
                <input
                  type="text"
                  required
                  value={productForm.image}
                  onChange={e => setProductForm({ ...productForm, image: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">বিবরণ (বাংলা)</label>
                <textarea
                  rows={2}
                  value={productForm.descriptionBn}
                  onChange={e => setProductForm({ ...productForm, descriptionBn: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                ></textarea>
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isOrganic}
                    onChange={e => setProductForm({ ...productForm, isOrganic: e.target.checked })}
                  />
                  <span>100% Organic</span>
                </label>

                <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isBestSeller}
                    onChange={e => setProductForm({ ...productForm, isBestSeller: e.target.checked })}
                  />
                  <span>Best Seller</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 bg-slate-200 rounded-lg font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0A66C2] text-white rounded-lg font-bold"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DOCTOR MODAL (ADD / EDIT) */}
      {showDoctorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 w-full max-w-xl rounded-3xl p-6 shadow-2xl border space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold border-b pb-2">
              {editingDoctorId ? 'ডাক্তারের তথ্য সম্পাদনা করুন' : 'নতুন ডাক্তার যোগ করুন'}
            </h3>

            <form onSubmit={handleSaveDoctor} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Doctor Name (EN)</label>
                  <input
                    type="text"
                    required
                    value={doctorForm.name}
                    onChange={e => setDoctorForm({ ...doctorForm, name: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">ডাক্তারের নাম (বাংলা)</label>
                  <input
                    type="text"
                    required
                    value={doctorForm.nameBn}
                    onChange={e => setDoctorForm({ ...doctorForm, nameBn: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">ডিগ্রী (Degree)</label>
                  <input
                    type="text"
                    required
                    value={doctorForm.degreeBn}
                    onChange={e => setDoctorForm({ ...doctorForm, degreeBn: e.target.value })}
                    placeholder="এমবিবিএস, এফসিপিএস (মেডিসিন)"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">বিশেষজ্ঞতা (Specialty)</label>
                  <input
                    type="text"
                    required
                    value={doctorForm.specialtyBn}
                    onChange={e => setDoctorForm({ ...doctorForm, specialtyBn: e.target.value })}
                    placeholder="মেডিসিন বিশেষজ্ঞ"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold mb-1">অভিজ্ঞতা (বছর)</label>
                  <input
                    type="number"
                    value={doctorForm.experienceYears}
                    onChange={e => setDoctorForm({ ...doctorForm, experienceYears: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">কনসালটেশন ফি (৳)</label>
                  <input
                    type="number"
                    required
                    value={doctorForm.consultationFee}
                    onChange={e => setDoctorForm({ ...doctorForm, consultationFee: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">BMDC Reg No</label>
                  <input
                    type="text"
                    value={doctorForm.bmdcReg}
                    onChange={e => setDoctorForm({ ...doctorForm, bmdcReg: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">সময়সূচী (Availability)</label>
                <input
                  type="text"
                  value={doctorForm.availabilityBn}
                  onChange={e => setDoctorForm({ ...doctorForm, availabilityBn: e.target.value })}
                  placeholder="প্রতিদিনঃ বিকাল ৪:০০ - রাত ৮:০০"
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">ছবি ইউআরএল (Photo URL)</label>
                <input
                  type="text"
                  required
                  value={doctorForm.photo}
                  onChange={e => setDoctorForm({ ...doctorForm, photo: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowDoctorModal(false)}
                  className="px-4 py-2 bg-slate-200 rounded-lg font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2EBD59] text-white rounded-lg font-bold"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LANDING PAGE MODAL (CREATE / EDIT) */}
      {showLandingModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto my-8 font-hind">
            <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-600" />
                {editingLandingId ? 'ল্যান্ডিং পেজ সংশোধন করুন' : 'নতুন ল্যান্ডিং পেজ তৈরি করুন'}
              </h3>
              <button
                type="button"
                onClick={() => setShowLandingModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveLandingPage} className="space-y-6 text-xs text-slate-700 dark:text-slate-300">
              
              {/* SECTION 1: PRODUCT & BASIC SETUP */}
              <div className="space-y-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                <h4 className="font-extrabold text-sm text-purple-600 dark:text-purple-400 uppercase">
                  ১. প্রোডাক্ট ও বেসিক সেটআপ
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold mb-1">সংযুক্ত প্রোডাক্ট নির্বাচন করুন *</label>
                    <select
                      required
                      value={landingForm.productId}
                      onChange={e => {
                        const selProd = products.find(p => p.id === e.target.value);
                        setLandingForm({
                          ...landingForm,
                          productId: e.target.value,
                          title: selProd ? (selProd.nameBn || selProd.name) : landingForm.title,
                          bannerUrl: selProd ? selProd.image : landingForm.bannerUrl
                        });
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-bold"
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.nameBn || p.name} (৳{p.discountPrice || p.price})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">ইউআরএল স্লগ (URL Slug) *</label>
                    <div className="flex items-center">
                      <span className="p-2.5 bg-slate-200 dark:bg-slate-700 rounded-l-xl text-slate-500 font-mono">
                        /product/
                      </span>
                      <input
                        type="text"
                        required
                        value={landingForm.slug}
                        onChange={e => setLandingForm({ ...landingForm, slug: e.target.value })}
                        placeholder="organic-honey"
                        className="w-full p-2.5 rounded-r-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1">ল্যান্ডিং পেজ টাইটেল *</label>
                  <input
                    type="text"
                    required
                    value={landingForm.title}
                    onChange={e => setLandingForm({ ...landingForm, title: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">আকর্ষণীয় হেডলাইন (Hero Headline) *</label>
                  <input
                    type="text"
                    required
                    value={landingForm.headline}
                    onChange={e => setLandingForm({ ...landingForm, headline: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">সাব-হেডলাইন (Subheadline)</label>
                  <textarea
                    rows={2}
                    value={landingForm.subheadline}
                    onChange={e => setLandingForm({ ...landingForm, subheadline: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                  ></textarea>
                </div>
              </div>

              {/* SECTION 2: MEDIA */}
              <div className="space-y-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                <h4 className="font-extrabold text-sm text-blue-600 dark:text-blue-400 uppercase">
                  ২. মিডিয়া ও ইমেজ ইউআরএল
                </h4>

                <div>
                  <label className="block font-bold mb-1">প্রধান ব্যানার ইমেজ ইউআরএল (Main Banner Image) *</label>
                  <input
                    type="text"
                    required
                    value={landingForm.bannerUrl}
                    onChange={e => setLandingForm({ ...landingForm, bannerUrl: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">গ্যালারি ইমেজ (প্রতি লাইনে ১টি ইউআরএল)</label>
                  <textarea
                    rows={3}
                    value={landingForm.galleryImagesText}
                    onChange={e => setLandingForm({ ...landingForm, galleryImagesText: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-mono"
                  ></textarea>
                </div>
              </div>

              {/* SECTION 3: MULTI-PACK SAVINGS OFFERS */}
              <div className="space-y-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                <h4 className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400 uppercase">
                  ৩. মাল্টি-প্যাক অফার বান্ডেলসমূহ
                </h4>
                <p className="text-[11px] text-slate-500">
                  ফরম্যাট: <code className="bg-slate-200 dark:bg-slate-700 p-0.5 rounded">লেবেল = প্রাইস = সেভিংস টেক্সট</code> (প্রতি লাইনে ১টি অফার)
                </p>
                <textarea
                  rows={4}
                  value={landingForm.buyMoreOffersText}
                  onChange={e => setLandingForm({ ...landingForm, buyMoreOffersText: e.target.value })}
                  placeholder="১টি প্যাক = 500 = নিয়মিত প্রাইস&#10;২টি প্যাক (অফার) = 900 = ৳100 ছাড়&#10;৩টি প্যাক (ফ্যামিলি) = 1300 = ৳200 ছাড়"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-mono"
                ></textarea>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold mb-1">অফার কাউন্টডাউন সময় (মিনিট)</label>
                    <input
                      type="number"
                      value={landingForm.countdownMinutes}
                      onChange={e => setLandingForm({ ...landingForm, countdownMinutes: parseInt(e.target.value) || 180 })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">স্টক অ্যালার্ট কাউন্ট (অবশিষ্ট সংখ্যা)</label>
                    <input
                      type="number"
                      value={landingForm.stockCount}
                      onChange={e => setLandingForm({ ...landingForm, stockCount: parseInt(e.target.value) || 15 })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: BENEFITS & FEATURES */}
              <div className="space-y-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                <h4 className="font-extrabold text-sm text-amber-600 dark:text-amber-400 uppercase">
                  ৪. উপকারিতা ও বৈশিষ্ট্যসমূহ (Benefits & Features)
                </h4>

                <div>
                  <label className="block font-bold mb-1">উপকারিতাসমূহ (প্রতি লাইনে ১টি)</label>
                  <textarea
                    rows={4}
                    value={landingForm.benefitsText}
                    onChange={e => setLandingForm({ ...landingForm, benefitsText: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                  ></textarea>
                </div>

                <div>
                  <label className="block font-bold mb-1">বিশেষ বৈশিষ্ট্যসমূহ (প্রতি লাইনে ১টি)</label>
                  <textarea
                    rows={3}
                    value={landingForm.featuresText}
                    onChange={e => setLandingForm({ ...landingForm, featuresText: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                  ></textarea>
                </div>
              </div>

              {/* SECTION 5: FAQS & REVIEWS */}
              <div className="space-y-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                <h4 className="font-extrabold text-sm text-rose-600 dark:text-rose-400 uppercase">
                  ৫. প্রশ্নোত্তর (FAQs) ও কাস্টমার রিভিউ
                </h4>

                <div>
                  <label className="block font-bold mb-1">
                    FAQs (ফরম্যাট: <code className="bg-slate-200 dark:bg-slate-700 p-0.5 rounded">প্রশ্ন = উত্তর</code>)
                  </label>
                  <textarea
                    rows={4}
                    value={landingForm.faqsText}
                    onChange={e => setLandingForm({ ...landingForm, faqsText: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-mono"
                  ></textarea>
                </div>

                <div>
                  <label className="block font-bold mb-1">
                    কাস্টমার রিভিউ (ফরম্যাট: <code className="bg-slate-200 dark:bg-slate-700 p-0.5 rounded">নাম | রেটিং | মন্তব্য</code>)
                  </label>
                  <textarea
                    rows={4}
                    value={landingForm.reviewsText}
                    onChange={e => setLandingForm({ ...landingForm, reviewsText: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-mono"
                  ></textarea>
                </div>
              </div>

              {/* SECTION 6: SEO & MARKETING PIXELS */}
              <div className="space-y-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                <h4 className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400 uppercase">
                  ৬. এসইও ও ফেসবুক পিক্সেল
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold mb-1">Facebook Pixel ID</label>
                    <input
                      type="text"
                      placeholder="e.g. 123456789012345"
                      value={landingForm.fbPixelId}
                      onChange={e => setLandingForm({ ...landingForm, fbPixelId: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Google Tag Manager ID</label>
                    <input
                      type="text"
                      placeholder="e.g. GTM-XXXXXX"
                      value={landingForm.gtmId}
                      onChange={e => setLandingForm({ ...landingForm, gtmId: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1">SEO Title</label>
                  <input
                    type="text"
                    value={landingForm.seoTitle}
                    onChange={e => setLandingForm({ ...landingForm, seoTitle: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowLandingModal(false)}
                  className="px-5 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-md transition"
                >
                  সংরক্ষণ করুন
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
