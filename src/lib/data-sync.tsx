/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, BlogPost, StaffAccount, Order } from '../types';
import { MENU_ITEMS } from '../data';
import { db, auth, storage } from './firebase';
import { 
  collection, 
  query, 
  onSnapshot, 
  orderBy, 
  doc, 
  writeBatch, 
  serverTimestamp,
  updateDoc,
  addDoc,
  deleteDoc,
  getDoc,
  setDoc,
  Unsubscribe,
  limit,
  runTransaction
} from 'firebase/firestore';
import { 
  ref, 
  uploadString, 
  getDownloadURL,
  uploadBytes
} from 'firebase/storage';
import { put } from '@vercel/blob';
import { onAuthStateChanged } from 'firebase/auth';
import { useToast } from './toast-context';
import { supabase, uploadToSupabase } from './supabase';

// Utility to check if a string is a base64 image
const isBase64Image = (str: string) => str.startsWith('data:image/');

interface DataSyncContextType {
  // ... (rest of interface remains same)
  menu: MenuItem[];
  posts: BlogPost[];
  staff: StaffAccount[];
  orders: Order[];
  userProfile: StaffAccount | null;
  isLoading: boolean;
  isCloudSyncing: boolean;
  isConnected: boolean;
  
  // Menu Operations
  updateMenuItem: (item: Partial<MenuItem>) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  
  // Blog Operations
  updatePost: (post: Partial<BlogPost>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  
  // Staff Operations
  updateStaff: (member: Partial<StaffAccount>) => Promise<void>;
  deleteStaff: (id: string) => Promise<void>;

  // Order Operations
  createOrder: (order: Partial<Order>) => Promise<string | null>;
  updateOrderStatus: (orderId: string, status: string, extraData?: Partial<Order>) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  
  // Logging
  logAction: (action: string, context?: any) => Promise<void>;

  // Master Sync
  syncToCloud: () => Promise<void>;
  restoreFromStatic: () => void;
  exportAsDataTs: () => string;
}

const DataSyncContext = createContext<DataSyncContextType | undefined>(undefined);

export function DataSyncProvider({ children }: { children: React.ReactNode }) {
  const { showToast } = useToast();
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [staff, setStaff] = useState<StaffAccount[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [userProfile, setUserProfile] = useState<StaffAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [isConnected, setIsConnected] = useState(!!db);

  // ==========================================
  // AUTH & PROFILE SYNC
  // ==========================================
  useEffect(() => {
    if (!auth || !db) return;

    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      console.log("[Auth] State changed:", user?.email);
      if (user) {
        const docRef = doc(db, 'staff', user.uid);
        try {
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setUserProfile({ ...docSnap.data(), id: docSnap.id } as StaffAccount);
          } else {
            const primaryAdminEmail = import.meta.env.VITE_ADMIN_EMAIL || "bamandakitchen25@gmail.com";
            if (user.email?.toLowerCase() === primaryAdminEmail.toLowerCase()) {
              const initialAdmin = {
                name: 'Master Curator',
                email: user.email,
                role: 'admin' as const,
                createdAt: new Date().toISOString()
              };
              await setDoc(docRef, { ...initialAdmin, createdAt: serverTimestamp() });
              setUserProfile({ ...initialAdmin, id: user.uid });
              showToast('Sacred Profile Manifested.', 'success');
            } else {
              setUserProfile(null);
            }
          }
        } catch (error) {
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
        setStaff([]); 
      }
    });

    return () => unsubAuth();
  }, [showToast]);

  // ==========================================
  // INITIAL LOAD (LocalStorage / Caching)
  // ==========================================
  useEffect(() => {
    const loadRootData = async () => {
      const cachedMenu = localStorage.getItem('bamanda_menu_cache');
      const cachedPosts = localStorage.getItem('bamanda_blog_cache');
      const cachedStaff = localStorage.getItem('bamanda_staff_cache');
      const cachedOrders = localStorage.getItem('bamanda_orders_cache');

      let initialMenu: MenuItem[] = [];
      let initialPosts: BlogPost[] = [];
      let initialStaff: StaffAccount[] = [];
      let initialOrders: Order[] = [];

      try {
        if (cachedMenu) {
          const parsed = JSON.parse(cachedMenu);
          if (Array.isArray(parsed) && parsed.length > 0) initialMenu = parsed;
        }
        if (cachedPosts) {
          const parsed = JSON.parse(cachedPosts);
          if (Array.isArray(parsed)) initialPosts = parsed;
        }
        if (cachedStaff) {
          const parsed = JSON.parse(cachedStaff);
          if (Array.isArray(parsed)) initialStaff = parsed;
        }
        if (cachedOrders) {
          const parsed = JSON.parse(cachedOrders);
          if (Array.isArray(parsed)) initialOrders = parsed;
        }
      } catch (e) {
        console.error('Failed to parse cached data', e);
      }

      // Fallback Logic: If nothing in cache, use static definitions
      if (initialMenu.length === 0) initialMenu = MENU_ITEMS;

      setMenu(initialMenu);
      setPosts(initialPosts);
      setStaff(initialStaff);
      setOrders(initialOrders);
      setIsLoading(false);
    };

    loadRootData();
  }, []);

