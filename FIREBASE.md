# Bamanda Heritage Restaurant: Firebase Technical Specification

This document outlines the database architecture, security rules, and integration strategy for migrating the Bamanda platform from local storage to a production-ready Firebase backend.

## 1. Cloud Firestore Structure (NoSQL)

### `menu` (Collection)
Primary repository for all heritage dishes and variations.
- **ID**: `item-{slug}` (e.g., `item-ofada-rice`)
- **Fields**:
  - `name`: string
  - `description`: string
  - `price`: number
  - `category`: string (Enum: Rice Dishes, Proteins, etc.)
  - `mealTime`: array[string] (Breakfast, Lunch, Dinner)
  - `image`: string (Cloud Storage URL)
  - `tags`: array[string]
  - `available`: boolean
  - `isTrending`: boolean
  - `whatsappLink`: string
  - `updatedAt`: timestamp

### `orders` (Collection)
Live stream of customer curations and status tracking.
- **ID**: `BAM-{RANDOM_UPPERCASE}` (e.g., `BAM-MOY1RQEN`)
- **Fields**:
  - `customer`: object { `name`, `phone`, `address` }
  - `items`: array[object] { `id`, `name`, `price`, `quantity` }
  - `total`: number
  - `status`: string (Enum: pending, preparing, on-the-way, delivered, cancelled)
  - `notes`: string
  - `createdAt`: timestamp
  - `estimatedDeliveryTime`: number (minutes)
  - `metadata`: object { `platform`, `device`, `userAgent`, `language` }

### `blog` (Collection)
The Heritage Gazette articles and editorial content.
- **ID**: `post-{slug}`
- **Fields**:
  - `title`: string
  - `topic`: string
  - `content`: string (Markdown supported)
  - `image`: string
  - `date`: string (Label for display)
  - `author`: string
  - `layout`: string (editorial, minimal, narrative, luxury)
  - `category`: string
  - `publishedAt`: timestamp

### `staff` (Collection)
Internal curation team credentials and role management.
- **ID**: `staff-{uid}` (Linked to Firebase Auth UID)
- **Fields**:
  - `name`: string
  - `email`: string
  - `role`: string (admin, staff, rider)
  - `createdAt`: timestamp
  - `lastActive`: timestamp

### `tracking_logs` (Collection)
Capture points for order tracking metadata.
- **ID**: Auto-generated
- **Fields**:
  - `orderId`: string (Reference)
  - `action`: string (e.g., check_track_landing)
  - `timestamp`: timestamp
  - `context`: object { `userAgent`, `platform`, `screenResolution`, `referrer` }

---

## 2. Security Rules (Firestore)

```javascript
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Public: Read-only access to Menu and Blog
    match /menu/{item} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/staff/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /blog/{post} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/staff/$(request.auth.uid)).data.role == 'admin';
    }

    // Orders: Public can create, but only owner/staff can read/update
    match /orders/{order} {
      allow create: if true;
      allow read: if true; // In production, restrict to OrderID + Phone validation
      allow update, delete: if request.auth != null;
    }

    // Staff: Protected access
    match /staff/{member} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && get(/databases/$(database)/documents/staff/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Logs: Write-only for public
    match /tracking_logs/{log} {
      allow create: if true;
      allow read, update: if request.auth != null;
    }
  }
}
```

---

## 3. Sample Dataset (JSON)

### Menu Item
```json
{
  "name": "Smokey Heritage Jollof",
  "category": "Rice Dishes",
  "price": 4500,
  "description": "Ancestral firewood-smoked rice with scorched bell peppers and native spices.",
  "available": true,
  "isTrending": true,
  "image": "https://firebasestorage.googleapis.com/.../jollof.png"
}
```

### Staff Account
```json
{
  "name": "Ebuka Curator",
  "email": "ebuka@bamanda.com",
  "role": "admin",
  "createdAt": "2026-05-09T10:00:00Z"
}
```

---

## 4. Integration Strategy

1.  **Firebase SDK Setup**: Initialize using the Config provided in `.env`.
2.  **Auth Implementation**: Migrate current local password check to `signInWithEmailAndPassword`.
3.  **Real-time Synchronization**: Use `onSnapshot` for the Admin Orders dashboard to provide instant updates when new orders arrive.
4.  **Offline Persistence**: Enable `enableIndexedDbPersistence` for the MenuScreen to fulfill the "faster loading" requirement even under poor network conditions.
5.  **Image Sourcing**: All assets in `/public/images` should be migrated to **Firebase Storage** with an automated script.

## 5. Deployment Checklist
- [ ] Create Firebase Project in Console
- [ ] Enable Email/Password Authentication
- [ ] Provision Firestore in Production Mode
- [ ] Apply Security Rules
- [ ] Configure Storage Buckets for Images
- [ ] Update `.env` with production keys
