/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

// 1. Supabase Client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 2. Firebase Admin
if (getApps().length === 0) {
  initializeApp({
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET
  });
}
const firebaseStorage = getStorage();

async function migrateImages() {
  console.log('🚀 Starting Image Migration (Firebase Storage -> Supabase Storage)...');
  
  const [files] = await firebaseStorage.bucket().getFiles({ prefix: 'menu/' });
  console.log(`Found ${files.length} files in Firebase Storage (menu/).`);

  for (const file of files) {
    if (file.name.endsWith('/')) continue; // Skip folders

    console.log(`Migrating: ${file.name}...`);
    
    try {
      const [buffer] = await file.download();
      
      const { data, error } = await supabase.storage
        .from('images')
        .upload(file.name, buffer, {
          contentType: file.metadata.contentType || 'image/jpeg',
          upsert: true
        });

      if (error) {
        console.error(`❌ Failed to upload ${file.name} to Supabase:`, error.message);
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(file.name);
        console.log(`✅ Migrated: ${file.name} -> ${publicUrl}`);
      }
    } catch (err: any) {
      console.error(`❌ Error downloading ${file.name} from Firebase:`, err.message);
    }
  }

  console.log('🚀 Image Migration Finished.');
}

migrateImages().catch(console.error);
