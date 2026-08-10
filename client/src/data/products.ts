import { supabase } from '@/lib/supabase';

export interface Product {
  id: string;
  name: string;
  tamilName: string;
  price: number;
  originalPrice?: number;
  weight: string;
  rating: number;
  reviews: number;
  badge?: 'bestseller' | 'new' | 'premium';
  description: string;
  benefits: string[];
  ingredients: string;
  nutritionalInfo: {
    calories: string;
    protein: string;
    fat: string;
    carbs: string;
    fiber: string;
  };
  storageInstructions: string;
  category: string;
  image?: string;
}

const ADMIN_PRODUCTS_KEY = 'happi-nuts-admin-products';
const CATALOG_VERSION_KEY = 'happi-nuts-catalog-version';
const CATALOG_VERSION = 'v2-no-static-badges';

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

const isCatalogOnline = () =>
  Boolean(
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_ANON_KEY &&
    import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co',
  );

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

type MenuProduct = Pick<Product, 'name' | 'tamilName' | 'price' | 'category'> &
  Partial<Pick<Product, 'badge'>>;

const writeCatalogProducts = (nextProducts: Product[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(nextProducts));
};

const productImages: Record<string, string> = {
  'Raw Cashews': '/assets/products/raw-cashews.jpg',
  'Broken Cashews': '/assets/products/broken-cashews.webp',
  'Premium Almonds': '/assets/products/premium-almonds.webp',
  'Regular Almonds': '/assets/products/regular-almonds.jpg',
  Pistachios: '/assets/products/pistachios.jpg',
  'Pistachio Kernels': '/assets/products/pistachio-kernels.webp',
  'Charoli Seeds': '/assets/products/charoli-seeds.jpg',
  'Red Walnuts': '/assets/products/red-walnuts.webp',
  'Pumpkin Seeds': '/assets/products/pumpkin-seeds.webp',
  'Melon Seeds': '/assets/products/melon-seeds.jpg',
  'Sunflower Seeds': '/assets/products/sunflower-seeds.jpg',
  'Cucumber Seeds': '/assets/products/cucumber-seeds.jpg',
  'Flax Seeds': '/assets/products/flax-seeds.jpg',
  'Chia Seeds': '/assets/products/chia-seeds.webp',
  'Golden Raisins': '/assets/products/golden-raisins.jpg',
  'Black Dry Grapes': '/assets/products/black-raisins.webp',
  'Dried Pomegranate': '/assets/products/dried-apricots.jpg',
  'Dried Figs': '/assets/products/dried-figs.webp',
  Dates: '/assets/products/dates.jpg',
  'Black Dates': '/assets/products/black-dates.jpg',
  'Black Kavuni Rice': '/assets/products/black-kavuni-rice.jpg',
  'Lotus Seeds': '/assets/products/lotus-seeds.jpg',
  'Sabja Seeds': '/assets/products/sabja-seeds.webp',
  'Soya Seeds': '/assets/products/soya-seeds.webp',
  'Dried Gooseberries': '/assets/products/dried-gooseberries.jpg',
  'Honey Gooseberries': '/assets/products/honey-gooseberries.webp',
  'Dried Kiwi': '/assets/products/dried-kiwi.jpg',
  'Dried Strawberries': '/assets/products/dried-strawberries.jpg',
  'Dried Blueberries': '/assets/products/dried-blueberries.jpg',
  'Dried Cherries': '/assets/products/dried-cherries.jpg',
  'Dried Black Cherries': '/assets/products/dried-black-cherries.jpg',
  'Dried Plums': '/assets/products/dried-plums.jpeg',
  'Dried Mango': '/assets/products/dried-mango.webp',
  'Dried Pineapple': '/assets/products/dried-pineapple.jpg',
  'Dried Papaya': '/assets/products/dried-papaya.jpg',
  'Tutti Frutti': '/assets/products/tutti-frutti.jpg',
  Saffron: '/assets/products/saffron.jpg',
  Cardamom: '/assets/products/cardamom.webp',
  'Black Pepper': '/assets/products/black-pepper.webp',
  'Almond Gum': '/assets/products/almond-gum.webp',
  'Palm Candy': '/assets/products/palm-candy.webp',
  'Palm Jaggery': '/assets/products/palm-jaggery.jpg',
  'Jaggery Balls': '/assets/products/jaggery-balls.jpg',
  'Country Sugar': '/assets/products/country-sugar.jpeg',
  'Kodo Millet': '/assets/products/kodo-millet.jpg',
  'Little Millet': '/assets/products/little-millet.webp',
  'Barnyard Millet': '/assets/products/barnyard-millet.webp',
  'Foxtail Millet': '/assets/products/foxtail-millet.jpg',
  'Finger Millet': '/assets/products/finger-millet.jpg',
  'Pearl Millet': '/assets/products/pearl-millet.jpg',
  'Jelly Candy': '/assets/products/jelly-candy.jpg',
  'Gems Stone Candy': '/assets/products/gems-stone-candy.jpg',
  'Vegetable Chips': '/assets/products/vegetable-chips.webp',
  'Fruit Chips': '/assets/products/fruit-chips.webp',
  'Tamarind Candy': '/assets/products/tamarind-candy.jpg',
  'Toor Dal': '/assets/products/toor-dal.jpg',
  'Moong Dal': '/assets/products/moong-dal.jpg',
  'Palm Tuber Flour': '/assets/products/palm-tuber-flour.jpg',
  'Whole White Urad Dal': '/assets/products/whole-white-urad-dal.jpg',
  'Mapillai Samba Rice': '/assets/products/mapillai-samba-rice.jpg',
};

