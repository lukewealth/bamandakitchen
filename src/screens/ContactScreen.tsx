/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook } from 'lucide-react';

export default function ContactScreen() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 lg:px-20 bg-surface">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="editorial-label text-accent mb-4 tracking-[0.5em]">The Sanctuary</div>
            <h1 className="font-serif italic text-6xl md:text-8xl text-on-surface mb-8">Get in Touch</h1>
            <p className="font-sans text-sm md:text-lg text-on-surface-variant max-w-2xl leading-relaxed uppercase tracking-wider">
              Whether you are seeking a feast or have a whisper from the past to share, we are here to listen.
            </p>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Contact Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-12"
          >
            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="p-4 bg-primary/5 rounded-full border border-accent/10">
                  <MapPin className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="editorial-label text-xs mb-2 opacity-50">Our Location</h3>
                  <p className="font-serif italic text-2xl text-on-surface">Kilometer 33 Lekki-Epe Expressway,</p>
                  <p className="font-serif italic text-2xl text-on-surface">Eputu, Lagos, Nigeria</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="p-4 bg-primary/5 rounded-full border border-accent/10">
                  <Phone className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="editorial-label text-xs mb-2 opacity-50">Phone</h3>
                  <p className="font-serif italic text-2xl text-on-surface">+234 908 765 4321</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="p-4 bg-primary/5 rounded-full border border-accent/10">
                  <Mail className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="editorial-label text-xs mb-2 opacity-50">Email</h3>
                  <p className="font-serif italic text-2xl text-on-surface">concierge@bamanda.com</p>
                </div>
              </div>
            </div>

            <div className="pt-12 border-t border-on-surface/10">
              <h3 className="editorial-label text-xs mb-8 opacity-50 uppercase tracking-widest">Connect with our Legacy</h3>
              <div className="flex gap-8">
                <a 
                  href="https://www.instagram.com/bamanda_kitchen?igsh=MWFqbndzbnVhNHFvMQ%3D%3D&utm_source=qr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-3"
                >
                  <Instagram className="w-8 h-8 text-on-surface/40 group-hover:text-accent transition-colors" />
                  <span className="text-[8px] uppercase tracking-widest font-black opacity-0 group-hover:opacity-100 transition-opacity">Instagram</span>
                </a>
                <a href="#" className="group flex flex-col items-center gap-3">
                  <Twitter className="w-8 h-8 text-on-surface/40 group-hover:text-accent transition-colors" />
                  <span className="text-[8px] uppercase tracking-widest font-black opacity-0 group-hover:opacity-100 transition-opacity">Twitter</span>
                </a>
                <a href="#" className="group flex flex-col items-center gap-3">
                  <Facebook className="w-8 h-8 text-on-surface/40 group-hover:text-accent transition-colors" />
                  <span className="text-[8px] uppercase tracking-widest font-black opacity-0 group-hover:opacity-100 transition-opacity">Facebook</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Google Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-[500px] w-full bg-primary/5 rounded-3xl overflow-hidden border border-accent/10 shadow-2xl relative group"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.717142438848!2d3.7423583!3d6.4259167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf7e23b000001%3A0x7d6c63a6f7b1b1b!2sEputu%20Town!5e0!3m2!1sen!2sng!4v1714830000000!5m2!1sen!2sng"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'grayscale(1) contrast(1.2) invert(0.9)' }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <div className="absolute inset-0 pointer-events-none border-[20px] border-surface/50 group-hover:border-surface/20 transition-all duration-700"></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
