# Bamanda Heritage Restaurant: Data Manifest

This document serves as the master record for the Bamanda Digital Experience inventory and content.

## 🍛 Menu Highlights (Heritage Collection)

| ID | Name | Category | Price | Featured Image |
|----|------|----------|-------|----------------|
| `ofada_rice_full` | Ofada Sauce & Rice | Rice Dishes | 6000 | `/images/meals/ofada_rice.png` |
| `heritage_moi_moi_deluxe` | Heritage Moi Moi Deluxe | Heritage Collection | 3500 | `/images/1780956444283.jpeg` |
| `goat_meat_peppersoup_std` | Goat Meat Pepper Soup | African Dishes | 8000 | `/images/meals/goat_peppersoup.webp` |

## 📦 Storage Strategy

- **Static Assets:** Located in `/public/images/`.
- **Dynamic Uploads:** Primary storage in **Firebase Storage**. 
- **Resilience Fallback:** If cloud synchronization fails (e.g., CORS or Network issues), the system attempts a fallback to **Vercel Blob** (via Vercel CLI/Edge).
- **Local Persistence:** All menu and order data is cached in `localStorage` for sub-100ms loading. Large visual assets (Base64) are temporarily held in `localStorage` as a buffer if cloud manifests are blocked.

## 🔄 Synchronization Pipeline

1. **Admin Update:** Curator modifies item in Admin UI.
2. **Asset Handling:** 
   - If image is a new file, it is converted to a URL via the storage provider.
   - If image is a URL, it is kept as-is.
3. **Cloud Manifestation:** Data is synced to Firestore.
4. **Local Broadcast:** All connected clients receive the update via real-time snapshots.
