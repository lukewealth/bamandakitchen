/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { cn, getCookie, setCookie } from './lib/utils';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import FloatingCart from './components/FloatingCart';
import BrandLoader from './components/BrandLoader';
import HomeScreen from './screens/HomeScreen';
import MenuScreen from './screens/MenuScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import AboutScreen from './screens/AboutScreen';
import BlogScreen from './screens/BlogScreen';
import ContactScreen from './screens/ContactScreen';
import TrackOrderScreen from './screens/TrackOrderScreen';
import AdminScreen from './screens/AdminScreen';
import InfoScreen from './screens/InfoScreen';
import { MenuItem, CartItem, Screen, Order } from './types';
import { ToastProvider } from './lib/toast-context';
import { DataSyncProvider, useDataSync } from './lib/data-sync';
import { db } from './lib/firebase';
import { setDoc, doc } from 'firebase/firestore';
import { patronTracker } from './lib/security';

function AppContent() {
  const { menu, posts, isLoading: isDataLoading, logAction } = useDataSync();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [menuFilter, setMenuFilter] = useState<string | undefined>(undefined);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [theme, setTheme] = useState<'night' | 'day'>('night');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Consulting Ancestral Recipes");
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [hasVisited, setHasVisited] = useState(() => !!getCookie('bamanda_visited'));

  const currentScreen = useMemo((): Screen => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path === '/menu') return 'menu';
    if (path === '/checkout') return 'checkout';
    if (path === '/about') return 'about';
    if (path === '/blog') return 'blog';
    if (path === '/contact') return 'contact';
    if (path === '/track-order') return 'track-order';
    if (path === '/admin') return 'admin';
    if (path === '/heritage') return 'heritage';
    if (path === '/sustainability') return 'sustainability';
    if (path === '/legal') return 'legal';
    return 'home';
  }, [location.pathname]);

  const handleNavigate = (screen: Screen) => {
    const paths: Record<string, string> = {
      'home': '/',
      'menu': '/menu',
      'checkout': '/checkout',
      'about': '/about',
      'blog': '/blog',
      'contact': '/contact',
      'track-order': '/track-order',
      'admin': '/admin',
      'heritage': '/heritage',
      'sustainability': '/sustainability',
      'legal': '/legal'
    };
    navigate(paths[screen] || '/');
    logAction('NAVIGATE', { to: screen });
  };

  useEffect(() => {
    const bootSequence = async () => {
      setLoadingMessage("Synchronizing Sanctuary Cache");
      if (!getCookie('bamanda_visited')) {
        setCookie('bamanda_visited', 'true', 30);
        setHasVisited(true);
      }
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsLoading(false);
    };
    bootSequence();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (isLoading || isDataLoading) return;
    
    window.scrollTo(0, 0);
    setIsLoading(true);
    setLoadingMessage(currentScreen === 'menu' ? "Curing the Inventory" : "Navigating the Sanctuary");
    
    const delay = hasVisited ? 400 : 800;
    const timer = setTimeout(() => setIsLoading(false), delay);
    return () => clearTimeout(timer);
  }, [currentScreen, isDataLoading, hasVisited]);

  const handleNavigateToMenu = (filter?: string) => {
    setMenuFilter(filter);
    navigate('/menu');
  };

  const handleAddToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
    patronTracker.trackView(item.id);
    logAction('ADD_TO_CART', { itemId: item.id, name: item.name });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const handleOrderComplete = async (order: Order) => {
    setActiveOrder(order);
    patronTracker.saveOrder(order); // Explicit patron tracking

    try {
      const existing = JSON.parse(localStorage.getItem('bamanda_orders') || '[]');
      localStorage.setItem('bamanda_orders', JSON.stringify([order, ...existing].slice(0, 50)));
    } catch (e) {}

    if (db) {
      try {
        await setDoc(doc(db, 'orders', order.id), {
          ...order,
          createdAt: new Date().toISOString()
        });
      } catch (err) {
        console.error('Cloud Order Manifestation Failed:', err);
      }
    }
    
    setCart([]);
    navigate('/track-order');
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-surface selection:bg-accent/30 overflow-x-hidden">
      
      {(isLoading || isDataLoading) && <BrandLoader subMessage={loadingMessage} />}

      {currentScreen !== 'admin' && (
        <Header 
          currentScreen={currentScreen} 
          onNavigate={handleNavigate} 
          onOpenCart={() => setIsCartOpen(true)}
          cartCount={cartCount}
          theme={theme}
          onToggleTheme={() => setTheme(prev => prev === 'night' ? 'day' : 'night')}
          isLoading={isLoading}
        />
      )}

      <main className={cn(currentScreen !== 'admin' && "pt-20")}>
        <Routes>
          <Route path="/" element={
            <HomeScreen 
              onNavigate={handleNavigate}
              onNavigateToMenu={handleNavigateToMenu} 
              onAddToCart={handleAddToCart} 
              trendingDishes={menu.filter(item => item.isTrending)} 
            />
          } />
          <Route path="/menu" element={
            <MenuScreen menuItems={menu} onAddToCart={handleAddToCart} initialFilter={menuFilter} />
          } />
          <Route path="/about" element={<AboutScreen />} />
          <Route path="/blog" element={<BlogScreen posts={posts} />} />
          <Route path="/contact" element={<ContactScreen />} />
          <Route path="/checkout" element={<CheckoutScreen items={cart} onOrderComplete={handleOrderComplete} />} />
          <Route path="/track-order" element={<TrackOrderScreen order={activeOrder} onBack={() => navigate('/menu')} />} />
          <Route path="/admin" element={<AdminScreen />} />
          
          <Route path="/heritage" element={
            <InfoScreen 
              title="Our Heritage" 
              subtitle="The Legacy"
              onBack={() => navigate('/')}
              content="Bamanda Kitchen is more than a restaurant; it is a sanctuary of ancestral recipes."
            />
          } />
          <Route path="/sustainability" element={
            <InfoScreen title="Sustainability" subtitle="Earth First" onBack={() => navigate('/')} content="Guided by our responsibility to the future land." />
          } />
          <Route path="/legal" element={
            <InfoScreen title="Legal" subtitle="Transparency" onBack={() => navigate('/')} content="Legal framework ensuring data protection." />
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {currentScreen !== 'admin' && <Footer onNavigate={handleNavigate} />}

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
      />

      {currentScreen !== 'admin' && <FloatingCart items={cart} onOpenCart={() => setIsCartOpen(true)} />}
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <DataSyncProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </DataSyncProvider>
    </ToastProvider>
  );
}
