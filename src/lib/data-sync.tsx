/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, BlogPost, StaffAccount } from '../types';
import { MENU_ITEMS } from '../data';
import { db } from './firebase';
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
  deleteDoc
} from 'firebase/firestore';
import { useToast } from './toast-context';

interface DataSyncContextType {
  menu: MenuItem[];
  posts: BlogPost[];
  staff: StaffAccount[];
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
  const [isLoading, setIsLoading] = useState(true);
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [isConnected, setIsConnected] = useState(!!db);

  // ==========================================
  // INITIAL LOAD (LocalStorage)
  // ==========================================
  useEffect(() => {
    const loadRootData = async () => {
      const cachedMenu = localStorage.getItem('bamanda_menu_cache');
      const cachedPosts = localStorage.getItem('bamanda_blog_cache');
      const cachedStaff = localStorage.getItem('bamanda_staff_cache');

      let initialMenu: MenuItem[] = [];
      let initialPosts: BlogPost[] = [];
      let initialStaff: StaffAccount[] = [];

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
      } catch (e) {
        console.error('Failed to parse cached data', e);
      }

      if (initialMenu.length === 0) initialMenu = MENU_ITEMS;

      setMenu(initialMenu);
      setPosts(initialPosts);
      setStaff(initialStaff);
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
    }, (err) => {
      console.error('Menu Sync Failed:', err);
    });

    const unsubBlog = onSnapshot(query(collection(db, 'blog'), orderBy('date', 'desc')), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as BlogPost));
      setPosts(items);
      localStorage.setItem('bamanda_blog_cache', JSON.stringify(items));
    }, (err) => {
      console.error('Blog Sync Failed:', err);
    });

    const unsubStaff = onSnapshot(query(collection(db, 'staff'), orderBy('name')), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as StaffAccount));
      setStaff(items);
      localStorage.setItem('bamanda_staff_cache', JSON.stringify(items));
    }, (err) => {
      console.error('Staff Sync Failed:', err);
    });

    return () => {
      unsubMenu();
      unsubBlog();
      unsubStaff();
    };
  }, []);

  // ==========================================
  // OPERATIONS
  // ==========================================

  const updateMenuItem = async (item: Partial<MenuItem>) => {
    let updatedItem = { ...item } as MenuItem;
    
    // Generate a temporary ID if missing
    if (!updatedItem.id) {
      updatedItem.id = `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    if (db) {
      try {
        if (item.id) {
          await updateDoc(doc(db, 'menu', item.id), { ...item, updatedAt: serverTimestamp() });
        } else {
          const newDoc = await addDoc(collection(db, 'menu'), { ...item, updatedAt: serverTimestamp() });
          updatedItem.id = newDoc.id;
        }
      } catch (err) {
        showToast('Cloud sync failed. Preserving local copy.', 'warning');
      }
    }
    const newMenu = item.id ? menu.map(m => m.id === item.id ? updatedItem : m) : [updatedItem, ...menu];
    setMenu(newMenu);
    localStorage.setItem('bamanda_menu_cache', JSON.stringify(newMenu));
  };

  const updatePost = async (post: Partial<BlogPost>) => {
    let updatedPost = { 
      ...post, 
      date: post.date || new Date().toISOString().split('T')[0] 
    } as BlogPost;

    if (!updatedPost.id) {
      updatedPost.id = `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    if (db) {
      try {
        if (post.id) {
          await updateDoc(doc(db, 'blog', post.id), { ...post, updatedAt: serverTimestamp() });
        } else {
          const newDoc = await addDoc(collection(db, 'blog'), { ...post, updatedAt: serverTimestamp() });
          updatedPost.id = newDoc.id;
        }
      } catch (err) {
        showToast('Cloud blog sync failed.', 'warning');
      }
    }
    const newPosts = post.id ? posts.map(p => p.id === post.id ? updatedPost : p) : [updatedPost, ...posts];
    setPosts(newPosts);
    localStorage.setItem('bamanda_blog_cache', JSON.stringify(newPosts));
  };

  const updateStaff = async (member: Partial<StaffAccount>) => {
    let updatedMember = { 
      ...member, 
      createdAt: member.createdAt || new Date().toISOString() 
    } as StaffAccount;

    if (!updatedMember.id) {
      updatedMember.id = `staff_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    if (db) {
      try {
        if (member.id) {
          await updateDoc(doc(db, 'staff', member.id), { ...member, lastUpdated: serverTimestamp() });
        } else {
          const newDoc = await addDoc(collection(db, 'staff'), { ...member, createdAt: serverTimestamp() });
          updatedMember.id = newDoc.id;
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
    if (db) await deleteDoc(doc(db, 'staff', id));
    const newStaff = staff.filter(s => s.id !== id);
    setStaff(newStaff);
    localStorage.setItem('bamanda_staff_cache', JSON.stringify(newStaff));
  };

  const syncToCloud = async () => {
    if (!db) return;
    setIsCloudSyncing(true);
    try {
      const batch = writeBatch(db);
      menu.forEach(item => {
        if (item.id) batch.set(doc(db, 'menu', item.id), { ...item, updatedAt: serverTimestamp() });
      });
      await batch.commit();
      showToast('Heritage manifested in cloud.', 'success');
    } catch (error) {
      showToast('Manifestation failed.', 'error');
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
      isLoading,
      isCloudSyncing,
      isConnected,
      updateMenuItem,
      deleteMenuItem,
      updatePost,
      deletePost,
      updateStaff,
      deleteStaff,
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
