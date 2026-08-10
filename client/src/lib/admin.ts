import { getCatalogProducts, setCatalogProducts, type Product } from '@/data/products';

const ADMIN_ORDERS_KEY = 'happi-nuts-admin-orders';

type AdminProduct = Product;

type AdminOrderStatus = 'Pending' | 'Packed' | 'Shipped' | 'Delivered';

export type AdminOrder = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  total: number;
  status: AdminOrderStatus;
  createdAt: string;
  items: Array<{ id: string; name: string; quantity: number; price: number }>;
};

const readJson = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;

  try {
    const stored = window.localStorage.getItem(key);
    if (!stored) return fallback;

    const parsed = JSON.parse(stored);
    return parsed && typeof parsed === 'object' ? (parsed as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = <T>(key: string, value: T) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

const ensureSeedProducts = (): Product[] => {
  const saved = getCatalogProducts();
  if (saved.length > 0) return saved;

  const seeded = saved.map((product) => ({ ...product }));
  setCatalogProducts(seeded);
  return seeded;
};

export const getAdminProducts = (): Product[] => ensureSeedProducts();

export const addAdminProduct = (product: Product) => {
  const products = ensureSeedProducts();
  const next = [...products, product];
  setCatalogProducts(next);
  return next;
};

export const updateAdminProduct = (product: Product) => {
  const products = ensureSeedProducts();
  const next = products.map((item) => (item.id === product.id ? product : item));
  setCatalogProducts(next);
  return next;
};

export const updateAdminProductPrice = (productId: string, price: number) => {
  const products = ensureSeedProducts();
  const next = products.map((item) =>
    item.id === productId ? { ...item, price: Number(price) || 0 } : item,
  );
  setCatalogProducts(next);
  return next;
};

export const removeAdminProduct = (productId: string) => {
  const products = ensureSeedProducts();
  const next = products.filter((item) => item.id !== productId);
  setCatalogProducts(next);
  return next;
};

export const seedAdminOrders = (): AdminOrder[] => {
  const saved = readJson<AdminOrder[]>(ADMIN_ORDERS_KEY, []);
  if (saved.length > 0) return saved;

  const mockOrders: AdminOrder[] = [
    {
      id: 'HN-1001',
      customerName: 'Priya Nair',
      email: 'priya@example.com',
      phone: '+91 98765 43210',
      total: 2360,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      items: [
        { id: '1', name: 'Raw Cashews', quantity: 2, price: 900 },
        { id: '9', name: 'Pumpkin Seeds', quantity: 1, price: 560 },
      ],
    },
    {
      id: 'HN-1002',
      customerName: 'Arun Kumar',
      email: 'arun@example.com',
      phone: '+91 91234 56789',
      total: 1800,
      status: 'Packed',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      items: [{ id: '2', name: 'Broken Cashews', quantity: 1, price: 840 }],
    },
  ];

  writeJson(ADMIN_ORDERS_KEY, mockOrders);
  return mockOrders;
};

export const getAdminOrders = (): AdminOrder[] => seedAdminOrders();

export const updateAdminOrderStatus = (orderId: string, status: AdminOrderStatus) => {
  const orders = getAdminOrders();
  const next = orders.map((order) =>
    order.id === orderId ? { ...order, status } : order,
  );
  writeJson(ADMIN_ORDERS_KEY, next);
  return next;
};

export const storeAdminOrder = (order: AdminOrder) => {
  const orders = getAdminOrders();
  const next = [order, ...orders];
  writeJson(ADMIN_ORDERS_KEY, next);
  return next;
};
