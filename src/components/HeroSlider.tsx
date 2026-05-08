/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const slides = [
  {
    image: "/images/hero/hero-jollof.png",
    title: "Nigerian Jollof",
    subtitle: "The classic taste of home, rich in flavor and tradition.",
    highlight: "Naija Flavor"
  },
  {
    image: "/images/hero/hero-2.png",
    title: "Signature Dishes",
    subtitle: "Crafted with passion using the finest local ingredients.",
    highlight: "Chef's Special"
  },
  {
    image: "/images/hero/hero-3.png",
    title: "Authentic Soups",
    subtitle: "Hearty and soul-warming recipes passed down through generations.",
    highlight: "Traditional"
  },
  {
    image: "/images/hero/hero-4.png",
    title: "Gourmet Experience",
    subtitle: "Redefining African gastronomy with a modern touch.",
    highlight: "Luxury Dining"
  },
  {
    image: "/images/hero/hero-5.png",
    title: "Healthy Living",
    subtitle: "Freshly cooked, nutritious meals for a balanced lifestyle.",
    highlight: "Eat Healthy"
  },
  {
    image: "/images/hero/hero-6.png",
    title: "Coastal Flavors",
    subtitle: "Experience the fresh and vibrant seafood of the Atlantic.",
    highlight: "Fresh Catch"
  }
];

interface HeroSliderProps {
  onNavigateToMenu: () => void;
}

export default function HeroSlider({ onNavigateToMenu }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[85vh] w-full overflow-hidden flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img 
            src={slides[current].image} 
            className="w-full h-full object-cover brightness-[0.5]"
            alt={slides[current].title}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-transparent to-primary/40" />
        </motion.div>
      </AnimatePresence>
      
      <div className="relative z-10 text-center px-6 max-w-5xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="editorial-label mb-4 text-accent drop-shadow-lg">
              {slides[current].highlight}
            </div>
            <h1 className="font-serif text-[clamp(3rem,8vw,6.5rem)] text-white leading-[0.95] tracking-tight mb-8 drop-shadow-2xl">
              {slides[current].title.split(' ')[0]} <br />
              <span className="italic text-accent">{slides[current].title.split(' ').slice(1).join(' ')}</span>
            </h1>
            <p className="text-white/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light tracking-wide">
              {slides[current].subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button 
                onClick={onNavigateToMenu}
                className="button-primary w-full sm:w-auto shadow-2xl shadow-accent/20"
              >
                Order Now
              </button>
              <button 
                onClick={onNavigateToMenu}
                className="border-2 border-white text-white px-8 py-4 font-bold uppercase tracking-widest hover:bg-white hover:text-primary transition-all w-full sm:w-auto backdrop-blur-sm"
              >
                Explore Menu
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Indicator dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 transition-all duration-500 rounded-full ${
                i === current ? 'w-12 bg-accent' : 'w-4 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
