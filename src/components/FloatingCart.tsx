/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { formatQuickWhatsAppMessage, getWhatsAppUrl } from '../lib/order';

interface FloatingCartProps {
  items: CartItem[];
  onOpenCart: () => void;
}

export default function FloatingCart({ items, onOpenCart }: FloatingCartProps) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (totalItems === 0) return null;

  const handleWhatsAppCheckout = () => {
    const message = formatQuickWhatsAppMessage(items, totalPrice);
    window.open(getWhatsAppUrl(message), '_blank');
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <motion.div
        initial={{ scale: 0, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="flex flex-col items-end gap-3"
      >
        {/* Floating Action Button */}
        <button
          onClick={onOpenCart}
          className="bg-accent text-primary p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 relative group"
        >
          <ShoppingBag className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 bg-white text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-accent">
            {totalItems}
          </span>
          
          {/* Tooltip/Label */}
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-surface border border-accent/20 px-4 py-2 rounded-lg shadow-xl pointer-events-none">
             <span className="editorial-label text-[10px] text-accent font-bold italic">
               View Cart • ₦{totalPrice.toLocaleString()}
             </span>
          </div>
        </button>

        {/* WhatsApp Quick Link */}
        <button
          onClick={handleWhatsAppCheckout}
          className="bg-primary border border-accent/30 text-accent px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 hover:bg-accent hover:text-primary transition-all duration-500 group"
        >
          <div className="flex flex-col items-end">
            <span className="text-[8px] uppercase tracking-widest font-bold opacity-70">Checkout via</span>
            <span className="text-[10px] font-black uppercase tracking-wider">WhatsApp</span>
          </div>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </div>
  );
}
