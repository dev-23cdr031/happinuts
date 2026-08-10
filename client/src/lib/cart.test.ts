import { describe, expect, it, beforeEach } from 'vitest';
import {
  addToCart,
  clearCart,
  getCartItems,
  getCartCount,
  removeFromCart,
  setCartUser,
} from './cart';

const createLocalStorageMock = () => {
  let store: Record<string, string> = {};
  const listeners = new Set<(event: Event) => void>();

  return {
    getItem: (key: string) => (key in store ? store[key] : null),
    setItem: (key: string, value: string) => {
      store[key] = String(value);
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    addEventListener: (_event: string, listener: (event: Event) => void) => {
      listeners.add(listener);
    },
    removeEventListener: (_event: string, listener: (event: Event) => void) => {
      listeners.delete(listener);
    },
    dispatchEvent: (event: Event) => {
      listeners.forEach((listener) => listener(event));
      return true;
    },
  };
};

const storage = createLocalStorageMock();

Object.defineProperty(globalThis, 'localStorage', {
  value: storage,
  configurable: true,
});

Object.defineProperty(globalThis, 'window', {
  value: {
    ...storage,
    localStorage: storage,
  },
  configurable: true,
});

describe('cart store', () => {
  beforeEach(() => {
    storage.clear();
    setCartUser(null);
  });

  it('adds products to the cart and tracks the total count', () => {
    addToCart({
      id: '1',
      name: 'Raw Cashews',
      tamilName: 'முழு முந்திரி பருப்பு',
      price: 900,
      weight: '1 kg',
      image: '/assets/products/raw-cashews.jpg',
    });

    addToCart({
      id: '1',
      name: 'Raw Cashews',
      tamilName: 'முழு முந்திரி பருப்பு',
      price: 900,
      weight: '1 kg',
      image: '/assets/products/raw-cashews.jpg',
    }, 2);

    expect(getCartItems()).toHaveLength(1);
    expect(getCartItems()[0].quantity).toBe(3);
    expect(getCartCount()).toBe(3);
  });

  it('removes a product from the cart', () => {
    addToCart({
      id: '2',
      name: 'Pistachios',
      tamilName: 'பிஸ்தா பருப்பு',
      price: 2700,
      weight: '1 kg',
    });

    removeFromCart('2');

    expect(getCartItems()).toHaveLength(0);
    expect(getCartCount()).toBe(0);
  });

  it('clears all products from the cart', () => {
    addToCart({
      id: '1',
      name: 'Raw Cashews',
      tamilName: 'முழு முந்திரி பருப்பு',
      price: 900,
      weight: '1 kg',
    });
    addToCart({
      id: '2',
      name: 'Pistachios',
      tamilName: 'பிஸ்தா பருப்பு',
      price: 2700,
      weight: '1 kg',
    });

    clearCart();

    expect(getCartItems()).toHaveLength(0);
    expect(getCartCount()).toBe(0);
  });

  it('keeps each user\'s cart separate by email', () => {
    // User A adds products
    setCartUser('alice@example.com');
    addToCart({
      id: '1',
      name: 'Raw Cashews',
      tamilName: 'முழு முந்திரி பருப்பு',
      price: 900,
      weight: '1 kg',
    });

    // User B has an empty cart
    setCartUser('bob@example.com');
    expect(getCartItems()).toHaveLength(0);
    expect(getCartCount()).toBe(0);

    // User B adds their own product
    addToCart({
      id: '2',
      name: 'Pistachios',
      tamilName: 'பிஸ்தா பருப்பு',
      price: 2700,
      weight: '1 kg',
    });

    // Switch back to User A — their cart is untouched
    setCartUser('alice@example.com');
    expect(getCartItems()).toHaveLength(1);
    expect(getCartItems()[0].id).toBe('1');
    expect(getCartCount()).toBe(1);

    // User B's cart is still intact
    setCartUser('bob@example.com');
    expect(getCartItems()).toHaveLength(1);
    expect(getCartItems()[0].id).toBe('2');
    expect(getCartCount()).toBe(1);
  });

  it('migrates guest cart items into the signed-in user\'s cart', () => {
    // Guest adds a product
    setCartUser(null);
    addToCart({
      id: '1',
      name: 'Raw Cashews',
      tamilName: 'முழு முந்திரி பருப்பு',
      price: 900,
      weight: '1 kg',
    });

    // Signing in as a user migrates the guest cart
    setCartUser('alice@example.com');
    expect(getCartItems()).toHaveLength(1);
    expect(getCartItems()[0].id).toBe('1');

    // Guest cart is now empty
    setCartUser(null);
    expect(getCartItems()).toHaveLength(0);
  });
});