  // ==========================================
  // CLOUD SYNCHRONIZATION (Firestore)
  // ==========================================
  useEffect(() => {
    if (!db) {
      setIsConnected(false);
      return;
    }

    setIsConnected(true);

    const unsubMenu = onSnapshot(query(collection(db, 'menu'), orderBy('name')), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as MenuItem));
      if (items.length > 0) {
        setMenu(items);
        localStorage.setItem('bamanda_menu_cache', JSON.stringify(items));
      }
    });

    const unsubBlog = onSnapshot(query(collection(db, 'blog'), orderBy('date', 'desc')), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as BlogPost));
      setPosts(items);
      localStorage.setItem('bamanda_blog_cache', JSON.stringify(items));
    });

    let unsubOrders: Unsubscribe | null = null;
    if (userProfile) {
      unsubOrders = onSnapshot(query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(100)), (snapshot) => {
        const items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Order));
        setOrders(items);
        localStorage.setItem('bamanda_orders_cache', JSON.stringify(items));
      });
    }

    let unsubStaff: Unsubscribe | null = null;
    if (userProfile?.role === 'admin') {
      unsubStaff = onSnapshot(query(collection(db, 'staff'), orderBy('name')), (snapshot) => {
        const items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as StaffAccount));
        setStaff(items);
        localStorage.setItem('bamanda_staff_cache', JSON.stringify(items));
      });
    }

    return () => {
      unsubMenu();
      unsubBlog();
      if (unsubOrders) unsubOrders();
      if (unsubStaff) unsubStaff();
    };
  }, [userProfile]);

  // ==========================================
  // OPERATIONS
  // ==========================================

  // Helper to upload an asset (base64 or file) to Cloud Storage (Supabase / Vercel / Firebase)
  const uploadAsset = async (asset: string | File, path: string): Promise<string> => {
    // Attempt Supabase Storage FIRST (Highest Intelligence & Reliability)
    try {
      const publicUrl = await uploadToSupabase('images', path, asset);
      if (publicUrl) {
        console.log("[Storage] Manifested via Supabase:", publicUrl);
        return publicUrl;
      }
    } catch (supaErr) {
      console.warn("[Storage] Supabase failed, trying Vercel Blob:", supaErr);
    }

    // Attempt Vercel Blob SECOND
    try {
      if (typeof asset === 'string' && isBase64Image(asset)) {
        const { url } = await put(path, asset, {
          access: 'public',
          contentType: 'image/jpeg'
        });
        console.log("[Storage] Manifested via Vercel Blob:", url);
        return url;
      }
    } catch (vercelErr) {
      console.warn("[Storage] Vercel Blob failed, falling back to Firebase:", vercelErr);
    }

    // Fallback to Firebase Storage
    if (!storage) throw new Error('Storage not available');
    const storageRef = ref(storage, path);
    
    if (typeof asset === 'string' && isBase64Image(asset)) {
      const result = await uploadString(storageRef, asset, 'data_url');
      return await getDownloadURL(result.ref);
    } else if (asset instanceof File) {
      const result = await uploadBytes(storageRef, asset);
      return await getDownloadURL(result.ref);
    }
    
    return typeof asset === 'string' ? asset : '';
  };

  const logAction = async (action: string, context?: any) => {
    if (!db) return;
    try {
      await addDoc(collection(db, 'tracking_logs'), {
        action,
        context: context || {},
        userId: auth?.currentUser?.uid || 'anonymous',
        userName: userProfile?.name || 'Anonymous',
        userRole: userProfile?.role || 'none',
        timestamp: serverTimestamp()
      });
    } catch (e) {
      console.error('Failed to log action:', e);
    }
  };

  const createOrder = async (order: Partial<Order>): Promise<string | null> => {
    if (!db) return null;
    try {
      const newDoc = await addDoc(collection(db, 'orders'), {
        ...order,
        createdAt: new Date().toISOString(),
        serverCreatedAt: serverTimestamp(),
        status: 'pending'
      });
      await logAction('CREATE_ORDER', { orderId: newDoc.id, customer: order.customer?.name });
      return newDoc.id;
    } catch (e) {
      showToast('Order failed to manifest in cloud.', 'error');
      return null;
    }
  };

  const updateOrderStatus = async (orderId: string, status: string, extraData: Partial<Order> = {}) => {
    if (!db) return;
    try {
      await runTransaction(db, async (transaction) => {
        const orderRef = doc(db, 'orders', orderId);
        const orderDoc = await transaction.get(orderRef);
        
        if (!orderDoc.exists()) {
          throw new Error("Order folio not found in the cloud sanctuary.");
        }

        transaction.update(orderRef, { 
          status, 
          ...extraData,
          updatedAt: serverTimestamp() 
        });
      });
      
      await logAction('UPDATE_ORDER_STATUS', { orderId, status });
      showToast(`Order marked as ${status}.`, 'success');
    } catch (e) {
      console.error('Status transition failed:', e);
      showToast('Status update failed due to concurrency or network.', 'error');
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!db || userProfile?.role !== 'admin') return;
    try {
      await deleteDoc(doc(db, 'orders', orderId));
      await logAction('DELETE_ORDER', { orderId });
      showToast('Order record expunged.', 'info');
    } catch (e) {}
  };

  const updateMenuItem = async (item: Partial<MenuItem>) => {
    if (userProfile?.role !== 'admin') {
      showToast('Only admins can manifest items.', 'error');
      return;
    }

    let updatedItem = { ...item } as MenuItem;
    
    if (db) {
      try {
        // High Intelligence: Check for Base64 image and move to Storage Sanctuary
        if (updatedItem.image && isBase64Image(updatedItem.image)) {
          showToast('Manifesting visual asset in cloud sanctuary...', 'info');
          try {
            const fileName = `menu/${Date.now()}-${updatedItem.name.replace(/\s+/g, '_').toLowerCase()}.jpg`;
            updatedItem.image = await uploadAsset(updatedItem.image, fileName);
          } catch (storageErr) {
            console.error('All Cloud Storage providers failed:', storageErr);
            showToast('Cloud storage blocked. Falling back to local manifest.', 'warning');
            // We keep updatedItem.image as Base64. It might hit Firestore size limits (1MB),
            // but it will definitely work in localStorage.
          }
        }

        if (item.id) {
          await updateDoc(doc(db, 'menu', item.id), { ...updatedItem, updatedAt: serverTimestamp() });
          await logAction('UPDATE_MENU_ITEM', { itemId: item.id, name: item.name });
          showToast(`Manifest for ${item.name} updated in cloud.`, 'success');
        } else {
          const newDoc = await addDoc(collection(db, 'menu'), { ...updatedItem, updatedAt: serverTimestamp() });
          updatedItem.id = newDoc.id;
          await logAction('CREATE_MENU_ITEM', { itemId: newDoc.id, name: item.name });
          showToast(`${item.name} manifested in cloud.`, 'success');
        }
      } catch (err) {
        console.error('Cloud sync failed:', err);
        showToast('Cloud sync failed. Document limit or network issue.', 'warning');
      }
    }
    const newMenu = item.id ? menu.map(m => m.id === item.id ? updatedItem : m) : [updatedItem, ...menu];
    setMenu(newMenu);
    localStorage.setItem('bamanda_menu_cache', JSON.stringify(newMenu));
  };

  const deleteMenuItem = async (id: string) => {
    if (userProfile?.role !== 'admin') {
      showToast('Only admins can purge items.', 'error');
      return;
    }

    if (db) {
      try {
        await deleteDoc(doc(db, 'menu', id));
        await logAction('DELETE_MENU_ITEM', { itemId: id });
      } catch (err) {}
    }
    const newMenu = menu.filter(m => m.id !== id);
    setMenu(newMenu);
    localStorage.setItem('bamanda_menu_cache', JSON.stringify(newMenu));
  };

  const updatePost = async (post: Partial<BlogPost>) => {
    if (userProfile?.role !== 'admin') {
      showToast('Only admins can edit the Gazette.', 'error');
      return;
    }

    let updatedPost = { 
      ...post, 
      date: post.date || new Date().toISOString().split('T')[0] 
    } as BlogPost;

    if (db) {
      try {
        // High Intelligence: Handle Blog visuals via Storage
        if (updatedPost.image && isBase64Image(updatedPost.image)) {
          showToast('Archiving narrative visual...', 'info');
          try {
            const fileName = `blog/${Date.now()}-${updatedPost.title.replace(/\s+/g, '_').toLowerCase()}.jpg`;
            updatedPost.image = await uploadAsset(updatedPost.image, fileName);
          } catch (err) {
            console.error('Blog image upload failed:', err);
          }
        }

        if (post.id) {
          await updateDoc(doc(db, 'blog', post.id), { ...updatedPost, updatedAt: serverTimestamp() });
          await logAction('UPDATE_BLOG_POST', { postId: post.id, title: post.title });
        } else {
          const newDoc = await addDoc(collection(db, 'blog'), { ...updatedPost, updatedAt: serverTimestamp() });
          updatedPost.id = newDoc.id;
          await logAction('CREATE_BLOG_POST', { postId: newDoc.id, title: post.title });
        }
      } catch (err) {
        console.error('Cloud blog sync failed:', err);
        showToast('Cloud blog sync failed.', 'warning');
      }
    }
    const newPosts = post.id ? posts.map(p => p.id === post.id ? updatedPost : p) : [updatedPost, ...posts];
    setPosts(newPosts);
    localStorage.setItem('bamanda_blog_cache', JSON.stringify(newPosts));
  };

  const deletePost = async (id: string) => {
    if (userProfile?.role !== 'admin') {
      showToast('Only admins can expunge articles.', 'error');
      return;
    }

    if (db) {
      try {
        await deleteDoc(doc(db, 'blog', id));
        await logAction('DELETE_BLOG_POST', { postId: id });
      } catch (err) {}
    }
    const newPosts = posts.filter(p => p.id !== id);
    setPosts(newPosts);
    localStorage.setItem('bamanda_blog_cache', JSON.stringify(newPosts));
  };

  const updateStaff = async (member: Partial<StaffAccount>) => {
    if (userProfile?.role !== 'admin') {
      showToast('Only admins can manage guardians.', 'error');
      return;
    }

    let updatedMember = { ...member, createdAt: member.createdAt || new Date().toISOString() } as StaffAccount;

    if (db) {
      try {
        if (member.id) {
          await updateDoc(doc(db, 'staff', member.id), { ...member, lastUpdated: serverTimestamp() });
          await logAction('UPDATE_STAFF', { staffId: member.id, name: member.name });
        } else {
          const newDoc = await addDoc(collection(db, 'staff'), { ...member, createdAt: serverTimestamp() });
          updatedMember.id = newDoc.id;
          await logAction('CREATE_STAFF', { staffId: newDoc.id, name: member.name });
        }
      } catch (err) {
        showToast('Cloud staff sync failed.', 'warning');
      }
    }
    const newStaff = member.id ? staff.map(s => s.id === member.id ? updatedMember : s) : [updatedMember, ...staff];
    setStaff(newStaff);
    localStorage.setItem('bamanda_staff_cache', JSON.stringify(newStaff));
  };

  const deleteStaff = async (id: string) => {
    if (userProfile?.role !== 'admin') {
      showToast('Only admins can revoke access.', 'error');
      return;
    }

    if (db) {
      try {
        await deleteDoc(doc(db, 'staff', id));
        await logAction('DELETE_STAFF', { staffId: id });
      } catch (err) {}
    }
    const newStaff = staff.filter(s => s.id !== id);
    setStaff(newStaff);
    localStorage.setItem('bamanda_staff_cache', JSON.stringify(newStaff));
  };

  const syncToCloud = async () => {
    if (!db || userProfile?.role !== 'admin') return;
    setIsCloudSyncing(true);
    showToast('Initiating cloud manifestation...', 'cloud');
    try {
      const batch = writeBatch(db);
      menu.forEach(item => {
        if (item.id) batch.set(doc(db, 'menu', item.id), { ...item, updatedAt: serverTimestamp() });
      });
      await batch.commit();
      await logAction('SYNC_TO_CLOUD');
      showToast('Heritage successfully manifested in cloud sanctuary.', 'success');
    } catch (error) {
      showToast('Manifestation failed to reach the heavens.', 'error');
    } finally {
      setIsCloudSyncing(false);
    }
  };

  const restoreFromStatic = () => {
    setMenu(MENU_ITEMS);
    localStorage.setItem('bamanda_menu_cache', JSON.stringify(MENU_ITEMS));
    showToast('Restored from ancestral records.', 'info');
  };

  const exportAsDataTs = () => {
    return `import { MenuItem } from './types';\n\nexport const MENU_ITEMS: MenuItem[] = ${JSON.stringify(menu, null, 2)};\n`;
  };

  return (
    <DataSyncContext.Provider value={{
      menu,
      posts,
      staff,
      orders,
      userProfile,
      isLoading,
      isCloudSyncing,
      isConnected,
      updateMenuItem,
      deleteMenuItem,
      updatePost,
      deletePost,
      updateStaff,
      deleteStaff,
      createOrder,
      updateOrderStatus,
      deleteOrder,
      logAction,
      syncToCloud,
      restoreFromStatic,
      exportAsDataTs
    }}>
      {children}
    </DataSyncContext.Provider>
  );
}

export function useDataSync() {
  const context = useContext(DataSyncContext);
  if (context === undefined) {
    throw new Error('useDataSync must be used within a DataSyncProvider');
  }
  return context;
}
