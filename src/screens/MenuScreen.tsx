/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Search, ShoppingBag, Heart, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MENU_ITEMS } from '../data';
import { MenuItem } from '../types';

interface MenuScreenProps {
  onAddToCart: (item: MenuItem) => void;
  initialFilter?: string;
}

const MEAL_TIMES = ['All Day', 'Breakfast', 'Lunch', 'Dinner'];

export default function MenuScreen({ onAddToCart, initialFilter }: MenuScreenProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeMealTime, setActiveMealTime] = useState(initialFilter || 'All Day');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Dynamic Categories from Data
  const categories = ['All', ...Array.from(new Set(menuItems.map(item => item.category)))];

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const response = await fetch('/menu.json');
        const data = await response.json();
        setMenuItems(data.menu);
      } catch (error) {
        console.error('Failed to fetch dynamic menu, using fallback data.', error);
        setMenuItems(MENU_ITEMS);
      } finally {
        setIsLoading(false);
      }
    };
    loadMenu();
  }, []);

  useEffect(() => {
    if (initialFilter && MEAL_TIMES.includes(initialFilter)) {
      setActiveMealTime(initialFilter);
    } else if (initialFilter && categories.includes(initialFilter)) {
      setActiveCategory(initialFilter);
    }
  }, [initialFilter, menuItems]);

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesMealTime = activeMealTime === 'All Day' || item.mealTime.includes(activeMealTime as any);
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesMealTime && matchesSearch && item.available;
  });

  return (
    <div className="pt-20 min-h-screen bg-cream">
      {/* Header / Search Area */}
      <section className="bg-primary text-white py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none wood-texture" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="editorial-label mb-4 text-accent">Full Online Store</div>
            <h1 className="font-serif text-5xl md:text-7xl mb-8">The Curated Menu</h1>
            
            <div className="max-w-2xl mx-auto relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
              <input 
                type="text"
                placeholder="Search by name, category, or tag (e.g. 'Spicy')..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-primary rounded-full py-5 pl-16 pr-6 shadow-2xl focus:ring-4 focus:ring-accent/20 transition-all outline-none font-sans"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-20 z-40 bg-white/80 backdrop-blur-xl editorial-border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 md:pb-0">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeCategory === cat ? 'bg-accent text-white shadow-lg' : 'bg-primary/5 text-on-surface-variant hover:bg-primary/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3">
             <Filter className="w-4 h-4 text-accent" />
             <div className="flex bg-primary/5 p-1 rounded-full">
               {MEAL_TIMES.map((time) => (
                 <button
                   key={time}
                   onClick={() => setActiveMealTime(time)}
                   className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all ${
                     activeMealTime === time ? 'bg-white text-accent shadow-sm' : 'text-on-surface-variant hover:text-primary'
                   }`}
                 >
                   {time}
                 </button>
               ))}
             </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <AnimatePresence mode='wait'>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[1, 2, 4, 8].map(i => (
                <div key={i} className="aspect-square bg-primary/5 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              <AnimatePresence mode='popLayout'>
                {filteredItems.map((item) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={item.id} 
                    className="bg-white rounded-2xl overflow-hidden shadow-md card-hover group"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.name} />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      <button className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md rounded-full text-primary hover:text-accent transition-colors shadow-lg translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-serif text-lg text-primary">{item.name}</h3>
                        <span className="font-bold text-accent">₦{item.price.toLocaleString()}</span>
                      </div>
                      <div className="text-[10px] text-on-surface-variant font-bold uppercase tracking-[0.1em] mb-4">
                        {item.category} {item.portion && `• ${item.portion} portion`}
                      </div>
                      <p className="text-xs text-on-surface-variant mb-6 line-clamp-2 leading-relaxed h-8">
                        {item.description}
                      </p>
                      <button 
                        onClick={() => onAddToCart(item)}
                        className="w-full flex items-center justify-center gap-2 bg-accent text-white px-6 py-3 rounded-xl font-bold hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 active:scale-95 text-xs uppercase tracking-widest"
                      >
                        <ShoppingBag className="w-4 h-4" /> Add to Cart
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
        
        {!isLoading && filteredItems.length === 0 && (
          <div className="py-32 text-center">
            <div className="font-serif italic text-3xl opacity-20 mb-4">No culinary treasures found</div>
            <p className="text-on-surface-variant max-w-sm mx-auto text-sm">Try searching for ingredients or categories to explore other heritage dishes.</p>
          </div>
        )}
      </section>
    </div>
  );
}
