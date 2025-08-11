// src/lib/storage.js
const hasLS = typeof window !== 'undefined' && 'localStorage' in window;

export const storage = {
  get(key, fallback = null) {
    if (!hasLS) return fallback;
    try {
      const v = window.localStorage.getItem(key);
      return v == null ? fallback : JSON.parse(v);
    } catch (e) {
      // JSON parse or quota issues
      console.warn('storage.get error:', e);
      return fallback;
    }
  },

  set(key, value) {
    if (!hasLS) return false;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn('storage.set error:', e);
      return false;
    }
  },

  remove(key) {
    if (!hasLS) return;
    try { window.localStorage.removeItem(key); } catch (e) { console.warn('storage.remove error:', e); }
  },

  has(key) {
    if (!hasLS) return false;
    try { return window.localStorage.getItem(key) !== null; } catch { return false; }
  }
};
