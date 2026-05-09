/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Robust input validation and security utilities for Bamanda Heritage.
 */

export const validatePhone = (phone: string): boolean => {
  // Supports international format and local Nigerian format
  const phoneRegex = /^(\+234|0)[789][01]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 3 && name.trim().length <= 50 && /^[a-zA-Z\s'-]+$/.test(name);
};

export const validateAddress = (address: string): boolean => {
  return address.trim().length >= 10 && address.trim().length <= 250;
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, ''); // Basic XSS prevention
};

/**
 * Simple client-side throttling to prevent rapid form submissions.
 */
const throttles = new Map<string, number>();

export const isThrottled = (action: string, limitMs: number = 5000): boolean => {
  const now = Date.now();
  const lastTime = throttles.get(action) || 0;
  
  if (now - lastTime < limitMs) {
    return true;
  }
  
  throttles.set(action, now);
  return false;
};

/**
 * Cookie-based Patron Tracking for Personalization.
 */
export const patronTracker = {
  saveOrder: (order: any) => {
    const history = patronTracker.getHistory();
    const updated = [order, ...history].slice(0, 10); // Keep last 10 orders
    localStorage.setItem('bamanda_patron_history', JSON.stringify(updated));
    
    // Also save favorite items
    const favorites = patronTracker.getFavorites();
    order.items.forEach((item: any) => {
      const existing = favorites.find(f => f.id === item.id);
      if (existing) {
        existing.count += 1;
      } else {
        favorites.push({ id: item.id, name: item.name, count: 1 });
      }
    });
    localStorage.setItem('bamanda_patron_favorites', JSON.stringify(favorites.sort((a, b) => b.count - a.count).slice(0, 5)));
  },

  getHistory: (): any[] => {
    try {
      return JSON.parse(localStorage.getItem('bamanda_patron_history') || '[]');
    } catch {
      return [];
    }
  },

  getFavorites: (): any[] => {
    try {
      return JSON.parse(localStorage.getItem('bamanda_patron_favorites') || '[]');
    } catch {
      return [];
    }
  },

  trackView: (itemId: string) => {
    const viewed = JSON.parse(localStorage.getItem('bamanda_viewed_items') || '[]');
    const updated = [itemId, ...viewed.filter((id: string) => id !== itemId)].slice(0, 12);
    localStorage.setItem('bamanda_viewed_items', JSON.stringify(updated));
  },

  captureTrackingMetadata: (action: string) => {
    const metadata = {
      action,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      referrer: document.referrer || 'direct',
      href: window.location.href
    };
    const logs = JSON.parse(localStorage.getItem('bamanda_tracking_logs') || '[]');
    localStorage.setItem('bamanda_tracking_logs', JSON.stringify([metadata, ...logs].slice(0, 50)));
    console.log(`[Tracking] Captured metadata for: ${action}`, metadata);
  }
};
