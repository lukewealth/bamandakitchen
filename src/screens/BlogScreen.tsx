/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { BookOpen, Calendar, Clock, Share2, Bookmark } from 'lucide-react';

const FEATURES = [
  {
    id: 'smoky-origin',
    title: "The Smoky Origin",
    subtitle: "Stories of Fire, Flavor, and Legacy",
    content: `The story of West African Jollof is not merely one of rice and spice—it is a narrative written in smoke, flame, and time. 

Long before modern kitchens and stainless steel precision, Jollof was born along the coastal belts of West Africa, where open firewood pits served as both hearth and heritage. The aroma of burning wood infused every grain, giving rise to a depth of flavor that modern methods still strive to replicate.

In these early kitchens, cooking was communal. Large iron pots rested over crackling flames, and recipes were not written but remembered—passed from one generation to the next through intuition and experience.

What distinguished Jollof was not just its ingredients, but its environment. The salt air from the coast, the quality of firewood, and the patience of slow cooking all contributed to its unmistakable character.`,
    quote: "Flavor born from fire, perfected over time.",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?auto=format&fit=crop&q=80&w=1200",
    category: "Heritage"
  },
  {
    id: 'fermentation',
    title: "Fermentation Alchemy",
    subtitle: "The Quiet Science Behind Bold Flavor",
    content: `In the evolving landscape of African gastronomy, fermentation is emerging not as a relic of the past, but as a frontier of innovation.

At the heart of this transformation are indigenous ingredients such as locust beans—known locally as iru—and palm wine. Once regarded as traditional staples, they are now being rediscovered for their complex biochemical properties and their ability to elevate flavor profiles in unexpected ways.

Locust beans introduce a deep umami richness, comparable to aged cheeses or fermented soy, while palm wine contributes subtle acidity and natural sweetness. Together, they form a foundation for a new culinary language—one that bridges tradition and experimentation.`,
    quote: "Fermentation is the reawakening of ancient biological wisdom.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1200",
    category: "Innovation"
  }
];

export default function BlogScreen() {
  return (
    <div className="pt-20 min-h-screen bg-cream text-charcoal overflow-x-hidden">
      {/* Editorial Header */}
      <header className="py-24 px-6 max-w-7xl mx-auto text-center border-b border-primary/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="editorial-label mb-6 text-accent tracking-[0.4em]">Lagos Island Heritage Journal</div>
          <h1 className="font-serif text-6xl md:text-9xl mb-8 leading-tight">
            BAMANDA <br /> <span className="italic text-primary">KITCHEN</span>
          </h1>
          <p className="font-serif italic text-xl md:text-2xl opacity-60 max-w-2xl mx-auto">
            "Stories of Fire, Flavor, and Legacy — Eating Well. Living Healthy."
          </p>
        </motion.div>
      </header>

      {/* Feature 1: The Smoky Origin */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl" />
            <div className="aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl relative z-10">
              <img 
                src={FEATURES[0].image} 
                className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-1000"
                alt="Firewood cooking"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-2xl" />
            </div>
            <div className="absolute -bottom-8 -right-8 bg-primary text-white p-8 rounded-xl shadow-xl max-w-xs hidden md:block">
              <p className="font-serif italic text-lg leading-relaxed">
                "{FEATURES[0].quote}"
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="editorial-label text-accent">{FEATURES[0].category}</div>
            <h2 className="font-serif text-5xl md:text-7xl leading-tight">
              {FEATURES[0].title}
            </h2>
            <div className="w-20 h-1 bg-accent" />
            <div className="space-y-6 text-lg leading-relaxed text-on-surface-variant font-sans whitespace-pre-line">
              <span className="text-6xl font-serif text-accent float-left mr-4 mt-2 leading-[0.5]">T</span>
              {FEATURES[0].content}
            </div>
            <div className="flex items-center gap-8 pt-8 border-t border-primary/10">
               <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:text-accent transition-colors">
                 <Share2 className="w-4 h-4" /> Share Story
               </button>
               <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:text-accent transition-colors">
                 <Bookmark className="w-4 h-4" /> Save Archive
               </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Wood Texture Interstitial */}
      <section className="py-24 bg-primary text-white overflow-hidden relative wood-texture">
        <div className="max-w-4xl mx-auto px-12 text-center relative z-10">
          <p className="font-serif italic text-3xl md:text-5xl leading-snug">
            "Cooking was communal. Recipes were not written but remembered—passed through intuition and experience."
          </p>
        </div>
      </section>

      {/* Feature 2: Fermentation Alchemy */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8 order-2 lg:order-1"
          >
            <div className="editorial-label text-accent">{FEATURES[1].category}</div>
            <h2 className="font-serif text-5xl md:text-7xl leading-tight">
              {FEATURES[1].title}
            </h2>
            <div className="w-20 h-1 bg-accent" />
            <div className="space-y-6 text-lg leading-relaxed text-on-surface-variant font-sans whitespace-pre-line">
              <span className="text-6xl font-serif text-accent float-left mr-4 mt-2 leading-[0.5]">I</span>
              {FEATURES[1].content}
            </div>
            <div className="bg-primary/5 p-8 border-l-4 border-accent rounded-r-xl italic font-serif text-xl">
              "Fermentation is the quiet science behind bold flavor."
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative order-1 lg:order-2"
          >
            <div className="aspect-square overflow-hidden rounded-full shadow-2xl border-8 border-white relative z-10">
              <img 
                src={FEATURES[1].image} 
                className="w-full h-full object-cover contrast-125 brightness-75 hover:brightness-100 transition-all duration-1000"
                alt="Fermentation"
              />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-accent/5 rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>
      </section>

      {/* Archive Grid */}
      <section className="py-32 bg-primary text-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16 border-b border-white/10 pb-8">
             <div>
               <div className="editorial-label text-accent mb-2">Heritage Archive</div>
               <h2 className="font-serif text-4xl italic">Further Exploration</h2>
             </div>
             <BookOpen className="w-8 h-8 opacity-20" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-[16/9] overflow-hidden rounded-xl mb-6 grayscale hover:grayscale-0 transition-all">
                  <img 
                    src={`https://images.unsplash.com/photo-${1500000000000 + i * 1000000}?auto=format&fit=crop&q=80&w=800`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                    alt="Archive" 
                  />
                </div>
                <div className="editorial-label text-[8px] mb-2 opacity-50">Volume 0{i} • April 2026</div>
                <h3 className="font-serif text-2xl mb-4 group-hover:text-accent transition-colors">The Ritual of Communal Dining</h3>
                <p className="text-sm opacity-60 line-clamp-2">Understanding how the shared plate fosters neurological connections and strengthens community bonds...</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
