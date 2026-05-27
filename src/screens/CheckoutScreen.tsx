/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ArrowRight, Lock, Sparkles, CheckCircle2, MessageCircle, History, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, Order } from '../types';
import { generateOrderId, formatWhatsAppMessage, getWhatsAppUrl } from '../lib/order';
import { useToast } from '../lib/toast-context';
import { validateName, validatePhone, validateAddress, sanitizeInput, isThrottled, patronTracker } from '../lib/security';
import { useDataSync } from '../lib/data-sync';

interface CheckoutScreenProps {
  items: CartItem[];
  onOrderComplete: (order: Order) => void;
}

export default function CheckoutScreen({ items, onOrderComplete }: CheckoutScreenProps) {
  const { showToast } = useToast();
  const { createOrder } = useDataSync();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [patronHistory, setPatronHistory] = useState<Order[]>([]);

  useEffect(() => {
    const history = patronTracker.getHistory();
    setPatronHistory(history);
    if (history.length > 0) {
      const lastOrder = history[0];
      setName(lastOrder.customer.name);
      setPhone(lastOrder.customer.phone);
      setAddress(lastOrder.customer.address);
    }
  }, []);
  
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = items.length > 0 ? 2500 : 0;
  const total = subtotal + deliveryFee;

  const handleWhatsAppOrder = () => {
    // 1. Rate Limiting
    if (isThrottled('order_submission', 10000)) {
      showToast('Our curators are processing your previous request. Please wait a moment.', 'warning');
      return;
    }

    // 2. Secured Validation
    const sanitizedName = sanitizeInput(name);
    const sanitizedPhone = sanitizeInput(phone);
    const sanitizedAddress = sanitizeInput(address);

    if (!validateName(sanitizedName)) {
      showToast('Patron name is too short or contains unpermitted symbols.', 'error');
      return;
    }

    if (!validatePhone(sanitizedPhone)) {
      showToast('Please provide a valid Nigerian contact vector (e.g. 080... or +234...).', 'error');
      return;
    }

    if (!validateAddress(sanitizedAddress)) {
      showToast('The destination address is too vague for our navigators.', 'error');
      return;
    }

    setIsSubmitting(true);

    const orderId = generateOrderId();
    const order: Order = {
      id: orderId,
      items,
      total,
      status: 'pending',
      customer: { name: sanitizedName, phone: sanitizedPhone, address: sanitizedAddress },
      notes: sanitizeInput(notes),
      createdAt: new Date().toISOString(),
      estimatedDeliveryTime: 45,
      metadata: {
        platform: 'Bamanda Heritage Web',
        version: '1.0.0',
        device: navigator.userAgent.split('(')[1]?.split(')')[0] || 'Unknown'
      }
    };

    // 3. Patron Tracking for reorders/recommendations
    patronTracker.saveOrder(order);

    const message = formatWhatsAppMessage(order);
    const whatsappUrl = getWhatsAppUrl(message);
    
    setTimeout(() => {
      onOrderComplete(order);
      window.open(whatsappUrl, '_blank');
      setIsSubmitting(false);
    }, 1500); // Artificial loading for UX
  };

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto bg-cream min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left: Form */}
        <div className="lg:col-span-7 space-y-12">
          <section>
            <div className="editorial-label mb-4 text-accent">Order Logistics</div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif text-5xl md:text-7xl text-primary mb-6 tracking-tight"
            >
              Finalize Your <br /><span className="italic text-accent">Curation</span>
            </motion.h1>
            <p className="text-on-surface-variant font-sans text-lg max-w-2xl leading-relaxed italic opacity-80">
              "To maintain our commitment to heritage, every order is personally reviewed before dispatch."
            </p>
          </section>

          {/* Patron Recognition Section */}
          {patronHistory.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 bg-primary/5 rounded-3xl border border-primary/10 space-y-4"
            >
              <div className="flex items-center gap-3 text-primary">
                <History className="w-5 h-5 text-accent" />
                <h3 className="font-serif italic text-xl">Welcome back, Patron</h3>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                We've recognized your contact vector and pre-filled your curation details based on your last manifestation on {new Date(patronHistory[0].createdAt).toLocaleDateString()}.
              </p>
            </motion.div>
          )}

          <div className="space-y-10">
            <div className="space-y-8">
              <div className="flex items-center gap-6 editorial-border-b pb-6">
                <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-accent font-extrabold border-2 border-accent px-4 py-1 rounded-full">01</span>
                <h2 className="font-serif text-3xl text-primary">Delivery Specifications</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3 group px-6 py-5 bg-white rounded-2xl shadow-sm border border-primary/5 focus-within:border-accent/50 transition-all">
                  <label className="font-sans text-[10px] uppercase tracking-[0.3em] text-accent font-bold">Patron Name *</label>
                  <input 
                    type="text" 
                    placeholder="Kwame Mensah"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 p-0 placeholder:text-on-surface-variant/30 font-sans text-base text-black"
                    required
                  />
                </div>
                <div className="space-y-3 group px-6 py-5 bg-white rounded-2xl shadow-sm border border-primary/5 focus-within:border-accent/50 transition-all">
                  <label className="font-sans text-[10px] uppercase tracking-[0.3em] text-accent font-bold">Contact Vector *</label>
                  <input 
                    type="tel" 
                    placeholder="+234 XX XXX XXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 p-0 placeholder:text-on-surface-variant/30 font-sans text-base text-black"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3 group px-6 py-5 bg-white rounded-2xl shadow-sm border border-primary/5 focus-within:border-accent/50 transition-all">
                <label className="font-sans text-[10px] uppercase tracking-[0.3em] text-accent font-bold">Destination Address *</label>
                <textarea 
                  placeholder="Street, City, Area..." 
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 p-0 placeholder:text-on-surface-variant/30 font-sans text-base text-black resize-none"
                  required
                />
              </div>

              <div className="space-y-3 group px-6 py-5 bg-white rounded-2xl shadow-sm border border-primary/5 focus-within:border-accent/50 transition-all">
                <label className="font-sans text-[10px] uppercase tracking-[0.3em] text-accent font-bold">Additional Instructions (Optional)</label>
                <textarea 
                  placeholder="Preferences, allergy notes, delivery landmarks..." 
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 p-0 placeholder:text-on-surface-variant/30 font-sans text-base text-black resize-none"
                />
              </div>
            </div>

            <div className="bg-primary text-white p-10 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-10 -mt-10" />
              <div className="flex items-start gap-8 relative z-10">
                <Sparkles className="w-8 h-8 text-accent shrink-0" />
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-accent font-bold mb-4">Quality Verification</p>
                  <p className="text-sm text-on-surface-variant leading-relaxed opacity-80">
                    Every dish is inspected by our lead curators before departure. Our heritage promise ensures authentic preparation and premium sourcing.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button 
                onClick={handleWhatsAppOrder}
                disabled={items.length === 0 || isSubmitting}
                className="group relative w-full bg-accent text-white py-6 px-10 rounded-2xl flex justify-between items-center transition-all shadow-2xl shadow-accent/30 hover:bg-accent/90 active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed overflow-hidden"
              >
                <AnimatePresence mode="wait">
                  {isSubmitting ? (
                    <motion.div 
                      key="loading"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-4 w-full justify-center"
                    >
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="font-sans text-sm uppercase tracking-[0.3em] font-bold">Reviewing Curation...</span>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="idle"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex justify-between items-center w-full"
                    >
                      <div className="flex items-center gap-4">
                        <MessageCircle className="w-6 h-6" />
                        <span className="font-sans text-sm uppercase tracking-[0.3em] font-bold">Dispatch Order via WhatsApp</span>
                      </div>
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
              <div className="flex items-center justify-center gap-3 mt-8 opacity-40">
                <Lock className="w-3 h-3 text-primary" />
                <p className="text-[9px] text-primary font-sans uppercase tracking-[0.4em] font-bold">Secure Editorial Processing</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-32 space-y-12">
            <div className="bg-white p-10 rounded-3xl shadow-lg border border-primary/5 relative overflow-hidden">
              <div className="editorial-label mb-8 text-primary">Inventory Summary</div>
              
              <div className="space-y-8 max-h-[40vh] overflow-y-auto no-scrollbar pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 shadow-md">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-lg text-primary truncate italic">{item.name}</p>
                      <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-on-surface-variant font-bold">
                        QTY {item.quantity} — {item.category}
                      </p>
                    </div>
                    <p className="font-sans text-accent font-bold text-sm whitespace-nowrap pt-1">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="mt-10 pt-10 border-t border-primary/10 space-y-4">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                   <span>Subtotal</span>
                   <span className="text-primary font-sans font-bold">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                   <span>Delivery Fee</span>
                   <span className="text-primary font-sans font-bold">₦{deliveryFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-6 mt-6 border-t-2 border-accent/20">
                  <p className="font-serif text-xl text-primary italic">Net Total</p>
                  <p className="font-sans text-3xl font-bold text-accent">₦{total.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8 p-8 bg-white/50 backdrop-blur-sm border border-primary/10 rounded-3xl">
              <CheckCircle2 className="w-10 h-10 text-accent shrink-0" />
              <div>
                <p className="font-sans text-[10px] uppercase tracking-[0.3em] font-bold text-primary mb-2">Heritage Certification</p>
                <p className="text-xs text-on-surface-variant font-light leading-relaxed">
                  Assuring the highest standards of culinary integrity and artisanal preparation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
