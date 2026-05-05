/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Globe, Instagram, Twitter, Facebook } from 'lucide-react';
import { Screen } from '../types';

interface FooterProps {
  onNavigate: (screen: Screen) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-primary pt-32 pb-12 px-10 text-white editorial-border-t">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-20 mb-24">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-accent/20">
                <img src="/logo.jpg" alt="Bamanda Logo" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-serif italic text-5xl text-accent">Bamanda Kitchen</h3>
            </div>
            <p className="font-sans text-on-surface-variant text-sm uppercase tracking-[0.2em] leading-relaxed max-w-md opacity-80 font-medium italic">
              "Eating Well. Living Healthy." <br />
              A sanctuary where ancestral recipes meet modern precision.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 lg:col-span-2">
            <div className="space-y-6">
              <div className="editorial-label text-accent opacity-50">Navigation</div>
              <ul className="space-y-4">
                {[
                  { label: 'Store', id: 'menu' },
                  { label: 'Journal', id: 'blog' },
                  { label: 'Kitchen', id: 'kitchen' },
                  { label: 'Checkout', id: 'checkout' },
                  { label: 'Contact', id: 'contact' }
                ].map((link) => (
                  <li key={link.id}>
                    <button 
                      onClick={() => onNavigate(link.id as Screen)}
                      className="font-sans text-[11px] uppercase tracking-[0.2em] font-bold text-white/60 hover:text-accent transition-all cursor-pointer"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <div className="editorial-label text-accent opacity-50">Heritage</div>
              <ul className="space-y-4">
                {[
                  { label: 'Our Heritage', id: 'heritage' },
                  { label: 'Sustainability', id: 'sustainability' },
                  { label: 'Legal', id: 'legal' },
                  { label: 'Press', id: 'press' },
                  { label: 'Careers', id: 'careers' }
                ].map((link) => (
                  <li key={link.id}>
                    <button 
                      onClick={() => onNavigate(link.id as Screen)}
                      className="font-sans text-[11px] uppercase tracking-[0.2em] font-bold text-white/60 hover:text-accent transition-all cursor-pointer"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-12 pb-12 border-b border-white/5">
           <div className="flex items-center gap-10">
              <a href="https://www.instagram.com/bamanda_kitchen?igsh=MWFqbndzbnVhNHFvMQ%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer">
                <Instagram className="w-5 h-5 text-white/40 hover:text-accent cursor-pointer transition-colors" />
              </a>
              <Twitter className="w-5 h-5 text-white/40 hover:text-accent cursor-pointer transition-colors" />
              <Facebook className="w-5 h-5 text-white/40 hover:text-accent cursor-pointer transition-colors" />
           </div>
           <div className="flex items-center gap-4 text-white/40">
             <Globe className="w-4 h-4" />
             <span className="text-[10px] uppercase tracking-widest font-bold">Lagos / Accra / Cape Town</span>
           </div>
        </div>
        
        <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-bold">
            © 2026 Bamanda Kitchen. Heritage Sanctuary.
          </p>
          <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold opacity-80">
            Cultivating Heritage through Taste.
          </p>
        </div>
      </div>
    </footer>
  );
}
