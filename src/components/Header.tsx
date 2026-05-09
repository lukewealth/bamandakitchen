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

          {/* Mobile Menu Toggle - Elevated z-index and improved design */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              "md:hidden transition-all duration-500 px-4 py-2 z-[200] relative rounded-full flex items-center gap-2",
              isMobileMenuOpen ? "bg-accent text-white shadow-lg" : "bg-primary/5 text-on-surface hover:bg-primary/10 border border-on-surface/5"
            )}
          >
            <span className="text-[9px] font-bold uppercase tracking-widest hidden sm:inline">Menu</span>
            {isMobileMenuOpen ? <X className="w-5 h-5 rotate-90" /> : (
              <div className="flex items-center gap-1">
                <Menu className="w-5 h-5" />
                <ChevronDown className="w-3 h-3 opacity-40" />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop - Solid coverage */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-primary z-[160] md:hidden"
            />
            
            {/* Full Screen Menu - Immersive and ergonomic */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
              className="fixed inset-0 bg-surface z-[170] md:hidden flex flex-col pt-32"
            >
              <div className="px-8 pb-12 space-y-12 flex-1 overflow-y-auto no-scrollbar">
                <div className="grid grid-cols-2 gap-4">
                  {navItems.map((item, i) => (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      onClick={() => handleNavigate(item.id as Screen)}
                      className={cn(
                        "text-left aspect-square flex flex-col justify-end p-6 rounded-[2rem] transition-all group border border-on-surface/5 shadow-sm",
                        currentScreen === item.id ? "bg-accent text-white border-accent shadow-xl" : "bg-primary/5 text-on-surface hover:bg-primary/10"
                      )}
                    >
                      <span className="font-serif text-2xl italic mb-1">{item.label}</span>
                      <span className={cn(
                        "text-[8px] uppercase tracking-[0.2em] font-bold",
                        currentScreen === item.id ? "text-white/60" : "text-accent"
                      )}>Manifest</span>
                    </motion.button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <motion.button 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    onClick={() => handleNavigate("track-order")}
                    className="flex flex-col items-center justify-center p-8 bg-on-surface text-surface rounded-[2rem] shadow-xl active:scale-95 transition-transform group"
                  >
                    <Truck className="w-7 h-7 text-accent mb-3 group-hover:animate-bounce" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">Track Order</span>
                  </motion.button>
                  <motion.button 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    onClick={() => handleNavigate("admin")}
                    className="flex flex-col items-center justify-center p-8 bg-primary/5 text-on-surface rounded-[2rem] border border-on-surface/5 active:scale-95 transition-transform"
                  >
                    <Settings className="w-7 h-7 text-accent mb-3" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">Curator</span>
                  </motion.button>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="p-10 bg-primary text-white rounded-[2.5rem] relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-10 -mt-10" />
                  <div className="relative z-10 space-y-4">
                    <h4 className="font-serif italic text-2xl">The Heritage Gazette</h4>
                    <p className="font-sans text-xs text-on-surface-variant leading-relaxed opacity-60">
                      Explore the alchemy of smoke and spice in our seasonal journal.
                    </p>
                    <button 
                      onClick={() => handleNavigate("blog")}
                      className="flex items-center space-x-3 text-accent font-bold uppercase tracking-[0.2em] text-[10px]"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Read Journal</span>
                    </button>
                  </div>
                  <div className="absolute inset-0 wood-texture opacity-5 pointer-events-none" />
                </motion.div>
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="p-8 border-t border-on-surface/5 bg-on-surface/5 flex items-center justify-between"
              >
                 <div className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-30">© 2026 Bamanda Heritage</div>
                 <button 
                   onClick={onToggleTheme}
                   className="p-4 bg-surface rounded-2xl shadow-xl text-accent border border-on-surface/5 active:scale-95 transition-transform flex items-center gap-3"
                 >
                   <span className="text-[9px] font-black uppercase tracking-widest">{theme === "night" ? "Night" : "Day"}</span>
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
