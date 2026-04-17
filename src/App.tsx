/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import HomeScreen from './screens/HomeScreen';
import MenuScreen from './screens/MenuScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import KitchenScreen from './screens/KitchenScreen';
import BlogScreen from './screens/BlogScreen';
import { MenuItem, CartItem, Screen } from './types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [menuFilter, setMenuFilter] = useState<string | undefined>(undefined);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [theme, setTheme] = useState<'night' | 'day'>('night');
  const [isLoading, setIsLoading] = useState(false);

  // Theme effect
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Screen change effect with loading simulation
  useEffect(() => {
    setIsLoading(true);
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
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

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-surface selection:bg-accent/30 overflow-x-hidden">
      <Header 
        currentScreen={currentScreen} 
        onNavigate={setCurrentScreen} 
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={cartCount}
        theme={theme}
        onToggleTheme={() => setTheme(prev => prev === 'night' ? 'day' : 'night')}
        isLoading={isLoading}
      />

      <main>
        {currentScreen === 'home' && (
          <HomeScreen onNavigateToMenu={handleNavigateToMenu} />
        )}
        {currentScreen === 'menu' && (
          <MenuScreen onAddToCart={handleAddToCart} initialFilter={menuFilter} />
        )}
        {currentScreen === 'kitchen' && (
          <KitchenScreen />
        )}
        {currentScreen === 'blog' && (
          <BlogScreen />
        )}
        {currentScreen === 'checkout' && (
          <CheckoutScreen items={cart} />
        )}
      </main>

      <Footer />

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
      />
      
      {/* Editorial Loading Bar */}
      <div className={`fixed top-0 left-0 w-full h-[3px] z-[200] pointer-events-none transition-opacity duration-300 ${isLoading ? 'opacity-100' : 'opacity-0'}`}>
        <div className="h-full bg-accent animate-editorial-loading" />
      </div>
    </div>
  );
}
