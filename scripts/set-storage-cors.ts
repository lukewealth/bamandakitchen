/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
const bucketName = process.env.VITE_FIREBASE_STORAGE_BUCKET || `${projectId}.firebasestorage.app`;

if (!projectId) {
  console.error('❌ Missing VITE_FIREBASE_PROJECT_ID in .env');
  process.exit(1);
}

// Initialize with project ID
// This works in environments where GOOGLE_APPLICATION_CREDENTIALS is set
// or if the machine is authenticated via firebase login
initializeApp({
  projectId: projectId,
  storageBucket: bucketName
});

const storage = getStorage();

async function setCors() {
  console.log(`🚀 Setting CORS for bucket: ${bucketName} in project: ${projectId}`);
  
  const corsPath = path.resolve(process.cwd(), 'cors.json');
  if (!fs.existsSync(corsPath)) {
    console.error(`❌ cors.json not found at ${corsPath}`);
    process.exit(1);
  }

  const corsConfig = JSON.parse(fs.readFileSync(corsPath, 'utf8'));
  
  const bucketNames = [
    bucketName,
    `${projectId}.firebasestorage.app`,
    `${projectId}.appspot.com`
  ];

  let success = false;
  for (const name of [...new Set(bucketNames)]) {
    try {
      console.log(`Trying bucket: ${name}...`);
      await storage.bucket(name).setMetadata({ cors: corsConfig });
      console.log(`✅ Successfully applied CORS configuration to ${name}.`);
      success = true;
      break;
    } catch (error) {
      if (error.code === 404) {
        console.warn(`⚠️ Bucket ${name} not found.`);
        continue;
      }
      console.error(`❌ Failed to set CORS on ${name}:`, error);
      throw error;
    }
  }

  if (!success) {
    console.error('❌ Could not find a valid bucket to apply CORS to.');
    process.exit(1);
  }
}

setCors().catch(console.error);
