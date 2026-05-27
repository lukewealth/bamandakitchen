/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArrowRight, Utensils, Globe, Martini, Star } from "lucide-react";
import { motion } from "motion/react";
import { MenuItem, Screen } from "../types";
import HeroSlider from "../components/HeroSlider";
import OptimizedImage from "../components/OptimizedImage";
import MenuCard from "../components/MenuCard";

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
  onNavigateToMenu: (filter?: string) => void;
  onAddToCart: (item: MenuItem) => void;
  trendingDishes: MenuItem[];
}

export default function HomeScreen({ onNavigate, onNavigateToMenu, onAddToCart, trendingDishes }: HomeScreenProps) {
  const mealTimes = [
    { name: "Breakfast", icon: "🍳", image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&q=80&w=800" },
    { name: "Lunch", icon: "🍛", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800" },
    { name: "Dinner", icon: "🍽️", image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800" },
  ];

  return (
    <div className="w-full pt-20 bg-cream">
      {/* Hero Section */}
      <HeroSlider onNavigate={(screen) => {
        if (screen === 'menu') onNavigateToMenu();
        else onNavigate(screen);
      }} />

      {/* Meal Time Segments */}
      <section className="py-24 editorial-container">
        <div className="editorial-label mb-4 text-center">Meal Time Segments</div>
        <h2 className="font-serif text-4xl text-center mb-16 text-primary">Curated for Every Hour</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mealTimes.map((meal) => (
            <motion.div 
              key={meal.name}
              whileHover={{ y: -10 }}
              onClick={() => onNavigateToMenu(meal.name)}
              className="group cursor-pointer relative aspect-[4/5] overflow-hidden rounded-xl shadow-xl"
            >
              <OptimizedImage 
                src={meal.image} 
                containerClassName="absolute inset-0 w-full h-full"
                className="transition-transform duration-1000 group-hover:scale-110 group-hover:brightness-110"
                alt={meal.name}
                aspectRatio="h-full w-full"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10 pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-20">
                <div className="text-4xl mb-4">{meal.icon}</div>
                <h3 className="font-serif text-3xl mb-2">{meal.name}</h3>
                <div className="flex items-center text-accent font-bold uppercase tracking-widest text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Now Selling (Hot Picks) */}
      <section className="py-24 bg-primary/5 editorial-border-t">
        <div className="editorial-container">
          <div className="flex justify-between items-end mb-12">
            <div>
              <div className="editorial-label mb-2 text-accent">Now Selling</div>
              <h2 className="font-serif text-4xl text-primary">Trending Hot Picks</h2>
            </div>
            <button 
              onClick={() => onNavigateToMenu()}
              className="text-primary font-bold flex items-center gap-2 group"
            >
              View Full Store <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {trendingDishes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {trendingDishes.map((dish) => (
                <MenuCard key={dish.id} item={dish} onAddToCart={onAddToCart} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border-2 border-dashed border-primary/10 rounded-3xl">
              <Star className="w-12 h-12 text-primary/10 mx-auto mb-4" />
              <p className="font-serif italic text-2xl text-primary opacity-20">New signature curations manifesting soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* Philosophy / Heritage Banner */}
      <section className="py-32 bg-primary text-white overflow-hidden relative wood-texture">
        <div className="max-w-4xl mx-auto px-12 text-center relative z-10">
          <div className="w-16 h-1 bg-accent mx-auto mb-12" />
          <h2 className="font-serif italic text-5xl mb-10 leading-tight">
            "Heritage is the fire we keep, not the ash we preserve."
          </h2>
          <p className="font-sans text-on-surface-variant max-w-2xl mx-auto text-lg leading-relaxed opacity-60">
            Bamanda Kitchen is a modern sanctuary of African gastronomy, where ancestral recipes meet contemporary precision.
          </p>
        </div>
      </section>

      {/* Cuisine Categories (Quick Access) */}
      <section className="py-24 editorial-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="group cursor-pointer" onClick={() => onNavigateToMenu("African Dishes")}>
            <div className="w-24 h-24 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-accent group-hover:text-white transition-all shadow-sm">
              <Utensils className="w-10 h-10" />
            </div>
            <h3 className="font-serif text-2xl text-primary mb-2">African Dishes</h3>
            <p className="text-sm text-on-surface-variant italic">Rooted in tradition</p>
          </div>
          <div className="group cursor-pointer" onClick={() => onNavigateToMenu("Intercontinental")}>
            <div className="w-24 h-24 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-accent group-hover:text-white transition-all shadow-sm">
              <Globe className="w-10 h-10" />
            </div>
            <h3 className="font-serif text-2xl text-primary mb-2">Intercontinental</h3>
            <p className="text-sm text-on-surface-variant italic">Global flavors, local soul</p>
          </div>
          <div className="group cursor-pointer" onClick={() => onNavigateToMenu("Drinks")}>
            <div className="w-24 h-24 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-accent group-hover:text-white transition-all shadow-sm">
              <Martini className="w-10 h-10" />
            </div>
            <h3 className="font-serif text-2xl text-primary mb-2">Drinks</h3>
            <p className="text-sm text-on-surface-variant italic">Crafted nectars</p>
          </div>
        </div>
      </section>
    </div>
  );
}
