/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { ShoppingBag, Sun, Moon, ChevronDown, BookOpen, Settings, Menu, X, Truck, MessageCircle } from "lucide-react";
import { cn } from "../lib/utils";
import { Screen } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface HeaderProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  onOpenCart: () => void;
  cartCount: number;
  theme: "night" | "day";
  onToggleTheme: () => void;
  isLoading: boolean;
}

export default function Header({ 
  currentScreen, 
  onNavigate, 
  onOpenCart, 
  cartCount,
  theme,
  onToggleTheme,
  isLoading
}: HeaderProps) {
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "menu", label: "Store", icon: ShoppingBag, description: "Manifest our culinary inventory." },
    { id: "blog", label: "Journal", icon: BookOpen, description: "Chronicles of fire and legacy." },
    { id: "contact", label: "Connect", icon: MessageCircle, description: "Join our culinary sanctuary." },
  ];

  const handleNavigate = (id: Screen) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
    setIsExploreOpen(false);
  };

  return (
    <header className={cn(
      "fixed top-0 w-full z-[100] glass-nav transition-all duration-500 h-20",
      isLoading && "opacity-60"
    )}>
      <div className="flex justify-between items-center px-4 lg:px-10 h-full w-full max-w-screen-2xl mx-auto">
        <div className="flex items-center space-x-2 lg:space-x-8">
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-on-surface hover:text-accent transition-colors p-2"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="flex items-center">
            <button 
              onClick={() => handleNavigate("home")}
              className="flex items-center space-x-3 lg:space-x-4 group"
            >
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden border-2 border-accent/20 group-hover:border-accent transition-colors shrink-0">
                <img src="/logo.jpg" alt="Bamanda Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-serif text-lg lg:text-2xl text-on-surface tracking-widest uppercase italic group-hover:text-accent transition-colors duration-500 whitespace-nowrap">
                Bamanda
              </span>
            </button>
          </div>

          {/* Desktop Navigation with Micro-Interactions */}
          <nav className="hidden md:flex items-center gap-2">
            <div className="relative group">
              <button 
                onMouseEnter={() => setIsExploreOpen(true)}
                className={cn(
                  "flex items-center gap-3 px-6 py-2 rounded-full font-sans text-[10px] uppercase tracking-[0.3em] font-extrabold transition-all duration-500",
                  isExploreOpen ? "bg-accent text-white" : "text-on-surface/60 hover:text-on-surface"
                )}
              >
                <span>Curations</span>
                <ChevronDown className={cn("w-3 h-3 transition-transform duration-500", isExploreOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {isExploreOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-[-1]" 
                      onMouseEnter={() => setIsExploreOpen(false)}
                    />
                    <motion.div 
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      onMouseLeave={() => setIsExploreOpen(false)}
                      className="absolute top-full left-0 w-[400px] bg-surface-variant border border-on-surface/5 shadow-2xl backdrop-blur-3xl mt-4 rounded-3xl overflow-hidden p-2 z-[110]"
                    >
                      <div className="grid grid-cols-1 gap-1">
                        {navItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.id}
                              onClick={() => handleNavigate(item.id as Screen)}
                              className="flex items-center gap-4 p-4 rounded-2xl hover:bg-primary/5 transition-all text-left group/item"
                            >
                              <div className="w-12 h-12 rounded-xl bg-accent/5 flex items-center justify-center group-hover/item:bg-accent group-hover/item:text-white transition-colors">
                                <Icon className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="text-[10px] uppercase tracking-widest font-black text-on-surface group-hover/item:text-accent transition-colors">{item.label}</div>
                                <div className="text-[11px] text-on-surface/40 font-serif italic mt-0.5">{item.description}</div>
                              </div>
                            </button>
                          );
                        })}
                        <button
                          onClick={() => handleNavigate("about")}
                          className="mt-2 p-4 pt-6 border-t border-on-surface/5 flex justify-between items-center group/all"
                        >
                          <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-on-surface/40 group-hover/all:text-accent transition-colors">The Ancestral Legacy</span>
                          <span className="text-[9px] font-serif italic text-accent opacity-0 group-hover/all:opacity-100 transition-all translate-x-2 group-hover/all:translate-x-0">Learn More</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </nav>
        </div>

        <div className="flex items-center space-x-2 lg:space-x-8">
          {/* Cart Icon */}
          <button 
            onClick={onOpenCart}
            className="text-on-surface hover:text-accent transition-all relative p-2 group"
          >
            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform duration-500" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-accent text-[10px] font-bold text-white rounded-full shadow-lg border-2 border-surface animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          <div className="h-6 w-px bg-on-surface/10 hidden sm:block" />

          {/* Track Order Icon */}
          <button 
            onClick={() => handleNavigate("track-order")}
            className={cn(
              "text-on-surface/60 hover:text-accent transition-all duration-500 hidden sm:block p-2",
              currentScreen === "track-order" && "text-accent"
            )}
            title="Track Order"
          >
            <Truck className="w-5 h-5" />
          </button>

          {/* Curator Access */}
          <button 
            onClick={() => handleNavigate("admin")}
            className={cn(
              "text-on-surface/60 hover:text-accent transition-all duration-500 hidden sm:block p-2",
              currentScreen === "admin" && "text-accent"
            )}
            title="Curator Access"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Theme Toggle */}
          <button 
            onClick={onToggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-on-surface/5 text-on-surface/60 hover:bg-accent/10 hover:text-accent transition-all duration-500"
            title={`Switch Theme`}
          >
            {theme === "night" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 top-20 bg-surface z-40 md:hidden overflow-y-auto"
          >
            <div className="p-8 space-y-12">
              <div className="space-y-8">
                <div className="editorial-label text-accent/40">Navigation</div>
                <nav className="flex flex-col space-y-6">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.id as Screen)}
                      className={cn(
                        "text-left font-serif text-4xl italic transition-colors",
                        currentScreen === item.id ? "text-accent" : "text-on-surface"
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <button 
                  onClick={() => {
                    onOpenCart();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex flex-col items-center justify-center p-4 bg-primary/5 rounded-3xl border border-accent/10 group text-center"
                >
                  <ShoppingBag className="w-6 h-6 text-accent mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-[8px] font-bold uppercase tracking-widest text-primary">Cart</span>
                  {cartCount > 0 && <span className="mt-1 text-accent font-black text-xs">({cartCount})</span>}
                </button>
                <button 
                  onClick={() => {
                    handleNavigate("track-order");
                  }}
                  className="flex flex-col items-center justify-center p-4 bg-primary/5 rounded-3xl border border-accent/10 group text-center"
                >
                  <Truck className="w-6 h-6 text-accent mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-[8px] font-bold uppercase tracking-widest text-primary">Track</span>
                </button>
                <button 
                  onClick={() => {
                    handleNavigate("admin");
                  }}
                  className="flex flex-col items-center justify-center p-4 bg-primary/5 rounded-3xl border border-accent/10 group text-center"
                >
                  <Settings className="w-6 h-6 text-on-surface/60 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-[8px] font-bold uppercase tracking-widest text-on-surface/60">Curator</span>
                </button>
              </div>

              <div className="pt-12 border-t border-on-surface/5 space-y-8">
                <div className="editorial-label text-accent/40">The Narrative</div>
                <div className="space-y-4">
                  <h4 className="font-serif italic text-2xl text-on-surface">Our Storyline</h4>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                    Manifesting centuries of culinary alchemy from the smoke-filled kitchens of ancient empires.
                  </p>
                  <button 
                    onClick={() => handleNavigate("blog")}
                    className="flex items-center space-x-3 text-accent font-bold uppercase tracking-widest text-[10px]"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Explore the Gazette</span>
                  </button>
                </div>
              </div>

              <div className="pt-8 flex items-center justify-between opacity-40">
                 <div className="text-[9px] font-bold uppercase tracking-[0.3em]">Bamanda Kitchen © 2026</div>
                 <button onClick={onToggleTheme}>
                   {theme === "night" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                 </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
