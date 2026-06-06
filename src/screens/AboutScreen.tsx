/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { ShieldCheck, Heart, Star, Users } from "lucide-react";
import OptimizedImage from "../components/OptimizedImage";

export default function AboutScreen() {
  return (
    <div className="min-h-screen pb-32 overflow-x-hidden">
      {/* Hero Section - Truly Full Width */}
      <section className="relative w-screen h-[80vh] md:h-screen mb-24 left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <div className="relative w-full h-full flex items-center overflow-hidden bg-primary">
          <OptimizedImage 
            src="/MD.png" 
            alt="Kitchen Manager" 
            containerClassName="absolute inset-0 w-full h-full"
            className="object-cover object-center brightness-75 hover:brightness-100 transition-all duration-1000"
            aspectRatio="h-full w-full"
            priority={true}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/40 to-transparent" />
          <div className="relative z-10 px-6 md:px-24 max-w-4xl">
            <div className="editorial-label mb-8 text-accent">The Curator</div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-serif text-5xl sm:text-6xl md:text-9xl text-on-surface mb-8 tracking-tighter leading-[0.85]"
            >
              Mastering the <span className="italic text-accent">Art</span> of Heritage
            </motion.h1>
            <p className="font-sans text-on-surface-variant text-lg md:text-2xl font-light italic leading-relaxed max-w-2xl">
              "At Bamanda, our kitchen is more than a place of preparation—it is a sanctuary where we honor our ancestors through every flame and spice."
            </p>
            <div className="mt-16">
              <span className="editorial-label text-[10px] block mb-2 opacity-60">Kitchen Manager</span>
              <h4 className="font-serif text-3xl md:text-4xl italic text-white">CHIDERA EZIKE NICHOLAS</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="editorial-container mb-32 pt-10">
        <div className="editorial-label mb-16 text-center">Our Core Values</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-px bg-on-surface/10 border border-on-surface/10">
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
            <div key={idx} className="bg-primary p-8 md:p-12 flex flex-col items-center text-center space-y-6 group hover:bg-surface transition-colors duration-500">
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
      <section className="editorial-container">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="space-y-8">
            <h2 className="font-serif text-4xl sm:text-5xl md:text-7xl text-on-surface tracking-tighter italic text-center">
              A Legacy in Every Manifestation
            </h2>
            <div className="h-[1px] w-40 bg-accent mx-auto" />
          </div>
          <div className="columns-1 md:columns-2 gap-16 font-sans text-base md:text-lg text-on-surface-variant leading-relaxed font-light space-y-8">
            <p>
              Bamanda Heritage Restaurant stands as a testament to the enduring power of culinary tradition. Our mission is to reclaim the narratives of our past and present them with modern precision, creating an experience that nourishes both the body and the soul.
            </p>
            <p>
              Under the guidance of our Kitchen Manager, CHIDERA EZIKE NICHOLAS, we have curated a space where quality is non-negotiable and heritage is celebrated. Every spice is selected for its medicinal and historical value, and every technique is a tribute to those who came before us.
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