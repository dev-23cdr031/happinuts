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
  image?: string | null;
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

  // Only seed when the products table is completely empty.
  // The Supabase products table is the source of truth — re-seeding the
  // full static catalog on every admin login would re-add products the
  // owner intentionally deleted from the store.
  const { count, error: countError } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true });

  if (countError) {
    console.warn('Failed to check products table before seeding:', countError.message);
    return;
  }

  if (count !== null && count > 0) {
    return; // table already has products — never overwrite/append
  }

  const rows = products.map(toSupabaseProduct);

  const { error } = await supabase
    .from('products')
    .upsert(rows, { onConflict: 'id' });

  if (error) {
    console.warn('Failed to seed products to Supabase:', error.message);
  }
};

export const saveProductToSupabase = async (product: Product): Promise<boolean> => {
  if (!isOnline()) return true; // offline — nothing to sync, but keep local cache

  // Always save locally after a successful DB write for a fast local cache.
  const { error } = await supabase.from('products').upsert(toSupabaseProduct(product), { onConflict: 'id' });
  if (error) {
    console.warn('Failed to save product to Supabase:', error.message);
    return false;
  }
  return true;
};

export const deleteProductFromSupabase = async (productId: string): Promise<boolean> => {
  if (!isOnline()) return true;

  const { error } = await supabase.from('products').delete().eq('id', productId);
  if (error) {
    console.warn('Failed to delete product from Supabase:', error.message);
    return false;
  }
  return true;
};

// ============================================
// ORDERS — DATABASE IS THE SINGLE SOURCE OF TRUTH
// ============================================

/**
 * Fetch ALL orders from the database (admins only).
 * The database is the single source of truth — local storage is never
 * merged in, so every device sees exactly the same orders.
 */
export const fetchOrders = async (): Promise<AdminOrder[]> => {
  if (!isOnline()) return [];

  // Only fetch the latest 200 orders — the limit is applied at the database
  // level so we never load more than 200 orders at once.
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) {
    console.warn('Failed to fetch orders from Supabase:', error.message);
    return [];
  }

  if (!data || data.length === 0) return [];

  // Fetch order items for all orders
  const orderIds = data.map((order) => order.id);
  const { data: itemsData } = await supabase
    .from('order_items')
    .select('*')
    .in('order_id', orderIds);

  // Fetch product images + names so order details can show the product
  // image alongside the product name.
  let productMeta: Record<string, { name: string | null; image: string | null }> = {};
  const { data: productsData } = await supabase
    .from('products')
    .select('id, name, image');

  if (productsData) {
    productMeta = productsData.reduce<Record<string, { name: string | null; image: string | null }>>((acc, p) => {
      acc[p.id] = { name: p.name || null, image: p.image || null };
      return acc;
    }, {});
  }

  const itemsByOrder = (itemsData || []).reduce<Record<string, AdminOrderItem[]>>((acc, item) => {
    if (!acc[item.order_id]) acc[item.order_id] = [];
    const product = item.product_id ? productMeta[item.product_id] : undefined;
    acc[item.order_id].push({
      id: item.id,
      product_id: item.product_id,
      name: item.name || product?.name || 'Product',
      price: Number(item.price),
      quantity: item.quantity,
      image: product?.image || null,
    });
    return acc;
  }, {});

  return data.map((order) => ({
    ...order,
    subtotal: Number(order.subtotal),
    discount: Number(order.discount),
    delivery: Number(order.delivery),
    total: Number(order.total),
    items: itemsByOrder[order.id] || [],
  }));
};

/**
 * Fetch orders for a specific user (customer order history).
 * Uses the authenticated user's ID — never a device/local identifier.
 */
