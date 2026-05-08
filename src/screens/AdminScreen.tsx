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
  Menu as MenuIcon
} from 'lucide-react';
import { MenuItem, Order, BlogPost, OrderStatus, BlogLayout, MenuCategory } from '../types';
import { MENU_ITEMS } from '../data';
import { formatStatusUpdateMessage, getWhatsAppUrl } from '../lib/order';
import { useToast } from '../lib/toast-context';

export default function AdminScreen() {
  const { showToast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'blog'>('orders');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);

  // Editing states
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [editingMenuItem, setEditingMenuItem] = useState<Partial<MenuItem> | null>(null);

  useEffect(() => {
    const savedOrders = localStorage.getItem('bamanda_orders');
    const savedMenu = localStorage.getItem('bamanda_menu');
    const savedPosts = localStorage.getItem('bamanda_posts');
    
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    
    if (savedMenu) {
      setMenu(JSON.parse(savedMenu));
    } else {
      setMenu(MENU_ITEMS);
      localStorage.setItem('bamanda_menu', JSON.stringify(MENU_ITEMS));
    }
    
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      const initialPosts: BlogPost[] = [{
        id: '1',
        title: 'The Ritual of Communal Dining',
        topic: 'Heritage Rituals',
        content: 'Understanding how the shared plate fosters community bonds and neurological connections through the act of communal dining...',
        image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?auto=format&fit=crop&q=80&w=1200',
        date: 'May 2026',
        author: 'Chef Amara',
        layout: 'editorial',
        category: 'Rituals'
      }];
      setPosts(initialPosts);
      localStorage.setItem('bamanda_posts', JSON.stringify(initialPosts));
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('bamanda_orders', JSON.stringify(orders));
      localStorage.setItem('bamanda_menu', JSON.stringify(menu));
      localStorage.setItem('bamanda_posts', JSON.stringify(posts));
    }
  }, [orders, menu, posts, isAuthenticated]);

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

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    showToast(`Order status updated to ${newStatus}.`, 'success');
  };

  const handleNotifyCustomer = (order: Order) => {
    const message = formatStatusUpdateMessage(order);
    const url = getWhatsAppUrl(message, order.customer.phone);
    window.open(url, '_blank');
  };

  const deleteOrder = (orderId: string) => {
    if (window.confirm('Are you sure you want to remove this curation from history?')) {
      setOrders(prev => prev.filter(o => o.id !== orderId));
      showToast('Curation archived from records.', 'info');
    }
  };

  // Blog Actions
  const handleSavePost = () => {
    if (!editingPost?.title || !editingPost?.content) return;

    if (editingPost.id) {
      setPosts(prev => prev.map(p => p.id === editingPost.id ? (editingPost as BlogPost) : p));
      showToast('Article manifestation updated.', 'success');
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
    setEditingPost(null);
  };

  const handleDeletePost = (id: string) => {
    if (window.confirm('Delete this article?')) {
      setPosts(prev => prev.filter(p => p.id !== id));
      showToast('Article archived from the Gazette.', 'info');
    }
  };

  // Menu Actions
  const handleSaveMenuItem = () => {
    if (!editingMenuItem?.name || !editingMenuItem?.price) return;

    if (editingMenuItem.id) {
      setMenu(prev => prev.map(item => item.id === editingMenuItem.id ? (editingMenuItem as MenuItem) : item));
      showToast('Inventory curation updated.', 'success');
    } else {
      const newItem: MenuItem = {
        ...editingMenuItem,
        id: 'item-' + Date.now(),
        mealTime: ['Lunch', 'Dinner'],
        available: true,
        tags: [],
      } as MenuItem;
      setMenu(prev => [newItem, ...prev]);
      showToast('New dish added to the sanctuary inventory.', 'success');
    }
    setEditingMenuItem(null);
  };

  const toggleTrending = (id: string) => {
    setMenu(prev => prev.map(item => 
      item.id === id ? { ...item, isTrending: !item.isTrending } : item
    ));
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
        "w-full lg:w-64 bg-primary text-white p-6 lg:p-8 lg:h-screen sticky top-0 lg:sticky overflow-y-auto z-[60] shadow-xl transition-all duration-500",
        isMobileMenuOpen ? "h-screen bg-primary" : "h-auto"
      )}>
        <div className="flex items-center justify-between lg:block space-y-0 lg:space-y-8">
          <h2 className="font-serif italic text-2xl text-accent">Bamanda</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-3 bg-white/5 rounded-xl border border-white/10 text-white active:scale-95 transition-all"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
            <button onClick={() => setIsAuthenticated(false)} className="flex items-center gap-2 p-3 px-4 opacity-60 hover:opacity-100 text-[10px] uppercase tracking-widest font-bold border border-white/20 rounded-xl bg-white/5 active:scale-95 transition-all">
              <LogOut className="w-4 h-4" /> 
              <span className="hidden sm:inline">Exit</span>
            </button>
          </div>
        </div>

        <div className={cn(
          "lg:flex lg:flex-col gap-2 lg:gap-4 lg:mt-8",
          isMobileMenuOpen ? "flex flex-col mt-8" : "hidden"
        )}>
          {[
            { id: 'orders', label: 'Orders', icon: ShoppingBag },
            { id: 'menu', label: 'Menu DB', icon: Utensils },
            { id: 'blog', label: 'Gazette', icon: BookOpen },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setIsMobileMenuOpen(false);
              }} 
              className={`w-full flex items-center justify-start gap-4 p-5 rounded-2xl transition-all ${activeTab === tab.id ? 'bg-white text-primary shadow-xl scale-[1.02]' : 'bg-white/5 opacity-60 hover:opacity-100 border border-white/5'}`}
            >
              <tab.icon className={cn("w-5 h-5", activeTab === tab.id ? "text-accent" : "text-white")} /> 
              <span className="text-xs font-bold uppercase tracking-[0.2em]">{tab.label}</span>
            </button>
          ))}
          
          <button onClick={() => setIsAuthenticated(false)} className="lg:hidden flex items-center gap-4 p-5 opacity-40 hover:opacity-100 hover:text-accent transition-colors">
            <LogOut className="w-5 h-5" /> Exit
          </button>
        </div>
        
        <button onClick={() => setIsAuthenticated(false)} className="hidden lg:flex items-center gap-4 p-4 mt-8 opacity-40 hover:opacity-100 hover:text-accent transition-colors">
          <LogOut className="w-5 h-5" /> Exit
        </button>
      </aside>
      
      <main className="flex-1 p-6 lg:p-12 overflow-x-hidden">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 lg:mb-16">
          <h1 className="font-serif text-3xl lg:text-5xl text-primary capitalize italic">{activeTab} Curation</h1>
          <div className="flex items-center gap-4">
            <div className="bg-white px-4 py-2 rounded-full border border-primary/10 flex items-center gap-2 shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-primary opacity-60">System Online</span>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {/* ORDERS TAB */}
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
                  <div key={order.id} className="bg-white p-6 lg:p-8 rounded-3xl shadow-sm border border-primary/5 overflow-hidden">
                    <div className="flex flex-col xl:flex-row justify-between gap-8">
                      <div className="flex-1 space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="editorial-label text-accent text-[9px]">Order #{order.id}</div>
                          <div className={`px-4 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'on-the-way' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'preparing' ? 'bg-orange-100 text-orange-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {order.status}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                          <div>
                            <h4 className="text-[9px] uppercase font-bold text-primary/40 mb-2 tracking-widest">Patron</h4>
                            <p className="font-serif italic text-lg leading-tight">{order.customer.name}</p>
                            <p className="text-xs text-primary/60 mt-1">{order.customer.phone}</p>
                            <p className="text-xs text-primary/60">{order.customer.address}</p>
                          </div>
                          <div>
                            <h4 className="text-[9px] uppercase font-bold text-primary/40 mb-2 tracking-widest">Financials</h4>
                            <p className="font-sans font-bold text-xl">₦{order.total.toLocaleString()}</p>
                            <p className="text-[10px] text-primary/60 mt-1 uppercase tracking-widest">{new Date(order.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                        {order.notes && (
                          <div className="bg-cream p-4 rounded-xl text-xs italic opacity-80 border border-primary/5">
                            " {order.notes} "
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-primary/5">
                          {order.items.map(item => (
                            <span key={item.id} className="bg-primary/5 px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider">
                              {item.quantity}x {item.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="xl:w-64 space-y-3 xl:border-l border-primary/5 xl:pl-8 flex flex-col justify-center">
                        <div className="grid grid-cols-2 xl:grid-cols-1 gap-3">
                          <button onClick={() => updateOrderStatus(order.id, 'preparing')} className="w-full bg-primary/5 hover:bg-orange-50 text-[10px] font-bold py-4 rounded-xl transition-colors tracking-widest uppercase">PREPARE</button>
                          <button onClick={() => updateOrderStatus(order.id, 'on-the-way')} className="w-full bg-primary/5 hover:bg-blue-50 text-[10px] font-bold py-4 rounded-xl transition-all tracking-widest uppercase">SHIP</button>
                        </div>
                        <button onClick={() => updateOrderStatus(order.id, 'delivered')} className="w-full bg-primary/5 hover:bg-green-50 text-[10px] font-bold py-4 rounded-xl transition-all tracking-widest uppercase">DELIVER</button>
                        <button 
                          onClick={() => handleNotifyCustomer(order)}
                          className="w-full bg-accent/10 hover:bg-accent hover:text-white text-accent text-[10px] font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 tracking-widest uppercase"
                        >
                          <MessageCircle className="w-4 h-4" /> NOTIFY PATRON
                        </button>
                        <button onClick={() => deleteOrder(order.id)} className="w-full text-red-500 text-[10px] font-bold py-3 hover:bg-red-50 rounded-xl mt-2 tracking-widest uppercase">ARCHIVE RECORD</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {/* MENU DB TAB */}
          {activeTab === 'menu' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <h2 className="editorial-label text-accent">Active Inventory</h2>
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
                          <button onClick={() => setMenu(prev => prev.filter(m => m.id !== item.id))} className="text-primary/40 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* BLOG CMS TAB */}
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
        </AnimatePresence>

        {/* MODAL EDITORS */}
        <AnimatePresence>
          {editingPost && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary/90 backdrop-blur-md">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
              >
                <div className="p-8 border-b border-primary/5 flex justify-between items-center">
                  <h2 className="font-serif text-2xl italic">Compose Editorial</h2>
                  <button onClick={() => setEditingPost(null)}><X className="w-6 h-6 text-primary/40" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-10 space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-accent">Article Title</label>
                      <input 
                        type="text" 
                        value={editingPost.title} 
                        onChange={e => setEditingPost({ ...editingPost, title: e.target.value })}
                        className="w-full bg-primary/5 border-none rounded-xl p-4 font-serif text-lg"
                        placeholder="The Alchemy of Smoke..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-accent">Design Layout Template</label>
                      <select 
                        value={editingPost.layout} 
                        onChange={e => setEditingPost({ ...editingPost, layout: e.target.value as BlogLayout })}
                        className="w-full bg-primary/5 border-none rounded-xl p-4 font-sans text-sm font-bold appearance-none"
                      >
                        <option value="editorial">Modern Editorial (Large Title)</option>
                        <option value="minimal">Minimalist Archive (Clean, White)</option>
                        <option value="narrative">Personal Narrative (Story Focus)</option>
                        <option value="journal">Journal Entry (Date Focused)</option>
                        <option value="luxury">Luxury Curation (Gold & Black)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-accent">Feature Image URL</label>
                      <div className="flex gap-4">
                        <input 
                          type="text" 
                          value={editingPost.image} 
                          onChange={e => setEditingPost({ ...editingPost, image: e.target.value })}
                          className="flex-1 bg-primary/5 border-none rounded-xl p-4 font-sans text-xs"
                          placeholder="https://images.unsplash.com/..."
                        />
                        <div className="w-14 h-14 bg-primary/5 rounded-xl flex items-center justify-center overflow-hidden">
                          {editingPost.image ? <img src={editingPost.image} className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 opacity-10" />}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-accent">Topic & Category</label>
                      <div className="grid grid-cols-2 gap-4">
                        <input 
                          type="text" 
                          placeholder="Rituals"
                          value={editingPost.topic} 
                          onChange={e => setEditingPost({ ...editingPost, topic: e.target.value })}
                          className="w-full bg-primary/5 border-none rounded-xl p-4 font-sans text-xs font-bold"
                        />
                        <select 
                          value={editingPost.category} 
                          onChange={e => setEditingPost({ ...editingPost, category: e.target.value })}
                          className="w-full bg-primary/5 border-none rounded-xl p-4 font-sans text-xs font-bold"
                        >
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
                    <textarea 
                      rows={12}
                      value={editingPost.content} 
                      onChange={e => setEditingPost({ ...editingPost, content: e.target.value })}
                      className="w-full bg-primary/5 border-none rounded-xl p-6 font-serif text-base leading-relaxed"
                      placeholder="Manifest your story here..."
                    />
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
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col"
              >
                <div className="p-8 border-b border-primary/5 flex justify-between items-center">
                  <h2 className="font-serif text-2xl italic">Modify Inventory</h2>
                  <button onClick={() => setEditingMenuItem(null)}><X className="w-6 h-6 text-primary/40" /></button>
                </div>
                <div className="p-10 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-accent">Dish Name</label>
                      <input 
                        type="text" 
                        value={editingMenuItem.name} 
                        onChange={e => setEditingMenuItem({ ...editingMenuItem, name: e.target.value })}
                        className="w-full bg-primary/5 border-none rounded-xl p-4 font-serif text-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-accent">Price (₦)</label>
                      <input 
                        type="number" 
                        value={editingMenuItem.price} 
                        onChange={e => setEditingMenuItem({ ...editingMenuItem, price: parseInt(e.target.value) })}
                        className="w-full bg-primary/5 border-none rounded-xl p-4 font-sans font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-accent">Category</label>
                    <select 
                      value={editingMenuItem.category} 
                      onChange={e => setEditingMenuItem({ ...editingMenuItem, category: e.target.value as MenuCategory })}
                      className="w-full bg-primary/5 border-none rounded-xl p-4 font-sans font-bold appearance-none"
                    >
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
                    <textarea 
                      rows={4}
                      value={editingMenuItem.description} 
                      onChange={e => setEditingMenuItem({ ...editingMenuItem, description: e.target.value })}
                      className="w-full bg-primary/5 border-none rounded-xl p-4 font-sans text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-accent">Image Asset URL</label>
                    <input 
                      type="text" 
                      value={editingMenuItem.image} 
                      onChange={e => setEditingMenuItem({ ...editingMenuItem, image: e.target.value })}
                      className="w-full bg-primary/5 border-none rounded-xl p-4 font-sans text-xs"
                    />
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
        </AnimatePresence>
      </main>
    </div>
  );
}