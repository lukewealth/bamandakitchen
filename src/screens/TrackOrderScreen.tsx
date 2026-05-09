/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, ChefHat, Truck, CheckCircle2, Clock, MapPin, Phone, ArrowLeft, MessageCircle, Bike, Car } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { getWhatsAppUrl } from '../lib/order';
import { cn } from '../lib/utils';

interface TrackOrderScreenProps {
  order: Order | null;
  onBack: () => void;
}

export default function TrackOrderScreen({ order: initialOrder, onBack }: TrackOrderScreenProps) {
  const [activeOrder, setActiveOrder] = useState<Order | null>(initialOrder);
  const [searchId, setSearchId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [history, setHistory] = useState<Order[]>([]);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // Default 30 mins
  const [vehicle, setVehicle] = useState<'bike' | 'car'>('bike');

  useEffect(() => {
    // Load local history
    const saved = localStorage.getItem('bamanda_orders');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        setHistory([]);
      }
    }
  }, []);

  useEffect(() => {
    if (activeOrder) {
      setTimeLeft(activeOrder.estimatedDeliveryTime || 30 * 60);
    }
  }, [activeOrder?.id]);

  useEffect(() => {
    if (!activeOrder || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [activeOrder, timeLeft]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);

    // Capture metadata for lookup interaction
    const metadata = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      orderIdAttempted: searchId.toUpperCase()
    };

    // Persist lookup attempt for curator insights (stored locally for demo)
    const lookups = JSON.parse(localStorage.getItem('bamanda_track_lookups') || '[]');
    localStorage.setItem('bamanda_track_lookups', JSON.stringify([metadata, ...lookups].slice(0, 50)));

    // Simulate lookup
    setTimeout(() => {
      const allOrders = JSON.parse(localStorage.getItem('bamanda_orders') || '[]');
      const found = allOrders.find((o: Order) => o.id.toUpperCase() === searchId.toUpperCase());

      if (found) {
        setActiveOrder(found);
      } else {
        alert("Order sequence not found in our archives.");
      }
      setIsSearching(false);
    }, 1000);
  };
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusIndex = (status: OrderStatus) => {
    const steps: OrderStatus[] = ['pending', 'preparing', 'on-the-way', 'delivered'];
    return steps.indexOf(status);
  };

  const currentStep = activeOrder ? getStatusIndex(activeOrder.status) : 0;

  const handleContactKitchen = () => {
    if (!activeOrder) return;
    const message = encodeURIComponent(`Hello Bamanda Kitchen! I'm inquiring about my order #${activeOrder.id}. Current status is: ${activeOrder.status.toUpperCase()}.`);
    window.open(getWhatsAppUrl(message), '_blank');
  };

  if (!activeOrder) {
    return (
      <div className="min-h-screen pt-32 pb-24 px-6 lg:px-20 bg-cream">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-6">
            <div className="editorial-label text-accent tracking-[0.4em]">Order Archives</div>
            <h1 className="font-serif text-5xl md:text-7xl text-primary italic leading-tight">Access Your <br />Curation History</h1>
            <p className="font-sans text-on-surface-variant max-w-xl mx-auto opacity-70 italic">
              "Every order is a unique manuscript of taste. Enter your unique identifier to trace its manifestation."
            </p>
          </div>

          {/* Search Portal */}
          <motion.form 
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-3xl p-4 shadow-2xl shadow-primary/10 border border-primary/5 flex items-center gap-4">
              <Package className="w-6 h-6 text-accent ml-4 shrink-0" />
              <input 
                type="text" 
                placeholder="Enter Unique Order ID (e.g. BAM-XXXX-XXXX)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="flex-1 bg-transparent border-none focus:ring-0 p-4 font-sans text-lg text-primary uppercase tracking-widest"
                required
              />
              <button 
                type="submit"
                disabled={isSearching}
                className="bg-primary text-white px-10 py-5 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-accent transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
              >
                {isSearching ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Truck className="w-4 h-4" />}
                Track
              </button>
            </div>
          </motion.form>

          {/* History List */}
          {history.length > 0 && (
            <div className="space-y-8">
              <div className="flex items-center gap-4 editorial-border-b pb-4">
                <Clock className="w-4 h-4 text-accent" />
                <h3 className="editorial-label text-xs tracking-widest">Recent Manifestations</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {history.slice(0, 4).map((h) => (
                  <button 
                    key={h.id}
                    onClick={() => setActiveOrder(h)}
                    className="flex items-center justify-between p-8 bg-white rounded-3xl border border-primary/5 hover:border-accent/30 transition-all text-left group shadow-sm hover:shadow-xl"
                  >
                    <div className="space-y-2">
                      <div className="text-[9px] font-sans font-black uppercase tracking-widest text-accent">{h.id}</div>
                      <div className="font-serif text-lg text-primary italic">{new Date(h.createdAt).toLocaleDateString()}</div>
                      <div className="text-[10px] text-on-surface-variant font-medium uppercase tracking-[0.1em]">{h.items.length} Curated Items</div>
                    </div>
                    <div className="p-4 bg-primary/5 rounded-2xl group-hover:bg-accent group-hover:text-white transition-colors">
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="text-center pt-8">
            <button 
              onClick={onBack}
              className="text-[10px] uppercase tracking-[0.3em] font-black text-primary opacity-40 hover:opacity-100 transition-opacity border-b border-primary/20 pb-1"
            >
              Return to Sanctuary
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 lg:px-20 bg-surface">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <button 
            onClick={() => setActiveOrder(null)}
            className="flex items-center gap-3 text-on-surface-variant hover:text-accent transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
            <span className="editorial-label text-[10px] uppercase tracking-widest">Tracking Archives</span>
          </button>

          <button 
            onClick={onBack}
            className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 hover:text-accent transition-all"
          >
            Exit to Store
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Status Details */}
          <div className="space-y-12">
            <header>
              <div className="editorial-label text-accent mb-4 tracking-[0.4em]">Tracking Order #{activeOrder.id}</div>
              <h1 className="font-serif italic text-6xl text-on-surface">Your Feast is <br />{activeOrder.status === 'delivered' ? 'Manifested' : 'Being Prepared'}</h1>
            </header>

            <div className="bg-primary p-10 rounded-3xl shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-40 h-40 bg-accent/5 rounded-full blur-3xl -mr-20 -mt-20" />
               <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="editorial-label text-accent/50 text-[8px] mb-2">{activeOrder.status === 'delivered' ? 'Delivery Completed' : 'Estimated Arrival'}</div>
                  <div className="font-sans text-6xl font-black text-white tracking-tighter mb-4">
                    {activeOrder.status === 'delivered' ? '00:00' : formatTime(timeLeft)}
                  </div>
                  <div className={cn(
                    "flex items-center gap-3",
                    activeOrder.status === 'delivered' ? "text-green-400" : "text-accent animate-pulse"
                  )}>
                    {activeOrder.status === 'delivered' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    <span className="font-sans text-[10px] uppercase tracking-widest font-bold">
                      {activeOrder.status.replace('-', ' ')}
                    </span>
                  </div>
               </div>
            </div>

            <div className="space-y-8">
               <div className="flex items-start gap-6">
                 <div className="p-4 bg-primary/5 rounded-full border border-accent/10">
                   <MapPin className="w-6 h-6 text-accent" />
                 </div>
                 <div>
                   <h3 className="editorial-label text-xs mb-2 opacity-40 uppercase tracking-widest">Destination</h3>
                   <p className="font-serif italic text-xl text-on-surface">{activeOrder.customer.address}</p>
                 </div>
               </div>

               <div className="flex items-start gap-6">
                 <div className="p-4 bg-primary/5 rounded-full border border-accent/10">
                   <Phone className="w-6 h-6 text-accent" />
                 </div>
                 <div>
                   <h3 className="editorial-label text-xs mb-2 opacity-40 uppercase tracking-widest">Contact</h3>
                   <p className="font-serif italic text-xl text-on-surface">{activeOrder.customer.phone}</p>
                 </div>
               </div>

               <div className="pt-8">
                 <div className="editorial-label text-[8px] opacity-40 mb-4 uppercase tracking-[0.2em]">Select Courier Preference</div>
                 <div className="flex bg-primary/5 p-1 rounded-2xl w-fit mb-8">
                    <button 
                      onClick={() => setVehicle('bike')}
                      className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all ${vehicle === 'bike' ? 'bg-white text-accent shadow-lg' : 'text-on-surface-variant hover:text-primary'}`}
                    >
                      <Bike className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Motorbike</span>
                    </button>
                    <button 
                      onClick={() => setVehicle('car')}
                      className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all ${vehicle === 'car' ? 'bg-white text-accent shadow-lg' : 'text-on-surface-variant hover:text-primary'}`}
                    >
                      <Car className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Vehicle</span>
                    </button>
                 </div>
                 <button 
                   onClick={handleContactKitchen}
                   className="w-full bg-accent text-white py-5 px-8 rounded-2xl flex justify-between items-center transition-all shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-[0.98]"
                 >
                   <div className="flex items-center gap-4">
                     <MessageCircle className="w-5 h-5" />
                     <span className="font-sans text-[11px] uppercase tracking-[0.3em] font-black">Contact Kitchen</span>
                   </div>
                   <span className="text-[10px] font-serif italic opacity-60 text-primary">Live WhatsApp</span>
                 </button>
               </div>

               {activeOrder.notes && (
                 <div className="flex items-start gap-6">
                   <div className="p-4 bg-primary/5 rounded-full border border-accent/10">
                     <Clock className="w-6 h-6 text-accent" />
                   </div>
                   <div>
                     <h3 className="editorial-label text-xs mb-2 opacity-40 uppercase tracking-widest">Instructions</h3>
                     <p className="font-sans text-sm text-on-surface-variant leading-relaxed">{activeOrder.notes}</p>
                   </div>
                 </div>
               )}
            </div>
          </div>

          {/* Infographic Character/Animation */}
          <div className="space-y-12">
            <div className="aspect-square bg-white border border-on-surface/5 rounded-3xl shadow-xl flex items-center justify-center p-12 relative group">
              <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <AnimatePresence mode="wait">
                {activeOrder.status === 'on-the-way' ? (
                  <motion.div 
                    key="on-way"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.2 }}
                    className="flex flex-col items-center"
                  >
                    <div className="relative mb-8">
                       {vehicle === 'bike' ? <Bike className="w-32 h-32 text-accent" /> : <Car className="w-32 h-32 text-accent" />}
                       <motion.div 
                         animate={{ x: [-20, 20, -20] }}
                         transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                         className="absolute -bottom-4 left-0 right-0 h-1 bg-accent/20 rounded-full"
                       />
                    </div>
                    <h3 className="font-serif italic text-3xl text-primary">Your food is on the way!</h3>
                    <p className="text-on-surface-variant text-sm mt-4 text-center max-w-xs">Our {vehicle === 'bike' ? 'dispatch rider' : 'delivery pilot'} is currently navigating the Lekki expressway to reach your sanctuary.</p>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="preparing"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.2 }}
                    className="flex flex-col items-center"
                  >
                    <div className="relative mb-8">
                       <ChefHat className="w-32 h-32 text-accent" />
                       <motion.div 
                         animate={{ rotate: 360 }}
                         transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                         className="absolute -inset-4 border-2 border-dashed border-accent/20 rounded-full"
                       />
                    </div>
                    <h3 className="font-serif italic text-3xl text-primary">Mastering the Flames</h3>
                    <p className="text-on-surface-variant text-sm mt-4 text-center max-w-xs">Your meal is being prepared with ancestral precision and modern excellence.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Steps Infographic */}
            <div className="px-8 space-y-8">
               {[
                 { id: 'pending', label: 'Curation Confirmed', icon: Package },
                 { id: 'preparing', label: 'Culinary Preparation', icon: ChefHat },
                 { id: 'on-the-way', label: 'En Route', icon: Truck },
                 { id: 'delivered', label: 'Manifested', icon: CheckCircle2 },
               ].map((step, index) => {
                 const isCompleted = index < currentStep;
                 const isActive = index === currentStep;
                 const Icon = step.icon;

                 return (
                   <div key={step.id} className="flex items-center gap-6 relative">
                     {index < 3 && (
                       <div className={`absolute left-4 top-10 w-[2px] h-10 ${isCompleted ? 'bg-accent' : 'bg-on-surface/10'}`} />
                     )}
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${isCompleted || isActive ? 'border-accent bg-accent text-primary' : 'border-on-surface/10 text-on-surface/20'}`}>
                        <Icon className="w-4 h-4" />
                     </div>
                     <div className={isActive ? 'text-on-surface' : 'text-on-surface/40'}>
                       <div className="editorial-label text-[10px] uppercase tracking-widest font-black">{step.label}</div>
                       {isActive && <div className="text-[10px] text-accent font-sans mt-1">Current Phase</div>}
                     </div>
                   </div>
                 );
               })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}