/* Prices are transcribed from the supplied Happi Nuts menu card. */
const menuProducts: MenuProduct[] = [
  { name: 'Raw Cashews', tamilName: 'முழு முந்திரி பருப்பு', price: 900, category: 'nuts' },
  { name: 'Broken Cashews', tamilName: 'அரை முந்திரி பருப்பு', price: 840, category: 'nuts' },
  { name: 'Premium Almonds', tamilName: 'பாதாம் பருப்பு பெரியது', price: 1100, category: 'nuts' },
  { name: 'Regular Almonds', tamilName: 'பாதாம் பருப்பு ரெகுலர்', price: 1000, category: 'nuts' },
  { name: 'Pistachio Kernels', tamilName: 'பிஸ்தா பருப்பு ஓடையுது', price: 1500, category: 'nuts' },
  { name: 'Pistachios', tamilName: 'பிஸ்தா பருப்பு ஓடு இல்லாதது', price: 2700, category: 'nuts' },
  { name: 'Charoli Seeds', tamilName: 'சாரப்பருப்பு', price: 1500, category: 'nuts' },
  { name: 'Red Walnuts', tamilName: 'சிவி வால்நட் பருப்பு', price: 1600, category: 'nuts' },
  { name: 'Pumpkin Seeds', tamilName: 'பச்சை பூசணி விதை', price: 560, category: 'seeds' },
  { name: 'Melon Seeds', tamilName: 'வெண் பூசணி விதை', price: 700, category: 'seeds' },
  { name: 'Sunflower Seeds', tamilName: 'சூரிய காந்தி விதை', price: 260, category: 'seeds' },
  { name: 'Cucumber Seeds', tamilName: 'வெள்ளரி விதை', price: 750, category: 'seeds' },
  { name: 'Flax Seeds', tamilName: 'ஆளி விதை', price: 180, category: 'seeds' },
  { name: 'Sabja Seeds', tamilName: 'சப்ஜா விதை', price: 300, category: 'seeds' },
  { name: 'Chia Seeds', tamilName: 'சியா விதை', price: 320, category: 'seeds' },
  { name: 'Soya Seeds', tamilName: 'சோயா (ஹலீம்) விதை', price: 180, category: 'seeds' },
  { name: 'Lotus Seeds', tamilName: 'தாமரை விதை', price: 1100, category: 'seeds' },
  { name: 'Brown Raisins', tamilName: 'சாதா பேரிச்சம் பழம்', price: 200, category: 'dried' },
  { name: 'Black Dates', tamilName: 'கருப்பு பேரீச்சம் பழம்', price: 450, category: 'dried' },
  { name: 'Dried Figs', tamilName: 'உலர் அத்திப்பழம்', price: 800, category: 'dried' },
  { name: 'Black Dry Grapes', tamilName: 'கருப்பு உலர் திராட்சை', price: 580, category: 'dried' },
  { name: 'Golden Raisins', tamilName: 'மஞ்சள் உலர் திராட்சை', price: 480, category: 'dried' },
  { name: 'Dried Gooseberries', tamilName: 'உலர் நெல்லிக்காய்', price: 360, category: 'dried' },
  { name: 'Honey Gooseberries', tamilName: 'தேன் நெல்லிக்காய்', price: 400, category: 'dried' },
  { name: 'Dates', tamilName: 'பேரீச்சம்பழம்', price: 240, category: 'dried' },
  { name: 'Dried Lemons', tamilName: 'உலர் எலுமிச்சை', price: 500, category: 'dried' },
  { name: 'Dried Kiwi', tamilName: 'உலர் கிவி பழம்', price: 560, category: 'dried' },
  { name: 'Dried Strawberries', tamilName: 'உலர் ஸ்ட்ராபெர்ரி பழம்', price: 760, category: 'dried' },
  { name: 'Dried Blueberries', tamilName: 'உலர் ப்ளூ பெர்ரி பழம்', price: 1300, category: 'dried' },
  { name: 'Dried Cherries', tamilName: 'உலர் செரி பழம்', price: 680, category: 'dried' },
  { name: 'Dried Black Cherries', tamilName: 'உலர் கலாக்காய் செரி பழம்', price: 240, category: 'dried' },
  { name: 'Dried Pomegranate', tamilName: 'உலர் மாதுளை பழம்', price: 540, category: 'dried' },
  { name: 'Dried Plums', tamilName: 'உலர் பிளாக் பளம்', price: 540, category: 'dried' },
  { name: 'Dried Mango', tamilName: 'உலர் மாம்பழம்', price: 540, category: 'dried' },
  { name: 'Dried Pineapple', tamilName: 'உலர் அன்னாசி பழம்', price: 520, category: 'dried' },
  { name: 'Dried Papaya', tamilName: 'உலர் பப்பாளி பழம்', price: 540, category: 'dried' },
  { name: 'Tutti Frutti', tamilName: 'டுட்டி புருட்டி', price: 90, category: 'sweets' },
  { name: 'Saffron', tamilName: 'குங்குமப்பூ', price: 250, category: 'pantry' },
  { name: 'Cardamom', tamilName: 'ஏலக்காய்', price: 3900, category: 'pantry' },
  { name: 'Black Pepper', tamilName: 'மிளகு', price: 850, category: 'pantry' },
  { name: 'Almond Gum', tamilName: 'பாதாம் பிசின்', price: 380, category: 'pantry' },
  { name: 'Palm Candy', tamilName: 'பனங்கற்கண்டு', price: 380, category: 'pantry' },
  { name: 'Palm Jaggery', tamilName: 'கருப்பட்டி', price: 400, category: 'pantry' },
  { name: 'Country Sugar', tamilName: 'நாட்டு சக்கரை', price: 65, category: 'pantry' },
  { name: 'Jaggery Balls', tamilName: 'உருண்டை வெல்லம்', price: 60, category: 'pantry' },
  { name: 'Kodo Millet', tamilName: 'வரகு அரிசி', price: 75, category: 'pantry' },
  { name: 'Little Millet', tamilName: 'சாமை அரிசி', price: 140, category: 'pantry' },
  { name: 'Barnyard Millet', tamilName: 'குதிரைவாலி அரிசி', price: 130, category: 'pantry' },
  { name: 'Foxtail Millet', tamilName: 'தினை அரிசி', price: 65, category: 'pantry' },
  { name: 'Pearl Millet', tamilName: 'கம்பு', price: 40, category: 'pantry' },
  { name: 'Finger Millet', tamilName: 'கேழ்வரகு', price: 55, category: 'pantry' },
  { name: 'Vermicelli', tamilName: 'வெள்ளை சேமி', price: 50, category: 'pantry' },
  { name: 'Mapillai Samba Rice', tamilName: 'மாப்பிள்ளை சம்பா அரிசி', price: 65, category: 'pantry' },
  { name: 'Black Kavuni Rice', tamilName: 'கருப்பு கவுனி அரிசி', price: 110, category: 'pantry' },
  { name: 'Whole White Urad Dal', tamilName: 'நாட்டு வெள்ளை உளுந்து', price: 140, category: 'pantry' },
  { name: 'Toor Dal', tamilName: 'துவரம் பருப்பு', price: 125, category: 'pantry' },
  { name: 'Moong Dal', tamilName: 'பாசிப் பருப்பு', price: 110, category: 'pantry' },
  { name: 'Palm Tuber Flour', tamilName: 'பனங்கிழங்கு மாவு', price: 700, category: 'pantry' },
  { name: 'Vegetable Chips', tamilName: 'காய்கறி சிப்ஸ்', price: 1000, category: 'sweets' },
  { name: 'Fruit Chips', tamilName: 'பழ சிப்ஸ்', price: 500, category: 'sweets' },
  { name: 'Bamboo Rice', tamilName: 'மூங்கில் சிப்ஸ்', price: 1200, category: 'pantry' },
  { name: 'Tamarind Candy', tamilName: 'புளி மிட்டாய்', price: 200, category: 'sweets' },
  { name: 'Jelly Candy', tamilName: 'ஜெல்லி மிட்டாய்', price: 250, category: 'sweets' },
  { name: 'Gems Stone Candy', tamilName: 'ஜெம்ஸ் ஸ்டோன் கேண்டி', price: 250, category: 'sweets' },
];

