import { supabase } from '@/lib/supabase';
import { type Product } from '@/data/products';

// ============================================
// Types
// ============================================

export type OrderStatus = 'Pending' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';

export type AdminOrderItem = {
  id: string;
  product_id: string | null;
  name: string;
  price: number;
  quantity: number;
};

export type AdminOrder = {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_name: string;
  email: string;
  phone: string;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  payment_method: string;
  payment_id: string | null;
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
  status: OrderStatus;
  created_at: string;
  items?: AdminOrderItem[];
};

export type AdminCustomer = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role: string;
  created_at: string;
  order_count?: number;
  total_spent?: number;
};

// ============================================
// Constants
// ============================================

const ADMIN_ORDERS_KEY = 'happi-nuts-admin-orders';
const LOCAL_PRODUCTS_KEY = 'happi-nuts-admin-products';

const PRODUCT_COLUMNS = `
  id,
  name,
  tamil_name,
  price,
  original_price,
  weight,
  rating,
  reviews,
  badge,
  description,
  benefits,
  ingredients,
  nutritional_info,
  storage_instructions,
  category,
  image,
  created_at,
  updated_at
`;

// ============================================
// Helpers
// ============================================

const isOnline = () => {
  if (typeof window === 'undefined') return true;
  return Boolean(
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_ANON_KEY &&
    import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co',
  );
};

