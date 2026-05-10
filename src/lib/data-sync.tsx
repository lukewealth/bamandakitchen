/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, BlogPost, StaffAccount } from '../types';
import { MENU_ITEMS } from '../data';
import { db, auth } from './firebase';
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
  setDoc
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useToast } from './toast-context';

interface DataSyncContextType {
  menu: MenuItem[];
  posts: BlogPost[];
  staff: StaffAccount[];
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
      if (user) {
        // Fetch user profile from Firestore
        const docRef = doc(db, 'staff', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setUserProfile({ ...docSnap.data(), id: docSnap.id } as StaffAccount);
        } else {
          // If this is the first admin (defined in .env), auto-create profile
          const primaryAdminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@bamanda.com';
          if (user.email === primaryAdminEmail) {
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
            showToast('Access denied. No staff profile found.', 'error');
          }
        }
      } else {
        setUserProfile(null);
      }
    });

    return () => unsubAuth();
  }, [showToast]);

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

  const updateMenuItem = async (item: Partial<MenuItem>) => {
    if (userProfile?.role !== 'admin') {
      showToast('Only admins can manifest items.', 'error');
      return;
    }

    let updatedItem = { ...item } as MenuItem;
    
    if (db) {
      try {
        if (item.id) {
          await updateDoc(doc(db, 'menu', item.id), { ...item, updatedAt: serverTimestamp() });
          await logAction('UPDATE_MENU_ITEM', { itemId: item.id, name: item.name });
        } else {
          const newDoc = await addDoc(collection(db, 'menu'), { ...item, updatedAt: serverTimestamp() });
          updatedItem.id = newDoc.id;
          await logAction('CREATE_MENU_ITEM', { itemId: newDoc.id, name: item.name });
        }
      } catch (err) {
        showToast('Cloud sync failed. Preserving local copy.', 'warning');
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
        if (post.id) {
          await updateDoc(doc(db, 'blog', post.id), { ...post, updatedAt: serverTimestamp() });
          await logAction('UPDATE_BLOG_POST', { postId: post.id, title: post.title });
        } else {
          const newDoc = await addDoc(collection(db, 'blog'), { ...post, updatedAt: serverTimestamp() });
          updatedPost.id = newDoc.id;
          await logAction('CREATE_BLOG_POST', { postId: newDoc.id, title: post.title });
        }
      } catch (err) {
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

    let updatedMember = { 
      ...member, 
      createdAt: member.createdAt || new Date().toISOString() 
    } as StaffAccount;

    if (db) {
      try {
        if (member.id) {
          await updateDoc(doc(db, 'staff', member.id), { ...member, lastUpdated: serverTimestamp() });
          await logAction('UPDATE_STAFF', { staffId: member.id, name: member.name });
        } else {
          // Note: In a production app, we would use a Firebase Function to create the Auth user
          // For this prototype, we create the Firestore record. The user will need to be 
          // manually created in Firebase Console or a separate 'Register' flow.
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
    try {
      const batch = writeBatch(db);
      menu.forEach(item => {
        if (item.id) batch.set(doc(db, 'menu', item.id), { ...item, updatedAt: serverTimestamp() });
      });
      await batch.commit();
      await logAction('SYNC_TO_CLOUD');
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
