import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import {
  Search,
  ShoppingCart,
  Heart,
  PhoneCall,
  MessageSquare,
  Globe,
  Sun,
  Moon,
  Menu,
  X,
  User,
  Stethoscope,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    language,
    toggleLanguage,
    darkMode,
    toggleDarkMode,
    cartCount,
    cartSubtotal,
    wishlist,
    siteSettings,
    setIsCartOpen,
    activePage,
    setActivePage,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    setSelectedSubcategory,
    currentUser
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActivePage('shop');
    }
  };

  const navItems = [
    { id: 'home', nameBn: 'হোম', nameEn: 'Home' },
    { id: 'shop', nameBn: 'শপ', nameEn: 'Shop' },
    { id: 'organic', nameBn: 'অর্গানিক প্রোডাক্টস', nameEn: 'Organic Products', badge: '100% Pure' },
    { id: 'medical', nameBn: 'মেডিকেল প্রোডাক্টস', nameEn: 'Medical Devices' },
    { id: 'doctors', nameBn: 'ডাক্তার কনসালটেশন', nameEn: 'Doctor Consultation', isDoctor: true },
    { id: 'about', nameBn: 'আমাদের সম্পর্কে', nameEn: 'About Us' },
    { id: 'contact', nameBn: 'যোগাযোগ', nameEn: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-[#E2E8F0] dark:border-slate-800 shadow-md transition-colors duration-200">
      {/* Top Info Bar */}
      <div className="bg-[#0F172A] text-slate-100 text-xs py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          {/* Announcement */}
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-[#22C55E] px-2.5 py-0.5 rounded-full font-semibold text-[11px]">
              <Sparkles className="w-3 h-3 text-[#22C55E]" />
              {language === 'bn' ? 'অফার' : 'Offer'}
            </span>
            <span className="truncate text-slate-200">{siteSettings.noticeBanner}</span>
          </div>

          {/* Quick Contacts & Language */}
          <div className="flex items-center gap-4 text-slate-300">
            <a
              href={`tel:${siteSettings.hotline}`}
              className="flex items-center gap-1.5 hover:text-[#22C55E] transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#22C55E]" />
              <span className="font-poppins">{siteSettings.hotline}</span>
            </a>

            <a
              href={`https://wa.me/${siteSettings.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center gap-1 text-[#22C55E] hover:underline"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-md text-slate-200 transition font-poppins"
            >
              <Globe className="w-3.5 h-3.5 text-[#0A66C2]" />
              <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>

            <button
              onClick={toggleDarkMode}
              className="p-1 text-slate-300 hover:text-amber-400 transition"
              title="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#1E293B] dark:text-slate-200 hover:bg-[#F8FAFC] dark:hover:bg-slate-800 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <button
            onClick={() => {
              setActivePage('home');
              setSelectedCategory('all');
              setSelectedSubcategory('all');
            }}
            className="flex items-center text-left group hover:opacity-95 transition"
          >
            <Logo size="md" />
          </button>
        </div>

        {/* Live Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-lg mx-4 relative"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={
              language === 'bn'
                ? 'ওষুধ, অর্গানিক মধু, বিপি মেশিন বা পণ্য খুঁজুন...'
                : 'Search medicine, organic honey, devices...'
            }
            className="w-full pl-4 pr-11 py-2.5 rounded-full border border-[#E2E8F0] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800 text-[#1E293B] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:bg-white transition"
          />
          <button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#0A66C2] hover:bg-[#22C55E] text-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-sm"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Header Action Icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Wishlist */}
          <button
            onClick={() => {
              setActivePage('shop');
            }}
            className="relative p-2 text-[#1E293B] dark:text-slate-300 hover:bg-[#F8FAFC] dark:hover:bg-slate-800 rounded-full transition"
            title="Wishlist"
          >
            <Heart className="w-5 h-5 text-[#0A66C2]" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Icon */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 dark:bg-blue-500/20 text-[#0A66C2] dark:text-blue-400 px-3.5 py-2 rounded-full transition font-medium text-sm"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-[#0A66C2]" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#22C55E] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline font-poppins font-bold text-[#0A66C2]">
              ৳{cartSubtotal}
            </span>
          </button>

          {/* User Profile / Login Button */}
          <button
            onClick={() => setActivePage('auth')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition ${
              currentUser
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#22C55E] border border-emerald-200 dark:border-emerald-800'
                : 'bg-white border-2 border-[#0A66C2] text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white transition-colors duration-200'
            }`}
            title={currentUser ? currentUser.name : 'User Login'}
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline font-hind">
              {currentUser ? currentUser.name.split(' ')[0] : (language === 'bn' ? 'লগইন' : 'Login')}
            </span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="hidden lg:block bg-white dark:bg-slate-900 border-t border-[#E2E8F0] dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <ul className="flex items-center gap-2">
            {navItems.map(item => {
              const isActive = activePage === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActivePage(item.id);
                      if (item.id === 'organic') {
                        setSelectedCategory('organic');
                        setSelectedSubcategory('all');
                      } else if (item.id === 'medical') {
                        setSelectedCategory('medical');
                        setSelectedSubcategory('all');
                      } else if (item.id === 'shop') {
                        setSelectedCategory('all');
                        setSelectedSubcategory('all');
                      }
                    }}
                    className={`relative px-4 py-3 text-sm font-semibold transition-colors duration-200 flex items-center gap-2 ${
                      isActive
                        ? 'text-[#0A66C2] font-bold border-b-2 border-[#0A66C2] bg-white dark:bg-slate-800'
                        : 'text-[#0A66C2] hover:text-[#22C55E] dark:text-blue-400 dark:hover:text-[#22C55E]'
                    }`}
                  >
                    {item.isDoctor && <Stethoscope className="w-4 h-4 text-[#22C55E]" />}
                    <span>{language === 'bn' ? item.nameBn : item.nameEn}</span>
                    {item.badge && (
                      <span className="text-[10px] bg-emerald-100 text-[#22C55E] dark:bg-emerald-900/50 dark:text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2 py-2">
            <button
              onClick={() => setActivePage('doctors')}
              className="flex items-center gap-2 bg-[#0A66C2] hover:bg-[#22C55E] text-white px-4 py-2 rounded-full text-xs font-bold shadow-sm transition-colors duration-200"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'ডাক্তার দেখান (MBBS)' : 'Talk to Doctor'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-3">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={
                language === 'bn' ? 'পণ্য বা সেবা খুঁজুন...' : 'Search products...'
              }
              className="w-full pl-3 pr-9 py-2 rounded-lg border border-[#E2E8F0] dark:border-slate-700 text-sm bg-[#F8FAFC] dark:bg-slate-800 text-[#1E293B] dark:text-white"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#0A66C2]"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Navigation links */}
          <div className="space-y-1 pt-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  if (item.id === 'organic') setSelectedCategory('organic');
                  if (item.id === 'medical') setSelectedCategory('medical');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors ${
                  activePage === item.id
                    ? 'bg-blue-50 text-[#0A66C2] font-bold'
                    : 'text-[#0A66C2] hover:text-[#22C55E] hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.isDoctor && <Stethoscope className="w-4 h-4 text-[#22C55E]" />}
                  <span>{language === 'bn' ? item.nameBn : item.nameEn}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-[#E2E8F0] dark:border-slate-800 flex justify-between items-center text-xs text-slate-500">
            <span>হটলাইন: {siteSettings.hotline}</span>
            <button
              onClick={toggleLanguage}
              className="text-[#0A66C2] font-semibold underline"
            >
              {language === 'bn' ? 'Switch to English' : 'বাংলায় দেখুন'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
