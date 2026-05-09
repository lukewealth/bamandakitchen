/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, Truck } from "lucide-react";
import OptimizedImage from "./OptimizedImage";
import { Screen } from "../types";
import { patronTracker } from "../lib/security";

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
  onNavigate: (screen: Screen) => void;
}

export default function HeroSlider({ onNavigate }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);

  // Pre-fetch all hero images for instant transitions
  useEffect(() => {
    slides.forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[90vh] w-full overflow-hidden flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <OptimizedImage 
            src={slides[current].image} 
            containerClassName="w-full h-full"
            className="brightness-[0.45] contrast-[1.05]"
            alt={slides[current].title}
            aspectRatio="h-full w-full"
            priority={true}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-transparent to-primary/60 z-[5]" />
        </motion.div>
      </AnimatePresence>
      
      <div className="relative z-10 text-center px-4 md:px-6 max-w-5xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div 
              initial={{ opacity: 0, letterSpacing: "0.5em" }}
              animate={{ opacity: 1, letterSpacing: "0.3em" }}
              className="editorial-label mb-6 text-accent drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] font-black"
            >
              {slides[current].highlight}
            </motion.div>
            <h1 className="font-serif text-[clamp(2.5rem,10vw,7.5rem)] text-white leading-[0.9] tracking-tighter mb-8 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
              {slides[current].title.split(" ")[0]} <br />
              <span className="italic text-accent">{slides[current].title.split(" ").slice(1).join(" ")}</span>
            </h1>
            <p className="text-white/90 text-base md:text-xl mb-12 max-w-2xl mx-auto font-sans font-medium tracking-wide drop-shadow-md leading-relaxed">
              {slides[current].subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <button 
                onClick={() => onNavigate("menu")}
                className="group relative bg-accent text-white px-10 py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-[11px] overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_20px_40px_-15px_rgba(255,107,0,0.5)] w-full sm:w-auto flex items-center justify-center gap-3"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                <ShoppingBag className="w-4 h-4" />
                <span>Order Heritage</span>
              </button>
              <button 
                onClick={() => {
                  patronTracker.captureTrackingMetadata("check_track_landing");
                  onNavigate("track-order");
                }}
                className="group border border-white/30 text-white px-10 py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-white hover:text-primary transition-all w-full sm:w-auto backdrop-blur-md flex items-center justify-center gap-3 hover:border-white shadow-xl"
              >
                <Truck className="w-4 h-4 group-hover:animate-bounce" />
                <span>Check Track</span>
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
        <div className="flex gap-2.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="group p-2"
              aria-label={`Go to slide ${i + 1}`}
            >
              <div className={`h-1 transition-all duration-700 rounded-full ${
                i === current ? "w-10 bg-accent shadow-[0_0_10px_#FF6B00]" : "w-4 bg-white/20 hover:bg-white/40"
              }`} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
