/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, ChefHat, Truck, CheckCircle2, Clock, MapPin, Phone, ArrowLeft, MessageCircle, Bike, Car } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { getWhatsAppUrl } from '../lib/order';

interface TrackOrderScreenProps {
  order: Order | null;
  onBack: () => void;
}

export default function TrackOrderScreen({ order, onBack }: TrackOrderScreenProps) {
  const [timeLeft, setTimeLeft] = useState(order?.estimatedDeliveryTime || 30 * 60); // In seconds
  const [vehicle, setVehicle] = useState<'bike' | 'car'>('bike');

  useEffect(() => {
    if (!order || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [order, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusIndex = (status: OrderStatus) => {
    const steps: OrderStatus[] = ['pending', 'preparing', 'on-the-way', 'delivered'];
    return steps.indexOf(status);
  };

  const currentStep = order ? getStatusIndex(order.status) : 0;

  const handleContactKitchen = () => {
    if (!order) return;
    const message = encodeURIComponent(`Hello Bamanda Kitchen! I'm inquiring about my order #${order.id}. Current status is: ${order.status.toUpperCase()}.`);
    window.open(getWhatsAppUrl(message), '_blank');
  };

  if (!order) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mb-8 animate-pulse">
          <Clock className="w-10 h-10 text-accent" />
        </div>
        <h2 className="font-serif text-3xl text-on-surface mb-4 italic">No Active Curation Found</h2>
        <p className="font-sans text-on-surface-variant max-w-md opacity-60 mb-12">
          It seems there are no orders currently being tracked. Please verify your order ID or return to the menu.
        </p>
        <button 
          onClick={onBack}
          className="editorial-label text-accent border-b border-accent py-2 hover:opacity-70 transition-opacity"
        >
          Return to Sanctuary
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 lg:px-20 bg-surface">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-3 text-on-surface-variant hover:text-accent transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
          <span className="editorial-label text-[10px] uppercase tracking-widest">Back to Store</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Status Details */}
          <div className="space-y-12">
            <header>
              <div className="editorial-label text-accent mb-4 tracking-[0.4em]">Tracking Order #{order.id}</div>
              <h1 className="font-serif italic text-6xl text-on-surface">Your Feast is <br />Being Prepared</h1>
            </header>

            <div className="bg-primary p-10 rounded-3xl shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-40 h-40 bg-accent/5 rounded-full blur-3xl -mr-20 -mt-20" />
               <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="editorial-label text-accent/50 text-[8px] mb-2">Estimated Arrival</div>
                  <div className="font-sans text-6xl font-black text-white tracking-tighter mb-4">
                    {formatTime(timeLeft)}
                  </div>
                  <div className="flex items-center gap-3 text-accent animate-pulse">
                    <Clock className="w-4 h-4" />
                    <span className="font-sans text-[10px] uppercase tracking-widest font-bold">In Progress</span>
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
                   <p className="font-serif italic text-xl text-on-surface">{order.customer.address}</p>
                 </div>
               </div>

               <div className="flex items-start gap-6">
                 <div className="p-4 bg-primary/5 rounded-full border border-accent/10">
                   <Phone className="w-6 h-6 text-accent" />
                 </div>
                 <div>
                   <h3 className="editorial-label text-xs mb-2 opacity-40 uppercase tracking-widest">Contact</h3>
                   <p className="font-serif italic text-xl text-on-surface">{order.customer.phone}</p>
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

               {order.notes && (
                 <div className="flex items-start gap-6">
                   <div className="p-4 bg-primary/5 rounded-full border border-accent/10">
                     <Clock className="w-6 h-6 text-accent" />
                   </div>
                   <div>
                     <h3 className="editorial-label text-xs mb-2 opacity-40 uppercase tracking-widest">Instructions</h3>
                     <p className="font-sans text-sm text-on-surface-variant leading-relaxed">{order.notes}</p>
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
                {order.status === 'on-the-way' ? (
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