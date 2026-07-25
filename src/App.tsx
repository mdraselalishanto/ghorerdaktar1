import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ProductModal } from './components/ProductModal';
import { DoctorBookingModal } from './components/DoctorBookingModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { ScrollToTop } from './components/ScrollToTop';
import { ToastNotification } from './components/ToastNotification';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { DoctorPage } from './pages/DoctorPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { PolicyPages } from './pages/PolicyPages';
import { AdminDashboard } from './pages/AdminDashboard';
import { AuthPage } from './pages/AuthPage';
import { ThankYouPage } from './pages/ThankYouPage';

const MainContent: React.FC = () => {
  const { activePage, setSelectedCategory } = useApp();

  React.useEffect(() => {
    if (activePage === 'organic') {
      setSelectedCategory('organic');
    } else if (activePage === 'medical') {
      setSelectedCategory('medical');
    }
  }, [activePage, setSelectedCategory]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col justify-between selection:bg-[#0A66C2] selection:text-white">
      
      {/* Header Bar */}
      <Header />

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {activePage === 'home' && <HomePage />}
        {(activePage === 'shop' || activePage === 'organic' || activePage === 'medical') && <ShopPage />}
        {activePage === 'doctors' && <DoctorPage />}
        {activePage === 'about' && <AboutPage />}
        {activePage === 'contact' && <ContactPage />}
        {activePage === 'checkout' && <CheckoutPage />}
        {activePage === 'thank-you' && <ThankYouPage />}
        {activePage === 'auth' && <AuthPage />}
        {activePage === 'admin' && <AdminDashboard />}

        {activePage === 'privacy' && <PolicyPages type="privacy" />}
        {activePage === 'terms' && <PolicyPages type="terms" />}
        {activePage === 'refund' && <PolicyPages type="refund" />}
      </main>

      {/* Footer Bar */}
      <Footer />

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <ProductModal />
      <DoctorBookingModal />
      <FloatingWhatsApp />
      <ScrollToTop />
      <ToastNotification />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