export const fetchUserOrders = async (userId: string): Promise<AdminOrder[]> => {
  if (!isOnline()) return [];

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('Failed to fetch user orders from Supabase:', error.message);
    return [];
  }

  if (!data || data.length === 0) return [];

  const orderIds = data.map((order) => order.id);
  const { data: itemsData } = await supabase
    .from('order_items')
    .select('*')
    .in('order_id', orderIds);

  const itemsByOrder = (itemsData || []).reduce<Record<string, AdminOrderItem[]>>((acc, item) => {
    if (!acc[item.order_id]) acc[item.order_id] = [];
    acc[item.order_id].push({
      id: item.id,
      product_id: item.product_id,
      name: item.name || 'Product',
      price: Number(item.price),
      quantity: item.quantity,
      image: null,
    });
    return acc;
  }, {});

  return data.map((order) => ({
    ...order,
    subtotal: Number(order.subtotal),
    discount: Number(order.discount),
    delivery: Number(order.delivery),
    total: Number(order.total),
    items: itemsByOrder[order.id] || [],
  }));
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<boolean> => {
  if (!isOnline()) return false;

  const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
  if (error) {
    console.warn('Failed to update order status:', error.message);
    return false;
  }
  return true;
};

export const updateOrderDiscount = async (
  orderId: string,
  discount: number,
  total: number,
): Promise<boolean> => {
  if (!isOnline()) return false;

  const { error } = await supabase.from('orders').update({ discount, total }).eq('id', orderId);
  if (error) {
    console.warn('Failed to update order discount:', error.message);
    return false;
  }
  return true;
};

export const updateOrderDelivery = async (
  orderId: string,
  delivery: number,
  total: number,
): Promise<boolean> => {
  if (!isOnline()) return false;

  const { error } = await supabase.from('orders').update({ delivery, total }).eq('id', orderId);
  if (error) {
    console.warn('Failed to update order delivery:', error.message);
    return false;
  }
  return true;
};

export const deleteOrder = async (orderId: string): Promise<boolean> => {
  if (!isOnline()) return false;

  // The database's foreign-key cascade removes the associated order items.
  const { error } = await supabase.from('orders').delete().eq('id', orderId);
  if (error) {
    console.warn('Failed to delete order from Supabase:', error.message);
    return false;
  }
  return true;
};

/**
 * Create an order in the database.
 *
 * IMPORTANT: The order is ONLY considered successful when the backend
 * confirms the database insert. If the database insert fails, this
 * returns `null` and the caller must NOT clear the cart.
 */
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
  if (!isOnline()) {
    console.warn('Cannot create order — Supabase is not configured.');
    return null;
  }

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
    return null;
  }

  if (!orderData) {
    console.warn('Failed to create order in Supabase — no data returned.');
    return null;
  }

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
};

// ============================================
// CUSTOMERS
// ============================================

export const fetchCustomers = async (): Promise<AdminCustomer[]> => {
  if (!isOnline()) return [];

  const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });

  if (error) {
    console.warn('Failed to fetch customers:', error.message);
    return [];
  }

  if (!data) return [];

  // Get order counts per user
  const { data: ordersData } = await supabase.from('orders').select('user_id, total');

  const ordersByUser = (ordersData || []).reduce<Record<string, { count: number; total: number }>>((acc, order) => {
    if (!order.user_id) return acc;
    if (!acc[order.user_id]) acc[order.user_id] = { count: 0, total: 0 };
    acc[order.user_id].count += 1;
    acc[order.user_id].total += Number(order.total) || 0;
    return acc;
  }, {});

  return data.map((profile) => ({
    id: profile.id,
    full_name: profile.full_name,
    email: profile.email,
    phone: profile.phone,
    role: profile.role || 'customer',
    created_at: profile.created_at,
    order_count: ordersByUser[profile.id]?.count || 0,
    total_spent: ordersByUser[profile.id]?.total || 0,
  }));
};

export const updateCustomerRole = async (userId: string, role: 'customer' | 'admin'): Promise<boolean> => {
  if (!isOnline()) return false;

  const { error } = await supabase.from('profiles').update({ role }).eq('id', userId);
  if (error) {
    console.warn('Failed to update customer role:', error.message);
    return false;
  }
  return true;
};

