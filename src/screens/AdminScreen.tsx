/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useDataSync } from '../lib/data-sync';
import { 
  Lock, LogOut, ShoppingBag, Utensils, BookOpen, X, Star, Edit, Trash2, Plus, 
  CheckCircle2, Clock, Truck, Image as ImageIcon, Layout, Save, AlertCircle, MessageCircle,
  Menu as MenuIcon, Users, ChevronLeft, ChevronRight, Loader2, RefreshCw, Download, FileCode
} from 'lucide-react';
import { MenuItem, Order, BlogPost, OrderStatus, BlogLayout, MenuCategory, StaffAccount } from '../types';
import { formatStatusUpdateMessage, getWhatsAppUrl } from '../lib/order';
import { useToast } from '../lib/toast-context';
import { db } from '../lib/firebase';
import { 
  collection, 
  query, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc, 
  setDoc, 
  writeBatch,
  orderBy,
  serverTimestamp,
  addDoc
} from 'firebase/firestore';

export default function AdminScreen() {
  const { showToast, confirm } = useToast();
  const { 
    menu, 
    syncToCloud, 
    updateMenuItem, 
    deleteMenuItem, 
    restoreFromStatic, 
    isCloudSyncing, 
    isConnected,
    exportAsDataTs 
  } = useDataSync();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'blog' | 'staff'>('orders');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isTabLoading, setIsTabLoading] = useState(false);
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [staff, setStaff] = useState<StaffAccount[]>([]);

  // Editing states
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [editingMenuItem, setEditingMenuItem] = useState<Partial<MenuItem> | null>(null);
  const [editingStaff, setEditingStaff] = useState<Partial<StaffAccount> | null>(null);

  // Firestore Real-time Sync (Orders, Blog, Staff only)
  useEffect(() => {
    if (!isAuthenticated || !db) return;

    const unsubOrders = onSnapshot(query(collection(db, 'orders'), orderBy('createdAt', 'desc')), (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Order)));
    });

    const unsubBlog = onSnapshot(query(collection(db, 'blog'), orderBy('date', 'desc')), (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as BlogPost)));
    });

    const unsubStaff = onSnapshot(query(collection(db, 'staff'), orderBy('name')), (snapshot) => {
      setStaff(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as StaffAccount)));
    });

    return () => {
      unsubOrders();
      unsubBlog();
      unsubStaff();
    };
  }, [isAuthenticated]);

  // ==========================================
  // MASTER OPERATIONS
  // ==========================================
  const handlePushToCloud = async () => {
    confirm({
      title: "Master Manifestation",
      message: "Synchronize current local inventory with the cloud sanctuary? This ensures all devices see your latest curations.",
      confirmLabel: "Manifest to Cloud",
      onConfirm: async () => {
        await syncToCloud();
      }
    });
  };

  const handleSaveMenuItem = async () => {
    if (!editingMenuItem?.name || !editingMenuItem?.price) return;
    await updateMenuItem(editingMenuItem);
    setEditingMenuItem(null);
  };

  const handleRestoreHeritage = () => {
    confirm({
      title: "Restore Ancestry",
      message: "Reset your local menu to the ancestral static records? This will overwrite recent local changes.",
      confirmLabel: "Restore Records",
      onConfirm: () => {
        restoreFromStatic();
      }
    });
  };

  const handleExportCode = () => {
    const code = exportAsDataTs();
    navigator.clipboard.writeText(code);
    showToast('Manifest copied to clipboard.', 'success');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setEditingMenuItem(prev => prev ? { ...prev, image: reader.result as string } : null);
    };
    reader.readAsDataURL(file);
  };

  const handleNotifyCustomer = (order: Order) => {
    const message = formatStatusUpdateMessage(order);
    const url = getWhatsAppUrl(message, order.customer.phone);
    window.open(url, '_blank');
  };

  const deleteOrder = async (orderId: string) => {
    confirm({
      title: "Archive Curation",
      message: "Remove this record from the active logs?",
      type: "danger",
      onConfirm: async () => {
        if (db) await deleteDoc(doc(db, 'orders', orderId));
        showToast('Record archived.', 'info');
      }
    });
  };

  const toggleTrending = async (id: string) => {
    const item = menu.find(m => m.id === id);
    if (!item) return;
    await updateMenuItem({ ...item, isTrending: !item.isTrending });
  };

  // ==========================================
  // AUTH LOGIC
  // ==========================================
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === (import.meta.env.VITE_ADMIN_EMAIL || 'admin@bamanda.com') && 
        password === (import.meta.env.VITE_ADMIN_PASSWORD || 'heritage2026')) {
      setIsAuthenticated(true);
      showToast('Welcome back, Curator.', 'success');
    } else {
      showToast('Invalid credentials.', 'error');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary p-6">
        <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl">
          <Lock className="w-12 h-12 mx-auto mb-8 text-accent" />
          <h1 className="font-serif text-3xl italic mb-12 text-center text-primary">Curator Access</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-primary/5 border-none rounded-2xl px-6 py-4 font-sans" placeholder="Curator Email" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-primary/5 border-none rounded-2xl px-6 py-4 font-sans" placeholder="Sacred Key" />
            <button type="submit" className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-xl shadow-primary/20 active:scale-95 transition-all">
              Enter Sanctuary
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col lg:flex-row">
      <aside className={cn(
        "bg-primary text-white transition-all duration-500 z-[60] shadow-xl relative group flex flex-col",
        isMobileMenuOpen ? "fixed inset-0 w-full h-screen" : (isSidebarCollapsed ? "w-0 lg:w-28 overflow-hidden" : "w-full lg:w-80")
      )}>
        <div className="flex flex-col h-full p-8 lg:p-10 space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="font-serif italic text-3xl text-accent">Bamanda</h2>
            <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="hidden lg:block opacity-40 hover:opacity-100 transition-opacity">
              {isSidebarCollapsed ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
            </button>
          </div>
          <nav className="flex-1 flex flex-col gap-4">
            {[
              { id: 'orders', label: 'Orders', icon: ShoppingBag },
              { id: 'menu', label: 'Menu DB', icon: Utensils },
              { id: 'blog', label: 'Gazette', icon: BookOpen },
              { id: 'staff', label: 'Staff', icon: Users },
            ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={cn("flex items-center gap-5 p-5 rounded-[1.5rem] transition-all border border-transparent", activeTab === tab.id ? 'bg-white text-primary shadow-xl' : 'bg-white/5 opacity-60 hover:opacity-100 hover:border-white/10')}>
                <tab.icon className="w-6 h-6 shrink-0" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">{tab.label}</span>
              </button>
            ))}
          </nav>
          <button onClick={() => setIsAuthenticated(false)} className="flex items-center gap-5 p-5 bg-white/5 rounded-2xl text-white/40 hover:text-accent transition-all">
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Sign Out</span>
          </button>
        </div>
      </aside>
      
      <main className="flex-1 p-8 lg:p-16 overflow-x-hidden">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 mb-20">
          <div className="space-y-2">
            <h1 className="font-serif text-5xl lg:text-7xl text-primary italic capitalize tracking-tight">{activeTab} Curation</h1>
            <p className="font-sans text-[10px] font-black uppercase tracking-[0.4em] text-primary/40">Managing the Digital Sanctuary</p>
          </div>
          <div className="flex items-center gap-5">
            <button onClick={handlePushToCloud} disabled={isCloudSyncing} className="flex items-center gap-4 px-8 py-4 rounded-full border-2 border-accent/20 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-accent hover:text-white transition-all disabled:opacity-50 active:scale-95">
              <RefreshCw className={cn("w-4 h-4", isCloudSyncing && "animate-spin")} />
              {isCloudSyncing ? 'Manifesting...' : 'Push to Cloud'}
            </button>
            <div className="bg-white px-8 py-4 rounded-full border border-primary/10 flex items-center gap-4 shadow-sm">
              <div className={cn("w-2.5 h-2.5 rounded-full animate-pulse shadow-glow", isConnected ? "bg-green-500 shadow-green-500/50" : "bg-red-500 shadow-red-500/50")} />
              <span className="text-[10px] uppercase tracking-widest font-black text-primary/60">{isConnected ? "Sanctuary Online" : "Operating Locally"}</span>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'menu' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-16">
              <div className="flex justify-between items-center bg-primary/5 p-8 rounded-[2.5rem] border border-primary/5">
                <div className="flex items-center gap-8">
                  <h2 className="editorial-label text-accent font-black tracking-[0.4em]">Active Inventory</h2>
                  <div className="h-8 w-px bg-primary/10" />
                  <div className="flex items-center gap-6">
                    <button onClick={handleRestoreHeritage} className="flex items-center gap-3 text-primary/30 hover:text-accent transition-all">
                      <Download className="w-5 h-5" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Restore</span>
                    </button>
                    <button onClick={handleExportCode} className="flex items-center gap-3 text-primary/30 hover:text-accent transition-all">
                      <FileCode className="w-5 h-5" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Export Code</span>
                    </button>
                  </div>
                </div>
                <button onClick={() => setEditingMenuItem({ name: '', price: 0, category: 'Rice Dishes', description: '', isTrending: false, image: '' })} className="bg-primary text-white px-10 py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest flex items-center gap-4 shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                  <Plus className="w-5 h-5" /> Add New Item
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                {menu.map(item => (
                  <div key={item.id} className="bg-white rounded-[3rem] p-8 shadow-sm border border-primary/5 group relative hover:shadow-2xl transition-all duration-700">
                    <div className="aspect-square rounded-[2rem] overflow-hidden mb-8 shadow-inner bg-cream relative">
                      {item.image ? (
                        <img src={item.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" alt={item.name} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary/10"><ImageIcon className="w-16 h-16" /></div>
                      )}
                    </div>
                    <div className="space-y-6">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="font-serif text-3xl italic text-primary leading-tight">{item.name}</h3>
                        <p className="font-sans font-black text-accent text-xl whitespace-nowrap">₦{item.price.toLocaleString()}</p>
                      </div>
                      <p className="text-[10px] text-primary/40 uppercase tracking-widest font-black leading-relaxed line-clamp-3 h-[45px]">{item.description}</p>
                      <div className="flex items-center justify-between pt-8 border-t border-primary/5">
                        <button onClick={() => toggleTrending(item.id)} className={cn("flex items-center gap-2 text-[10px] font-black uppercase transition-all", item.isTrending ? "text-orange-500" : "text-primary/20 hover:text-accent")}>
                           <Star className={cn("w-4 h-4", item.isTrending && "fill-current")} /> {item.isTrending ? "Trending" : "Boost"}
                        </button>
                        <div className="flex gap-3">
                          <button onClick={() => setEditingMenuItem(item)} className="p-3 bg-primary/5 rounded-xl hover:bg-accent hover:text-white transition-all active:scale-90"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => {
                            confirm({
                              title: "Purge Selection",
                              message: "Erase this dish from the sanctuary records permanently?",
                              type: "danger",
                              onConfirm: () => deleteMenuItem(item.id)
                            });
                          }} className="p-3 bg-primary/5 rounded-xl hover:bg-red-600 hover:text-white transition-all active:scale-90"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 gap-10">
              {orders.length === 0 ? (
                <div className="bg-white p-32 rounded-[4rem] text-center border border-primary/5">
                  <ShoppingBag className="w-20 h-20 text-primary/5 mx-auto mb-10" />
                  <p className="font-serif italic text-3xl text-primary opacity-10">No manifestations recorded.</p>
                </div>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="bg-white p-12 rounded-[3rem] border border-primary/5 shadow-sm hover:shadow-2xl transition-all duration-700 relative overflow-hidden">
                    <div className="flex flex-col xl:flex-row justify-between gap-16">
                      <div className="flex-1 space-y-10">
                        <div className="flex items-center justify-between">
                          <div className="editorial-label text-accent font-black tracking-[0.5em] text-xs">Folio #{order.id}</div>
                          <div className={cn("px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.3em] bg-primary/5", order.status === 'delivered' ? 'text-green-600 bg-green-50' : 'text-accent')}>
                            {order.status}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                          <div className="space-y-4 border-l-4 border-accent pl-8">
                            <h4 className="text-[9px] uppercase font-black text-primary/30 tracking-[0.4em]">Patron</h4>
                            <p className="font-serif italic text-4xl text-primary">{order.customer.name}</p>
                            <p className="font-sans text-sm font-bold text-primary/60">{order.customer.phone}</p>
                            <p className="text-xs text-primary/40 leading-relaxed max-w-xs">{order.customer.address}</p>
                          </div>
                          <div className="space-y-4 bg-cream/30 p-8 rounded-[2rem]">
                            <h4 className="text-[9px] uppercase font-black text-primary/30 tracking-[0.4em]">Financials</h4>
                            <p className="font-sans font-black text-4xl text-primary">₦{order.total.toLocaleString()}</p>
                            <p className="text-[10px] font-black text-accent uppercase tracking-widest">{new Date(order.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4 pt-10 border-t border-primary/5">
                          {order.items.map(item => (
                            <span key={item.id} className="bg-primary text-white px-6 py-4 rounded-[1.2rem] text-[11px] font-black uppercase tracking-widest">{item.quantity}x {item.name}</span>
                          ))}
                        </div>
                      </div>
                      <div className="xl:w-96 flex flex-col gap-4 justify-center xl:border-l border-primary/5 xl:pl-16">
                        <button onClick={() => updateDoc(doc(db, 'orders', order.id), { status: 'preparing' })} className="w-full bg-primary/5 py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-accent hover:text-white transition-all shadow-sm active:scale-95">Initiate Prep</button>
                        <button onClick={() => updateDoc(doc(db, 'orders', order.id), { status: 'on-the-way' })} className="w-full bg-primary/5 py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95">Dispatch Rider</button>
                        <button onClick={() => updateDoc(doc(db, 'orders', order.id), { status: 'delivered' })} className="w-full bg-primary/5 py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-green-600 hover:text-white transition-all shadow-sm active:scale-95">Confirm Arrival</button>
                        <div className="h-px bg-primary/5 my-4" />
                        <button onClick={() => handleNotifyCustomer(order)} className="w-full bg-accent text-white py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 shadow-2xl shadow-accent/30 hover:scale-[1.02] active:scale-95 transition-all"><MessageCircle className="w-5 h-5" /> Notify Patron</button>
                        <button onClick={() => deleteOrder(order.id)} className="w-full text-red-600/40 hover:text-red-600 py-3 text-[9px] font-black uppercase tracking-[0.2em] transition-all">Archive Folio</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODAL EDITOR: MENU ITEM */}
        <AnimatePresence>
          {editingMenuItem && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary/95 backdrop-blur-2xl">
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 40 }} className="bg-white w-full max-w-3xl rounded-[4rem] overflow-hidden shadow-2xl border border-primary/5">
                <div className="p-16 border-b border-primary/5 flex justify-between items-center bg-cream/30">
                  <div className="space-y-2">
                    <h2 className="font-serif text-4xl italic text-primary">Curation Manuscript</h2>
                    <p className="font-sans text-[10px] font-black uppercase tracking-[0.3em] text-primary/30">Refining the Inventory</p>
                  </div>
                  <button onClick={() => setEditingMenuItem(null)} className="p-6 bg-primary/5 rounded-full hover:bg-primary hover:text-white transition-all active:scale-90"><X className="w-8 h-8" /></button>
                </div>
                <div className="p-16 space-y-12 bg-white">
                  <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase font-black text-accent tracking-[0.3em] ml-2">Title of Dish</label>
                      <input type="text" value={editingMenuItem.name} onChange={e => setEditingMenuItem({ ...editingMenuItem, name: e.target.value })} className="w-full bg-primary/5 border-none rounded-3xl px-8 py-6 font-serif text-2xl placeholder:text-primary/10" placeholder="e.g. Imperial Jollof" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase font-black text-accent tracking-[0.3em] ml-2">Sacred Price (₦)</label>
                      <input type="number" value={editingMenuItem.price} onChange={e => setEditingMenuItem({ ...editingMenuItem, price: parseInt(e.target.value) })} className="w-full bg-primary/5 border-none rounded-3xl px-8 py-6 font-sans font-black text-2xl" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase font-black text-accent tracking-[0.3em] ml-2">Visual Asset</label>
                    <div className="flex gap-8 items-center">
                      <div className="flex-1 space-y-4">
                        <input type="text" value={editingMenuItem.image} onChange={e => setEditingMenuItem({ ...editingMenuItem, image: e.target.value })} className="w-full bg-primary/5 border-none rounded-2xl px-6 py-4 font-sans text-xs tracking-wider" placeholder="Sacred Image URL (Unsplash/Firebase)" />
                        <div className="flex items-center gap-4">
                          <label className="flex-1 bg-accent/5 border border-accent/20 rounded-2xl px-6 py-4 cursor-pointer hover:bg-accent/10 transition-all flex items-center gap-3">
                            <ImageIcon className="w-4 h-4 text-accent" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-accent">Upload Local Manifest</span>
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                          </label>
                          {editingMenuItem.image?.startsWith('data:') && (
                            <button onClick={() => setEditingMenuItem({ ...editingMenuItem, image: '' })} className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-all">
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="w-32 h-32 bg-primary/5 rounded-[2rem] flex items-center justify-center overflow-hidden shrink-0 shadow-inner border border-primary/5 relative group">
                        {editingMenuItem.image ? (
                          <img src={editingMenuItem.image} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-10 h-10 opacity-10" />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase font-black text-accent tracking-[0.3em] ml-2">Curation Narrative</label>
                    <textarea rows={4} value={editingMenuItem.description} onChange={e => setEditingMenuItem({ ...editingMenuItem, description: e.target.value })} className="w-full bg-primary/5 border-none rounded-[2rem] px-8 py-8 font-sans text-sm leading-relaxed placeholder:text-primary/10" placeholder="Manifest the story of this flavor..." />
                  </div>
                  <div className="pt-8">
                    <button onClick={handleSaveMenuItem} className="w-full bg-primary text-white py-8 rounded-[2rem] font-black uppercase tracking-[0.5em] text-[12px] shadow-[0_20px_50px_rgba(10,13,54,0.3)] hover:shadow-[0_30px_60px_rgba(10,13,54,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-6">
                      <Save className="w-6 h-6" /> Manifest to Records
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
