/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArrowRight, Utensils, Globe, Martini, ShoppingBag, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { MenuItem } from '../types';
import { MENU_ITEMS } from '../data';

interface HomeScreenProps {
  onNavigateToMenu: (filter?: string) => void;
}

export default function HomeScreen({ onNavigateToMenu }: HomeScreenProps) {
  const trendingDishes = MENU_ITEMS.filter(item => item.tag === 'Signature' || ['7', '8'].includes(item.id));

  const mealTimes = [
    { name: 'Breakfast', icon: '🍳', image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&q=80&w=800' },
    { name: 'Lunch', icon: '🍛', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800' },
    { name: 'Dinner', icon: '🍽️', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800' },
  ];

  return (
    <div className="w-full pt-20 bg-cream">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover brightness-[0.4]"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 to-primary/20" />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-serif text-[clamp(3.5rem,8vw,7rem)] text-white leading-[0.9] tracking-tight mb-8">
              Eating Well. <br />
              <span className="italic text-accent">Living Healthy.</span>
            </h1>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button 
                onClick={() => onNavigateToMenu()}
                className="button-primary w-full sm:w-auto"
              >
                Order Now
              </button>
              <button 
                onClick={() => onNavigateToMenu()}
                className="border-2 border-white text-white px-8 py-4 font-bold uppercase tracking-widest hover:bg-white hover:text-primary transition-all w-full sm:w-auto"
              >
                Explore Menu
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Meal Time Segments */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="editorial-label mb-4 text-center">Meal Time Segments</div>
        <h2 className="font-serif text-4xl text-center mb-16 text-primary">Curated for Every Hour</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mealTimes.map((meal) => (
            <motion.div 
              key={meal.name}
              whileHover={{ y: -10 }}
              onClick={() => onNavigateToMenu(meal.name)}
              className="group cursor-pointer relative aspect-[3/4] overflow-hidden rounded-xl shadow-xl"
            >
              <img 
                src={meal.image} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt={meal.name}
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
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
        <div className="max-w-7xl mx-auto px-6">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {trendingDishes.map((dish) => (
              <div key={dish.id} className="bg-white rounded-2xl overflow-hidden shadow-lg card-hover">
                <div className="relative aspect-square">
                  <img src={dish.image} className="w-full h-full object-cover" alt={dish.name} />
                  {dish.tag && (
                    <div className="absolute top-4 left-4 bg-accent text-white px-4 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full">
                      {dish.tag}
                    </div>
                  )}
                  <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full text-primary hover:text-accent transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-serif text-xl text-primary">{dish.name}</h3>
                    <span className="font-bold text-accent">₦{dish.price.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-on-surface-variant mb-6 line-clamp-2">{dish.description}</p>
                  <button 
                    onClick={() => onNavigateToMenu()}
                    className="w-full flex items-center justify-center gap-2 border-2 border-accent text-accent px-6 py-3 rounded-xl font-bold hover:bg-accent hover:text-white transition-all"
                  >
                    <ShoppingBag className="w-4 h-4" /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy / Heritage Banner */}
      <section className="py-32 bg-primary text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <img src="https://www.transparenttextures.com/patterns/wood-pattern.png" className="w-full h-full object-cover" alt="texture" />
        </div>
        <div className="max-w-4xl mx-auto px-12 text-center relative z-10">
          <div className="w-16 h-1 bg-accent mx-auto mb-12" />
          <h2 className="font-serif italic text-5xl mb-10 leading-tight">
            "Heritage is the fire we keep, not the ash we preserve."
          </h2>
          <p className="font-sans text-on-surface-variant max-w-2xl mx-auto text-lg leading-relaxed">
            Bamanda Kitchen is a modern sanctuary of African gastronomy, where ancestral recipes meet contemporary precision.
          </p>
        </div>
      </section>

      {/* Cuisine Categories (Quick Access) */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="group cursor-pointer" onClick={() => onNavigateToMenu('African Dishes')}>
            <div className="w-24 h-24 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-accent group-hover:text-white transition-all">
              <Utensils className="w-10 h-10" />
            </div>
            <h3 className="font-serif text-2xl text-primary mb-2">African Dishes</h3>
            <p className="text-sm text-on-surface-variant italic">Rooted in tradition</p>
          </div>
          <div className="group cursor-pointer" onClick={() => onNavigateToMenu('Intercontinental')}>
            <div className="w-24 h-24 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-accent group-hover:text-white transition-all">
              <Globe className="w-10 h-10" />
            </div>
            <h3 className="font-serif text-2xl text-primary mb-2">Intercontinental</h3>
            <p className="text-sm text-on-surface-variant italic">Global flavors, local soul</p>
          </div>
          <div className="group cursor-pointer" onClick={() => onNavigateToMenu('Drinks')}>
            <div className="w-24 h-24 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-accent group-hover:text-white transition-all">
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