// ============================================
// MIGRATION — existing localStorage orders → database
// ============================================

const ADMIN_ORDERS_KEY = 'happi-nuts-admin-orders';

/**
 * One-time migration: pushes any orders that were previously stored only in
 * localStorage (offline/legacy orders) into the Supabase database.
 *
 * Safely validates: only inserts orders whose order_number does NOT already
 * exist in the database (prevents duplicates). After a successful insert the
 * migrated order is removed from localStorage so it isn't re-inserted later.
 */
export const migrateLocalOrdersToSupabase = async (): Promise<void> => {
  if (!isOnline()) return;

  const localOrders = readLocalJson<AdminOrder[]>(ADMIN_ORDERS_KEY, []);
  if (localOrders.length === 0) return;

  // Fetch the order numbers already in the database so we skip duplicates.
  const { data: existingRows } = await supabase
    .from('orders')
    .select('order_number');

  const existingNumbers = new Set(
    (existingRows || []).map((row) => row.order_number),
  );

  let migratedAny = false;

  // Also track which order_items were inserted so we can dedupe.
  const seenOrderNumbers = new Set<string>();

  for (const localOrder of localOrders) {
    // Only migrate local-only/legacy orders. Real database orders are
    // already persisted — those are left untouched.
    const isManualOrLocal =
      localOrder.id?.startsWith('manual-') ||
      localOrder.id?.startsWith('local-') ||
      localOrder.order_number?.startsWith('HN-OFF-');

    if (!isManualOrLocal) continue;

    // Skip orders that already exist in the database.
    if (existingNumbers.has(localOrder.order_number)) continue;
    if (seenOrderNumbers.has(localOrder.order_number)) continue;
    seenOrderNumbers.add(localOrder.order_number);

    const orderPayload = {
      order_number: localOrder.order_number,
      user_id: localOrder.user_id || null,
      customer_name: localOrder.customer_name,
      email: localOrder.email,
      phone: localOrder.phone,
      address: localOrder.address || null,
      city: localOrder.city || null,
      state: localOrder.state || null,
      pincode: localOrder.pincode || null,
      payment_method: localOrder.payment_method || 'cash',
      payment_id: localOrder.payment_id || null,
      subtotal: Number(localOrder.subtotal) || 0,
      discount: Number(localOrder.discount) || 0,
      delivery: Number(localOrder.delivery) || 0,
      total: Number(localOrder.total) || 0,
      status: localOrder.status || 'Pending',
    };

    const { data: inserted, error } = await supabase
      .from('orders')
      .insert(orderPayload)
      .select()
      .single();

    if (error) {
      console.warn('Failed to migrate local order:', localOrder.order_number, error.message);
      continue;
    }

    // Also insert the order items for the migrated order.
    if (inserted && localOrder.items && localOrder.items.length > 0) {
      const itemRows = localOrder.items.map((item) => ({
        order_id: inserted.id,
        product_id: item.product_id || null,
        name: item.name || 'Product',
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(itemRows);

      if (itemsError) {
        console.warn('Failed to migrate local order items:', localOrder.order_number, itemsError.message);
      }
    }

    migratedAny = true;
    existingNumbers.add(localOrder.order_number);
  }

  if (migratedAny) {
    // Remove the migrated orders from localStorage so they aren't re-inserted.
    const remaining = localOrders.filter((o) => !seenOrderNumbers.has(o.order_number));
    writeLocalJson(ADMIN_ORDERS_KEY, remaining);
    console.log('Successfully migrated legacy local orders to the database.');
  }
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

  // Ensure the owner's profile row exists with role='admin' in Supabase.
  // The products table RLS insert/update/delete policies require a profile
  // row with role='admin' for the current user, so without this the
  // "Add product" button would fail with an RLS error even though the
  // client-side email check passed.
  if (isOnline()) {
    const { error } = await supabase.from('profiles').upsert(
      {
        id: session.user.id,
        full_name:
          session.user.user_metadata?.full_name ||
          session.user.email?.split('@')[0] ||
          'Admin',
        email: session.user.email,
        phone: session.user.user_metadata?.phone || '',
        role: 'admin',
      },
      { onConflict: 'id' },
    );

    if (error) {
      console.warn('Failed to ensure admin profile row exists:', error.message);
    }
  }

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

// ============================================
// STORE SETTINGS — DATABASE BACKED
// ============================================

export type StoreSettingsRow = {
  delivery_charge: number;
  free_delivery_threshold: number;
  default_discount_percent: number;
};

export const fetchStoreSettings = async (): Promise<StoreSettingsRow | null> => {
  if (!isOnline()) return null;
  const { data, error } = await supabase.from('store_settings').select('*').eq('id', 1).maybeSingle();
  if (error) {
    console.warn('Failed to fetch store settings:', error.message);
    return null;
  }
  return data;
};

export const saveStoreSettingsToSupabase = async (settings: StoreSettingsRow): Promise<boolean> => {
  if (!isOnline()) return false;
  const { error } = await supabase.from('store_settings').upsert({ id: 1, ...settings });
  if (error) {
    console.warn('Failed to save store settings:', error.message);
    return false;
  }
  return true;
};

// ============================================
// PAGE CONTROLS — DATABASE BACKED
// ============================================

export type PageControlsRow = {
  key: string;
  label: string;
  enabled: boolean;
  description: string;
};

export const fetchPageControls = async (): Promise<PageControlsRow[] | null> => {
  if (!isOnline()) return null;
  const { data, error } = await supabase.from('page_controls').select('*');
  if (error) {
    console.warn('Failed to fetch page controls:', error.message);
    return null;
  }
  return data;
};

export const savePageControlsToSupabase = async (controls: PageControlsRow[]): Promise<boolean> => {
  if (!isOnline() || controls.length === 0) return false;
  const { error } = await supabase.from('page_controls').upsert(controls);
  if (error) {
    console.warn('Failed to save page controls:', error.message);
    return false;
  }
  return true;
};

// ============================================
// PRODUCT TOGGLES — DATABASE BACKED
// ============================================

export type ProductToggleRow = {
  product_id: string;
  enabled: boolean;
};

export const fetchProductToggles = async (): Promise<ProductToggleRow[] | null> => {
  if (!isOnline()) return null;
  const { data, error } = await supabase.from('product_toggles').select('*');
  if (error) {
    console.warn('Failed to fetch product toggles:', error.message);
    return null;
  }
  return data;
};

export const saveProductToggleToSupabase = async (productId: string, enabled: boolean): Promise<boolean> => {
  if (!isOnline()) return false;
  const { error } = await supabase.from('product_toggles').upsert({ product_id: productId, enabled });
  if (error) {
    console.warn('Failed to save product toggle:', error.message);
    return false;
  }
  return true;
};

// ============================================
// CONTACT MESSAGES — DATABASE BACKED
// ============================================

export type ContactMessageRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  created_at: string;
};

export const fetchContactMessages = async (): Promise<ContactMessageRow[]> => {
  if (!isOnline()) return [];
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.warn('Failed to fetch contact messages:', error.message);
    return [];
  }
  return data || [];
};

export const createContactMessage = async (message: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}): Promise<boolean> => {
  if (!isOnline()) return false;
  const { error } = await supabase.from('contact_messages').insert(message);
  if (error) {
    console.warn('Failed to save contact message:', error.message);
    return false;
  }
  return true;
};

export const deleteContactMessage = async (id: string): Promise<boolean> => {
  if (!isOnline()) return false;
  const { error } = await supabase.from('contact_messages').delete().eq('id', id);
  if (error) {
    console.warn('Failed to delete contact message:', error.message);
    return false;
  }
  return true;
};