/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { ShoppingBag, Sun, Moon, ChevronDown, BookOpen, Settings, Menu, X, Truck, MessageCircle, Home, Utensils, Info, Send, ShieldCheck, History } from "lucide-react";
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
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home", icon: Home, subtitle: "Return to Sanctuary" },
    { id: "menu", label: "Store", icon: Utensils, subtitle: "The Curated Menu" },
    { id: "about", label: "About", icon: Info, subtitle: "Our Heritage" },
    { id: "blog", label: "Journal", icon: BookOpen, subtitle: "The Gazette" },
    { id: "contact", label: "Contact", icon: Send, subtitle: "Reach Out" },
    { id: "track-order", label: "Track", icon: Truck, subtitle: "Curation Status" },
    { id: "admin", label: "Admin", icon: ShieldCheck, subtitle: "Curator Access" },
  ];

  const handleNavigate = (id: Screen) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className={cn(
        "fixed top-0 w-full z-[100] glass-nav transition-all duration-500 h-20",
        isLoading && "opacity-80 md:opacity-60",
        isMobileMenuOpen && "z-[50]"
      )}>
        <div className="flex justify-between items-center px-6 lg:px-10 h-full w-full max-w-screen-2xl mx-auto relative z-[165]">
          <div className="flex items-center space-x-2 lg:space-x-8">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => handleNavigate("home")}
                className="flex items-center space-x-3 lg:space-x-4 group"
              >
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden border-2 border-accent/20 group-hover:border-accent transition-colors">
                  <img src="/logo.jpg" alt="Bamanda Logo" className="w-full h-full object-cover" />
                </div>
                <span className="font-serif text-xl lg:text-2xl text-on-surface tracking-widest uppercase italic group-hover:text-accent transition-colors duration-500">
                  Bamanda
                </span>
              </button>
            </div>

            {/* Storyline Dropdown */}
            <div className="relative hidden lg:block">
              <button 
                onMouseEnter={() => setIsStoryOpen(true)}
                onMouseLeave={() => setIsStoryOpen(false)}
                className="flex items-center space-x-2 editorial-label text-[9px] hover:text-on-surface transition-colors cursor-pointer py-2"
              >
                <span>Our Storyline</span>
                <ChevronDown className={cn("w-3 h-3 transition-transform duration-500", isStoryOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {isStoryOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onMouseEnter={() => setIsStoryOpen(true)}
                    onMouseLeave={() => setIsStoryOpen(false)}
                    className="absolute top-full left-0 w-80 bg-surface border border-on-surface/10 p-8 shadow-2xl backdrop-blur-3xl mt-2"
                  >
                    <div className="space-y-6">
                      <div className="editorial-label text-[8px] opacity-40">The Narrative</div>
                      <h4 className="font-serif italic text-2xl text-on-surface leading-tight">Manifesting Centuries of Culinary Alchemy</h4>
                      <p className="font-sans text-[11px] text-on-surface-variant leading-relaxed">
                        From the smoke-filled kitchens of ancient empires to the modern sanctuary of Bamanda, our journey is one of reclamation. Each dish is a chapter, each flavor a whisper from the past.
                      </p>
                      <button 
                        onClick={() => handleNavigate("blog")}
                        className="group flex items-center space-x-3 text-accent hover:text-on-surface transition-colors"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span className="editorial-label text-[8px] group-hover:block transition-all">Explore the Gazette</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8 lg:space-x-12 font-sans text-[11px] uppercase tracking-[0.3em] font-extrabold">
            {navItems.filter(item => ["menu", "about", "blog", "contact"].includes(item.id)).map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id as Screen)}
                className={cn(
                  "text-on-surface/40 hover:text-accent transition-all duration-300 relative py-1 group",
                  currentScreen === item.id && "text-accent"
                )}
              >
                {item.label}
                <span className={cn(
                  "absolute -bottom-1 left-0 h-[1px] bg-accent transition-all duration-500",
                  currentScreen === item.id ? "w-full" : "w-0 group-hover:w-full"
                )} />
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-4 lg:space-x-8">
            {/* Cart Icon */}
            <button 
              onClick={onOpenCart}
              className="text-on-surface hover:text-accent transition-all relative p-2 group"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform duration-500" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 text-[10px] font-bold text-accent animate-pulse">
                  ({cartCount})
                </span>
              )}
            </button>

            {/* Track Order Icon */}
            <button 
              onClick={() => handleNavigate("track-order")}
              className={cn(
                "text-on-surface/60 hover:text-accent transition-all duration-500 hidden sm:block",
                currentScreen === "track-order" && "text-accent"
              )}
              title="Track Your Curation"
            >
              <Truck className="w-5 h-5" />
            </button>

            {/* Admin Access / Login Icon */}
            <button 
              onClick={() => handleNavigate("admin")}
              className={cn(
                "text-on-surface/60 hover:text-accent transition-all duration-500 hidden sm:block",
                currentScreen === "admin" && "text-accent"
              )}
              title="Curator Access"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Theme Toggle */}
            <button 
              onClick={onToggleTheme}
              className="text-on-surface/60 hover:text-on-surface transition-all duration-500 hidden sm:block"
              title={`Switch to ${theme === "night" ? "Day" : "Night"} Mode`}
            >
              {theme === "night" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                "md:hidden transition-all duration-500 p-3 z-[300] relative rounded-full flex items-center justify-center",
                isMobileMenuOpen ? "bg-accent text-white shadow-xl" : "bg-primary/5 text-on-surface hover:bg-primary/10 border border-on-surface/5"
              )}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-surface z-[270] md:hidden flex flex-col overflow-hidden"
          >
            {/* Background Texture/Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none wood-texture" />
            
            {/* Centered List Content */}
            <div className="flex-1 flex flex-col justify-center px-10 relative z-10">
              <div className="space-y-3 max-w-md mx-auto w-full">
                {navItems.map((item, i) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleNavigate(item.id as Screen)}
                    className={cn(
                      "w-full flex items-center gap-6 p-5 rounded-2xl transition-all group",
                      currentScreen === item.id 
                        ? "bg-accent text-white shadow-lg" 
                        : "bg-primary/5 text-on-surface hover:bg-primary/10"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                      currentScreen === item.id ? "bg-white/20" : "bg-white text-accent"
                    )}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <div className="font-serif text-2xl italic leading-none mb-1">{item.label}</div>
                      <div className={cn(
                        "text-[9px] uppercase tracking-[0.2em] font-black opacity-40",
                        currentScreen === item.id ? "text-white" : "text-primary"
                      )}>{item.subtitle}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Simple Utility Footer */}
            <div className="p-10 flex flex-col items-center gap-6 relative z-10">
              <button 
                onClick={onToggleTheme}
                className="flex items-center gap-4 px-6 py-3 bg-primary/5 rounded-full border border-on-surface/5"
              >
                <span className="text-[9px] font-black uppercase tracking-widest opacity-40">
                  {theme === "night" ? "Night Sanctuary" : "Golden Day"}
                </span>
                {theme === "night" ? <Sun className="w-3 h-3 text-accent" /> : <Moon className="w-3 h-3 text-accent" />}
              </button>
              <div className="text-[8px] font-bold uppercase tracking-[0.5em] opacity-20">
                © 2026 Bamanda Heritage
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
