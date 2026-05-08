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
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "menu", label: "Store" },
    { id: "about", label: "About" },
    { id: "blog", label: "Journal" },
    { id: "contact", label: "Contact" },
  ];

  const handleNavigate = (id: Screen) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={cn(
      "fixed top-0 w-full z-[100] glass-nav transition-all duration-500 h-20",
      isLoading && "opacity-80 md:opacity-60",
      isMobileMenuOpen && "z-[200]"
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
          {navItems.map((item) => (
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

          {/* Mobile Menu Toggle - Elevated z-index */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              "md:hidden transition-all duration-500 p-2 z-[200] relative rounded-full",
              isMobileMenuOpen ? "bg-accent text-white rotate-90 shadow-lg" : "text-on-surface hover:text-accent"
            )}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop - Increased depth */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-primary/60 backdrop-blur-md z-[160] md:hidden"
            />
            
            {/* Side Drawer - Solid surface and refined padding */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-surface z-[170] md:hidden shadow-[0_0_50px_rgba(0,0,0,0.3)] flex flex-col border-l border-on-surface/5"
            >
              <div className="p-8 pt-24 space-y-10 flex-1 overflow-y-auto no-scrollbar">
                <div className="space-y-6">
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="editorial-label text-accent opacity-60"
                  >
                    Navigation
                  </motion.div>
                  <nav className="flex flex-col space-y-2">
                    {navItems.map((item, i) => (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.1 }}
                        onClick={() => handleNavigate(item.id as Screen)}
                        className={cn(
                          "text-left font-serif text-4xl italic transition-all py-3 hover:pl-4 hover:text-accent",
                          currentScreen === item.id ? "text-accent pl-4" : "text-on-surface"
                        )}
                      >
                        {item.label}
                      </motion.button>
                    ))}
                  </nav>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <button 
                    onClick={() => {
                      handleNavigate("track-order");
                    }}
                    className="flex flex-col items-center justify-center p-6 bg-primary/5 rounded-3xl border border-primary/5 hover:border-accent/30 transition-all group"
                  >
                    <Truck className="w-6 h-6 text-accent mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface/60 group-hover:text-accent">Track</span>
                  </button>
                  <button 
                    onClick={() => {
                      handleNavigate("admin");
                    }}
                    className="flex flex-col items-center justify-center p-6 bg-primary/5 rounded-3xl border border-primary/5 hover:border-accent/30 transition-all group"
                  >
                    <Settings className="w-6 h-6 text-on-surface/40 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface/60 group-hover:text-accent">Curator</span>
                  </button>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="pt-10 border-t border-on-surface/5 space-y-6"
                >
                  <div className="editorial-label text-accent opacity-60">The Narrative</div>
                  <div className="space-y-4">
                    <h4 className="font-serif italic text-2xl text-on-surface">Our Storyline</h4>
                    <p className="font-sans text-xs text-on-surface-variant leading-relaxed opacity-70">
                      Manifesting centuries of culinary alchemy from the smoke-filled kitchens of ancient empires.
                    </p>
                    <button 
                      onClick={() => handleNavigate("blog")}
                      className="flex items-center space-x-3 text-accent font-bold uppercase tracking-[0.2em] text-[10px] hover:translate-x-2 transition-transform"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Explore Gazette</span>
                    </button>
                  </div>
                </motion.div>
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="p-8 border-t border-on-surface/5 bg-on-surface/5 flex items-center justify-between"
              >
                 <div className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-30">© 2026 Bamanda</div>
                 <button 
                   onClick={onToggleTheme}
                   className="p-4 bg-surface rounded-2xl shadow-xl text-accent border border-on-surface/5 active:scale-95 transition-transform"
                 >
                   {theme === "night" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                 </button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
