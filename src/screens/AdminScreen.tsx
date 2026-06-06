/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useDataSync } from '../lib/data-sync';
import { 
  Lock, LogOut, ShoppingBag, Utensils, BookOpen, X, Star, Edit, Trash2, Plus, 
  Image as ImageIcon, Save, MessageCircle, Users, ChevronRight, RefreshCw, Download, FileCode, Menu as MenuIcon, ShieldAlert,
  Eye, EyeOff, Home, BarChart3, TrendingUp, UserCheck, Clock, CheckCircle2,
  Upload, Check, AlertCircle, Info
} from 'lucide-react';
import { MenuItem, Order, BlogPost, BlogLayout, StaffAccount, MenuCategory } from '../types';
import { formatStatusUpdateMessage, getWhatsAppUrl } from '../lib/order';
import { useToast } from '../lib/toast-context';
import { db, auth } from '../lib/firebase';
import { onAuthStateChanged, signOut, User, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { patronTracker } from '../lib/security';

const CATEGORIES: MenuCategory[] = [
  'Rice Dishes', 'Proteins', 'Pasta & Noodles', 'Snacks', 
  'Sides, Sauces & Porridge', 'Drinks', 'Heritage Collection', 
  'African Dishes', 'Intercontinental'
];

export default function AdminScreen() {
  const navigate = useNavigate();
  const { showToast, confirm } = useToast();
  const { 
    menu, 
    posts,
    staff,
    orders,
    userProfile,
    syncToCloud, 
    updateMenuItem, 
    deleteMenuItem, 
    updatePost,
    deletePost,
    updateStaff,
    deleteStaff,
    updateOrderStatus,
    deleteOrder,
    restoreFromStatic, 
    isCloudSyncing, 
    isConnected,
    exportAsDataTs 
  } = useDataSync();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'blog' | 'staff' | 'patronage'>('orders');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [menuSearch, setMenuSearch] = useState('');
  const [staffSearch, setStaffSearch] = useState('');
  const [blogSearch, setBlogSearch] = useState('');

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

  // Role Protection
  const isAdmin = userProfile?.role === 'admin';

  // Filter tabs based on role
  const availableTabs = useMemo(() => {
    const tabs = [{ id: 'orders', label: 'Orders', icon: ShoppingBag }];
    if (isAdmin) {
      tabs.push(
        { id: 'patronage', label: 'Patronage', icon: BarChart3 },
        { id: 'menu', label: 'Menu DB', icon: Utensils },
        { id: 'blog', label: 'Gazette', icon: BookOpen },
        { id: 'staff', label: 'Staff', icon: Users }
      );
    }
    return tabs;
  }, [isAdmin]);

  // Patronage Analytics
  const patronageStats = useMemo(() => {
    const patrons = new Map<string, { name: string, count: number, spent: number, lastOrder: string }>();
    
    orders.forEach(order => {
      const phone = order.customer.phone;
      const existing = patrons.get(phone) || { name: order.customer.name, count: 0, spent: 0, lastOrder: order.createdAt };
      patrons.set(phone, {
        name: order.customer.name,
        count: existing.count + 1,
        spent: existing.spent + order.total,
        lastOrder: new Date(order.createdAt) > new Date(existing.lastOrder) ? order.createdAt : existing.lastOrder
      });
    });

    return Array.from(patrons.entries())
      .map(([phone, data]) => ({ phone, ...data }))
      .sort((a, b) => b.spent - a.spent);
  }, [orders]);

  const filteredMenu = useMemo(() => {
    return menu.filter(item => 
      item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(menuSearch.toLowerCase())
    );
  }, [menu, menuSearch]);

  const filteredBlog = useMemo(() => {
    return posts.filter(post => 
      post.title.toLowerCase().includes(blogSearch.toLowerCase())
    );
  }, [posts, blogSearch]);

  const filteredStaff = useMemo(() => {
    return staff.filter(member => 
      member.name.toLowerCase().includes(staffSearch.toLowerCase()) ||
      member.email.toLowerCase().includes(staffSearch.toLowerCase())
    );
  }, [staff, staffSearch]);

  // Order Queuing Logic
  const pendingOrdersCount = useMemo(() => {
    return orders.filter(o => o.status === 'pending').length;
  }, [orders]);

  const handleConfirmOrder = async (order: Order) => {
    const queuePos = pendingOrdersCount; // Simple queue based on current pending
    await updateOrderStatus(order.id, 'preparing', { 
      confirmedAt: new Date().toISOString(),
      queuePosition: queuePos
    });
  };

  const handlePushToCloud = async () => {
    if (!isAdmin) return;
    confirm({
      title: "Master Manifestation",
      message: "Synchronize current local inventory with the cloud sanctuary?",
      confirmLabel: "Manifest to Cloud",
      onConfirm: async () => {
        await syncToCloud();
      }
    });
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    await updateOrderStatus(orderId, status);
  };

  const handleSaveMenuItem = async () => {
    if (!isAdmin || !editingMenuItem?.name || !editingMenuItem?.price) return;
    await updateMenuItem(editingMenuItem);
    setEditingMenuItem(null);
  };

  const handleRestoreHeritage = () => {
    if (!isAdmin) return;
    confirm({
      title: "Restore Ancestry",
      message: "Reset your local menu to the ancestral static records?",
      confirmLabel: "Restore Records",
      onConfirm: () => {
        restoreFromStatic();
      }
    });
  };

  const handleExportCode = () => {
    if (!isAdmin) return;
    const code = exportAsDataTs();
    navigator.clipboard.writeText(code);
    showToast('Manifest copied to clipboard.', 'success');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setEditingMenuItem(prev => prev ? { ...prev, image: reader.result as string } : null);
    reader.readAsDataURL(file);
  };

  const handleNotifyCustomer = (order: Order) => {
    const message = formatStatusUpdateMessage(order);
    const url = getWhatsAppUrl(message, order.customer.phone);
    window.open(url, '_blank');
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!isAdmin) return;
    confirm({
      title: "Archive Curation",
      message: "Remove this record from the active logs?",
      type: "danger",
      onConfirm: async () => await deleteOrder(orderId)
    });
  };

  const handleSavePost = async () => {
    if (!isAdmin || !editingPost?.title || !editingPost?.content) return;
    await updatePost(editingPost);
    setEditingPost(null);
  };

  const handleSaveStaff = async () => {
    if (!isAdmin || !editingStaff?.name || !editingStaff?.email) return;
    await updateStaff(editingStaff);
    setEditingStaff(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setIsLoggingIn(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showToast('Welcome back, Curator.', 'success');
    } catch (err: any) {
      const primaryAdminEmail = import.meta.env.VITE_ADMIN_EMAIL;
      const primaryAdminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
      if (email === primaryAdminEmail && password === primaryAdminPassword) {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          showToast('Master Curator Manifested.', 'success');
        } catch (createErr: any) {
          showToast(createErr.message || 'Manifestation failed.', 'error');
        }
      } else {
        showToast(err.message || 'Authentication failed.', 'error');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!auth) return;
    setIsLoggingIn(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      showToast('Welcome back, Curator.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Google Auth failed.', 'error');
    } finally {
      setIsLoggingIn(false);
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-primary p-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none wood-texture" />
        <div className="absolute top-10 left-10 z-20">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 text-white/40 hover:text-accent transition-all group">
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-accent group-hover:bg-accent/5 transition-all">
              <Home className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] hidden sm:block">Return Home</span>
          </button>
        </div>
        <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl relative z-10">
          <Lock className="w-12 h-12 mx-auto mb-8 text-accent" />
          <h1 className="font-serif text-3xl italic mb-12 text-center text-primary">Curator Access</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-primary/5 border-none rounded-2xl px-6 py-4 font-sans text-black focus:ring-2 focus:ring-accent/50 outline-none transition-all" placeholder="Curator Email" />
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-primary/5 border-none rounded-2xl px-6 py-4 font-sans text-black focus:ring-2 focus:ring-accent/50 outline-none transition-all pr-14" placeholder="Sacred Key" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-primary/30 hover:text-accent transition-colors">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <button type="submit" disabled={isLoggingIn} className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-xl shadow-primary/20 active:scale-95 transition-all disabled:opacity-50">
              {isLoggingIn ? "Validating..." : "Enter Sanctuary"}
            </button>
          </form>
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-primary/5"></div></div>
            <div className="relative flex justify-center text-[8px] uppercase font-black tracking-widest text-primary/20 bg-white px-4">Or Use Google</div>
          </div>
          <button onClick={handleGoogleLogin} disabled={isLoggingIn} className="w-full bg-white border border-primary/10 text-primary py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[9px] flex items-center justify-center gap-4 hover:bg-primary/5 transition-all active:scale-95 disabled:opacity-50">
             <span className="font-bold">G</span> Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  if (currentUser && !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary p-6">
        <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl text-center">
          <ShieldAlert className="w-16 h-16 mx-auto mb-8 text-red-500" />
          <h1 className="font-serif text-3xl italic mb-6 text-primary">Access Restricted</h1>
          <button onClick={handleSignOut} className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-xl shadow-primary/20 active:scale-95 transition-all">
            Return to Sanctuary
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col lg:flex-row">
      <motion.aside initial={false} animate={{ width: isSidebarCollapsed ? 110 : 320 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className={cn("bg-primary text-white z-[60] shadow-2xl relative flex flex-col overflow-visible", isMobileMenuOpen ? "fixed inset-0 w-full h-screen" : "hidden lg:flex")}>
        <div className="flex flex-col h-full p-8 lg:p-10 space-y-16">
          <div className="flex items-center justify-between min-h-[40px]">
            {!isSidebarCollapsed && <h2 className="font-serif italic text-3xl text-accent">Bamanda</h2>}
            <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className={cn("p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5", isSidebarCollapsed && "mx-auto")}>
              <ChevronRight className={cn("w-5 h-5 transition-transform duration-300", !isSidebarCollapsed && "rotate-180")} />
            </button>
          </div>
          <nav className="flex-1 flex flex-col gap-4">
            {availableTabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={cn("flex items-center gap-5 p-5 rounded-[1.5rem] transition-all border border-transparent group relative", activeTab === tab.id ? 'bg-white text-primary shadow-xl' : 'bg-white/5 opacity-60 hover:opacity-100', isSidebarCollapsed && "justify-center p-6")}>
                <tab.icon className={cn("w-6 h-6 shrink-0", activeTab === tab.id && "text-accent")} />
                {!isSidebarCollapsed && <span className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">{tab.label}</span>}
              </button>
            ))}
          </nav>
          <button onClick={handleSignOut} className={cn("flex items-center gap-5 p-5 bg-white/5 rounded-2xl text-white/40 hover:text-accent hover:bg-white/10 transition-all group relative", isSidebarCollapsed && "justify-center")}>
            <LogOut className="w-5 h-5 shrink-0" />
            {!isSidebarCollapsed && <span className="text-[10px] font-black uppercase tracking-widest">Sign Out</span>}
          </button>
        </div>
      </motion.aside>
      
      <main className="flex-1 p-8 lg:p-16 overflow-x-hidden">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 mb-20">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-4 bg-primary text-white rounded-2xl shadow-xl"><MenuIcon className="w-6 h-6" /></button>
            <div className="space-y-2">
              <h1 className="font-serif text-5xl lg:text-7xl text-primary italic capitalize tracking-tight">{activeTab}</h1>
              <p className="font-sans text-[10px] font-black uppercase tracking-[0.4em] text-primary/40">Managing the Digital Sanctuary</p>
            </div>
          </div>
          <div className="flex items-center gap-5 w-full sm:w-auto">
            {isAdmin && <button onClick={handlePushToCloud} disabled={isCloudSyncing} className="flex-1 sm:flex-none flex items-center justify-center gap-4 px-8 py-4 rounded-full border-2 border-accent/20 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-accent hover:text-white transition-all active:scale-95"><RefreshCw className={cn("w-4 h-4", isCloudSyncing && "animate-spin")} /> {isCloudSyncing ? 'Manifesting...' : 'Push to Cloud'}</button>}
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 gap-10">
              {orders.length === 0 ? (
                <div className="bg-white p-32 rounded-[4rem] text-center border border-primary/5">
                  <ShoppingBag className="w-20 h-20 text-primary/5 mx-auto mb-10" />
                  <p className="font-serif italic text-3xl text-primary opacity-10">No manifestations recorded.</p>
                </div>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="bg-white p-12 rounded-[3rem] border border-primary/5 shadow-sm hover:shadow-2xl transition-all duration-700 relative overflow-hidden group">
                    <div className="flex flex-col xl:flex-row justify-between gap-16">
                      <div className="flex-1 space-y-10">
                        <div className="flex items-center justify-between">
                          <div className="editorial-label text-accent font-black tracking-[0.5em] text-xs">Folio #{order.id}</div>
                          <div className={cn("px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.3em] bg-primary/5", order.status === 'delivered' ? 'text-green-600 bg-green-50' : 'text-accent')}>
                            {order.status} {order.queuePosition !== undefined && `| QUEUE #${order.queuePosition + 1}`}
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
                            <h4 className="text-[9px] uppercase font-black text-primary/30 tracking-[0.4em]">Time Vector</h4>
                            <p className="font-sans font-black text-2xl text-primary">{new Date(order.createdAt).toLocaleTimeString()}</p>
                            <p className="text-[10px] font-black text-accent uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
                            {order.confirmedAt && <p className="text-[8px] font-bold text-green-500 uppercase tracking-widest mt-2 flex items-center gap-2"><CheckCircle2 className="w-3 h-3" /> Confirmed {new Date(order.confirmedAt).toLocaleTimeString()}</p>}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4 pt-10 border-t border-primary/5">
                          {order.items.map(item => (
                            <span key={item.id} className="bg-primary text-white px-6 py-4 rounded-[1.2rem] text-[11px] font-black uppercase tracking-widest">{item.quantity}x {item.name}</span>
                          ))}
                        </div>
                      </div>
                      <div className="xl:w-96 flex flex-col gap-4 justify-center xl:border-l border-primary/5 xl:pl-16">
                        {order.status === 'pending' && (
                          <button onClick={() => handleConfirmOrder(order)} className="w-full bg-green-600 text-white py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] shadow-xl shadow-green-600/20 active:scale-95 transition-all">Confirm & Queue</button>
                        )}
                        <button onClick={() => handleUpdateOrderStatus(order.id, 'preparing')} className="w-full bg-primary/5 py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-accent hover:text-white transition-all shadow-sm active:scale-95">Initiate Prep</button>
                        <button onClick={() => handleUpdateOrderStatus(order.id, 'on-the-way')} className="w-full bg-primary/5 py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95">Dispatch Rider</button>
                        <button onClick={() => handleUpdateOrderStatus(order.id, 'delivered')} className="w-full bg-primary/5 py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-green-600 hover:text-white transition-all shadow-sm active:scale-95">Confirm Arrival</button>
                        <div className="h-px bg-primary/5 my-4" />
                        <button onClick={() => handleNotifyCustomer(order)} className="w-full bg-accent text-white py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 shadow-2xl shadow-accent/30 hover:scale-[1.02] active:scale-95 transition-all"><MessageCircle className="w-5 h-5" /> Notify Patron</button>
                        {isAdmin && <button onClick={() => handleDeleteOrder(order.id)} className="w-full text-red-600/40 hover:text-red-600 py-3 text-[9px] font-black uppercase tracking-[0.2em] transition-all">Archive Folio</button>}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'patronage' && isAdmin && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-10 rounded-[2.5rem] border border-primary/5 shadow-sm">
                  <UserCheck className="w-10 h-10 text-accent mb-6" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 mb-2">Total Unique Patrons</p>
                  <h3 className="font-serif text-5xl italic text-primary">{patronageStats.length}</h3>
                </div>
                <div className="bg-white p-10 rounded-[2.5rem] border border-primary/5 shadow-sm">
                  <TrendingUp className="w-10 h-10 text-accent mb-6" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 mb-2">Heritage Revenue</p>
                  <h3 className="font-serif text-5xl italic text-primary">₦{patronageStats.reduce((sum, p) => sum + p.spent, 0).toLocaleString()}</h3>
                </div>
                <div className="bg-white p-10 rounded-[2.5rem] border border-primary/5 shadow-sm">
                  <Clock className="w-10 h-10 text-accent mb-6" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 mb-2">Avg Curations/Patron</p>
                  <h3 className="font-serif text-5xl italic text-primary">{(orders.length / (patronageStats.length || 1)).toFixed(1)}</h3>
                </div>
              </div>

              <div className="bg-white rounded-[3rem] border border-primary/5 shadow-sm overflow-hidden">
                <div className="p-10 border-b border-primary/5 flex justify-between items-center bg-cream/20">
                  <h2 className="font-serif text-3xl italic text-primary">Patron Recognition</h2>
                  <BarChart3 className="w-6 h-6 text-accent" />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-primary/5">
                        <th className="p-8 text-[10px] font-black uppercase tracking-[0.4em] text-primary/40">Patron Name</th>
                        <th className="p-8 text-[10px] font-black uppercase tracking-[0.4em] text-primary/40">Contact Vector</th>
                        <th className="p-8 text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 text-center">Manifestations</th>
                        <th className="p-8 text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 text-right">Lifetime Value</th>
                        <th className="p-8 text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 text-right">Last Curation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primary/5">
                      {patronageStats.map((patron, i) => (
                        <tr key={patron.phone} className="hover:bg-cream/10 transition-colors group">
                          <td className="p-8">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-serif italic text-lg">{patron.name.charAt(0)}</div>
                              <span className="font-serif italic text-xl text-primary">{patron.name}</span>
                            </div>
                          </td>
                          <td className="p-8 font-sans font-bold text-primary/60">{patron.phone}</td>
                          <td className="p-8 text-center"><span className="bg-primary/5 px-4 py-1.5 rounded-full text-[10px] font-black text-accent">{patron.count}</span></td>
                          <td className="p-8 text-right font-sans font-black text-primary">₦{patron.spent.toLocaleString()}</td>
                          <td className="p-8 text-right text-[10px] font-black text-primary/40 uppercase tracking-widest">{new Date(patron.lastOrder).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'menu' && isAdmin && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
              <div className="flex justify-between items-center bg-primary/5 p-8 rounded-[2.5rem] border border-primary/5">
                <input type="text" placeholder="Search Manifest..." value={menuSearch} onChange={e => setMenuSearch(e.target.value)} className="w-80 bg-white border border-primary/5 rounded-2xl pl-14 pr-6 py-4 text-[10px] font-black text-black uppercase tracking-widest focus:ring-2 focus:ring-accent/20 outline-none transition-all" />
                <button onClick={() => setEditingMenuItem({ name: '', price: 0, category: 'Rice Dishes', description: '', isTrending: false, image: '', available: true, tags: [], mealTime: ['Lunch', 'Dinner'] })} className="bg-primary text-white px-10 py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest flex items-center gap-4 shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all"><Plus className="w-5 h-5" /> Add New Item</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                {filteredMenu.map(item => (
                  <div key={item.id} className="bg-white rounded-[3rem] p-8 shadow-sm border border-primary/5 group relative hover:shadow-2xl transition-all duration-700">
                    <div className="aspect-square rounded-[2rem] overflow-hidden mb-8 shadow-inner bg-cream">
                      {item.image ? <img src={item.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" alt={item.name} /> : <div className="w-full h-full flex items-center justify-center text-primary/10"><ImageIcon className="w-16 h-16" /></div>}
                    </div>
                    <div className="space-y-6">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="font-serif text-3xl italic text-primary leading-tight">{item.name}</h3>
                        <p className="font-sans font-black text-accent text-xl">₦{item.price.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center justify-between pt-8 border-t border-primary/5">
                        <button onClick={() => setEditingMenuItem(item)} className="p-3 bg-primary/5 rounded-xl hover:bg-accent hover:text-white transition-all"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => deleteMenuItem(item.id)} className="p-3 bg-primary/5 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ENHANCED MODAL EDITOR: MENU ITEM */}
        <AnimatePresence>
          {editingMenuItem && isAdmin && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/95 backdrop-blur-2xl overflow-y-auto">
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="bg-white w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-2xl relative my-8">
                <button onClick={() => setEditingMenuItem(null)} className="absolute top-8 right-8 p-4 bg-primary/5 rounded-2xl hover:bg-accent hover:text-white transition-all z-10"><X className="w-6 h-6" /></button>
                
                <div className="flex flex-col lg:flex-row">
                  {/* Left Side: Image Upload & Preview */}
                  <div className="lg:w-2/5 bg-cream/30 p-12 flex flex-col items-center justify-center border-r border-primary/5">
                    <div className="w-full aspect-square rounded-[2.5rem] overflow-hidden bg-white shadow-inner mb-8 group relative">
                      {editingMenuItem.image ? (
                        <img src={editingMenuItem.image} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-primary/20 gap-4">
                          <ImageIcon className="w-16 h-16" />
                          <p className="text-[10px] font-black uppercase tracking-widest">No Image Manifested</p>
                        </div>
                      )}
                      <label className="absolute inset-0 bg-primary/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer">
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        <div className="flex flex-col items-center gap-3 text-white">
                          <Upload className="w-8 h-8" />
                          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Upload Vision</span>
                        </div>
                      </label>
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/30 text-center leading-relaxed">Recommended: 1024x1024px<br/>PNG or JPG (Max 2MB)</p>
                  </div>

                  {/* Right Side: Form Fields */}
                  <div className="flex-1 p-12 lg:p-16 space-y-10">
                    <header className="space-y-2">
                      <div className="editorial-label text-accent font-black tracking-[0.4em] text-[9px]">Inventory Management</div>
                      <h2 className="font-serif text-4xl italic text-primary">Curation Manuscript</h2>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-widest text-primary/40 ml-4">Dish Title</label>
                        <input type="text" value={editingMenuItem.name} onChange={e => setEditingMenuItem({ ...editingMenuItem, name: e.target.value })} className="w-full bg-primary/5 border-none rounded-2xl px-6 py-5 font-sans font-bold text-primary focus:ring-2 focus:ring-accent/50 outline-none transition-all" placeholder="e.g. Smoky Jollof Heritage" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-widest text-primary/40 ml-4">Price (NGN)</label>
                        <input type="number" value={editingMenuItem.price} onChange={e => setEditingMenuItem({ ...editingMenuItem, price: parseInt(e.target.value) || 0 })} className="w-full bg-primary/5 border-none rounded-2xl px-6 py-5 font-sans font-black text-primary focus:ring-2 focus:ring-accent/50 outline-none transition-all" placeholder="0" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-widest text-primary/40 ml-4">Category Selection</label>
                      <select value={editingMenuItem.category} onChange={e => setEditingMenuItem({ ...editingMenuItem, category: e.target.value as MenuCategory })} className="w-full bg-primary/5 border-none rounded-2xl px-6 py-5 font-sans font-bold text-primary focus:ring-2 focus:ring-accent/50 outline-none transition-all appearance-none cursor-pointer">
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-widest text-primary/40 ml-4">Flavor Narrative (Description)</label>
                      <textarea value={editingMenuItem.description} onChange={e => setEditingMenuItem({ ...editingMenuItem, description: e.target.value })} className="w-full bg-primary/5 border-none rounded-2xl px-6 py-5 font-sans text-sm text-primary/70 focus:ring-2 focus:ring-accent/50 outline-none transition-all h-32 resize-none" placeholder="Describe the ancestral essence of this dish..." />
                    </div>

                    <div className="grid grid-cols-2 gap-8 pt-4">
                      <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setEditingMenuItem({ ...editingMenuItem, isTrending: !editingMenuItem.isTrending })}>
                        <div className={cn("w-14 h-8 rounded-full transition-all flex items-center px-1", editingMenuItem.isTrending ? "bg-accent" : "bg-primary/10")}>
                          <motion.div animate={{ x: editingMenuItem.isTrending ? 24 : 0 }} className="w-6 h-6 bg-white rounded-full shadow-lg" />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-primary/60 group-hover:text-accent transition-colors">Trending Hot Pick</span>
                      </div>
                      <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setEditingMenuItem({ ...editingMenuItem, available: editingMenuItem.available === false ? true : false })}>
                        <div className={cn("w-14 h-8 rounded-full transition-all flex items-center px-1", editingMenuItem.available !== false ? "bg-green-500" : "bg-primary/10")}>
                          <motion.div animate={{ x: editingMenuItem.available !== false ? 24 : 0 }} className="w-6 h-6 bg-white rounded-full shadow-lg" />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-primary/60 group-hover:text-green-500 transition-colors">Active Availability</span>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-8">
                      <button onClick={handleSaveMenuItem} className="flex-1 bg-primary text-white py-6 rounded-2xl font-black uppercase tracking-[0.4em] text-[11px] hover:bg-accent transition-all flex items-center justify-center gap-4 shadow-2xl shadow-primary/20 active:scale-95"><Save className="w-5 h-5" /> Manifest Changes</button>
                      <button onClick={() => setEditingMenuItem(null)} className="px-10 bg-primary/5 text-primary/40 py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-red-50 hover:text-red-500 transition-all active:scale-95">Discard</button>
                    </div>
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
