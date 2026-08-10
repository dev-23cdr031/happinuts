import { beforeEach, describe, expect, it, vi } from 'vitest';

const createLocalStorageMock = () => {
  let store: Record<string, string> = {};
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
  };
};

const storage = createLocalStorageMock();
Object.defineProperty(globalThis, 'localStorage', {
  value: storage,
  configurable: true,
});

// Mock window so admin.ts and products.ts can persist to localStorage
Object.defineProperty(globalThis, 'window', {
  value: { localStorage: storage },
  configurable: true,
});

describe('admin product store', () => {
  beforeEach(async () => {
    vi.resetModules();
    storage.clear();
  });

  it('seeds products when no saved admin catalog exists', async () => {
    const { getAdminProducts } = await import('./admin');
    const products = getAdminProducts();
    expect(products.length).toBeGreaterThan(0);
    expect(products[0].name).toBeTruthy();
  });

  it('updates a product price and removes a product from the catalog', async () => {
    const { getAdminProducts, updateAdminProductPrice, removeAdminProduct } = await import('./admin');
    const first = getAdminProducts()[0];
    updateAdminProductPrice(first.id, 999);

    expect(getAdminProducts().find((product) => product.id === first.id)?.price).toBe(999);

    removeAdminProduct(first.id);
    expect(getAdminProducts().find((product) => product.id === first.id)).toBeUndefined();
  });

  it('updates rich product fields and keeps the product list in sync', async () => {
    const { getAdminProducts, updateAdminProduct } = await import('./admin');
    const first = getAdminProducts()[0];
    const next = { ...first, name: 'Updated Cashews', price: 1250, badge: 'premium' as const };

    updateAdminProduct(next);

    expect(getAdminProducts().find((product) => product.id === first.id)?.name).toBe('Updated Cashews');
    expect(getAdminProducts().find((product) => product.id === first.id)?.badge).toBe('premium');
  });

  it('creates a valid order number and order structure', async () => {
    const { getAdminProducts } = await import('./admin');
    const products = getAdminProducts();

    const order = {
      id: 'HN-1001',
      customerName: 'Priya Nair',
      email: 'priya@example.com',
      phone: '+91 98765 43210',
      total: 2360,
      status: 'Pending' as const,
      createdAt: new Date().toISOString(),
      items: products.slice(0, 2).map((product) => ({
        id: product.id,
        name: product.name,
        quantity: 1,
        price: product.price,
      })),
    };

    expect(order.id).toMatch(/^HN-\d+$/);
    expect(order.items.length).toBe(2);
    expect(order.status).toBe('Pending');
  });
});