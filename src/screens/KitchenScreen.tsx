/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ChefHat, Flame, UtensilsCrossed } from 'lucide-react';

const CHEFS = [
  {
    name: "Chef Amara Bamanda",
    role: "Culinary Director & Heritage Guardian",
    bio: "With over 25 years of experience across the continent, Chef Amara lead the sanctuary with a focus on ancestral preservation and organic integrity.",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Chef Kofi Mensah",
    role: "Master of Earth & Sea",
    bio: "A specialist in coastal techniques, Kofi brings a deep understanding of marine ecosystems and sustainable harvesting to every dish.",
    image: "https://images.unsplash.com/photo-1595273670150-db0c3e39243e?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Chef Zola Okoro",
    role: "Ancestral Grains Specialist",
    bio: "Zola's expertise lies in the revival of forgotten grains and fermentation techniques passed down through generations.",
    image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=800"
  }
];

export default function KitchenScreen() {
  return (
    <div className="pt-24 min-h-screen pb-32">
      {/* Hero Section */}
      <section className="px-10 max-w-screen-2xl mx-auto mb-24">
        <div className="relative h-[600px] flex items-center editorial-border overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=2000" 
            alt="The Kitchen" 
            className="absolute inset-0 w-full h-full object-cover grayscale brightness-50"
            referrerPolicy="no-referrer"
          />
          <div className="relative z-10 px-12 md:px-24">
            <div className="editorial-label mb-8">Behind the Curtain</div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif text-6xl md:text-9xl text-on-surface mb-8 tracking-tighter leading-[0.8]"
            >
              The <span className="italic text-accent">Alchemists</span> <br /> of Bamanda
            </motion.h1>
            <p className="font-sans text-on-surface-variant text-xl max-w-xl font-light italic leading-relaxed">
              "Our kitchen is a sanctuary where fire, earth, and heritage converge to manifest the soul of a continent."
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy Grid */}
      <section className="px-10 max-w-screen-2xl mx-auto mb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-on-surface/10 border border-on-surface/10">
          {[
            { icon: ChefHat, title: "Ancestral Mastery", desc: "Techniques preserved and perfected over centuries." },
            { icon: Flame, title: "Sacred Fire", desc: "Every dish touched by the raw element of open-flame alchemy." },
            { icon: UtensilsCrossed, title: "Organic Integrity", desc: "Sourcing only what the earth grants us in its purest form." }
          ].map((item, idx) => (
            <div key={idx} className="bg-primary p-12 flex flex-col items-center text-center space-y-6">
              <item.icon className="w-8 h-8 text-accent" />
              <h3 className="font-serif text-2xl text-on-surface italic">{item.title}</h3>
              <p className="font-sans text-xs text-on-surface-variant uppercase tracking-widest leading-loose">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Chefs Showcase */}
      <section className="px-10 max-w-screen-2xl mx-auto">
        <div className="editorial-label mb-16 text-center">Meet the Guardians</div>
        <div className="space-y-32">
          {CHEFS.map((chef, idx) => (
            <div key={idx} className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-20 items-center`}>
              <div className="flex-1 w-full aspect-[4/5] editorial-border overflow-hidden grayscale contrast-125 hover:grayscale-0 transition-all duration-1000">
                <img 
                  src={chef.image} 
                  alt={chef.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1 space-y-8">
                <div className="editorial-label">Personnel Profile {idx + 1}</div>
                <h2 className="font-serif text-5xl md:text-7xl text-on-surface tracking-tighter italic">
                  {chef.name}
                </h2>
                <h4 className="font-sans text-xs uppercase tracking-[0.4em] text-accent font-bold">
                  {chef.role}
                </h4>
                <p className="font-sans text-on-surface-variant text-lg leading-relaxed font-light first-letter:text-5xl first-letter:font-serif first-letter:mr-3 first-letter:float-left first-letter:text-accent">
                  {chef.bio}
                </p>
                <div className="pt-8 border-t border-on-surface/5">
                  <span className="font-serif italic text-sm opacity-40">Signature Taste: {idx === 0 ? 'Heritage Saffron Stew' : idx === 1 ? 'Oak-Smoked Sea Bass' : 'Wild Grain Risotto'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
