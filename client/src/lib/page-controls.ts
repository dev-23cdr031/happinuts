// ============================================
// PAGE CONTROLS STORE
// Admin can lock/unlock any page in the app.
// Locked pages show "Temporarily locked by owner".
// ============================================

import { supabase } from '@/lib/supabase';

export type PageKey =
  | 'home'
  | 'shop'
  | 'categories'
  | 'gifting'
  | 'about'
  | 'why-happi-nuts'
  | 'contact'
  | 'cart'
  | 'wishlist'
  | 'login'
  | 'signup'
  | 'forgot-password'
  | 'reset-password'
  | 'checkout'
  | 'account'
  | 'product-details'
  | 'faq'
  | 'shipping-info'
  | 'returns'
  | 'terms'
  | 'privacy-policy'
  | 'not-found';

export interface PageControl {
  key: PageKey;
  label: string;
  enabled: boolean;
  description: string;
}

const PAGE_CONTROLS_KEY = 'happi-nuts-page-controls';

export const DEFAULT_PAGE_CONTROLS: PageControl[] = [
  { key: 'home', label: 'Home', enabled: true, description: 'Landing page with hero & features' },
  { key: 'shop', label: 'Shop', enabled: true, description: 'Product catalog with filters' },
  { key: 'categories', label: 'Categories', enabled: true, description: 'Browse by category' },
  { key: 'gifting', label: 'Gifting', enabled: true, description: 'Gifting & hampers' },
  { key: 'about', label: 'About Us', enabled: true, description: 'Our story & values' },
  { key: 'why-happi-nuts', label: 'Why Happi Nuts', enabled: true, description: 'Our differentiators' },
  { key: 'contact', label: 'Contact', enabled: true, description: 'Contact & support' },
  { key: 'cart', label: 'Cart', enabled: true, description: 'Shopping cart' },
  { key: 'wishlist', label: 'Wishlist', enabled: true, description: 'Saved favorites' },
  { key: 'login', label: 'Login', enabled: true, description: 'User sign-in' },
  { key: 'signup', label: 'Sign Up', enabled: true, description: 'Create account' },
  { key: 'forgot-password', label: 'Forgot Password', enabled: true, description: 'Request password reset' },
  { key: 'reset-password', label: 'Reset Password', enabled: true, description: 'Set new password' },
  { key: 'checkout', label: 'Checkout', enabled: true, description: 'Place order & pay' },
  { key: 'account', label: 'Account', enabled: true, description: 'User dashboard' },
  { key: 'product-details', label: 'Product Details', enabled: true, description: 'Product detail page' },
  { key: 'faq', label: 'FAQ', enabled: true, description: 'Frequently asked questions' },
  { key: 'shipping-info', label: 'Shipping Info', enabled: true, description: 'Shipping & delivery' },
  { key: 'returns', label: 'Returns', enabled: true, description: 'Returns & refunds' },
  { key: 'terms', label: 'Terms & Conditions', enabled: true, description: 'Terms of service' },
  { key: 'privacy-policy', label: 'Privacy Policy', enabled: true, description: 'Privacy & data' },
  { key: 'not-found', label: '404 Not Found', enabled: true, description: 'Fallback page' },
];

export const getPageControls = (): PageControl[] => {
  if (typeof window === 'undefined') return DEFAULT_PAGE_CONTROLS;
  try {
    const stored = window.localStorage.getItem(PAGE_CONTROLS_KEY);
    if (!stored) {
      window.localStorage.setItem(PAGE_CONTROLS_KEY, JSON.stringify(DEFAULT_PAGE_CONTROLS));
      return DEFAULT_PAGE_CONTROLS;
    }
    const parsed = JSON.parse(stored) as PageControl[];
    if (!Array.isArray(parsed)) return DEFAULT_PAGE_CONTROLS;
    // Merge with defaults to ensure all keys exist
    const merged = DEFAULT_PAGE_CONTROLS.map((def) => {
      const existing = parsed.find((p) => p.key === def.key);
      return existing ? { ...def, ...existing } : def;
    });
    return merged;
  } catch {
    return DEFAULT_PAGE_CONTROLS;
  }
};

export const setPageControl = (key: PageKey, enabled: boolean): PageControl[] => {
  const controls = getPageControls();
  const next = controls.map((c) => (c.key === key ? { ...c, enabled } : c));
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(PAGE_CONTROLS_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('happi-nuts-page-controls-updated', { detail: { key, enabled } }));
  }
  return next;
};

export const setAllPageControls = (enabled: boolean): PageControl[] => {
  const controls = getPageControls().map((c) => ({ ...c, enabled }));
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(PAGE_CONTROLS_KEY, JSON.stringify(controls));
    window.dispatchEvent(new CustomEvent('happi-nuts-page-controls-updated', { detail: { all: enabled } }));
  }
  return controls;
};

export const isPageEnabled = (key: PageKey): boolean => {
  const controls = getPageControls();
  const control = controls.find((c) => c.key === key);
  return control ? control.enabled : true;
};

export const getEnabledPageKeys = (): Set<PageKey> => {
  return new Set(getPageControls().filter((c) => c.enabled).map((c) => c.key));
};

/**
 * Load the page controls from the Supabase database and refresh the local
 * cache so customers on every device see the same locked/unlocked pages.
 */
export const loadPageControlsFromSupabase = async (): Promise<PageControl[]> => {
  const isOnline = Boolean(
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_ANON_KEY &&
    import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co',
  );

  if (!isOnline) return getPageControls();

  try {
    const { data, error } = await supabase.from('page_controls').select('*');

    if (error || !data || data.length === 0) return getPageControls();

    // Merge remote controls with the defaults so every key exists.
    const merged = DEFAULT_PAGE_CONTROLS.map((def) => {
      const remote = data.find((c) => c.key === def.key);
      return remote ? { ...def, enabled: Boolean(remote.enabled) } : def;
    });

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(PAGE_CONTROLS_KEY, JSON.stringify(merged));
      window.dispatchEvent(new CustomEvent('happi-nuts-page-controls-updated', { detail: { synced: true } }));
    }
    return merged;
  } catch {
    return getPageControls();
  }
};

// ============================================
// PRODUCT VISIBILITY
// Products can be toggled on/off. Off = "Out of Stock"
// ============================================

export interface ProductToggle {
  productId: string;
  enabled: boolean;
}

const PRODUCT_TOGGLES_KEY = 'happi-nuts-product-toggles';

export const getProductToggles = (): Record<string, boolean> => {
  if (typeof window === 'undefined') return {};
  try {
    const stored = window.localStorage.getItem(PRODUCT_TOGGLES_KEY);
    return stored ? (JSON.parse(stored) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
};

export const setProductToggle = (productId: string, enabled: boolean): void => {
  const toggles = getProductToggles();
  toggles[productId] = enabled;
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(PRODUCT_TOGGLES_KEY, JSON.stringify(toggles));
    window.dispatchEvent(new CustomEvent('happi-nuts-product-toggles-updated', { detail: { productId, enabled } }));
  }
};

export const isProductEnabled = (productId: string): boolean => {
  const toggles = getProductToggles();
  return toggles[productId] !== false; // default: enabled if not explicitly set to false
};