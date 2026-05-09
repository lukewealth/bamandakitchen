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
  Image as ImageIcon, Save, MessageCircle, Users, ChevronLeft, ChevronRight, RefreshCw, Download, FileCode
} from 'lucide-react';
import { MenuItem, Order, BlogPost, BlogLayout, StaffAccount } from '../types';
import { formatStatusUpdateMessage, getWhatsAppUrl } from '../lib/order';
import { useToast } from '../lib/toast-context';
import { db, auth } from '../lib/firebase';
import { 
  collection, 
  query, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc, 
  orderBy,
} from 'firebase/firestore';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from 'firebase/auth';

export default function AdminScreen() {
  const { showToast, confirm } = useToast();
  const { 
    menu, 
    posts,
    staff,
    syncToCloud, 
    updateMenuItem, 
    deleteMenuItem, 
    updatePost,
    deletePost,
    updateStaff,
    deleteStaff,
    restoreFromStatic, 
    isCloudSyncing, 
    isConnected,
    exportAsDataTs 
  } = useDataSync();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'blog' | 'staff'>('orders');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const [orders, setOrders] = useState<Order[]>([]);

  // Editing states
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [editingMenuItem, setEditingMenuItem] = useState<Partial<MenuItem> | null>(null);
  const [editingStaff, setEditingStaff] = useState<Partial<StaffAccount> | null>(null);

  // Persistence & Auth Check
  useEffect(() => {
    if (!auth) {
      setAuthLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  // Firestore Real-time Sync (Orders only, rest via DataSync)
  useEffect(() => {
    if (!currentUser || !db) return;

    const unsubOrders = onSnapshot(query(collection(db, 'orders'), orderBy('createdAt', 'desc')), (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Order)));
    });

    return () => {
      unsubOrders();
    };
  }, [currentUser]);

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

  const handleSavePost = async () => {
    if (!editingPost?.title || !editingPost?.content) return;
    await updatePost(editingPost);
    setEditingPost(null);
    showToast('Gazette entry manifested.', 'success');
  };

  const handleSaveStaff = async () => {
    if (!editingStaff?.name || !editingStaff?.email) return;
    await updateStaff(editingStaff);
    setEditingStaff(null);
    showToast('Staff record updated.', 'success');
  };

  const handlePostImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setEditingPost(prev => prev ? { ...prev, image: reader.result as string } : null);
    };
    reader.readAsDataURL(file);
  };

  // ==========================================
  // AUTH LOGIC
  // ==========================================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showToast('Welcome back, Curator.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Authentication failed.', 'error');
    }
  };

  const handleSignOut = async () => {
    if (!auth) return;
    await signOut(auth);
    showToast('Departed the sanctuary.', 'info');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-accent font-serif italic text-xl">Consulting the Scribes...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
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
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarCollapsed ? 110 : 320 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "bg-primary text-white z-[60] shadow-2xl relative flex flex-col overflow-visible",
          isMobileMenuOpen ? "fixed inset-0 w-full h-screen" : "hidden lg:flex"
        )}
      >
        <div className="flex flex-col h-full p-8 lg:p-10 space-y-16">
          <div className="flex items-center justify-between min-h-[40px]">
            <AnimatePresence mode="wait">
              {!isSidebarCollapsed && (
                <motion.h2 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="font-serif italic text-3xl text-accent whitespace-nowrap"
                >
                  Bamanda
                </motion.h2>
              )}
            </AnimatePresence>
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
              className={cn(
                "p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5",
                isSidebarCollapsed && "mx-auto"
              )}
            >
              <motion.div
                animate={{ rotate: isSidebarCollapsed ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronRight className={cn("w-5 h-5", isSidebarCollapsed ? "text-accent" : "opacity-40")} />
              </motion.div>
            </button>
          </div>

          <nav className="flex-1 flex flex-col gap-4">
            {[
              { id: 'orders', label: 'Orders', icon: ShoppingBag },
              { id: 'menu', label: 'Menu DB', icon: Utensils },
              { id: 'blog', label: 'Gazette', icon: BookOpen },
              { id: 'staff', label: 'Staff', icon: Users },
            ].map((tab) => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id as any)} 
                className={cn(
                  "flex items-center gap-5 p-5 rounded-[1.5rem] transition-all border border-transparent group relative",
                  activeTab === tab.id ? 'bg-white text-primary shadow-xl scale-[1.02]' : 'bg-white/5 opacity-60 hover:opacity-100 hover:border-white/10 hover:bg-white/10',
                  isSidebarCollapsed && "justify-center p-6"
                )}
              >
                <tab.icon className={cn("w-6 h-6 shrink-0 transition-transform group-hover:scale-110", activeTab === tab.id && "text-accent")} />
                {!isSidebarCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap"
                  >
                    {tab.label}
                  </motion.span>
                )}
                
                {isSidebarCollapsed && (
                  <div className="absolute left-full ml-6 px-5 py-3 bg-primary text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 whitespace-nowrap z-[100] shadow-2xl border border-white/10 after:content-[''] after:absolute after:right-full after:top-1/2 after:-translate-y-1/2 after:border-8 after:border-transparent after:border-r-primary">
                    {tab.label}
                  </div>
                )}
              </button>
            ))}
          </nav>

          <button 
            onClick={handleSignOut} 
            className={cn(
              "flex items-center gap-5 p-5 bg-white/5 rounded-2xl text-white/40 hover:text-accent hover:bg-white/10 transition-all group relative",
              isSidebarCollapsed && "justify-center"
            )}
          >
            <LogOut className="w-5 h-5 shrink-0 group-hover:rotate-12 transition-transform" />
            {!isSidebarCollapsed && (
              <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Sign Out</span>
            )}
            {isSidebarCollapsed && (
              <div className="absolute left-full ml-6 px-5 py-3 bg-red-600 text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 whitespace-nowrap z-[100] shadow-2xl after:content-[''] after:absolute after:right-full after:top-1/2 after:-translate-y-1/2 after:border-8 after:border-transparent after:border-r-red-600">
                Exit Sanctuary
              </div>
            )}
          </button>
        </div>
      </motion.aside>
      
      <main className="flex-1 p-8 lg:p-16 overflow-x-hidden">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 mb-20">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-4 bg-primary text-white rounded-2xl shadow-xl active:scale-95 transition-all"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
            <div className="space-y-2">
              <h1 className="font-serif text-5xl lg:text-7xl text-primary italic capitalize tracking-tight">{activeTab} Curation</h1>
              <p className="font-sans text-[10px] font-black uppercase tracking-[0.4em] text-primary/40">Managing the Digital Sanctuary</p>
            </div>
          </div>
          <div className="flex items-center gap-5 w-full sm:w-auto">
            <button onClick={handlePushToCloud} disabled={isCloudSyncing} className="flex-1 sm:flex-none flex items-center justify-center gap-4 px-8 py-4 rounded-full border-2 border-accent/20 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-accent hover:text-white transition-all disabled:opacity-50 active:scale-95">
              <RefreshCw className={cn("w-4 h-4", isCloudSyncing && "animate-spin")} />
              {isCloudSyncing ? 'Manifesting...' : 'Push to Cloud'}
            </button>
            <div className="bg-white px-8 py-4 rounded-full border border-primary/10 flex items-center gap-4 shadow-sm">
              <div className={cn("w-2.5 h-2.5 rounded-full animate-pulse shadow-glow", isConnected ? "bg-green-500 shadow-green-500/50" : "bg-red-500 shadow-red-500/50")} />
              <span className="text-[10px] uppercase tracking-widest font-black text-primary/60">{isConnected ? "Sanctuary Online" : "Operating Locally"}</span>
            </div>
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[70] lg:hidden"
              />
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 w-80 bg-primary z-[80] lg:hidden p-10 flex flex-col"
              >
                <div className="flex items-center justify-between mb-16">
                  <h2 className="font-serif italic text-3xl text-accent">Bamanda</h2>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-white/5 rounded-xl">
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
                <nav className="flex-1 flex flex-col gap-4">
                  {[
                    { id: 'orders', label: 'Orders', icon: ShoppingBag },
                    { id: 'menu', label: 'Menu DB', icon: Utensils },
                    { id: 'blog', label: 'Gazette', icon: BookOpen },
                    { id: 'staff', label: 'Staff', icon: Users },
                  ].map((tab) => (
                    <button 
                      key={tab.id} 
                      onClick={() => { setActiveTab(tab.id as any); setIsMobileMenuOpen(false); }} 
                      className={cn(
                        "flex items-center gap-5 p-6 rounded-[1.5rem] transition-all border border-transparent",
                        activeTab === tab.id ? 'bg-white text-primary shadow-xl' : 'bg-white/5 text-white/60'
                      )}
                    >
                      <tab.icon className="w-6 h-6" />
                      <span className="text-xs font-black uppercase tracking-widest">{tab.label}</span>
                    </button>
                  ))}
                </nav>
                <button onClick={handleSignOut} className="flex items-center gap-5 p-6 bg-white/5 rounded-2xl text-white/40 mt-auto">
                  <LogOut className="w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-widest">Sign Out</span>
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

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

          {activeTab === 'blog' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-16">
              <div className="flex justify-between items-center bg-primary/5 p-8 rounded-[2.5rem] border border-primary/5">
                <h2 className="editorial-label text-accent font-black tracking-[0.4em]">Gazette Records</h2>
                <button 
                  onClick={() => setEditingPost({ title: '', content: '', author: 'Curator', category: 'Heritage', layout: 'editorial', image: '', topic: '' })} 
                  className="bg-primary text-white px-10 py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest flex items-center gap-4 shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <Plus className="w-5 h-5" /> Compose Article
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {posts.map(post => (
                  <div key={post.id} className="bg-white rounded-[3rem] p-10 shadow-sm border border-primary/5 group flex gap-10 hover:shadow-2xl transition-all duration-700">
                    <div className="w-48 h-48 rounded-[2rem] overflow-hidden shrink-0 bg-cream">
                      {post.image ? (
                        <img src={post.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" alt={post.title} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary/10"><ImageIcon className="w-12 h-12" /></div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-2">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-accent">{post.category}</span>
                          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/20">{post.date}</span>
                        </div>
                        <h3 className="font-serif text-3xl italic text-primary leading-tight">{post.title}</h3>
                        <p className="text-[10px] text-primary/40 uppercase tracking-widest font-black line-clamp-2">{post.content}</p>
                      </div>
                      <div className="flex gap-4 mt-6">
                        <button onClick={() => setEditingPost(post)} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-primary/30 hover:text-accent transition-all">
                          <Edit className="w-4 h-4" /> Edit
                        </button>
                        <button onClick={() => {
                          confirm({
                            title: "Expunge Article",
                            message: "Permanently remove this entry from the Gazette?",
                            type: "danger",
                            onConfirm: () => deletePost(post.id)
                          });
                        }} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-primary/30 hover:text-red-600 transition-all">
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'staff' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-16">
              <div className="flex justify-between items-center bg-primary/5 p-8 rounded-[2.5rem] border border-primary/5">
                <h2 className="editorial-label text-accent font-black tracking-[0.4em]">Sanctuary Guardians</h2>
                <button 
                  onClick={() => setEditingStaff({ name: '', email: '', role: 'staff' })} 
                  className="bg-primary text-white px-10 py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest flex items-center gap-4 shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <Plus className="w-5 h-5" /> Add Team Member
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {staff.map(member => (
                  <div key={member.id} className="bg-white rounded-[2.5rem] p-10 border border-primary/5 shadow-sm hover:shadow-2xl transition-all group">
                    <div className="flex items-center gap-6 mb-8">
                      <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent font-serif text-2xl italic">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-serif text-2xl italic text-primary">{member.name}</h3>
                        <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-primary/5">
                      <div className={cn(
                        "px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest",
                        member.role === 'admin' ? "bg-accent text-white" : member.role === 'rider' ? "bg-blue-100 text-blue-600" : "bg-primary/5 text-primary/60"
                      )}>
                        {member.role}
                      </div>
                      <div className="flex gap-4">
                        <button onClick={() => setEditingStaff(member)} className="p-3 bg-primary/5 rounded-xl hover:bg-accent hover:text-white transition-all"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => {
                          confirm({
                            title: "Remove Guardian",
                            message: "Revoke sanctuary access for this member?",
                            type: "danger",
                            onConfirm: () => deleteStaff(member.id)
                          });
                        }} className="p-3 bg-primary/5 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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

        {/* MODAL EDITOR: BLOG POST */}
        <AnimatePresence>
          {editingPost && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary/95 backdrop-blur-2xl">
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 40 }} className="bg-white w-full max-w-4xl h-[85vh] rounded-[4rem] overflow-hidden shadow-2xl border border-primary/5 flex flex-col">
                <div className="p-12 border-b border-primary/5 flex justify-between items-center bg-cream/30 shrink-0">
                  <div className="space-y-2">
                    <h2 className="font-serif text-4xl italic text-primary">Gazette Manuscript</h2>
                    <p className="font-sans text-[10px] font-black uppercase tracking-[0.3em] text-primary/30">Curating the Heritage Narrative</p>
                  </div>
                  <button onClick={() => setEditingPost(null)} className="p-6 bg-primary/5 rounded-full hover:bg-primary hover:text-white transition-all"><X className="w-8 h-8" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-12 space-y-12">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase font-black text-accent tracking-[0.3em] ml-2">Article Title</label>
                      <input type="text" value={editingPost.title} onChange={e => setEditingPost({ ...editingPost, title: e.target.value })} className="w-full bg-primary/5 border-none rounded-3xl px-8 py-5 font-serif text-2xl" placeholder="e.g. The Ritual of Smoke" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase font-black text-accent tracking-[0.3em] ml-2">Topic Header</label>
                      <input type="text" value={editingPost.topic} onChange={e => setEditingPost({ ...editingPost, topic: e.target.value })} className="w-full bg-primary/5 border-none rounded-3xl px-8 py-5 font-sans font-black text-xs uppercase tracking-widest" placeholder="e.g. CULINARY TRADITIONS" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase font-black text-accent tracking-[0.3em] ml-2">Category</label>
                      <select value={editingPost.category} onChange={e => setEditingPost({ ...editingPost, category: e.target.value })} className="w-full bg-primary/5 border-none rounded-2xl px-6 py-4 font-sans text-xs font-black uppercase tracking-widest">
                        {['Heritage', 'Innovation', 'Rituals', 'Sustainability'].map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase font-black text-accent tracking-[0.3em] ml-2">Visual Layout</label>
                      <select value={editingPost.layout} onChange={e => setEditingPost({ ...editingPost, layout: e.target.value as BlogLayout })} className="w-full bg-primary/5 border-none rounded-2xl px-6 py-4 font-sans text-xs font-black uppercase tracking-widest">
                        {['editorial', 'minimal', 'narrative', 'journal', 'luxury'].map(lay => (
                          <option key={lay} value={lay}>{lay}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase font-black text-accent tracking-[0.3em] ml-2">Author</label>
                      <input type="text" value={editingPost.author} onChange={e => setEditingPost({ ...editingPost, author: e.target.value })} className="w-full bg-primary/5 border-none rounded-2xl px-6 py-4 font-sans text-xs font-black" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] uppercase font-black text-accent tracking-[0.3em] ml-2">Hero Narrative (Content)</label>
                    <textarea rows={10} value={editingPost.content} onChange={e => setEditingPost({ ...editingPost, content: e.target.value })} className="w-full bg-primary/5 border-none rounded-[2.5rem] px-8 py-8 font-sans text-sm leading-relaxed" placeholder="Tell the story..." />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] uppercase font-black text-accent tracking-[0.3em] ml-2">Visual Asset</label>
                    <div className="flex gap-8 items-center">
                      <div className="flex-1 space-y-4">
                        <input type="text" value={editingPost.image} onChange={e => setEditingPost({ ...editingPost, image: e.target.value })} className="w-full bg-primary/5 border-none rounded-2xl px-6 py-4 font-sans text-xs tracking-wider" placeholder="Image URL" />
                        <label className="block w-full bg-accent/5 border border-accent/20 rounded-2xl px-6 py-4 cursor-pointer hover:bg-accent/10 transition-all text-center">
                          <span className="text-[10px] font-black uppercase tracking-widest text-accent">Upload Base64 Asset</span>
                          <input type="file" accept="image/*" onChange={handlePostImageUpload} className="hidden" />
                        </label>
                      </div>
                      <div className="w-40 h-40 bg-primary/5 rounded-[2rem] overflow-hidden flex items-center justify-center border border-primary/5 shrink-0">
                        {editingPost.image ? <img src={editingPost.image} className="w-full h-full object-cover" /> : <ImageIcon className="w-12 h-12 opacity-10" />}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-12 border-t border-primary/5 bg-cream/10 shrink-0">
                  <button onClick={handleSavePost} className="w-full bg-primary text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.5em] text-[11px] flex items-center justify-center gap-6 shadow-2xl hover:scale-[1.01] transition-all">
                    <Save className="w-6 h-6" /> Manifest to Gazette
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL EDITOR: STAFF MEMBER */}
        <AnimatePresence>
          {editingStaff && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary/95 backdrop-blur-2xl">
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 40 }} className="bg-white w-full max-w-xl rounded-[4rem] overflow-hidden shadow-2xl border border-primary/5">
                <div className="p-12 border-b border-primary/5 flex justify-between items-center bg-cream/30">
                  <div className="space-y-2">
                    <h2 className="font-serif text-3xl italic text-primary">Guardian Folio</h2>
                    <p className="font-sans text-[10px] font-black uppercase tracking-[0.3em] text-primary/30">Managing Sanctuary Access</p>
                  </div>
                  <button onClick={() => setEditingStaff(null)} className="p-5 bg-primary/5 rounded-full hover:bg-primary hover:text-white transition-all"><X className="w-6 h-6" /></button>
                </div>
                <div className="p-12 space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase font-black text-accent tracking-[0.3em] ml-2">Full Name</label>
                    <input type="text" value={editingStaff.name} onChange={e => setEditingStaff({ ...editingStaff, name: e.target.value })} className="w-full bg-primary/5 border-none rounded-2xl px-6 py-4 font-sans font-bold" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase font-black text-accent tracking-[0.3em] ml-2">Email Address</label>
                    <input type="email" value={editingStaff.email} onChange={e => setEditingStaff({ ...editingStaff, email: e.target.value })} className="w-full bg-primary/5 border-none rounded-2xl px-6 py-4 font-sans font-bold" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase font-black text-accent tracking-[0.3em] ml-2">Assigned Role</label>
                    <div className="grid grid-cols-3 gap-4">
                      {['admin', 'staff', 'rider'].map(role => (
                        <button 
                          key={role} 
                          onClick={() => setEditingStaff({ ...editingStaff, role: role as any })}
                          className={cn(
                            "py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                            editingStaff.role === role ? "bg-accent text-white shadow-lg" : "bg-primary/5 text-primary/40 hover:bg-primary/10"
                          )}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="pt-8">
                    <button onClick={handleSaveStaff} className="w-full bg-primary text-white py-6 rounded-2xl font-black uppercase tracking-[0.4em] text-[11px] flex items-center justify-center gap-4 shadow-xl">
                      <Save className="w-5 h-5" /> Update Records
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
