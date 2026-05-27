/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from "react";
import { Search, ShoppingBag, Heart, Filter, Star, History } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MENU_ITEMS } from "../data";
import { MenuItem } from "../types";
import MenuCard from "../components/MenuCard";
import SkeletonLoader from "../components/SkeletonLoader";
import { patronTracker } from "../lib/security";
import { cn, getCookie } from "../lib/utils";

interface MenuScreenProps {
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
  initialFilter?: string;
}

const MEAL_TIMES = ["All Day", "Breakfast", "Lunch", "Dinner"];

export default function MenuScreen({ menuItems, onAddToCart, initialFilter }: MenuScreenProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeMealTime, setActiveMealTime] = useState(initialFilter || "All Day");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [patronFavorites, setPatronFavorites] = useState<any[]>([]);

  useEffect(() => {
    // Load patron insights
    setPatronFavorites(patronTracker.getFavorites());
    
    // Simulate loading for UX, but resolve faster if we have data or visited before
    const isReturningUser = !!getCookie('bamanda_visited');
    const delay = isReturningUser ? 100 : (menuItems.length > 0 ? 300 : 800);
    const timer = setTimeout(() => setIsLoading(false), delay);
    return () => clearTimeout(timer);
  }, [menuItems.length]);

  // Memoized Categories
  const categories = useMemo(() => ["All", ...Array.from(new Set(menuItems.map(item => item.category)))], [menuItems]);

  useEffect(() => {
    if (initialFilter && MEAL_TIMES.includes(initialFilter)) {
      setActiveMealTime(initialFilter);
    } else if (initialFilter && categories.includes(initialFilter)) {
      setActiveCategory(initialFilter);
    }
  }, [initialFilter, categories]);

  const handleAddToCart = (item: MenuItem) => {
    onAddToCart(item);
    patronTracker.trackView(item.id);
  };

  // Memoized Filtered Items for Performance
  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      const matchesMealTime = activeMealTime === "All Day" || item.mealTime.includes(activeMealTime as any);
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesCategory && matchesMealTime && matchesSearch && item.available;
    });
  }, [menuItems, activeCategory, activeMealTime, searchQuery]);

  return (
    <div className="pt-20 min-h-screen bg-cream">
      {/* Header / Search Area */}
      <section className="bg-surface py-16 px-6 relative overflow-hidden editorial-border-b">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none wood-texture" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="editorial-label mb-4 text-accent">Full Online Store</div>
            <h1 className="font-serif text-5xl md:text-7xl mb-8 text-black">The Curated Menu</h1>

            <div className="max-w-2xl mx-auto relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
              <input 
                type="text"
                placeholder="Search by name, category, or tag (e.g. 'Spicy')..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-black rounded-full py-5 pl-16 pr-6 shadow-2xl focus:ring-4 focus:ring-accent/20 transition-all outline-none font-sans border border-on-surface/5"
              />
            </div>
          </motion.div>

        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-20 z-[50] bg-white/80 backdrop-blur-xl editorial-border-b shadow-sm">
        <div className="editorial-container py-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-2 pb-2 md:pb-0">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-6 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all whitespace-nowrap",
                  activeCategory === cat ? "bg-accent text-white shadow-lg" : "bg-primary/5 text-on-surface-variant hover:bg-primary/10"
                )}
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
                   className={cn(
                     "px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all",
                     activeMealTime === time ? "bg-white text-accent shadow-sm" : "text-on-surface-variant hover:text-primary"
                   )}
                 >
                   {time}
                 </button>
               ))}
             </div>
          </div>
        </div>
      </section>

      {/* Patron Favorites / Recommendations */}
      {patronFavorites.length > 0 && searchQuery === "" && activeCategory === "All" && (
        <section className="editorial-container pt-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary/5 rounded-[2rem] p-10 border border-primary/5"
          >
            <div className="flex items-center gap-3 mb-10">
              <Star className="w-5 h-5 text-accent" />
              <h2 className="font-serif italic text-3xl text-primary">Patron Favorites</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {patronFavorites.map((fav) => {
                const item = menuItems.find(m => m.id === fav.id);
                if (!item) return null;
                return (
                  <button 
                    key={fav.id}
                    onClick={() => handleAddToCart(item)}
                    className="flex items-center gap-5 p-5 bg-white rounded-2xl border border-primary/5 hover:border-accent/30 transition-all text-left group shadow-sm hover:shadow-xl hover:-translate-y-1"
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden shadow-md shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-serif text-primary italic text-base truncate">{item.name}</h4>
                      <div className="flex items-center gap-2 mt-2">
                        <History className="w-3 h-3 text-accent" />
                        <p className="text-[9px] text-accent font-black uppercase tracking-widest">Order Again</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </section>
      )}

      {/* Product Grid */}
      <section className="editorial-container py-16">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-12">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="space-y-6">
                  <SkeletonLoader className="aspect-[4/5] rounded-[2rem]" />
                  <div className="space-y-3 px-2">
                    <SkeletonLoader className="h-7 w-3/4" />
                    <SkeletonLoader className="h-4 w-1/2 opacity-50" />
                    <SkeletonLoader className="h-12 w-full mt-6" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-12"
            >
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item) => (
                  <MenuCard 
                    key={item.id}
                    item={item}
                    onAddToCart={handleAddToCart}
                  />
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
