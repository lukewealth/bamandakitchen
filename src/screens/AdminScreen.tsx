/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { 
  Lock, LogOut, ShoppingBag, Utensils, BookOpen, X, Star, Edit, Trash2, Plus, 
  CheckCircle2, Clock, Truck, Image as ImageIcon, Layout, Save, AlertCircle, MessageCircle,
  Menu as MenuIcon, Users, ChevronLeft, ChevronRight, Loader2, RefreshCw, Download
} from 'lucide-react';
import { MenuItem, Order, BlogPost, OrderStatus, BlogLayout, MenuCategory, StaffAccount } from '../types';
import { MENU_ITEMS } from '../data';
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
  const { showToast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'blog' | 'staff'>('orders');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isTabLoading, setIsTabLoading] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>(() => {
    const cached = localStorage.getItem('bamanda_menu_cache');
    try { return cached ? JSON.parse(cached) : MENU_ITEMS; } catch { return MENU_ITEMS; }
  });
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [staff, setStaff] = useState<StaffAccount[]>([]);

  // Editing states
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [editingMenuItem, setEditingMenuItem] = useState<Partial<MenuItem> | null>(null);
  const [editingStaff, setEditingStaff] = useState<Partial<StaffAccount> | null>(null);

  // Firestore Real-time Subscriptions
  useEffect(() => {
    if (!isAuthenticated || !db) {
      if (isAuthenticated && !db) {
        showToast('Cloud database unavailable. Using local view.', 'warning');
      }
      return;
    }

    try {
      const unsubMenu = onSnapshot(query(collection(db, 'menu'), orderBy('name')), (snapshot) => {
        const items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as MenuItem));
        if (items.length > 0) {
          setMenu(items);
          localStorage.setItem('bamanda_menu_cache', JSON.stringify(items));
        }
      }, (err) => {
        console.error('Admin menu subscription failed:', err);
      });

      const unsubOrders = onSnapshot(query(collection(db, 'orders'), orderBy('createdAt', 'desc')), (snapshot) => {
        const items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Order));
        setOrders(items);
      }, (err) => {
        console.error('Admin orders subscription failed:', err);
      });

      const unsubBlog = onSnapshot(query(collection(db, 'blog'), orderBy('date', 'desc')), (snapshot) => {
        const items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as BlogPost));
        setPosts(items);
        localStorage.setItem('bamanda_blog_cache', JSON.stringify(items));
      }, (err) => {
        console.error('Admin blog subscription failed:', err);
      });

      const unsubStaff = onSnapshot(query(collection(db, 'staff'), orderBy('name')), (snapshot) => {
        setStaff(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as StaffAccount)));
      }, (err) => {
        console.error('Admin staff subscription failed:', err);
      });

      return () => {
        unsubMenu();
        unsubOrders();
        unsubBlog();
        unsubStaff();
      };
    } catch (err) {
      console.error('Admin Firebase subscriptions failed:', err);
    }
  }, [isAuthenticated]);

  // Sidebar Auto-collapse Logic
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!isSidebarCollapsed && !isMobileMenuOpen && isAuthenticated) {
      timeout = setTimeout(() => setIsSidebarCollapsed(true), 15000);
    }
    return () => clearTimeout(timeout);
  }, [isSidebarCollapsed, activeTab, isMobileMenuOpen, isAuthenticated]);

  const handleTabChange = (tab: any) => {
    setIsTabLoading(true);
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    setTimeout(() => setIsTabLoading(false), 400);
  };

  const handleMigration = async () => {
    if (!db) {
      showToast('Sanctuary cloud connection is offline. Seed aborted.', 'error');
      return;
    }

    if (!window.confirm('This will seed the cloud database with current local menu items. Continue?')) return;
    setIsMigrating(true);
    try {
      const batch = writeBatch(db);
      menu.forEach(item => {
        const docRef = doc(db, 'menu', item.id);
        batch.set(docRef, { ...item, updatedAt: serverTimestamp() });
      });
      await batch.commit();
      showToast('Sanctuary inventory successfully migrated to the cloud.', 'success');
    } catch (error) {
      console.error('Migration failed:', error);
      showToast('Migration encountered a spiritual blockage.', 'error');
    } finally {
      setIsMigrating(false);
    }
  };

  const restoreFromStatic = () => {
    if (window.confirm('Restore menu items from static heritage data? Current changes will be overwritten.')) {
      setMenu(MENU_ITEMS);
      localStorage.setItem('bamanda_menu_cache', JSON.stringify(MENU_ITEMS));
      showToast('Restored from ancestral records.', 'info');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === (import.meta.env.VITE_ADMIN_EMAIL || 'admin@bamanda.com') && 
        password === (import.meta.env.VITE_ADMIN_PASSWORD || 'heritage2026')) {
      setIsAuthenticated(true);
      showToast('Welcome back, Curator.', 'success');
    } else {
      showToast('The sanctuary remains closed. Invalid credentials.', 'error');
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    if (db) {
      try {
        await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
        showToast(`Order status updated to ${newStatus}.`, 'success');
      } catch (err) {
        console.error('Failed to update cloud order:', err);
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        showToast('Local status updated (Cloud sync failed).', 'warning');
      }
    } else {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      showToast(`Local record updated to ${newStatus}.`, 'success');
    }
  };

  const handleNotifyCustomer = (order: Order) => {
    const message = formatStatusUpdateMessage(order);
    const url = getWhatsAppUrl(message, order.customer.phone);
    window.open(url, '_blank');
  };

  const deleteOrder = async (orderId: string) => {
    if (window.confirm('Are you sure you want to remove this curation from history?')) {
      if (db) {
        try {
          await deleteDoc(doc(db, 'orders', orderId));
          showToast('Curation archived from cloud records.', 'info');
        } catch (err) {
          console.error('Cloud delete failed:', err);
          setOrders(prev => prev.filter(o => o.id !== orderId));
          showToast('Curation archived from local view.', 'info');
        }
      } else {
        setOrders(prev => prev.filter(o => o.id !== orderId));
        showToast('Curation archived from records.', 'info');
      }
    }
  };

  // Blog Actions
  const handleSavePost = async () => {
    if (!editingPost?.title || !editingPost?.content) return;

    if (db) {
      try {
        const postData = {
          ...editingPost,
          updatedAt: serverTimestamp(),
          date: editingPost.date || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          author: editingPost.author || 'Heritage Curator'
        };

        if (editingPost.id) {
          await updateDoc(doc(db, 'blog', editingPost.id), postData);
          showToast('Article manifestation updated in cloud.', 'success');
        } else {
          await addDoc(collection(db, 'blog'), postData);
          showToast('New article manifested in the Gazette cloud.', 'success');
        }
      } catch (err) {
        console.error('Cloud blog save failed:', err);
        showToast('Cloud sync failed. Manifestation remains local.', 'warning');
      }
    } else {
      if (editingPost.id) {
        setPosts(prev => prev.map(p => p.id === editingPost.id ? (editingPost as BlogPost) : p));
        showToast('Article manifestation updated locally.', 'success');
      } else {
        const newPost: BlogPost = {
          ...editingPost,
          id: Date.now().toString(),
          date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          author: 'Heritage Curator',
        } as BlogPost;
        setPosts(prev => [newPost, ...prev]);
        showToast('New article manifested in the Gazette.', 'success');
      }
    }
    setEditingPost(null);
  };

  const handleDeletePost = async (id: string) => {
    if (window.confirm('Delete this article?')) {
      if (db) {
        try {
          await deleteDoc(doc(db, 'blog', id));
          showToast('Article archived from cloud.', 'info');
        } catch (err) {
          console.error('Cloud blog delete failed:', err);
          setPosts(prev => prev.filter(p => p.id !== id));
          showToast('Article archived from local view.', 'info');
        }
      } else {
        setPosts(prev => prev.filter(p => p.id !== id));
        showToast('Article archived from the Gazette.', 'info');
      }
    }
  };

  // Menu Actions
  const handleSaveMenuItem = async () => {
    if (!editingMenuItem?.name || !editingMenuItem?.price) return;

    if (db) {
      try {
        const itemData = {
          ...editingMenuItem,
          updatedAt: serverTimestamp()
        };

        if (editingMenuItem.id) {
          await updateDoc(doc(db, 'menu', editingMenuItem.id), itemData);
          showToast('Inventory curation updated in cloud.', 'success');
        } else {
          await addDoc(collection(db, 'menu'), itemData);
          showToast('New dish added to cloud inventory.', 'success');
        }
      } catch (err) {
        console.error('Cloud menu save failed:', err);
        showToast('Cloud sync failed. Record remains local.', 'warning');
      }
    } else {
      if (editingMenuItem.id) {
        setMenu(prev => {
          const updated = prev.map(item => item.id === editingMenuItem.id ? (editingMenuItem as MenuItem) : item);
          localStorage.setItem('bamanda_menu_cache', JSON.stringify(updated));
          return updated;
        });
        showToast('Inventory curation updated locally.', 'success');
      } else {
        const newItem: MenuItem = {
          ...editingMenuItem,
          id: 'item-' + Date.now(),
          mealTime: ['Lunch', 'Dinner'],
          available: true,
          tags: [],
        } as MenuItem;
        setMenu(prev => {
          const updated = [newItem, ...prev];
          localStorage.setItem('bamanda_menu_cache', JSON.stringify(updated));
          return updated;
        });
        showToast('New dish added to the sanctuary inventory.', 'success');
      }
    }
    setEditingMenuItem(null);
  };

  const handleSaveStaff = async () => {
    if (!editingStaff?.name || !editingStaff?.email) return;

    if (db) {
      try {
        const staffData = {
          ...editingStaff,
          updatedAt: serverTimestamp()
        };

        if (editingStaff.id) {
          await updateDoc(doc(db, 'staff', editingStaff.id), staffData);
          showToast('Staff credentials updated in cloud.', 'success');
        } else {
          await addDoc(collection(db, 'staff'), {
            ...staffData,
            createdAt: new Date().toISOString()
          });
          showToast('New staff member added to cloud team.', 'success');
        }
      } catch (err) {
        console.error('Cloud staff save failed:', err);
        showToast('Cloud sync failed. Record remains local.', 'warning');
      }
    } else {
      if (editingStaff.id) {
        setStaff(prev => prev.map(s => s.id === editingStaff.id ? (editingStaff as StaffAccount) : s));
        showToast('Staff credentials updated locally.', 'success');
      } else {
        const newStaff: StaffAccount = {
          ...editingStaff,
          id: 'staff-' + Date.now(),
          createdAt: new Date().toISOString(),
        } as StaffAccount;
        setStaff(prev => [newStaff, ...prev]);
        showToast('New staff member added to the curation team.', 'success');
      }
    }
    setEditingStaff(null);
  };

  const deleteStaff = async (id: string) => {
    if (window.confirm('Remove this staff member from the sanctuary records?')) {
      if (db) {
        try {
          await deleteDoc(doc(db, 'staff', id));
          showToast('Staff records archived from cloud.', 'info');
        } catch (err) {
          console.error('Cloud staff delete failed:', err);
          setStaff(prev => prev.filter(s => s.id !== id));
          showToast('Staff archived from local view.', 'info');
        }
      } else {
        setStaff(prev => prev.filter(s => s.id !== id));
        showToast('Staff records archived.', 'info');
      }
    }
  };

  const toggleTrending = async (id: string) => {
    const item = menu.find(m => m.id === id);
    if (!item) return;
    
    const nextState = !item.isTrending;
    
    if (db) {
      try {
        await updateDoc(doc(db, 'menu', id), { isTrending: nextState });
      } catch (err) {
        console.error('Cloud trending toggle failed:', err);
        setMenu(prev => prev.map(m => m.id === id ? { ...m, isTrending: nextState } : m));
      }
    } else {
      setMenu(prev => {
        const updated = prev.map(m => m.id === id ? { ...m, isTrending: nextState } : m);
        localStorage.setItem('bamanda_menu_cache', JSON.stringify(updated));
        return updated;
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary p-6 text-white text-center">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl text-primary">
          <Lock className="w-10 h-10 mx-auto mb-6 text-accent" />
          <h1 className="font-serif text-3xl italic mb-10 text-primary">Curator Access</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-primary/5 border-none rounded-xl px-4 py-3" placeholder="Email" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-primary/5 border-none rounded-xl px-4 py-3" placeholder="Password" />
            <button type="submit" className="w-full bg-accent text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs">Enter Sanctuary</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col lg:flex-row">
      <aside className={cn(
        "bg-primary text-white transition-all duration-500 z-[60] shadow-xl relative group flex flex-col",
        isMobileMenuOpen ? "fixed inset-0 w-full h-screen" : (isSidebarCollapsed ? "w-0 lg:w-24 overflow-hidden" : "w-full lg:w-72"),
        isSidebarCollapsed && "lg:hover:w-72"
      )}>
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="hidden lg:flex absolute -right-4 top-10 w-8 h-8 bg-accent text-white rounded-full items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-all z-10"
        >
          {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>

        <div className="flex flex-col h-full p-6 lg:p-8 space-y-8">
          <div className="flex items-center justify-between lg:justify-start gap-4">
            <h2 className={cn("font-serif italic text-2xl text-accent transition-all duration-500", isSidebarCollapsed && "lg:opacity-0")}>
              Bamanda
            </h2>
            <div className="lg:hidden">
               <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-3 bg-white/5 rounded-xl border border-white/10 text-white active:scale-95 transition-all"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className={cn(
            "flex-1 flex flex-col gap-3",
            !isMobileMenuOpen && isSidebarCollapsed && "lg:items-center"
          )}>
            {[
              { id: 'orders', label: 'Orders', icon: ShoppingBag },
              { id: 'menu', label: 'Menu DB', icon: Utensils },
              { id: 'blog', label: 'Gazette', icon: BookOpen },
              { id: 'staff', label: 'Staff', icon: Users },
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => handleTabChange(tab.id as any)} 
                className={cn(
                  "flex items-center gap-4 p-4 rounded-2xl transition-all relative overflow-hidden group",
                  activeTab === tab.id ? 'bg-white text-primary shadow-xl' : 'bg-white/5 opacity-60 hover:opacity-100 border border-white/5',
                  isSidebarCollapsed && !isMobileMenuOpen && "lg:p-4 lg:justify-center"
                )}
                title={tab.label}
              >
                <tab.icon className={cn("w-5 h-5 shrink-0", activeTab === tab.id ? "text-accent" : "text-white")} /> 
                <span className={cn(
                  "text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300",
                  isSidebarCollapsed && !isMobileMenuOpen && "lg:hidden"
                )}>
                  {tab.label}
                </span>
                {activeTab === tab.id && <div className="absolute right-0 top-0 bottom-0 w-1 bg-accent" />}
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => setIsAuthenticated(false)} 
            className={cn(
              "flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-accent hover:border-accent transition-all",
              isSidebarCollapsed && !isMobileMenuOpen && "lg:justify-center"
            )}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-widest",
              isSidebarCollapsed && !isMobileMenuOpen && "lg:hidden"
            )}>Sign Out</span>
          </button>
        </div>
      </aside>
      
      <main className="flex-1 p-6 lg:p-12 overflow-x-hidden">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 lg:mb-16">
          <h1 className="font-serif text-3xl lg:text-5xl text-primary capitalize italic">{activeTab} Curation</h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleMigration}
              disabled={isMigrating}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 text-[10px] font-black uppercase tracking-widest transition-all",
                isMigrating ? "opacity-50 cursor-not-allowed" : "hover:bg-accent hover:text-white"
              )}
              title="Push current local menu to cloud"
            >
              <RefreshCw className={cn("w-3 h-3", isMigrating && "animate-spin")} />
              {isMigrating ? 'Syncing...' : 'Push to Cloud'}
            </button>
            <div className="bg-white px-4 py-2 rounded-full border border-primary/10 flex items-center gap-2 shadow-sm">
              <div className={cn("w-2 h-2 rounded-full animate-pulse", db ? "bg-green-500" : "bg-red-500")} />
              <span className="text-[10px] uppercase tracking-widest font-bold text-primary opacity-60">
                {db ? "System Online" : "System Degraded"}
              </span>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {isTabLoading ? (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-[60vh] flex flex-col items-center justify-center space-y-4"
            >
              <Loader2 className="w-12 h-12 text-accent animate-spin" />
              <p className="font-serif italic text-primary/40 uppercase tracking-widest text-xs">Accessing Records...</p>
            </motion.div>
          ) : (
            <>
              {activeTab === 'orders' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 gap-6 lg:gap-8"
            >
              {orders.length === 0 ? (
                <div className="bg-white p-12 lg:p-20 rounded-3xl border border-primary/5 flex flex-col items-center justify-center text-center">
                  <ShoppingBag className="w-12 h-12 text-primary/10 mb-6" />
                  <p className="font-serif italic text-xl lg:text-2xl text-primary opacity-20">No active curations recorded.</p>
                </div>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="bg-white p-6 lg:p-8 rounded-3xl shadow-sm hover:shadow-xl border border-primary/5 hover:border-accent/20 transition-all duration-500 overflow-hidden group">
                    <div className="flex flex-col xl:flex-row justify-between gap-8">
                      <div className="flex-1 space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="editorial-label text-accent text-[10px] font-black group-hover:scale-110 transition-transform origin-left">Order #{order.id}</div>
                          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'on-the-way' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'preparing' ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-200 text-gray-800'
                          }`}>
                            {order.status}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                          <div>
                            <h4 className="text-[10px] uppercase font-black text-primary/60 mb-2 tracking-[0.2em]">Patron</h4>
                            <p className="font-serif italic text-2xl leading-tight text-primary">{order.customer.name}</p>
                            <p className="text-sm font-medium text-primary/80 mt-1">{order.customer.phone}</p>
                            <p className="text-sm text-primary/70">{order.customer.address}</p>
                          </div>
                          <div>
                            <h4 className="text-[10px] uppercase font-black text-primary/60 mb-2 tracking-[0.2em]">Financials</h4>
                            <p className="font-sans font-black text-2xl text-primary">₦{order.total.toLocaleString()}</p>
                            <p className="text-[11px] text-primary/70 mt-1 font-bold uppercase tracking-widest">{new Date(order.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                        {order.notes && (
                          <div className="bg-primary/5 p-5 rounded-2xl text-sm italic text-primary/80 border-l-4 border-accent">
                            " {order.notes} "
                          </div>
                        )}
                        <div className="flex flex-wrap gap-3 pt-6 border-t border-primary/10">
                          {order.items.map(item => (
                            <span key={item.id} className="bg-primary text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">
                              {item.quantity}x {item.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="xl:w-72 space-y-4 xl:border-l border-primary/10 xl:pl-8 flex flex-col justify-center">
                        <div className="grid grid-cols-2 xl:grid-cols-1 gap-3">
                          <button onClick={() => updateOrderStatus(order.id, 'preparing')} className="w-full bg-primary/5 hover:bg-orange-600 hover:text-white text-[10px] font-black py-4 rounded-xl transition-all tracking-widest uppercase border border-primary/5 hover:border-orange-600 shadow-sm active:scale-95">PREPARE</button>
                          <button onClick={() => updateOrderStatus(order.id, 'on-the-way')} className="w-full bg-primary/5 hover:bg-blue-600 hover:text-white text-[10px] font-black py-4 rounded-xl transition-all tracking-widest uppercase border border-primary/5 hover:border-blue-600 shadow-sm active:scale-95">SHIP</button>
                        </div>
                        <button onClick={() => updateOrderStatus(order.id, 'delivered')} className="w-full bg-primary/5 hover:bg-green-600 hover:text-white text-[10px] font-black py-4 rounded-xl transition-all tracking-widest uppercase border border-primary/5 hover:border-green-600 shadow-sm active:scale-95">DELIVER</button>
                        <button 
                          onClick={() => handleNotifyCustomer(order)}
                          className="w-full bg-accent text-white hover:bg-primary text-[10px] font-black py-4 rounded-xl transition-all flex items-center justify-center gap-3 tracking-widest uppercase shadow-lg shadow-accent/20 hover:shadow-primary/20 active:scale-95"
                        >
                          <MessageCircle className="w-5 h-5" /> NOTIFY PATRON
                        </button>
                        <button onClick={() => deleteOrder(order.id)} className="w-full text-red-600 hover:text-white hover:bg-red-600 text-[10px] font-black py-4 rounded-xl transition-all tracking-widest uppercase border border-transparent hover:border-red-600 active:scale-95">ARCHIVE RECORD</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'menu' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <h2 className="editorial-label text-accent">Active Inventory</h2>
                  <button onClick={restoreFromStatic} className="p-2 text-primary/20 hover:text-accent transition-colors" title="Restore from Static Heritage Records">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
                <button 
                  onClick={() => setEditingMenuItem({ name: '', price: 0, category: 'Rice Dishes', description: '', isTrending: false, image: '' })}
                  className="bg-accent text-white px-8 py-4 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-accent/20"
                >
                  <Plus className="w-4 h-4" /> Add New Item
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {menu.map(item => (
                  <div key={item.id} className="bg-white rounded-3xl p-6 shadow-sm border border-primary/5 group relative">
                    <div className="aspect-square rounded-2xl overflow-hidden mb-6 shadow-inner">
                      <img src={item.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={item.name} />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-serif text-xl italic">{item.name}</h3>
                        <p className="font-sans font-bold text-accent">₦{item.price.toLocaleString()}</p>
                      </div>
                      <p className="text-xs text-primary/40 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-primary/5">
                        <button 
                          onClick={() => toggleTrending(item.id)}
                          className={`flex items-center gap-2 text-[10px] font-bold uppercase transition-colors ${item.isTrending ? 'text-orange-500' : 'text-primary/20'}`}
                        >
                          <Star className={`w-3 h-3 ${item.isTrending ? 'fill-current' : ''}`} /> {item.isTrending ? 'Trending' : 'Boost'}
                        </button>
                        <div className="flex gap-4">
                          <button onClick={() => setEditingMenuItem(item)} className="text-primary/40 hover:text-accent"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => setMenu(prev => {
                            const updated = prev.filter(m => m.id !== item.id);
                            localStorage.setItem('bamanda_menu_cache', JSON.stringify(updated));
                            return updated;
                          })} className="text-primary/40 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'blog' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <h2 className="editorial-label text-accent">Gazette Publications</h2>
                <button 
                  onClick={() => setEditingPost({ title: '', content: '', topic: '', category: 'Heritage', layout: 'editorial', image: '' })}
                  className="bg-accent text-white px-8 py-4 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-accent/20"
                >
                  <Plus className="w-4 h-4" /> Compose Article
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {posts.map(post => (
                  <div key={post.id} className="bg-white p-8 rounded-3xl border border-primary/5 flex gap-8 items-center group shadow-sm hover:shadow-md transition-all">
                    <div className="w-32 h-32 rounded-2xl overflow-hidden shrink-0">
                      <img src={post.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" alt={post.title} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div className="editorial-label text-[8px] text-accent">{post.category}</div>
                        <div className="flex gap-3">
                          <button onClick={() => setEditingPost(post)} className="text-primary/20 hover:text-accent transition-colors"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDeletePost(post.id)} className="text-primary/20 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <h3 className="font-serif text-2xl italic text-primary leading-tight mb-2">{post.title}</h3>
                      <p className="text-[10px] uppercase tracking-widest font-bold opacity-30">{post.layout} Layout • {post.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'staff' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <h2 className="editorial-label text-accent">Internal Curation Team</h2>
                <button 
                  onClick={() => setEditingStaff({ name: '', email: '', role: 'staff' })}
                  className="bg-accent text-white px-8 py-4 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-accent/20"
                >
                  <Plus className="w-4 h-4" /> Add Team Member
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {staff.map(member => (
                  <div key={member.id} className="bg-white rounded-3xl p-8 shadow-sm border border-primary/5 hover:border-accent/20 transition-all group">
                    <div className="flex items-center gap-6 mb-6">
                      <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-white transition-all">
                        <Users className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="font-serif text-xl italic">{member.name}</h3>
                        <div className="px-3 py-1 bg-primary/5 text-primary rounded-full text-[8px] font-black uppercase tracking-widest mt-1 inline-block">
                          {member.role}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4 pt-6 border-t border-primary/5">
                      <div>
                        <div className="text-[9px] font-black uppercase tracking-widest text-primary/40 mb-1">Email Access</div>
                        <div className="text-xs font-medium text-primary/80">{member.email}</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-black uppercase tracking-widest text-primary/40 mb-1">Enlisted On</div>
                        <div className="text-xs font-medium text-primary/80">{new Date(member.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className="flex gap-4 pt-4">
                        <button onClick={() => setEditingStaff(member)} className="flex-1 bg-primary/5 hover:bg-accent hover:text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Update</button>
                        <button onClick={() => deleteStaff(member.id)} className="p-3 text-primary/20 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          </>
        )}
        </AnimatePresence>

        <AnimatePresence>
          {editingPost && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary/90 backdrop-blur-md">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                <div className="p-8 border-b border-primary/5 flex justify-between items-center">
                  <h2 className="font-serif text-2xl italic">Compose Editorial</h2>
                  <button onClick={() => setEditingPost(null)}><X className="w-6 h-6 text-primary/40" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-10 space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-accent">Article Title</label>
                      <input type="text" value={editingPost.title} onChange={e => setEditingPost({ ...editingPost, title: e.target.value })} className="w-full bg-primary/5 border-none rounded-xl p-4 font-serif text-lg" placeholder="The Alchemy of Smoke..." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-accent">Design Layout Template</label>
                      <select value={editingPost.layout} onChange={e => setEditingPost({ ...editingPost, layout: e.target.value as BlogLayout })} className="w-full bg-primary/5 border-none rounded-xl p-4 font-sans text-sm font-bold appearance-none">
                        <option value="editorial">Modern Editorial</option>
                        <option value="minimal">Minimalist Archive</option>
                        <option value="narrative">Personal Narrative</option>
                        <option value="journal">Journal Entry</option>
                        <option value="luxury">Luxury Curation</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-accent">Feature Image URL</label>
                      <div className="flex gap-4">
                        <input type="text" value={editingPost.image} onChange={e => setEditingPost({ ...editingPost, image: e.target.value })} className="flex-1 bg-primary/5 border-none rounded-xl p-4 font-sans text-xs" placeholder="https://images.unsplash.com/..." />
                        <div className="w-14 h-14 bg-primary/5 rounded-xl flex items-center justify-center overflow-hidden">
                          {editingPost.image ? <img src={editingPost.image} className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 opacity-10" />}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-accent">Topic & Category</label>
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Rituals" value={editingPost.topic} onChange={e => setEditingPost({ ...editingPost, topic: e.target.value })} className="w-full bg-primary/5 border-none rounded-xl p-4 font-sans text-xs font-bold" />
                        <select value={editingPost.category} onChange={e => setEditingPost({ ...editingPost, category: e.target.value })} className="w-full bg-primary/5 border-none rounded-xl p-4 font-sans text-xs font-bold">
                          <option value="Heritage">Heritage</option>
                          <option value="Innovation">Innovation</option>
                          <option value="Rituals">Rituals</option>
                          <option value="Sustainability">Sustainability</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-accent">Article Content (Markdown Supported)</label>
                    <textarea rows={12} value={editingPost.content} onChange={e => setEditingPost({ ...editingPost, content: e.target.value })} className="w-full bg-primary/5 border-none rounded-xl p-6 font-serif text-base leading-relaxed" placeholder="Manifest your story here..." />
                  </div>
                </div>
                <div className="p-8 bg-cream flex justify-end gap-6">
                  <button onClick={() => setEditingPost(null)} className="text-[10px] font-bold uppercase tracking-widest opacity-40">Cancel</button>
                  <button onClick={handleSavePost} className="bg-primary text-white px-12 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                    <Save className="w-4 h-4" /> Save Publication
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {editingMenuItem && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary/90 backdrop-blur-md">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col">
                <div className="p-8 border-b border-primary/5 flex justify-between items-center">
                  <h2 className="font-serif text-2xl italic">Modify Inventory</h2>
                  <button onClick={() => setEditingMenuItem(null)}><X className="w-6 h-6 text-primary/40" /></button>
                </div>
                <div className="p-10 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-accent">Dish Name</label>
                      <input type="text" value={editingMenuItem.name} onChange={e => setEditingMenuItem({ ...editingMenuItem, name: e.target.value })} className="w-full bg-primary/5 border-none rounded-xl p-4 font-serif text-lg" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-accent">Price (₦)</label>
                      <input type="number" value={editingMenuItem.price} onChange={e => setEditingMenuItem({ ...editingMenuItem, price: parseInt(e.target.value) })} className="w-full bg-primary/5 border-none rounded-xl p-4 font-sans font-bold" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-accent">Category</label>
                    <select value={editingMenuItem.category} onChange={e => setEditingMenuItem({ ...editingMenuItem, category: e.target.value as MenuCategory })} className="w-full bg-primary/5 border-none rounded-xl p-4 font-sans font-bold appearance-none">
                      <option value="Rice Dishes">Rice Dishes</option>
                      <option value="Proteins">Proteins</option>
                      <option value="Pasta & Noodles">Pasta & Noodles</option>
                      <option value="Snacks">Snacks</option>
                      <option value="African Dishes">African Dishes</option>
                      <option value="Drinks">Drinks</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-accent">Inventory Description</label>
                    <textarea rows={4} value={editingMenuItem.description} onChange={e => setEditingMenuItem({ ...editingMenuItem, description: e.target.value })} className="w-full bg-primary/5 border-none rounded-xl p-4 font-sans text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-accent">Image Asset URL</label>
                    <input type="text" value={editingMenuItem.image} onChange={e => setEditingMenuItem({ ...editingMenuItem, image: e.target.value })} className="w-full bg-primary/5 border-none rounded-xl p-4 font-sans text-xs" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-accent">WhatsApp Catalog Link</label>
                    <input type="text" placeholder="https://wa.me/p/..." value={editingMenuItem.whatsappLink || ''} onChange={e => setEditingMenuItem({ ...editingMenuItem, whatsappLink: e.target.value })} className="w-full bg-primary/5 border-none rounded-xl p-4 font-sans text-xs" />
                  </div>
                </div>
                <div className="p-8 bg-cream flex justify-end gap-6">
                <button onClick={() => setEditingMenuItem(null)} className="text-[10px] font-bold uppercase tracking-widest opacity-40">Cancel</button>
                <button onClick={handleSaveMenuItem} className="bg-primary text-white px-12 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                  <Save className="w-4 h-4" /> Commit Changes
                </button>
                </div>
              </motion.div>
            </div>
          )}

          {editingStaff && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary/90 backdrop-blur-md">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl flex flex-col">
                <div className="p-8 border-b border-primary/5 flex justify-between items-center">
                  <h2 className="font-serif text-2xl italic">Staff Credentials</h2>
                  <button onClick={() => setEditingStaff(null)}><X className="w-6 h-6 text-primary/40" /></button>
                </div>
                <div className="p-10 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-accent">Full Name</label>
                    <input type="text" value={editingStaff.name} onChange={e => setEditingStaff({ ...editingStaff, name: e.target.value })} className="w-full bg-primary/5 border-none rounded-xl p-4 font-serif text-lg" placeholder="e.g. Ebuka Okoro" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-accent">Email Address</label>
                    <input type="email" value={editingStaff.email} onChange={e => setEditingStaff({ ...editingStaff, email: e.target.value })} className="w-full bg-primary/5 border-none rounded-xl p-4 font-sans font-bold" placeholder="staff@bamanda.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-accent">Organizational Role</label>
                    <select value={editingStaff.role} onChange={e => setEditingStaff({ ...editingStaff, role: e.target.value as any })} className="w-full bg-primary/5 border-none rounded-xl p-4 font-sans font-bold appearance-none">
                      <option value="admin">Administrator</option>
                      <option value="staff">Floor Staff</option>
                      <option value="rider">Dispatch Rider</option>
                    </select>
                  </div>
                </div>
                <div className="p-8 bg-cream flex justify-end gap-6">
                  <button onClick={() => setEditingStaff(null)} className="text-[10px] font-bold uppercase tracking-widest opacity-40">Cancel</button>
                  <button onClick={handleSaveStaff} className="bg-primary text-white px-12 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                    <Save className="w-4 h-4" /> Enlist Member
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
