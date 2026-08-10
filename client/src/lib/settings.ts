export type StoreSettings = {
  /** Flat delivery fee in ₹ charged when subtotal is below the free threshold. */
  deliveryCharge: number;
  /** Subtotal (₹) at or above which delivery is FREE. */
  freeDeliveryThreshold: number;
  /** Default discount percentage applied to customer orders at checkout. */
  defaultDiscountPercent: number;
};

const SETTINGS_STORAGE_KEY = 'happi-nuts-store-settings';
export const SETTINGS_UPDATED_EVENT = 'happi-nuts-settings-updated';

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  deliveryCharge: 50,
  freeDeliveryThreshold: 500,
  defaultDiscountPercent: 0,
};

const readSettings = (): StoreSettings => {
  if (typeof window === 'undefined') return DEFAULT_STORE_SETTINGS;

  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_STORE_SETTINGS;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return DEFAULT_STORE_SETTINGS;

    return {
      deliveryCharge:
        typeof parsed.deliveryCharge === 'number'
          ? parsed.deliveryCharge
          : DEFAULT_STORE_SETTINGS.deliveryCharge,
      freeDeliveryThreshold:
        typeof parsed.freeDeliveryThreshold === 'number'
          ? parsed.freeDeliveryThreshold
          : DEFAULT_STORE_SETTINGS.freeDeliveryThreshold,
      defaultDiscountPercent:
        typeof parsed.defaultDiscountPercent === 'number'
          ? parsed.defaultDiscountPercent
          : DEFAULT_STORE_SETTINGS.defaultDiscountPercent,
    };
  } catch {
    return DEFAULT_STORE_SETTINGS;
  }
};

export const getStoreSettings = (): StoreSettings => readSettings();

export const saveStoreSettings = (settings: Partial<StoreSettings>): StoreSettings => {
  if (typeof window === 'undefined') return DEFAULT_STORE_SETTINGS;

  const current = readSettings();

  const next: StoreSettings = {
    ...current,
    ...settings,
    deliveryCharge: Math.max(0, Number(settings.deliveryCharge ?? current.deliveryCharge) || 0),
    freeDeliveryThreshold: Math.max(0, Number(settings.freeDeliveryThreshold ?? current.freeDeliveryThreshold) || 0),
    defaultDiscountPercent: Math.max(0, Number(settings.defaultDiscountPercent ?? current.defaultDiscountPercent) || 0),
  };

  window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(SETTINGS_UPDATED_EVENT));
  return next;
};

/** Returns the delivery charge (₹) for a given subtotal based on admin settings. FREE when subtotal >= threshold. */
export const getDeliveryCharge = (subtotal: number): number => {
  const { deliveryCharge, freeDeliveryThreshold } = readSettings();
  return subtotal >= freeDeliveryThreshold ? 0 : deliveryCharge;
};

/** Returns the default discount (₹) for a subtotal based on the admin-configured percent. */
export const getDefaultDiscount = (subtotal: number): number => {
  const { defaultDiscountPercent } = readSettings();
  if (defaultDiscountPercent <= 0) return 0;
  return Math.round((subtotal * defaultDiscountPercent) / 100);
};