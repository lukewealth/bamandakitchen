/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

// 1. Supabase Client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 2. Firebase Admin (Assuming ADC or local credentials)
if (getApps().length === 0) {
  initializeApp({
    projectId: process.env.VITE_FIREBASE_PROJECT_ID
  });
}
const db = getFirestore();

async function migrateCollection(collectionName: string, tableName: string, transform?: (data: any) => any) {
  console.log(`📦 Migrating ${collectionName} -> ${tableName}...`);
  
  const snapshot = await db.collection(collectionName).get();
  const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  if (docs.length === 0) {
    console.log(`⚠️ No documents found in ${collectionName}.`);
    return;
  }

  const transformedDocs = transform ? docs.map(transform) : docs;

  const { error } = await supabase.from(tableName).upsert(transformedDocs);

  if (error) {
    console.error(`❌ Error migrating ${tableName}:`, error);
  } else {
    console.log(`✅ Successfully migrated ${docs.length} records to ${tableName}.`);
  }
}

async function runMigration() {
  // Menu Migration
  await migrateCollection('menu', 'menu', (item) => ({
    id: item.id.includes('-') && item.id.length > 20 ? item.id : undefined, // Keep UUIDs if valid, else let Supabase generate
    name: item.name,
    description: item.description,
    price: item.price,
    category: item.category,
    meal_time: item.mealTime,
    image: item.image,
    tag: item.tag,
    portion: item.portion,
    tags: item.tags,
    available: item.available !== false,
    is_trending: !!item.isTrending,
    whatsapp_link: item.whatsappLink,
    updated_at: item.updatedAt ? new Date(item.updatedAt._seconds * 1000).toISOString() : new Date().toISOString()
  }));

  // Blog Migration
  await migrateCollection('blog', 'blog', (post) => ({
    title: post.title,
    topic: post.topic,
    content: post.content,
    image: post.image,
    date: post.date,
    author: post.author,
    layout: post.layout,
    category: post.category
  }));

  // Staff Migration
  await migrateCollection('staff', 'staff', (member) => ({
    id: member.id, // Auth UID
    name: member.name,
    email: member.email,
    role: member.role,
    created_at: member.createdAt ? new Date(member.createdAt._seconds * 1000).toISOString() : new Date().toISOString()
  }));

  // Orders Migration
  await migrateCollection('orders', 'orders', (order) => ({
    id: order.id,
    customer_name: order.customer?.name,
    customer_phone: order.customer?.phone,
    customer_address: order.customer?.address,
    items: order.items,
    total: order.total,
    status: order.status,
    notes: order.notes,
    created_at: order.createdAt,
    confirmed_at: order.confirmedAt,
    queue_position: order.queuePosition,
    estimated_delivery_time: order.estimatedDeliveryTime,
    metadata: order.metadata
  }));

  console.log('🚀 Migration Finished.');
}

runMigration().catch(console.error);
