/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, AlertCircle, Info, Bell, ShieldAlert, Check } from 'lucide-react';
import { cn } from './utils';

type ToastType = 'success' | 'error' | 'info' | 'warning';

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
      
      {/* Toast Notifications */}
      <div className="fixed bottom-8 right-8 z-[500] flex flex-col gap-4 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={cn(
                "pointer-events-auto flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl min-w-[320px] max-w-md",
                toast.type === 'success' && "bg-primary/95 text-white border-accent/20",
                toast.type === 'error' && "bg-red-950/95 text-red-50 border-red-900/50",
                toast.type === 'warning' && "bg-orange-950/95 text-orange-50 border-orange-900/50",
                toast.type === 'info' && "bg-surface/95 text-primary border-primary/10"
              )}
            >
              <div className="shrink-0 p-2 rounded-xl bg-white/5">
                {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-accent" />}
                {toast.type === 'error' && <ShieldAlert className="w-5 h-5 text-red-500" />}
                {toast.type === 'warning' && <Bell className="w-5 h-5 text-orange-500" />}
                {toast.type === 'info' && <Info className="w-5 h-5 text-accent" />}
              </div>
              
              <div className="flex-1 pr-2">
                <p className="font-sans text-[9px] uppercase tracking-[0.3em] font-black opacity-40 mb-1">{toast.type}</p>
                <p className="font-serif italic text-sm leading-relaxed">{toast.message}</p>
              </div>

              <button 
                onClick={() => removeToast(toast.id)}
                className="shrink-0 opacity-20 hover:opacity-100 transition-opacity p-2"
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
                  "w-20 h-20 mx-auto rounded-3xl flex items-center justify-center",
                  activeConfirm.type === 'danger' ? "bg-red-50 text-red-600" : "bg-accent/10 text-accent"
                )}>
                  {activeConfirm.type === 'danger' ? <ShieldAlert className="w-10 h-10" /> : <Bell className="w-10 h-10" />}
                </div>

                <div className="space-y-3">
                  <h3 className="font-serif italic text-3xl text-primary">{activeConfirm.title}</h3>
                  <p className="font-sans text-sm text-primary/60 leading-relaxed max-w-[280px] mx-auto uppercase tracking-widest font-bold text-[10px]">
                    {activeConfirm.message}
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleConfirmAction}
                    className={cn(
                      "w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] transition-all active:scale-95 shadow-xl shadow-accent/20",
                      activeConfirm.type === 'danger' ? "bg-red-600 text-white" : "bg-primary text-white"
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
