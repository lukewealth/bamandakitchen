/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import { MENU_ITEMS } from '../src/data';

dotenv.config();

if (!process.env.VITE_FIREBASE_PROJECT_ID) {
  console.error('❌ Missing VITE_FIREBASE_PROJECT_ID in .env');
  process.exit(1);
}

// Initialize with project ID
// This works in environments where GOOGLE_APPLICATION_CREDENTIALS is set 
// or if the machine is authenticated via gcloud/firebase
initializeApp({
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
});

const db = getFirestore();

async function seedMenu() {
  console.log(`🚀 Seeding Firestore for project: ${process.env.VITE_FIREBASE_PROJECT_ID}`);
  
  const menuCollection = db.collection('menu');
  const snapshot = await menuCollection.limit(1).get();
  
  if (!snapshot.empty) {
    console.log('⚠️ Menu already contains items. Skipping seed.');
    return;
  }

  const batch = db.batch();

  MENU_ITEMS.forEach((item) => {
    const docRef = menuCollection.doc(item.id);
    batch.set(docRef, {
      ...item,
      updatedAt: FieldValue.serverTimestamp()
    });
  });

  await batch.commit();
  console.log(`✅ Successfully seeded ${MENU_ITEMS.length} items.`);
}

seedMenu().catch(console.error);
