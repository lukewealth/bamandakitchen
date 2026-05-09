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
import { MenuItem, CartItem, Screen, Order, BlogPost } from './types';
import { MENU_ITEMS } from './data';
import { ToastProvider } from './lib/toast-context';
import { db } from './lib/firebase';
import { collection, query, onSnapshot, orderBy, setDoc, doc } from 'firebase/firestore';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [menuFilter, setMenuFilter] = useState<string | undefined>(undefined);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [theme, setTheme] = useState<'night' | 'day'>('night');
  const [isLoading, setIsLoading] = useState(true); // Start with true for initial boot
  const [loadingMessage, setLoadingMessage] = useState("Consulting Ancestral Recipes");
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [hasVisited, setHasVisited] = useState(() => !!getCookie('bamanda_visited'));

  // Hybrid Data State
  const [menu, setMenu] = useState<MenuItem[]>(() => {
    // Phase 1: LocalStorage Hydration
    const cached = localStorage.getItem('bamanda_menu_cache');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        return MENU_ITEMS;
      }
    }
    return MENU_ITEMS;
  });
  
  const [posts, setPosts] = useState<BlogPost[]>(() => {
    const cached = localStorage.getItem('bamanda_blog_cache');
    try {
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  // Initial Boot Sequence
  useEffect(() => {
    const bootSequence = async () => {
      setLoadingMessage("Synchronizing Sanctuary Cache");
      
      // Check cookies
      if (!getCookie('bamanda_visited')) {
        setCookie('bamanda_visited', 'true', 30);
        setHasVisited(true);
      }

      // Simulate a brief minimum loading for aesthetics
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsLoading(false);
    };

    bootSequence();
  }, []);

  // Firestore Real-time Sync (Background)
  useEffect(() => {
    if (!db) return;

    try {
      const unsubMenu = onSnapshot(query(collection(db, 'menu'), orderBy('name')), (snapshot) => {
        const items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as MenuItem));
        const finalMenu = items.length > 0 ? items : MENU_ITEMS;
        setMenu(finalMenu);
        localStorage.setItem('bamanda_menu_cache', JSON.stringify(finalMenu));
      });

      const unsubBlog = onSnapshot(query(collection(db, 'blog'), orderBy('date', 'desc')), (snapshot) => {
        const articles = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as BlogPost));
        setPosts(articles);
        localStorage.setItem('bamanda_blog_cache', JSON.stringify(articles));
      });

      return () => {
        unsubMenu();
        unsubBlog();
      };
    } catch (err) {
      console.error('Firebase background sync failed:', err);
    }
  }, []);

  // Theme effect
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Screen change logic
  useEffect(() => {
    if (isLoading) return; // Don't interrupt initial boot
    
    const isDataCached = currentScreen === 'menu' ? menu.length > 0 : true;
    const isReturningUser = hasVisited || !!getCookie('bamanda_visited');
    
    window.scrollTo(0, 0);
    
    // Quick transition loader for navigation
    setIsLoading(true);
    setLoadingMessage(currentScreen === 'menu' ? "Curing the Inventory" : "Navigating the Sanctuary");
    
    const delay = isDataCached ? (isReturningUser ? 300 : 500) : 800;
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [currentScreen]);

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
      const existingOrders = JSON.parse(localStorage.getItem('bamanda_orders') || '[]');
      localStorage.setItem('bamanda_orders', JSON.stringify([order, ...existingOrders].slice(0, 50)));
    } catch (e) {}

    if (db) {
      try {
        await setDoc(doc(db, 'orders', order.id), {
          ...order,
          createdAt: new Date().toISOString()
        });
      } catch (err) {}
    }
    
    setCart([]);
    setCurrentScreen('track-order');
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-surface selection:bg-accent/30 overflow-x-hidden">
      
      {isLoading && <BrandLoader subMessage={loadingMessage} />}

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
        {currentScreen === 'blog' && <BlogScreen />}
        {currentScreen === 'contact' && <ContactScreen />}
        {currentScreen === 'checkout' && <CheckoutScreen items={cart} onOrderComplete={handleOrderComplete} />}
        {currentScreen === 'track-order' && <TrackOrderScreen order={activeOrder} onBack={() => setCurrentScreen('menu')} />}
        {currentScreen === 'admin' && <AdminScreen />}
        
        {currentScreen === 'heritage' && (
          <InfoScreen 
            title="Our Heritage" 
            subtitle="The Legacy"
            onBack={() => setCurrentScreen('home')}
            content="Bamanda Kitchen is more than a restaurant; it is a sanctuary of ancestral recipes. For centuries, our culinary traditions have been passed down through generations, preserved in the smoke of ancient hearths and the wisdom of our elders."
          />
        )}
        {currentScreen === 'sustainability' && (
          <InfoScreen 
            title="Sustainability" 
            subtitle="Earth First"
            onBack={() => setCurrentScreen('home')}
            content="We are committed to the preservation of our land. From sourcing organic ingredients to minimizing waste, every step we take is guided by our responsibility to the future."
          />
        )}
        {currentScreen === 'legal' && (
          <InfoScreen 
            title="Legal" 
            subtitle="Transparency"
            onBack={() => setCurrentScreen('home')}
            content="Your trust is our most valuable asset. Our legal framework ensures that your data is protected and our operations remain transparent and ethical."
          />
        )}
        {currentScreen === 'press' && (
          <InfoScreen 
            title="Press" 
            subtitle="The Gazette"
            onBack={() => setCurrentScreen('home')}
            content="Discover what the world is saying about Bamanda. From culinary reviews to feature stories on our heritage, stay updated with our latest manifestations."
          />
        )}
        {currentScreen === 'careers' && (
          <InfoScreen 
            title="Careers" 
            subtitle="Join the Curation"
            onBack={() => setCurrentScreen('home')}
            content="We are always seeking passionate individuals to join our culinary family. If you have a deep respect for heritage and a commitment to excellence, we welcome you."
          />
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
    </ToastProvider>
  );
}
