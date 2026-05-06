/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, AlertCircle, Info, Bell } from 'lucide-react';
import { cn } from './utils';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-8 right-8 z-[300] flex flex-col gap-4 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={cn(
                "pointer-events-auto flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl min-w-[320px] max-w-md",
                toast.type === 'success' && "bg-primary text-white border-accent/20",
                toast.type === 'error' && "bg-red-50 text-red-900 border-red-100",
                toast.type === 'warning' && "bg-orange-50 text-orange-900 border-orange-100",
                toast.type === 'info' && "bg-surface text-primary border-primary/10"
              )}
            >
              <div className="shrink-0">
                {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-accent" />}
                {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
                {toast.type === 'warning' && <Bell className="w-5 h-5 text-orange-600" />}
                {toast.type === 'info' && <Info className="w-5 h-5 text-accent" />}
              </div>
              
              <div className="flex-1">
                <p className="font-sans text-[11px] uppercase tracking-widest font-bold opacity-40 mb-1">{toast.type}</p>
                <p className="font-serif italic text-sm leading-relaxed">{toast.message}</p>
              </div>

              <button 
                onClick={() => removeToast(toast.id)}
                className="shrink-0 opacity-40 hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