const readLocalJson = <T>(key: string, fallback: T): T => {
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

const writeLocalJson = <T>(key: string, value: T) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

const toLocalProduct = (row: any): Product => ({
  id: row.id,
  name: row.name,
  tamilName: row.tamil_name || '',
  price: Number(row.price) || 0,
  originalPrice: row.original_price != null ? Number(row.original_price) : undefined,
  weight: row.weight || '1 kg',
  rating: Number(row.rating) || 4.5,
  reviews: Number(row.reviews) || 0,
  badge: row.badge || undefined,
  description: row.description || '',
  benefits: Array.isArray(row.benefits) ? row.benefits : [],
  ingredients: row.ingredients || '',
  nutritionalInfo: row.nutritional_info || {
    calories: 'See package',
    protein: 'See package',
    fat: 'See package',
    carbs: 'See package',
    fiber: 'See package',
  },
  storageInstructions: row.storage_instructions || '',
  category: row.category || 'nuts',
  image: row.image || undefined,
});

const toSupabaseProduct = (product: Product) => ({
  id: product.id,
  name: product.name,
  tamil_name: product.tamilName || '',
  price: Number(product.price) || 0,
  original_price: product.originalPrice ?? null,
  weight: product.weight || '1 kg',
  rating: Number(product.rating) || 4.5,
  reviews: Number(product.reviews) || 0,
  badge: product.badge ?? null,
  description: product.description || '',
  benefits: Array.isArray(product.benefits) ? product.benefits : [],
  ingredients: product.ingredients || '',
  nutritional_info: product.nutritionalInfo || {},
  storage_instructions: product.storageInstructions || '',
  category: product.category || 'nuts',
  image: product.image || null,
});

// ============================================
// PRODUCTS
// ============================================

export const fetchProducts = async (): Promise<Product[]> => {
  if (!isOnline()) {
    return readLocalJson<Product[]>(LOCAL_PRODUCTS_KEY, []);
  }

  const { data, error } = await supabase.from('products').select(PRODUCT_COLUMNS).order('name');

  if (error) {
    console.warn('Failed to fetch products from Supabase, falling back to local:', error.message);
    return readLocalJson<Product[]>(LOCAL_PRODUCTS_KEY, []);
  }

  if (!data || data.length === 0) {
    return readLocalJson<Product[]>(LOCAL_PRODUCTS_KEY, []);
  }

  return data.map(toLocalProduct);
};

export const seedProductsToSupabase = async (products: Product[]): Promise<void> => {
  if (!isOnline() || products.length === 0) return;

  const rows = products.map(toSupabaseProduct);

  const { error } = await supabase
    .from('products')
    .upsert(rows, { onConflict: 'id' });

  if (error) {
    console.warn('Failed to seed products to Supabase:', error.message);
  }
};

export const saveProductToSupabase = async (product: Product): Promise<boolean> => {
  // Always save locally first so admin edits persist even without Supabase
  const localProducts = readLocalJson<Product[]>(LOCAL_PRODUCTS_KEY, []);
  const existingIndex = localProducts.findIndex((p) => p.id === product.id || p.name === product.name);
  if (existingIndex >= 0) {
    localProducts[existingIndex] = { ...product, id: localProducts[existingIndex].id };
  } else {
    localProducts.unshift(product);
  }
  writeLocalJson(LOCAL_PRODUCTS_KEY, localProducts);

  if (!isOnline()) return true; // saved locally

  const { error } = await supabase.from('products').upsert(toSupabaseProduct(product), { onConflict: 'id' });
  if (error) {
    console.warn('Failed to save product to Supabase:', error.message);
    return true; // still saved locally
  }
  return true;
};

export const deleteProductFromSupabase = async (productId: string): Promise<boolean> => {
  // Always remove locally so admin deletes work even without Supabase
  const localProducts = readLocalJson<Product[]>(LOCAL_PRODUCTS_KEY, []);
  const nextProducts = localProducts.filter((p) => p.id !== productId);
  writeLocalJson(LOCAL_PRODUCTS_KEY, nextProducts);

  if (!isOnline()) return true;

  const { error } = await supabase.from('products').delete().eq('id', productId);
  if (error) {
    console.warn('Failed to delete product from Supabase:', error.message);
    return true; // still deleted locally
  }
  return true;
};

// ============================================
// ORDERS
// ============================================

export const fetchOrders = async (): Promise<AdminOrder[]> => {
  const localOrders = readLocalJson<AdminOrder[]>(ADMIN_ORDERS_KEY, []);

  if (!isOnline()) {
    return localOrders;
  }

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('Failed to fetch orders from Supabase, falling back to local:', error.message);
    return localOrders;
  }

  let remoteOrders: AdminOrder[] = [];

  if (data && data.length > 0) {
    // Fetch order items for all orders
    const orderIds = data.map((order) => order.id);
    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .in('order_id', orderIds);

    if (!itemsError && itemsData) {
      const itemsByOrder = itemsData.reduce<Record<string, AdminOrderItem[]>>((acc, item) => {
        if (!acc[item.order_id]) acc[item.order_id] = [];
        acc[item.order_id].push({
          id: item.id,
          product_id: item.product_id,
          name: item.name,
          price: Number(item.price),
          quantity: item.quantity,
        });
        return acc;
      }, {});

      remoteOrders = data.map((order) => ({
        ...order,
        subtotal: Number(order.subtotal),
        discount: Number(order.discount),
        delivery: Number(order.delivery),
        total: Number(order.total),
        items: itemsByOrder[order.id] || [],
      }));
    } else {
      remoteOrders = data.map((order) => ({
        ...order,
        subtotal: Number(order.subtotal),
        discount: Number(order.discount),
        delivery: Number(order.delivery),
        total: Number(order.total),
        items: [],
      }));
    }
  }

  // Merge local + remote orders, dedupe by order_number
  const merged = [...localOrders, ...remoteOrders];
  const seen = new Set<string>();
  return merged.filter((order) => {
    const key = order.order_number || order.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<boolean> => {
  // Always update locally so status changes persist even without Supabase
  const localOrders = readLocalJson<AdminOrder[]>(ADMIN_ORDERS_KEY, []);
  const nextOrders = localOrders.map((o) => (o.id === orderId ? { ...o, status } : o));
  writeLocalJson(ADMIN_ORDERS_KEY, nextOrders);

  if (!isOnline()) return true;

  const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
  if (error) {
    console.warn('Failed to update order status:', error.message);
    return true; // still updated locally
  }
  return true;
};

export const updateOrderDiscount = async (
  orderId: string,
  discount: number,
  total: number,
): Promise<boolean> => {
  // Always update locally so discount changes persist even without Supabase
  const localOrders = readLocalJson<AdminOrder[]>(ADMIN_ORDERS_KEY, []);
  const nextOrders = localOrders.map((o) => (o.id === orderId ? { ...o, discount, total } : o));
  writeLocalJson(ADMIN_ORDERS_KEY, nextOrders);

  if (!isOnline()) return true;

  const { error } = await supabase.from('orders').update({ discount, total }).eq('id', orderId);
  if (error) {
    console.warn('Failed to update order discount:', error.message);
    return true; // still updated locally
  }
  return true;
};

export const updateOrderDelivery = async (
  orderId: string,
  delivery: number,
  total: number,
): Promise<boolean> => {
  // Always update locally so delivery changes persist even without Supabase
  const localOrders = readLocalJson<AdminOrder[]>(ADMIN_ORDERS_KEY, []);
  const nextOrders = localOrders.map((o) => (o.id === orderId ? { ...o, delivery, total } : o));
  writeLocalJson(ADMIN_ORDERS_KEY, nextOrders);

  if (!isOnline()) return true;

  const { error } = await supabase.from('orders').update({ delivery, total }).eq('id', orderId);
  if (error) {
    console.warn('Failed to update order delivery:', error.message);
    return true; // still updated locally
  }
  return true;
};

export const deleteOrder = async (orderId: string): Promise<boolean> => {
  // Local-only orders (offline/manual orders) have no matching database record to remove.
  const localOrders = readLocalJson<AdminOrder[]>(ADMIN_ORDERS_KEY, []);
  const isLocalOnlyOrder = orderId.startsWith('local-') || orderId.startsWith('manual-');

  if (!isOnline() || isLocalOnlyOrder) {
    writeLocalJson(ADMIN_ORDERS_KEY, localOrders.filter((order) => order.id !== orderId));
    return true;
  }

  // The database's foreign-key cascade removes the associated order items.
  const { error } = await supabase.from('orders').delete().eq('id', orderId);
  if (error) {
    console.warn('Failed to delete order from Supabase:', error.message);
    return false;
  }

  // Keep the offline cache in sync only once Supabase has accepted the deletion.
  writeLocalJson(ADMIN_ORDERS_KEY, localOrders.filter((order) => order.id !== orderId));
  return true;
};

export const createOrderInSupabase = async (order: {
  order_number: string;
  user_id: string | null;
  customer_name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  payment_method: string;
  payment_id?: string | null;
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
  items: Array<{ product_id: string; name: string; price: number; quantity: number }>;
}): Promise<AdminOrder | null> => {
  // Build the local order object first so it always persists
  const localOrder: AdminOrder = {
    id: `local-${Date.now()}`,
    order_number: order.order_number,
    user_id: order.user_id,
    customer_name: order.customer_name,
    email: order.email,
    phone: order.phone,
    address: order.address || null,
    city: order.city || null,
    state: order.state || null,
    pincode: order.pincode || null,
    payment_method: order.payment_method,
    payment_id: order.payment_id || null,
    subtotal: order.subtotal,
    discount: order.discount,
    delivery: order.delivery,
    total: order.total,
    status: 'Pending',
    created_at: new Date().toISOString(),
    items: order.items.map((item, index) => ({
      id: String(index),
      product_id: item.product_id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  };

  // Always save locally so orders appear in admin even without Supabase
  const localOrders = readLocalJson<AdminOrder[]>(ADMIN_ORDERS_KEY, []);
  localOrders.unshift(localOrder);
  writeLocalJson(ADMIN_ORDERS_KEY, localOrders);

  // Also track the customer locally so admin can see who logged in
  if (order.user_id) {
    const localCustomers = readLocalJson<AdminCustomer[]>('happi-nuts-admin-customers', []);
    const existing = localCustomers.find((c) => c.id === order.user_id);
    if (existing) {
      existing.full_name = order.customer_name;
      existing.email = order.email;
      existing.phone = order.phone;
      existing.order_count = (existing.order_count || 0) + 1;
      existing.total_spent = (existing.total_spent || 0) + order.total;
    } else {
      localCustomers.unshift({
        id: order.user_id,
        full_name: order.customer_name,
        email: order.email,
        phone: order.phone,
        role: 'customer',
        created_at: new Date().toISOString(),
        order_count: 1,
        total_spent: order.total,
      });
    }
    writeLocalJson('happi-nuts-admin-customers', localCustomers);
  }

  if (!isOnline()) return localOrder;

  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: order.order_number,
      user_id: order.user_id,
      customer_name: order.customer_name,
      email: order.email,
      phone: order.phone,
      address: order.address || null,
      city: order.city || null,
      state: order.state || null,
      pincode: order.pincode || null,
      payment_method: order.payment_method,
      payment_id: order.payment_id || null,
      subtotal: order.subtotal,
      discount: order.discount,
      delivery: order.delivery,
      total: order.total,
      status: 'Pending',
    })
    .select()
    .single();

  if (orderError) {
    console.warn('Failed to create order in Supabase:', orderError.message);
    return localOrder;
  }

  if (orderData) {
    const itemsRows = order.items.map((item) => ({
      order_id: orderData.id,
      product_id: item.product_id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(itemsRows);
    if (itemsError) {
      console.warn('Failed to create order items in Supabase:', itemsError.message);
    }

    return {
      ...orderData,
      subtotal: Number(orderData.subtotal),
      discount: Number(orderData.discount),
      delivery: Number(orderData.delivery),
      total: Number(orderData.total),
      status: orderData.status as OrderStatus,
      items: order.items.map((item, index) => ({
        id: String(index),
        product_id: item.product_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    };
  }

  return localOrder;
};

// ============================================
// CUSTOMERS
// ============================================

export const fetchCustomers = async (): Promise<AdminCustomer[]> => {
  const localCustomers = readLocalJson<AdminCustomer[]>('happi-nuts-admin-customers', []);

  if (!isOnline()) return localCustomers;

  const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });

  if (error) {
    console.warn('Failed to fetch customers:', error.message);
    return localCustomers;
  }

  if (!data) return localCustomers;

  // Get order counts per user
  const { data: ordersData } = await supabase.from('orders').select('user_id, total');

  const ordersByUser = (ordersData || []).reduce<Record<string, { count: number; total: number }>>((acc, order) => {
    if (!order.user_id) return acc;
    if (!acc[order.user_id]) acc[order.user_id] = { count: 0, total: 0 };
    acc[order.user_id].count += 1;
    acc[order.user_id].total += Number(order.total) || 0;
    return acc;
  }, {});

  // Read local admin overrides so roles persist even if DB column doesn't exist
  const localRoles = readLocalJson<Record<string, string>>('happi-nuts-admin-roles', {});

  const remoteCustomers = data.map((profile) => ({
    id: profile.id,
    full_name: profile.full_name,
    email: profile.email,
    phone: profile.phone,
    role: localRoles[profile.id] || profile.role || 'customer',
    created_at: profile.created_at,
    order_count: ordersByUser[profile.id]?.count || 0,
    total_spent: ordersByUser[profile.id]?.total || 0,
  }));

  // Merge local + remote customers, dedupe by id
  const merged = [...localCustomers, ...remoteCustomers];
  const seen = new Set<string>();
  return merged.filter((c) => {
    if (seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });
};

export const updateCustomerRole = async (userId: string, role: 'customer' | 'admin'): Promise<boolean> => {
  let dbUpdated = false;

  if (isOnline()) {
    try {
      const { error } = await supabase.from('profiles').update({ role }).eq('id', userId);
      if (!error) {
        dbUpdated = true;
      } else if (!error.message.includes('column')) {
        console.warn('Failed to update customer role:', error.message);
      }
    } catch (e) {
      console.warn('Failed to update customer role:', e);
    }
  }

  // Always update local override so role changes persist even if DB column is missing
  const localRoles = readLocalJson<Record<string, string>>('happi-nuts-admin-roles', {});
  if (role === 'admin') {
    localRoles[userId] = 'admin';
    // Also set the admin status flag for checkIsAdmin
    const localAdmin = readLocalJson<Record<string, boolean>>('happi-nuts-admin-status', {});
    localAdmin[userId] = true;
    writeLocalJson('happi-nuts-admin-status', localAdmin);
  } else {
    delete localRoles[userId];
    const localAdmin = readLocalJson<Record<string, boolean>>('happi-nuts-admin-status', {});
    delete localAdmin[userId];
    writeLocalJson('happi-nuts-admin-status', localAdmin);
  }
  writeLocalJson('happi-nuts-admin-roles', localRoles);

  return true;
};

// ============================================
// ADMIN CHECK
// ============================================

const ADMIN_LOCAL_KEY = 'happi-nuts-admin-status';

/**
 * The ONLY emails allowed to access the admin dashboard.
 * No other user (including users with a local override or a
 * 'role = admin' profile row) can see the admin page.
 */
export const OWNER_EMAIL = 'devdharrshans.23csd@kongu.edu';
export const ADMIN_EMAILS = [OWNER_EMAIL, 'devdharrshan421@gmail.com'];

export const isOwnerEmail = (email: string | null | undefined): boolean =>
  Boolean(
    email &&
      ADMIN_EMAILS.some(
        (adminEmail) => email.trim().toLowerCase() === adminEmail.toLowerCase(),
      ),
  );

export const checkIsAdmin = async (): Promise<boolean> => {
  const { data } = await supabase.auth.getSession();
  const session = data.session;

  if (!session) return false;

  // Strict owner-only check — no other user gets admin access.
  if (!isOwnerEmail(session.user.email)) return false;

  // Cache the owner in the local flag for fast future checks.
  const existing = readLocalJson<Record<string, boolean>>(ADMIN_LOCAL_KEY, {});
  existing[session.user.id] = true;
  writeLocalJson(ADMIN_LOCAL_KEY, existing);

  return true;
};

// Mark/unmark the current user as admin locally.
// NOTE: This only matters for the owner email — non-owners are always rejected
// by checkIsAdmin regardless of this flag.
export const setLocalAdmin = (userId: string, isAdmin: boolean): void => {
  const localAdmin = readLocalJson<Record<string, boolean>>(ADMIN_LOCAL_KEY, {});
  if (isAdmin) {
    localAdmin[userId] = true;
  } else {
    delete localAdmin[userId];
  }
  writeLocalJson(ADMIN_LOCAL_KEY, localAdmin);
};
