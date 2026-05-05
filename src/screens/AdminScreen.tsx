/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/// <reference types="vite/client" />
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, LayoutDashboard, Utensils, BookOpen, ShoppingBag, LogOut, Save, Plus, Trash2, Edit, CheckCircle2, XCircle, Truck, ChefHat, Phone } from 'lucide-react';
import { MenuItem, Order, BlogPost, OrderStatus } from '../types';
import { MENU_ITEMS as initialMenu } from '../data';

export default function AdminScreen() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'blog'>('orders');

  // State for managed data
  const [orders, setOrders] = useState<Order[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);

  // Load data from localStorage or initial data
  useEffect(() => {
    const savedOrders = localStorage.getItem('bamanda_orders');
    const savedMenu = localStorage.getItem('bamanda_menu');
    const savedPosts = localStorage.getItem('bamanda_posts');

    if (savedOrders) setOrders(JSON.parse(savedOrders));
    if (savedMenu) setMenu(JSON.parse(savedMenu));
    else setMenu(initialMenu);
    if (savedPosts) setPosts(JSON.parse(savedPosts));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('bamanda_orders', JSON.stringify(orders));
    localStorage.setItem('bamanda_menu', JSON.stringify(menu));
    localStorage.setItem('bamanda_posts', JSON.stringify(posts));
  }, [orders, menu, posts]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, these should be in .env
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@bamanda.com';
    const adminPass = import.meta.env.VITE_ADMIN_PASSWORD || 'heritage2026';
    
    if (email === adminEmail && password === adminPass) {
      setIsAuthenticated(true);
    } else {
      alert('Invalid credentials. Access denied to the Sanctuary.');
    }
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const updatePrice = (itemId: string, newPrice: number) => {
    setMenu(prev => prev.map(item => item.id === itemId ? { ...item, price: newPrice } : item));
  };

  const toggleAvailability = (itemId: string) => {
    setMenu(prev => prev.map(item => item.id === itemId ? { ...item, available: !item.available } : item));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-3xl p-10 shadow-2xl"
        >
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-6">
              <Lock className="w-8 h-8 text-accent" />
            </div>
            <h1 className="font-serif text-3xl text-primary italic">Curator Access</h1>
            <p className="font-sans text-[10px] uppercase tracking-widest text-on-surface-variant opacity-60 mt-2">
              Bamanda Heritage Administration
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="editorial-label text-[10px]">Registry Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-primary/5 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent transition-all"
                placeholder="admin@bamanda.com"
              />
            </div>
            <div className="space-y-2">
              <label className="editorial-label text-[10px]">Access Key</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-primary/5 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent transition-all"
                placeholder="••••••••"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-accent text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-accent/90 transition-all shadow-xl shadow-accent/20"
            >
              Enter the Sanctuary
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-20 md:w-64 bg-primary text-white z-50 flex flex-col">
        <div className="p-8 hidden md:block">
          <h2 className="font-serif italic text-2xl text-accent">Bamanda</h2>
          <p className="text-[8px] uppercase tracking-[0.4em] opacity-40">Admin Dashboard</p>
        </div>
        
        <nav className="flex-1 px-4 py-10 space-y-4">
          {[
            { id: 'orders', label: 'Orders', icon: ShoppingBag },
            { id: 'menu', label: 'Menu', icon: Utensils },
            { id: 'blog', label: 'Journal', icon: BookOpen },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all ${activeTab === tab.id ? 'bg-accent text-primary' : 'hover:bg-white/5 opacity-60 hover:opacity-100'}`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="hidden md:block font-sans text-[10px] uppercase tracking-widest font-bold">{tab.label}</span>
            </button>
          ))}
        </nav>

        <button 
          onClick={() => setIsAuthenticated(false)}
          className="p-8 flex items-center gap-4 opacity-40 hover:opacity-100 hover:text-accent transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="hidden md:block font-sans text-[10px] uppercase tracking-widest font-bold">Exit</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="ml-20 md:ml-64 p-10">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <div className="editorial-label text-accent mb-2">Management Portal</div>
            <h1 className="font-serif text-5xl text-primary capitalize italic">{activeTab} Curation</h1>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl shadow-sm border border-primary/5">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="font-sans text-[10px] uppercase tracking-widest font-bold opacity-60">System Live</span>
            </div>
          </div>
        </header>

        <div className="space-y-8">
          {activeTab === 'orders' && (
            <div className="grid grid-cols-1 gap-6">
              {orders.length === 0 ? (
                <div className="bg-white p-20 rounded-3xl text-center shadow-sm border border-primary/5">
                  <ShoppingBag className="w-12 h-12 text-primary/10 mx-auto mb-6" />
                  <p className="font-serif italic text-2xl text-primary/40">No manifestations today.</p>
                </div>
              ) : (
                orders.map((order) => (
                  <motion.div 
                    layout
                    key={order.id}
                    className="bg-white p-8 rounded-3xl shadow-sm border border-primary/5 flex flex-col md:flex-row justify-between gap-8"
                  >
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center gap-4">
                        <span className="font-sans text-[10px] uppercase tracking-widest font-black px-3 py-1 bg-primary/5 rounded-full">#{order.id}</span>
                        <span className="text-on-surface-variant/40 text-[10px] uppercase tracking-widest">{order.createdAt}</span>
                      </div>
                      <h3 className="font-serif text-2xl text-primary">{order.customer.name}</h3>
                      <p className="text-sm text-on-surface-variant flex items-center gap-2">
                        <Phone className="w-3 h-3" /> {order.customer.phone}
                      </p>
                      <div className="pt-4 space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="text-xs text-on-surface-variant flex justify-between italic">
                            <span>{item.name} ({item.quantity}x)</span>
                            <span>₦{(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-4 border-t border-primary/5 flex justify-between items-center">
                        <span className="font-serif text-xl text-primary">Total Amount</span>
                        <span className="font-sans text-xl font-bold text-accent">₦{order.total.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between gap-4 w-full md:w-64">
                      <div className="space-y-3">
                        <label className="editorial-label text-[8px] opacity-40">Update Status</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'preparing', icon: ChefHat },
                            { id: 'on-the-way', icon: Truck },
                            { id: 'delivered', icon: CheckCircle2 },
                            { id: 'cancelled', icon: XCircle },
                          ].map((s) => (
                            <button
                              key={s.id}
                              onClick={() => updateOrderStatus(order.id, s.id as any)}
                              className={`p-3 rounded-xl flex flex-col items-center gap-2 border transition-all ${order.status === s.id ? 'border-accent bg-accent/5 text-accent' : 'border-primary/5 opacity-40 hover:opacity-100'}`}
                            >
                              <s.icon className="w-4 h-4" />
                              <span className="text-[8px] uppercase tracking-tighter font-black">{s.id}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {activeTab === 'menu' && (
            <div className="bg-white rounded-3xl shadow-sm border border-primary/5 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-primary/5 border-b border-primary/5">
                  <tr>
                    <th className="p-6 editorial-label text-[10px]">Dish</th>
                    <th className="p-6 editorial-label text-[10px]">Category</th>
                    <th className="p-6 editorial-label text-[10px]">Price (₦)</th>
                    <th className="p-6 editorial-label text-[10px]">Status</th>
                    <th className="p-6 editorial-label text-[10px] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {menu.map((item) => (
                    <tr key={item.id} className="hover:bg-primary/[0.02] transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <img src={item.image} className="w-10 h-10 rounded-lg object-cover" />
                          <span className="font-serif text-lg text-primary italic">{item.name}</span>
                        </div>
                      </td>
                      <td className="p-6 font-sans text-[10px] uppercase tracking-widest opacity-60">{item.category}</td>
                      <td className="p-6">
                        <input 
                          type="number" 
                          value={item.price}
                          onChange={(e) => updatePrice(item.id, parseInt(e.target.value))}
                          className="w-24 bg-primary/5 border-none rounded-lg px-3 py-2 font-sans font-bold text-accent"
                        />
                      </td>
                      <td className="p-6">
                        <button 
                          onClick={() => toggleAvailability(item.id)}
                          className={`px-4 py-2 rounded-full font-sans text-[8px] uppercase tracking-[0.2em] font-black ${item.available ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}
                        >
                          {item.available ? 'Available' : 'Sold Out'}
                        </button>
                      </td>
                      <td className="p-6 text-right">
                        <button className="p-2 text-on-surface-variant/40 hover:text-accent transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'blog' && (
            <div className="space-y-8">
              <button className="bg-primary text-white px-8 py-4 rounded-2xl flex items-center gap-4 hover:bg-accent transition-all group shadow-xl shadow-primary/20">
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                <span className="font-sans text-[10px] uppercase tracking-widest font-bold">New Heritage Article</span>
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {posts.map((post) => (
                  <div key={post.id} className="bg-white p-6 rounded-3xl shadow-sm border border-primary/5 flex gap-6">
                    <img src={post.image} className="w-24 h-24 rounded-2xl object-cover" />
                    <div className="flex-1 flex flex-col justify-between py-2">
                      <h3 className="font-serif text-xl text-primary italic">{post.title}</h3>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-[10px] text-on-surface-variant opacity-40 uppercase tracking-widest">{post.date}</span>
                        <div className="flex gap-2">
                          <button className="p-2 hover:text-accent transition-colors"><Edit className="w-4 h-4" /></button>
                          <button className="p-2 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}