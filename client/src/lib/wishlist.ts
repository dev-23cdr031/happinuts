export type WishlistItem = {
  id: string;
  name: string;
  tamilName?: string;
  price: number;
  weight: string;
  image?: string;
  category?: string;
};

const WISHLIST_STORAGE_KEY = 'happi-nuts-wishlist';

const readWishlist = (): WishlistItem[] => {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item) => item && typeof item.id === 'string');
  } catch {
    return [];
  }
};

const writeWishlist = (items: WishlistItem[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('happi-nuts-wishlist-updated'));
};

export const getWishlistItems = () => readWishlist();

export const isWishlisted = (productId: string) =>
  readWishlist().some((item) => item.id === productId);

export const toggleWishlistItem = (product: WishlistItem) => {
  const items = readWishlist();
  const exists = items.some((item) => item.id === product.id);

  const nextItems = exists
    ? items.filter((item) => item.id !== product.id)
    : [...items, product];

  writeWishlist(nextItems);
  return nextItems;
};

export const removeFromWishlist = (productId: string) => {
  const nextItems = readWishlist().filter((item) => item.id !== productId);
  writeWishlist(nextItems);
  return nextItems;
};
