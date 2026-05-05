/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ShieldCheck, Heart, Star, Users } from 'lucide-react';

export default function AboutScreen() {
  return (
    <div className="pt-24 min-h-screen pb-32">
      {/* Hero Section */}
      <section className="px-10 max-w-screen-2xl mx-auto mb-24">
        <div className="relative h-[600px] flex items-center editorial-border overflow-hidden bg-primary">
          <img 
            src="/IMG_2031.png" 
            alt="Kitchen Manager" 
            className="absolute inset-0 w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 transition-all duration-1000"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/40 to-transparent" />
          <div className="relative z-10 px-12 md:px-24 max-w-3xl">
            <div className="editorial-label mb-8 text-accent">The Curator</div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-serif text-6xl md:text-8xl text-on-surface mb-8 tracking-tighter leading-[0.9]"
            >
              Mastering the <span className="italic text-accent">Art</span> of Heritage
            </motion.h1>
            <p className="font-sans text-on-surface-variant text-xl font-light italic leading-relaxed">
              "At Bamanda, our kitchen is more than a place of preparation—it is a sanctuary where we honor our ancestors through every flame and spice."
            </p>
            <div className="mt-12">
              <span className="editorial-label text-[10px] block mb-2 opacity-60">Kitchen Manager</span>
              <h4 className="font-serif text-3xl italic">Michael David</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="px-10 max-w-screen-2xl mx-auto mb-32">
        <div className="editorial-label mb-16 text-center">Our Core Values</div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-on-surface/10 border border-on-surface/10">
          {[
            { 
              icon: ShieldCheck, 
              title: "Integrity", 
              desc: "Honoring original recipes and sourcing only the finest organic ingredients from local guardians." 
            },
            { 
              icon: Heart, 
              title: "Heritage", 
              desc: "Preserving the culinary narratives of our ancestors for the generations that follow." 
            },
            { 
              icon: Star, 
              title: "Excellence", 
              desc: "Precision in every manifestation, ensuring each dish is a masterpiece of flavor and health." 
            },
            { 
              icon: Users, 
              title: "Community", 
              desc: "Fostering connection through the shared ritual of dining and communal appreciation." 
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-primary p-12 flex flex-col items-center text-center space-y-6 group hover:bg-surface transition-colors duration-500">
              <item.icon className="w-8 h-8 text-accent group-hover:scale-110 transition-transform" />
              <h3 className="font-serif text-2xl text-on-surface italic">{item.title}</h3>
              <p className="font-sans text-[10px] text-on-surface-variant uppercase tracking-widest leading-loose font-medium">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Briefing Section */}
      <section className="px-10 max-w-screen-2xl mx-auto">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="space-y-8">
            <h2 className="font-serif text-5xl md:text-7xl text-on-surface tracking-tighter italic text-center">
              A Legacy in Every Manifestation
            </h2>
            <div className="h-[1px] w-40 bg-accent mx-auto" />
          </div>
          <div className="columns-1 md:columns-2 gap-16 font-sans text-lg text-on-surface-variant leading-relaxed font-light space-y-8">
            <p>
              Bamanda Heritage Restaurant stands as a testament to the enduring power of culinary tradition. Our mission is to reclaim the narratives of our past and present them with modern precision, creating an experience that nourishes both the body and the soul.
            </p>
            <p>
              Under the guidance of our Kitchen Manager, Michael David, we have curated a space where quality is non-negotiable and heritage is celebrated. Every spice is selected for its medicinal and historical value, and every technique is a tribute to those who came before us.
            </p>
            <p>
              We believe that eating well is a form of living healthy, and through our commitment to organic integrity and sustainable sourcing, we ensure that Bamanda remains a sanctuary for all who seek authenticity in a rapidly changing world.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
