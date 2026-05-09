/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as dotenv from 'dotenv';
dotenv.config();

// Shim import.meta.env for Node.js
(global as any).import = {
  meta: {
    env: {
      VITE_FIREBASE_API_KEY: process.env.VITE_FIREBASE_API_KEY,
      VITE_FIREBASE_AUTH_DOMAIN: process.env.VITE_FIREBASE_AUTH_DOMAIN,
      VITE_FIREBASE_PROJECT_ID: process.env.VITE_FIREBASE_PROJECT_ID,
      VITE_FIREBASE_STORAGE_BUCKET: process.env.VITE_FIREBASE_STORAGE_BUCKET,
      VITE_FIREBASE_MESSAGING_SENDER_ID: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      VITE_FIREBASE_APP_ID: process.env.VITE_FIREBASE_APP_ID,
      VITE_FIREBASE_MEASUREMENT_ID: process.env.VITE_FIREBASE_MEASUREMENT_ID,
    }
  }
};

import { db } from '../src/lib/firebase';
import { collection, doc, getDocs, writeBatch } from 'firebase/firestore';
import { MENU_ITEMS } from '../src/data';

async function seedMenu() {
  console.log('🚀 Starting Firestore Menu Seeding...');
  const menuCollection = collection(db, 'menu');
  
  // Check if already seeded
  const snapshot = await getDocs(menuCollection);
  if (!snapshot.empty) {
    console.log('⚠️ Menu already contains items. Skipping seed to prevent duplicates.');
    return;
  }

  const batch = writeBatch(db);

  MENU_ITEMS.forEach((item) => {
    const docRef = doc(menuCollection, item.id);
    batch.set(docRef, {
      ...item,
      updatedAt: new Date().toISOString()
    });
  });

  await batch.commit();
  console.log(`✅ Successfully seeded ${MENU_ITEMS.length} items to Firestore.`);
}

seedMenu().catch(console.error);
