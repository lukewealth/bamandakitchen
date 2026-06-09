/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, AlertCircle, Info, Bell, ShieldAlert, Check, Sparkles, Cloud, Command } from 'lucide-react';
import { cn } from './utils';

type ToastType = 'success' | 'error' | 'info' | 'warning' | 'cloud';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  type?: 'danger' | 'info' | 'success';
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  confirm: (options: ConfirmOptions) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [activeConfirm, setActiveConfirm] = useState<ConfirmOptions | null>(null);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const confirm = useCallback((options: ConfirmOptions) => {
    setActiveConfirm(options);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleConfirmAction = () => {
    if (activeConfirm) {
      activeConfirm.onConfirm();
      setActiveConfirm(null);
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, confirm }}>
      {children}
      
      {/* Toast Notifications - Top Center "Dynamic Island" style */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[500] flex flex-col items-center gap-4 pointer-events-none w-full max-w-xl px-6">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -40, scale: 0.9, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.9, y: -20, transition: { duration: 0.3, ease: "circIn" } }}
              className={cn(
                "pointer-events-auto flex items-center gap-5 px-10 py-4 rounded-full shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border backdrop-blur-3xl min-w-[320px] max-w-full relative overflow-hidden group",
                toast.type === 'success' && "bg-primary/95 text-white border-accent/40",
                toast.type === 'cloud' && "bg-accent text-primary border-white/20",
                toast.type === 'error' && "bg-red-600 text-white border-red-400/20",
                toast.type === 'warning' && "bg-orange-500 text-white border-orange-300/20",
                toast.type === 'info' && "bg-white/95 text-primary border-primary/10"
              )}
            >
              {/* Premium Glossy Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />

              <div className={cn(
                "shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg",
                toast.type === 'success' && "bg-accent/20 text-accent",
                toast.type === 'cloud' && "bg-primary/10 text-primary",
                toast.type === 'error' && "bg-white/20 text-white",
                toast.type === 'warning' && "bg-white/20 text-white",
                toast.type === 'info' && "bg-primary/5 text-accent"
              )}>
                {toast.type === 'success' && <Check className="w-5 h-5 stroke-[3px]" />}
                {toast.type === 'cloud' && <Cloud className="w-5 h-5" />}
                {toast.type === 'error' && <ShieldAlert className="w-5 h-5" />}
                {toast.type === 'warning' && <Bell className="w-5 h-5" />}
                {toast.type === 'info' && <Sparkles className="w-5 h-5" />}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "font-sans text-[7px] uppercase tracking-[0.4em] font-black mb-0.5",
                  toast.type === 'success' || toast.type === 'error' || toast.type === 'warning' || toast.type === 'cloud' ? "opacity-60" : "text-accent"
                )}>
                  {toast.type === 'success' ? "Manifestation Confirmed" : 
                   toast.type === 'cloud' ? "Cloud Sync Active" :
                   toast.type === 'error' ? "Ritual Interrupted" :
                   toast.type === 'warning' ? "Oracle Warning" : "Sacred Insight"}
                </p>
                <p className="font-serif italic text-sm leading-tight tracking-wide truncate">
                  {toast.message}
                </p>
              </div>

              <button 
                onClick={() => removeToast(toast.id)}
                className="shrink-0 opacity-40 hover:opacity-100 transition-all ml-2"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {activeConfirm && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-primary/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl border border-primary/5"
            >
              <div className="p-10 space-y-8 text-center">
                <div className={cn(
                  "w-20 h-20 mx-auto rounded-3xl flex items-center justify-center shadow-2xl",
                  activeConfirm.type === 'danger' ? "bg-red-50 text-red-600" : "bg-accent/10 text-accent"
                )}>
                  {activeConfirm.type === 'danger' ? <ShieldAlert className="w-10 h-10" /> : <Command className="w-10 h-10" />}
                </div>

                <div className="space-y-3">
                  <h3 className="font-serif italic text-3xl text-primary">{activeConfirm.title}</h3>
                  <p className="font-sans text-sm text-primary/60 leading-relaxed max-w-[280px] mx-auto uppercase tracking-widest font-bold text-[9px]">
                    {activeConfirm.message}
                  </p>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                  <button
                    onClick={handleConfirmAction}
                    className={cn(
                      "w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] transition-all active:scale-95 shadow-xl",
                      activeConfirm.type === 'danger' ? "bg-red-600 text-white shadow-red-600/20" : "bg-primary text-white shadow-primary/20"
                    )}
                  >
                    {activeConfirm.confirmLabel || 'Proceed'}
                  </button>
                  <button
                    onClick={() => setActiveConfirm(null)}
                    className="w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] text-primary/40 hover:text-primary transition-all"
                  >
                    {activeConfirm.cancelLabel || 'Archive Request'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
