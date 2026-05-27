/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Share2, Bookmark, ArrowRight } from "lucide-react";
import { BlogPost } from "../types";
import { useDataSync } from "../lib/data-sync";
import OptimizedImage from "../components/OptimizedImage";

interface BlogScreenProps {
  posts?: BlogPost[]; // Optional as we now have useDataSync
}

export default function BlogScreen({ posts: propPosts }: BlogScreenProps) {
  const { posts: contextPosts } = useDataSync();
  const posts = propPosts || contextPosts;

  const renderPost = (post: BlogPost, index: number) => {
    const isEven = index % 2 === 0;

    switch (post.layout) {
      case "luxury":
        return (
          <section key={post.id} className="py-20 md:py-32 bg-primary text-white overflow-hidden relative border-y border-accent/20">
            <div className="absolute inset-0 opacity-10 wood-texture" />
            <div className="editorial-container relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-center">
                <div className="lg:col-span-5 space-y-8">
                  <div className="editorial-label text-accent font-black tracking-[0.5em]">{post.category}</div>
                  <h2 className="font-serif text-5xl sm:text-6xl md:text-8xl italic leading-tight text-accent">
                    {post.title}
                  </h2>
                  <p className="font-sans text-lg md:text-xl leading-relaxed opacity-80 first-letter:text-7xl first-letter:font-serif first-letter:mr-4 first-letter:float-left first-letter:text-accent whitespace-pre-line">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold text-accent">
                    <span>Curated by {post.author}</span>
                    <span className="w-8 h-px bg-accent/30" />
                    <span>{post.date}</span>
                  </div>
                </div>
                <div className="lg:col-span-7">
                  <div className="aspect-[16/9] rounded-3xl overflow-hidden border-4 md:border-8 border-accent/10 shadow-2xl">
                    <OptimizedImage 
                      src={post.image} 
                      className="grayscale hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" 
                      alt={post.title} 
                      aspectRatio="h-full w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      case "minimal":
        return (
          <section key={post.id} className="py-20 md:py-32 px-6 max-w-4xl mx-auto text-center space-y-12">
            <div className="editorial-label text-primary/30 tracking-widest">{post.category} — {post.date}</div>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-7xl text-primary">{post.title}</h2>
            <div className="aspect-video rounded-2xl overflow-hidden shadow-sm">
              <OptimizedImage 
                src={post.image} 
                className="grayscale brightness-110 hover:grayscale-0 transition-all duration-1000" 
                alt={post.title} 
                aspectRatio="h-full w-full"
              />
            </div>
            <p className="font-sans text-base md:text-lg leading-loose text-on-surface-variant max-w-2xl mx-auto whitespace-pre-line">
              {post.content}
            </p>
            <div className="w-12 h-px bg-primary/20 mx-auto" />
          </section>
        );

      case "narrative":
        return (
          <section key={post.id} className="py-20 md:py-32 px-6 max-w-7xl mx-auto">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
                <div className={`space-y-8 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                  <div className="editorial-label text-accent">{post.topic}</div>
                  <h2 className="font-serif text-4xl sm:text-5xl md:text-7xl leading-tight text-primary italic">
                    {post.title}
                  </h2>
                  <div className="w-20 h-1 bg-accent" />
                  <p className="text-base md:text-lg leading-relaxed text-on-surface-variant font-sans whitespace-pre-line">
                    {post.content}
                  </p>
                  <button className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-primary hover:text-accent transition-colors">
                    Explore This Chapter <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className={`relative ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                  <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                    <OptimizedImage 
                      src={post.image} 
                      className="grayscale contrast-125 hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" 
                      alt={post.title} 
                      aspectRatio="h-full w-full"
                    />
                  </div>
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl -z-10" />
                </div>
             </div>
          </section>
        );

      case "journal":
        return (
          <section key={post.id} className="py-20 md:py-32 px-6 max-w-7xl mx-auto border-b border-primary/5">
            <div className="flex flex-col md:flex-row gap-12 md:gap-16">
              <div className="md:w-1/4">
                <div className="md:sticky md:top-32 space-y-4 mb-8 md:mb-0">
                  <div className="text-3xl md:text-4xl font-serif italic text-accent opacity-40">{post.date}</div>
                  <div className="editorial-label text-[10px] text-primary">{post.author}</div>
                  <div className="h-px w-full bg-primary/10" />
                  <div className="flex gap-4 opacity-40">
                    <Share2 className="w-4 h-4" />
                    <Bookmark className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div className="md:w-3/4 space-y-10">
                <h2 className="font-serif text-4xl sm:text-5xl md:text-7xl text-primary leading-tight">{post.title}</h2>
                <div className="aspect-[21/9] rounded-xl overflow-hidden shadow-lg">
                  <OptimizedImage 
                    src={post.image} 
                    className="grayscale hover:grayscale-0 transition-all duration-1000" 
                    alt={post.title} 
                    aspectRatio="h-full w-full"
                  />
                </div>
                <p className="font-serif text-xl md:text-2xl text-on-surface-variant leading-relaxed italic whitespace-pre-line">
                  {post.content}
                </p>
              </div>
            </div>
          </section>
        );

      default: // editorial
        return (
          <section key={post.id} className="py-20 md:py-32 editorial-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-start">
              <div className="space-y-12">
                <div className="editorial-label text-accent tracking-[0.4em]">{post.category}</div>
                <h2 className="font-serif text-5xl sm:text-6xl md:text-9xl leading-none tracking-tighter text-primary">
                  {post.title.split(" ").map((word, i) => (
                    <span key={i} className={i % 2 === 1 ? "italic text-accent" : ""}>{word} </span>
                  ))}
                </h2>
                <div className="space-y-6 text-lg md:text-xl leading-relaxed text-on-surface-variant font-sans whitespace-pre-line first-letter:text-7xl md:first-letter:text-8xl first-letter:font-serif first-letter:text-accent first-letter:mr-4 first-letter:float-left first-letter:leading-[0.8]">
                  {post.content}
                </div>
              </div>
              <div className="lg:sticky lg:top-32">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl relative group">
                   <OptimizedImage 
                     src={post.image} 
                     className="grayscale brightness-90 group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" 
                     alt={post.title} 
                     aspectRatio="h-full w-full"
                   />
                   <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors pointer-events-none" />
                </div>
                <div className="mt-8 flex justify-between items-center px-4">
                  <p className="text-[10px] uppercase font-bold tracking-widest opacity-40">Archive Reference {post.id.slice(-4)}</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest opacity-40">{post.date}</p>
                </div>
              </div>
            </div>
          </section>
        );
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-cream text-charcoal overflow-x-hidden">
      {/* Editorial Header */}
      <header className="py-16 md:py-24 editorial-container text-center border-b border-primary/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="editorial-label mb-6 text-accent tracking-[0.4em]">Heritage Gazette</div>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-9xl mb-8 leading-tight">
            BAMANDA <br /> <span className="italic text-primary">LIFESTYLE</span>
          </h1>
          <p className="font-serif italic text-lg md:text-2xl opacity-60 max-w-2xl mx-auto">
            "Chronicles of Fire, Flavor, and Ancestral Legacy."
          </p>
        </motion.div>
      </header>

      {/* Dynamic Content */}
      <div className="divide-y divide-primary/5">
        {posts.length > 0 ? (
          posts.map((post, idx) => renderPost(post, idx))
        ) : (
          <div className="py-40 text-center">
            <p className="font-serif italic text-2xl opacity-20">The Gazette is currently quiet. <br /> Manifesting new stories soon.</p>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <section className="py-20 md:py-32 bg-primary text-white text-center">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          <div className="w-16 h-1 bg-accent mx-auto" />
          <h2 className="font-serif italic text-4xl md:text-5xl">Stay in the Ritual</h2>
          <p className="text-on-surface-variant text-base md:text-lg opacity-60">Join our newsletter to receive monthly curations of heritage recipes and stories of our people.</p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
            <input type="email" placeholder="email@heritage.com" className="flex-1 bg-white border border-white/10 rounded-xl px-6 py-4 text-sm text-black" />
            <button className="bg-accent text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px]">Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  );
}
