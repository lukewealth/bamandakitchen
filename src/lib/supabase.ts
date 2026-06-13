/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vzkwqmnegijzqrjagydh.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseAnonKey) {
  console.warn('⚠️ Missing VITE_SUPABASE_ANON_KEY in environment. Supabase features will be disabled.');
}

// Only create the client if we have a key, otherwise export null or a proxy
export const supabase = supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Helper to upload a base64 image or File to Supabase Storage
 */
export const uploadToSupabase = async (
  bucket: string,
  path: string,
  asset: string | File
): Promise<string | null> => {
  if (!supabase) {
    console.error('[Supabase Storage] Client not initialized. Check your environment variables.');
    return null;
  }
  try {
    let body: any;
    let contentType = 'image/jpeg';

    if (typeof asset === 'string' && asset.startsWith('data:image/')) {
      // Convert base64 to Blob
      const base64Data = asset.split(',')[1];
      const binaryData = atob(base64Data);
      const array = [];
      for (let i = 0; i < binaryData.length; i++) {
        array.push(binaryData.charCodeAt(i));
      }
      body = new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
    } else {
      body = asset;
    }

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, body, {
        contentType,
        upsert: true
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (err) {
    console.error('[Supabase Storage] Upload failed:', err);
    return null;
  }
};
