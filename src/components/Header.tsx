/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ShoppingBag, Sun, Moon, ChevronDown, BookOpen, Settings } from 'lucide-react';
import { cn } from '../lib/utils';
import { Screen } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  onOpenCart: () => void;
  cartCount: number;
  theme: 'night' | 'day';
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

  return (
    <header className={cn(
      "fixed top-0 w-full z-50 glass-nav transition-all duration-500 h-20",
      isLoading && "opacity-60"
    )}>
      <div className="flex justify-between items-center px-10 h-full w-full max-w-screen-2xl mx-auto">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-4 group"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-accent/20 group-hover:border-accent transition-colors">
                <img src="/logo.jpg" alt="Bamanda Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-serif text-2xl text-on-surface tracking-widest uppercase italic group-hover:text-accent transition-colors duration-500">
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
                      onClick={() => onNavigate('blog')}
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
        
        <nav className="hidden md:flex items-center space-x-12 font-sans text-[11px] uppercase tracking-[0.3em] font-extrabold">
          {[
            { id: 'menu', label: 'Store' },
            { id: 'kitchen', label: 'Kitchen' },
            { id: 'blog', label: 'Journal' },
            { id: 'contact', label: 'Contact' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as Screen)}
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

        <div className="flex items-center space-x-8">
          {/* Admin Access */}
          <button 
            onClick={() => onNavigate('admin')}
            className={cn(
              "text-on-surface/60 hover:text-accent transition-all duration-500",
              currentScreen === 'admin' && "text-accent"
            )}
            title="Curator Access"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Theme Toggle */}
          <button 
            onClick={onToggleTheme}
            className="text-on-surface/60 hover:text-on-surface transition-all duration-500"
            title={`Switch to ${theme === 'night' ? 'Day' : 'Night'} Mode`}
          >
            {theme === 'night' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

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
        </div>
      </div>
    </header>
  );
}