const nutrition = { calories: 'See package', protein: 'See package', fat: 'See package', carbs: 'See package', fiber: 'See package' };

const defaultProducts: Product[] = menuProducts.map((item, index) => ({
  id: String(index + 1),
  ...item,
  image: productImages[item.name],
  weight: '1 kg',
  rating: 4.6 + (index % 4) / 10,
  reviews: 24 + index * 3,
  description: `${item.name} (${item.tamilName}), available in a 1 kg pack for ₹${item.price}.`,
  benefits: ['Quality-picked', 'Packed for freshness', 'Everyday pantry essential'],
  ingredients: `${item.name} / ${item.tamilName}`,
  nutritionalInfo: nutrition,
  storageInstructions: 'Store in an airtight container in a cool, dry place.',
}));

export const getCatalogProducts = (): Product[] => {
  if (typeof window === 'undefined') {
    return defaultProducts;
  }

  try {
    // If the catalog version changed (e.g. static badges were removed),
    // reset the cached catalog so stale badge data doesn't linger.
    const currentVersion = window.localStorage.getItem(CATALOG_VERSION_KEY);
    if (currentVersion !== CATALOG_VERSION) {
      window.localStorage.removeItem(ADMIN_PRODUCTS_KEY);
      window.localStorage.setItem(CATALOG_VERSION_KEY, CATALOG_VERSION);
    }

    const saved = window.localStorage.getItem(ADMIN_PRODUCTS_KEY);
    if (!saved) {
      writeCatalogProducts(defaultProducts);
      return defaultProducts;
    }

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      writeCatalogProducts(defaultProducts);
      return defaultProducts;
    }

    const savedProducts = parsed as Product[];
    const requiredProductNames = new Set([
      'Black Dates',
      'Honey Gooseberries',
      'Fruit Chips',
      'Dried Mango',
      'Dried Pineapple',
      'Dried Papaya',
    ]);
    const catalogProducts = [
      ...savedProducts,
      ...defaultProducts.filter(
        (product) => requiredProductNames.has(product.name) && !savedProducts.some((saved) => saved.name === product.name),
      ),
    ];

    // Split into known menu products (which get legacy hydration + image mapping)
    // and admin-added products (which must pass through so they appear on the storefront).
    const knownMenuProducts = catalogProducts
      .map((product) => {
        const isLegacyDriedFigs = product.name === 'Dried Apricots' && product.tamilName === 'உலர் அத்திப்பழம்';
        const isLegacyDriedApricots = product.name === 'Dried Apricots';
        const isLegacyJellySponge = product.name === 'Jelly Sponge Candy';
        const isLegacyBlackRaisins = product.name === 'Black Raisins';
        const isLegacyBlackGrapesAt450 = product.name === 'Black Dry Grapes' && product.price === 450;
        const isDatesProduct = product.name === 'Dates';
        const normalizedProduct = isLegacyDriedFigs
          ? {
              ...product,
              name: 'Dried Figs',
              description: product.description.replace('Dried Apricots', 'Dried Figs'),
            }
          : isLegacyDriedApricots
            ? {
                ...product,
                name: 'Dried Pomegranate',
                tamilName: 'உலர் மாதுளை பழம்',
                description: product.description.replace('Dried Apricots', 'Dried Pomegranate'),
              }
          : isLegacyJellySponge
            ? {
                ...product,
                name: 'Gems Stone Candy',
                description: product.description.replace('Jelly Sponge Candy', 'Gems Stone Candy'),
              }
            : isLegacyBlackRaisins
              ? { ...product, name: 'Black Dates', tamilName: 'கருப்பு பேரீச்சம் பழம்' }
              : isLegacyBlackGrapesAt450
                ? { ...product, name: 'Black Dates', tamilName: 'கருப்பு பேரீச்சம் பழம்' }
              : isDatesProduct
                ? { ...product, tamilName: 'பேரீச்சம்பழம்' }
                : product;
        const currentImage = normalizedProduct.image;
        const catalogImage = productImages[normalizedProduct.name];
        const usesBundledImage = currentImage?.startsWith('/assets/products/');

        return catalogImage && (!currentImage || usesBundledImage)
          ? { ...normalizedProduct, image: catalogImage }
          : normalizedProduct;
      })
      .filter((product) => defaultProducts.some((menuProduct) => menuProduct.name === product.name));

    // Admin-added products (names NOT in the default menu) must NOT be filtered out,
    // otherwise they would never appear on the customer's Shop page.
    const adminAddedProducts = catalogProducts.filter(
      (product) => !defaultProducts.some((menuProduct) => menuProduct.name === product.name),
    );

    const hydratedProducts = [...knownMenuProducts, ...adminAddedProducts];

    writeCatalogProducts(hydratedProducts);
    return hydratedProducts;
  } catch {
    return defaultProducts;
  }
};

