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
    <section className="relative h-[85vh] md:h-[90vh] w-full overflow-hidden flex items-center justify-center">
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
            className="brightness-[0.4] contrast-[1.05]"
            alt={slides[current].title}
            aspectRatio="h-full w-full"
            priority={true}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-transparent to-primary/80 z-[5]" />
        </motion.div>
      </AnimatePresence>
      
      <div className="relative z-10 text-center px-6 md:px-12 max-w-6xl mt-10 md:mt-0">
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
              animate={{ opacity: 1, letterSpacing: "0.4em" }}
              className="editorial-label mb-4 md:mb-8 text-accent drop-shadow-xl font-black text-[10px] md:text-xs"
            >
              {slides[current].highlight}
            </motion.div>
            <h1 className="font-serif text-[clamp(2.5rem,12vw,7rem)] text-white leading-[0.85] tracking-tighter mb-8 md:mb-10 drop-shadow-2xl">
              {slides[current].title.split(" ")[0]} <br />
              <span className="italic text-accent">{slides[current].title.split(" ").slice(1).join(" ")}</span>
            </h1>
            <p className="text-white/80 text-sm md:text-xl mb-12 md:mb-16 max-w-2xl mx-auto font-sans font-medium tracking-wide drop-shadow-md leading-relaxed md:leading-loose">
              {slides[current].subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
              <button 
                onClick={() => onNavigate("menu")}
                className="group relative bg-accent text-white px-12 py-5 md:py-6 rounded-2xl font-bold uppercase tracking-[0.25em] text-[10px] md:text-[11px] overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_20px_50px_-15px_rgba(255,107,0,0.4)] w-full sm:w-auto flex items-center justify-center gap-4"
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
                className="group border border-white/20 text-white px-12 py-5 md:py-6 rounded-2xl font-bold uppercase tracking-[0.25em] text-[10px] md:text-[11px] hover:bg-white hover:text-primary transition-all w-full sm:w-auto backdrop-blur-md flex items-center justify-center gap-4 hover:border-white shadow-xl"
              >
                <Truck className="w-4 h-4 group-hover:animate-bounce" />
                <span>Track Journey</span>
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Indicators */}
      <div className="absolute bottom-10 md:bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
        <div className="flex gap-2.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="group p-2"
              aria-label={`Go to slide ${i + 1}`}
            >
              <div className={`h-[2px] transition-all duration-700 rounded-full ${
                i === current ? "w-12 bg-accent shadow-[0_0_15px_rgba(255,107,0,0.8)]" : "w-4 bg-white/30 hover:bg-white/50"
              }`} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
