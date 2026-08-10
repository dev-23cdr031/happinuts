export type CartProduct = {
  id: string;
  name: string;
  tamilName?: string;
  price: number;
  weight: string;
  image?: string;
  quantity?: number;
};

export type CartItem = CartProduct & {
  quantity: number;
};

const CART_STORAGE_KEY = 'happi-nuts-cart';
const CART_UPDATED_EVENT = 'happi-nuts-cart-updated';

// Currently signed-in user's email (lowercased). When null, the guest cart is used.
let currentUser: string | null = null;

const notifyCartUpdated = () => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
};

const storageKey = () =>
  currentUser ? `${CART_STORAGE_KEY}:${currentUser}` : CART_STORAGE_KEY;

const readCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(storageKey());
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item) => item && typeof item.id === 'string');
  } catch {
    return [];
  }
};

const writeCart = (items: CartItem[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(storageKey(), JSON.stringify(items));
};

/**
 * Switch the cart context to a specific user (by email) or back to the
 * guest cart (pass `null`). Each email address gets its own private cart.
 *
 * When signing in, any items that were added while logged out (guest cart)
 * are migrated into that user's cart so they aren't lost.
 */
export const setCartUser = (email: string | null) => {
  if (typeof window === 'undefined') return;

  const nextUser = email ? email.trim().toLowerCase() : null;
  if (nextUser === currentUser) return;

  // Migrate the guest cart into the user's cart on sign-in.
  if (nextUser) {
    const guestKey = CART_STORAGE_KEY;
    const userKey = `${CART_STORAGE_KEY}:${nextUser}`;
    const guestRaw = window.localStorage.getItem(guestKey);
    const userRaw = window.localStorage.getItem(userKey);

    if (guestRaw && !userRaw) {
      window.localStorage.setItem(userKey, guestRaw);
    }
    window.localStorage.removeItem(guestKey);
  }

  currentUser = nextUser;
  notifyCartUpdated();
};

export const getCartItems = (): CartItem[] => readCart();

export const getCartCount = (): number =>
  readCart().reduce((sum, item) => sum + item.quantity, 0);

export const addToCart = (product: CartProduct, quantity = 1) => {
  const items = readCart();
  const existingIndex = items.findIndex((item) => item.id === product.id);

  if (existingIndex >= 0) {
    items[existingIndex] = {
      ...items[existingIndex],
      ...product,
      quantity: items[existingIndex].quantity + quantity,
    };
  } else {
    items.push({ ...product, quantity });
  }

  writeCart(items);
  notifyCartUpdated();
  return items;
};

export const removeFromCart = (productId: string) => {
  const nextItems = readCart().filter((item) => item.id !== productId);
  writeCart(nextItems);
  notifyCartUpdated();
  return nextItems;
};

export const updateCartItemQuantity = (productId: string, quantity: number) => {
  const items = readCart();
  const nextItems = items
    .map((item) =>
      item.id === productId
        ? { ...item, quantity: Math.max(0, quantity) }
        : item,
    )
    .filter((item) => item.quantity > 0);

  writeCart(nextItems);
  notifyCartUpdated();
  return nextItems;
};

export const clearCart = () => {
  writeCart([]);
  notifyCartUpdated();
  return [];
};