/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
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

function AppContent() {
  const { menu, posts, isLoading: isDataLoading } = useDataSync();
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [menuFilter, setMenuFilter] = useState<string | undefined>(undefined);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [theme, setTheme] = useState<'night' | 'day'>('night');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Consulting Ancestral Recipes");
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [hasVisited, setHasVisited] = useState(() => !!getCookie('bamanda_visited'));

  // Initial Boot Sequence
  useEffect(() => {
    const bootSequence = async () => {
      setLoadingMessage("Synchronizing Sanctuary Cache");
      if (!getCookie('bamanda_visited')) {
        setCookie('bamanda_visited', 'true', 30);
        setHasVisited(true);
      }
      // Aesthetically pleasing minimum load time
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsLoading(false);
    };
    bootSequence();
  }, []);

  // UI & NAVIGATION LOGIC
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
  }, [currentScreen, isDataLoading]);

  const handleNavigateToMenu = (filter?: string) => {
    setMenuFilter(filter);
    setCurrentScreen('menu');
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
    setCurrentScreen('checkout');
  };

  const handleOrderComplete = async (order: Order) => {
    setActiveOrder(order);
    
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
    setCurrentScreen('track-order');
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-surface selection:bg-accent/30 overflow-x-hidden">
      
      {(isLoading || isDataLoading) && <BrandLoader subMessage={loadingMessage} />}

      {currentScreen !== 'admin' && (
        <Header 
          currentScreen={currentScreen} 
          onNavigate={setCurrentScreen} 
          onOpenCart={() => setIsCartOpen(true)}
          cartCount={cartCount}
          theme={theme}
          onToggleTheme={() => setTheme(prev => prev === 'night' ? 'day' : 'night')}
          isLoading={isLoading}
        />
      )}

      <main className={cn(currentScreen !== 'admin' && "pt-20")}>
        {currentScreen === 'home' && (
          <HomeScreen 
            onNavigate={setCurrentScreen}
            onNavigateToMenu={handleNavigateToMenu} 
            onAddToCart={handleAddToCart} 
            trendingDishes={menu.filter(item => item.isTrending)} 
          />
        )}
        {currentScreen === 'menu' && (
          <MenuScreen menuItems={menu} onAddToCart={handleAddToCart} initialFilter={menuFilter} />
        )}
        {currentScreen === 'about' && <AboutScreen />}
        {currentScreen === 'blog' && <BlogScreen posts={posts} />}
        {currentScreen === 'contact' && <ContactScreen />}
        {currentScreen === 'checkout' && <CheckoutScreen items={cart} onOrderComplete={handleOrderComplete} />}
        {currentScreen === 'track-order' && <TrackOrderScreen order={activeOrder} onBack={() => setCurrentScreen('menu')} />}
        {currentScreen === 'admin' && <AdminScreen />}
        
        {currentScreen === 'heritage' && (
          <InfoScreen 
            title="Our Heritage" 
            subtitle="The Legacy"
            onBack={() => setCurrentScreen('home')}
            content="Bamanda Kitchen is more than a restaurant; it is a sanctuary of ancestral recipes."
          />
        )}
        {currentScreen === 'sustainability' && (
          <InfoScreen title="Sustainability" subtitle="Earth First" onBack={() => setCurrentScreen('home')} content="Guided by our responsibility to the future land." />
        )}
        {currentScreen === 'legal' && (
          <InfoScreen title="Legal" subtitle="Transparency" onBack={() => setCurrentScreen('home')} content="Legal framework ensuring data protection." />
        )}
      </main>

      {currentScreen !== 'admin' && <Footer onNavigate={setCurrentScreen} />}

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
        <AppContent />
      </DataSyncProvider>
    </ToastProvider>
  );
}
