/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CartItem } from "../types";
import OptimizedImage from "./OptimizedImage";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemove, 
  onCheckout 
}: CartDrawerProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = items.length > 0 ? 2500 : 0;
  const total = subtotal + deliveryFee;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-primary/60 z-[210] backdrop-blur-md"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-cream z-[220] shadow-2xl flex flex-col"
          >
            <div className="p-8 flex items-center justify-between bg-primary text-white relative">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <ShoppingBag className="w-7 h-7 text-accent" />
                  {items.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-white text-accent text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-lg">
                      {items.length}
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="font-serif text-2xl leading-tight">Your Cart</h2>
                  <div className="editorial-label text-accent opacity-80 mt-1">
                    {items.length} {items.length === 1 ? "Item" : "Items"} Ready
                  </div>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-10 space-y-10 no-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-12">
                  <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mb-8">
                    <ShoppingBag className="w-10 h-10 text-primary opacity-20" />
                  </div>
                  <p className="font-serif italic text-2xl text-primary opacity-40 mb-2">Your cart is empty</p>
                  <p className="text-on-surface-variant text-sm">Explore our curated menu to find your heritage favorites.</p>
                  <button 
                    onClick={onClose}
                    className="mt-8 text-accent font-bold uppercase tracking-widest text-xs flex items-center gap-2"
                  >
                    Continue Shopping <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={item.id} 
                    className="flex gap-6 group"
                  >
                    <div className="w-24 h-24 flex-shrink-0">
                      <OptimizedImage 
                        src={item.image} 
                        alt={item.name} 
                        containerClassName="rounded-xl shadow-lg"
                        className="group-hover:scale-110 transition-transform duration-700" 
                        aspectRatio="h-full w-full"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-serif text-lg text-primary">{item.name}</h4>
                          <div className="text-[10px] text-on-surface-variant font-bold uppercase tracking-[0.1em] mt-1">
                            {item.category}
                          </div>
                        </div>
                        <button 
                          onClick={() => onRemove(item.id)}
                          className="text-on-surface-variant hover:text-accent transition-colors p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center bg-primary/5 rounded-lg p-1">
                          <button 
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-all shadow-sm disabled:opacity-20"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3 text-primary" />
                          </button>
                          <span className="w-10 text-center font-bold text-primary text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-all shadow-sm"
                          >
                            <Plus className="w-3 h-3 text-primary" />
                          </button>
                        </div>
                        <span className="font-bold text-primary">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-8 bg-white border-t border-primary/10 shadow-[0_-20px_50px_rgba(0,0,0,0.05)]">
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    <span>Subtotal</span>
                    <span className="text-primary font-sans">₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    <span>Delivery Fee</span>
                    <span className="text-primary font-sans">₦{deliveryFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-6 mt-6 border-t border-primary/10">
                    <span className="font-serif text-2xl text-primary">Total Amount</span>
                    <span className="font-sans text-3xl text-accent font-bold tracking-tight">
                      ₦{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={onCheckout}
                  className="w-full bg-accent text-white py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-4 hover:bg-accent/90 transition-all shadow-2xl shadow-accent/30 group active:scale-[0.98]"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </button>
                <p className="text-center mt-6 text-[10px] text-on-surface-variant italic font-serif opacity-60">
                  Estimated Delivery: 30-45 Minutes
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
