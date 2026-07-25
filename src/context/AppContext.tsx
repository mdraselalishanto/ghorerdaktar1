import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Doctor, Category, CartItem, SiteSettings, LandingPageData, District, PostOffice, Appointment } from '../types';
import { initialSiteSettings, initialCategories, initialDistricts, initialPostOffices } from '../data/mockData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

export interface UserProfile {
  id: number;
  uid: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
}

interface AppContextType {
  language: 'bn' | 'en';
  toggleLanguage: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  orderNow: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  siteSettings: SiteSettings;
  updateSiteSettingsState: (settings: Partial<SiteSettings>) => void;
  products: Product[];
  doctors: Doctor[];
  categories: Category[];
  landingPages: LandingPageData[];
  districts: District[];
  postOffices: PostOffice[];
  fetchProducts: () => Promise<void>;
  fetchDoctors: () => Promise<void>;
  fetchLandingPages: () => Promise<void>;
  fetchDistricts: () => Promise<void>;
  fetchPostOffices: () => Promise<void>;
  currentLandingSlug: string | null;
  setCurrentLandingSlug: (slug: string | null) => void;
  openProductLandingPage: (slugOrProductId: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  activePage: string;
  setActivePage: (page: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedSubcategory: string;
  setSelectedSubcategory: (sub: string) => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  adminLogin: (token: string) => void;
  adminLogout: () => void;
  currentUser: UserProfile | null;
  userLogin: (userData: UserProfile, token?: string) => void;
  userLogout: () => void;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  selectedDoctorForBooking: Doctor | null;
  setSelectedDoctorForBooking: (doc: Doctor | null) => void;
  selectedProductForQuickView: Product | null;
  setSelectedProductForQuickView: (prod: Product | null) => void;
  lastBookedAppointment: Appointment | null;
  setLastBookedAppointment: (apt: Appointment | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('gd_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('gd_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(initialSiteSettings);
  const [products, setProducts] = useState<Product[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [landingPages, setLandingPages] = useState<LandingPageData[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [postOffices, setPostOffices] = useState<PostOffice[]>([]);
  const [categories] = useState<Category[]>(initialCategories);

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [currentLandingSlug, setCurrentLandingSlug] = useState<string | null>(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/product/')) {
      return window.location.pathname.replace('/product/', '').trim();
    }
    return null;
  });

  const [activePage, setActivePageInternal] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/product/')) {
      return 'landing-page';
    }
    return 'home';
  });

  const setActivePage = (page: string) => {
    if (page.startsWith('product:')) {
      const slug = page.replace('product:', '').trim();
      setCurrentLandingSlug(slug);
      setActivePageInternal('landing-page');
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', `/product/${slug}`);
      }
    } else {
      if (page !== 'landing-page') {
        setCurrentLandingSlug(null);
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/product/')) {
          window.history.pushState(null, '', '/');
        }
      }
      setActivePageInternal(page);
    }
  };

  const openProductLandingPage = (slugOrProductId: string) => {
    const clean = slugOrProductId.toLowerCase().trim();
    const existingLp = landingPages.find(l => l.slug === clean || l.productId === clean);
    const slugToUse = existingLp ? existingLp.slug : clean;
    
    setCurrentLandingSlug(slugToUse);
    setActivePageInternal('landing-page');
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `/product/${slugToUse}`);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname.startsWith('/product/')) {
        const slug = window.location.pathname.replace('/product/', '').trim();
        setCurrentLandingSlug(slug);
        setActivePageInternal('landing-page');
      } else if (activePage === 'landing-page') {
        setCurrentLandingSlug(null);
        setActivePageInternal('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activePage]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return !!localStorage.getItem('gd_admin_token');
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('gd_user_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<Doctor | null>(null);
  const [selectedProductForQuickView, setSelectedProductForQuickView] = useState<Product | null>(null);
  const [lastBookedAppointment, setLastBookedAppointment] = useState<Appointment | null>(null);

  // Save cart & wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gd_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('gd_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Fetch initial data
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await fetch('/api/doctors');
      if (res.ok) {
        const data = await res.json();
        setDoctors(data);
      }
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
    }
  };

  const fetchLandingPages = async () => {
    try {
      const res = await fetch('/api/landing-pages');
      if (res.ok) {
        const data = await res.json();
        setLandingPages(data);
      }
    } catch (err) {
      console.error('Failed to fetch landing pages:', err);
    }
  };

  const fetchDistricts = async () => {
    try {
      const res = await fetch('/api/districts');
      if (res.ok) {
        const data = await res.json();
        setDistricts(data);
      }
    } catch (err) {
      console.error('Failed to fetch districts:', err);
    }
  };

  const fetchPostOffices = async () => {
    try {
      const res = await fetch('/api/post-offices');
      if (res.ok) {
        const data = await res.json();
        setPostOffices(data);
      }
    } catch (err) {
      console.error('Failed to fetch post offices:', err);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSiteSettings(data);
      }
    } catch (err) {
      console.error('Failed to fetch site settings:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchDoctors();
    fetchLandingPages();
    fetchDistricts();
    fetchPostOffices();
    fetchSettings();
  }, []);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'bn' ? 'en' : 'bn'));
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(
      language === 'bn'
        ? `"${product.nameBn}" কার্টে যোগ করা হয়েছে!`
        : `Added "${product.name}" to cart!`
    );
  };

  const orderNow = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: Math.max(item.quantity, quantity) }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setActivePage('checkout');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast(language === 'bn' ? 'কার্ট থেকে মুছে ফেলা হয়েছে' : 'Item removed from cart', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        showToast(
          language === 'bn' ? 'উইশলিস্ট থেকে সরানো হয়েছে' : 'Removed from Wishlist',
          'info'
        );
        return prev.filter(p => p.id !== product.id);
      } else {
        showToast(
          language === 'bn' ? 'উইশলিস্টে যোগ করা হয়েছে ❤️' : 'Added to Wishlist ❤️'
        );
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(p => p.id === productId);
  };

  const updateSiteSettingsState = (settings: Partial<SiteSettings>) => {
    setSiteSettings(prev => ({ ...prev, ...settings }));
  };

  const adminLogin = (token: string) => {
    localStorage.setItem('gd_admin_token', token);
    setIsAdmin(true);
    showToast(language === 'bn' ? 'এডমিন হিসেবে লগইন সফল হয়েছে' : 'Logged in as Admin successfully');
  };

  const adminLogout = () => {
    localStorage.removeItem('gd_admin_token');
    setIsAdmin(false);
    showToast(language === 'bn' ? 'লগআউট হয়েছে' : 'Logged out', 'info');
  };

  const userLogin = (userData: UserProfile, token?: string) => {
    setCurrentUser(userData);
    localStorage.setItem('gd_user_profile', JSON.stringify(userData));
    if (token) {
      localStorage.setItem('gd_user_token', token);
    }
    showToast(language === 'bn' ? `স্বাগতম ${userData.name}!` : `Welcome ${userData.name}!`);
  };

  const userLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('gd_user_profile');
    localStorage.removeItem('gd_user_token');
    showToast(language === 'bn' ? 'অ্যাকাউন্ট থেকে লগআউট হয়েছে' : 'Logged out of account', 'info');
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => {
    const effectivePrice = item.product.discountPrice || item.product.price;
    return sum + effectivePrice * item.quantity;
  }, 0);

  return (
    <AppContext.Provider
      value={{
        language,
        toggleLanguage,
        darkMode,
        toggleDarkMode,
        cart,
        addToCart,
        orderNow,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        siteSettings,
        updateSiteSettingsState,
        products,
        doctors,
        categories,
        landingPages,
        districts,
        postOffices,
        fetchProducts,
        fetchDoctors,
        fetchLandingPages,
        fetchDistricts,
        fetchPostOffices,
        currentLandingSlug,
        setCurrentLandingSlug,
        openProductLandingPage,
        isCartOpen,
        setIsCartOpen,
        activePage,
        setActivePage,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedSubcategory,
        setSelectedSubcategory,
        isAdmin,
        setIsAdmin,
        adminLogin,
        adminLogout,
        currentUser,
        userLogin,
        userLogout,
        toasts,
        showToast,
        selectedDoctorForBooking,
        setSelectedDoctorForBooking,
        selectedProductForQuickView,
        setSelectedProductForQuickView,
        lastBookedAppointment,
        setLastBookedAppointment,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
