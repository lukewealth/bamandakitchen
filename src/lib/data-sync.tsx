/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, BlogPost } from '../types';
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
  isLoading: boolean;
  isCloudSyncing: boolean;
  isConnected: boolean;
  updateMenuItem: (item: Partial<MenuItem>) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  syncToCloud: () => Promise<void>;
  restoreFromStatic: () => void;
  exportAsDataTs: () => string;
}

const DataSyncContext = createContext<DataSyncContextType | undefined>(undefined);

export function DataSyncProvider({ children }: { children: React.ReactNode }) {
  const { showToast } = useToast();
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [isConnected, setIsConnected] = useState(!!db);

  useEffect(() => {
    const loadRootData = async () => {
      const cachedMenu = localStorage.getItem('bamanda_menu_cache');
      const cachedPosts = localStorage.getItem('bamanda_blog_cache');

      let initialMenu: MenuItem[] = [];
      let initialPosts: BlogPost[] = [];

      try {
        if (cachedMenu) {
          const parsed = JSON.parse(cachedMenu);
          if (Array.isArray(parsed) && parsed.length > 0) initialMenu = parsed;
        }
        if (cachedPosts) {
          const parsed = JSON.parse(cachedPosts);
          if (Array.isArray(parsed)) initialPosts = parsed;
        }
      } catch (e) {
        console.error('Failed to parse cached data', e);
      }

      if (initialMenu.length === 0) {
        try {
          const response = await fetch('/menu.json');
          if (response.ok) {
            const data = await response.json();
            if (data.menu && Array.isArray(data.menu)) {
              initialMenu = data.menu;
            } else if (data.categories && Array.isArray(data.categories)) {
              initialMenu = data.categories.flatMap((cat: any) => 
                cat.items.map((item: any) => ({ ...item, category: cat.name }))
              );
            }
          }
        } catch (e) {
          console.warn('Failed to fetch public/menu.json', e);
        }
      }

      if (initialMenu.length === 0) {
        initialMenu = MENU_ITEMS;
      }

      setMenu(initialMenu);
      setPosts(initialPosts);
      setIsLoading(false);
    };

    loadRootData();
  }, []);

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
      console.error('Cloud Menu Sync Failed:', err);
      setIsConnected(false);
    });

    const unsubBlog = onSnapshot(query(collection(db, 'blog'), orderBy('date', 'desc')), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as BlogPost));
      setPosts(items);
      localStorage.setItem('bamanda_blog_cache', JSON.stringify(items));
    }, (err) => {
      console.error('Cloud Blog Sync Failed:', err);
    });

    return () => {
      unsubMenu();
      unsubBlog();
    };
  }, []);

  const updateMenuItem = async (item: Partial<MenuItem>) => {
    let updatedItem = { ...item, updatedAt: new Date().toISOString() } as MenuItem;
    
    if (db) {
      try {
        if (updatedItem.id) {
          await updateDoc(doc(db, 'menu', updatedItem.id), { ...updatedItem, updatedAt: serverTimestamp() });
        } else {
          const newDoc = await addDoc(collection(db, 'menu'), { ...updatedItem, updatedAt: serverTimestamp() });
          updatedItem.id = newDoc.id;
        }
      } catch (err) {
        showToast('Cloud sync failed. Preserving local copy.', 'warning');
      }
    }

    const newMenu = updatedItem.id 
      ? menu.map(m => m.id === updatedItem.id ? updatedItem : m)
      : [updatedItem, ...menu];
    
    setMenu(newMenu);
    localStorage.setItem('bamanda_menu_cache', JSON.stringify(newMenu));
  };

  const deleteMenuItem = async (id: string) => {
    if (db) {
      try {
        await deleteDoc(doc(db, 'menu', id));
      } catch (err) {
        showToast('Failed to delete from cloud.', 'error');
        return;
      }
    }

    const newMenu = menu.filter(m => m.id !== id);
    setMenu(newMenu);
    localStorage.setItem('bamanda_menu_cache', JSON.stringify(newMenu));
    showToast('Dish removed from records.', 'info');
  };

  const syncToCloud = async () => {
    if (!db) {
      showToast('Cloud sanctuary offline.', 'error');
      return;
    }

    setIsCloudSyncing(true);
    try {
      const batch = writeBatch(db);
      menu.forEach(item => {
        const docRef = doc(db, 'menu', item.id);
        batch.set(docRef, { ...item, updatedAt: serverTimestamp() });
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
      isLoading,
      isCloudSyncing,
      isConnected,
      updateMenuItem,
      deleteMenuItem,
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