export const setCatalogProducts = (nextProducts: Product[]) => {
  writeCatalogProducts(nextProducts);
  return nextProducts;
};

/**
 * Fetch the latest catalog (including products added by the admin) from
 * Supabase and merge it into the local storefront catalog. Local-only
 * products (created offline) are preserved. Returns the merged catalog.
 */
export const syncCatalogFromSupabase = async (): Promise<Product[]> => {
  const localProducts = getCatalogProducts();

  if (!isCatalogOnline()) return localProducts;

  try {
    const { data, error } = await supabase.from('products').select(PRODUCT_COLUMNS).order('name');

    if (error) {
      console.warn('Failed to sync products from Supabase:', error.message);
      return localProducts;
    }

    if (!data || data.length === 0) return localProducts;

    const remoteProducts = data.map(toLocalProduct);

    // Merge: remote (Supabase) products come first; local-only products
    // that don't exist remotely are kept at the end.
    const merged = [...remoteProducts];
    for (const localProduct of localProducts) {
      const exists = merged.some(
        (p) => p.id === localProduct.id || p.name === localProduct.name,
      );
      if (!exists) {
        merged.push(localProduct);
      }
    }

    writeCatalogProducts(merged);
    return merged;
  } catch (e) {
    console.warn('Failed to sync products from Supabase:', e);
    return localProducts;
  }
};

export const products: Product[] = getCatalogProducts();

const categoryNames: Record<string, string> = {
  nuts: 'Nuts & Dry Fruits',
  seeds: 'Seeds',
  dried: 'Dried Fruits',
  pantry: 'Healthy Pantry',
  sweets: 'Sweets & Treats',
};

export const getCatalogCategories = () =>
  Object.entries(categoryNames).map(([id, name]) => ({
    id,
    name,
    count: getCatalogProducts().filter((product) => product.category === id).length,
  }));

export const categories = getCatalogCategories();
