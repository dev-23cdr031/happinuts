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

type MenuProduct = Pick<Product, 'name' | 'tamilName' | 'price' | 'category'> &
  Partial<Pick<Product, 'badge'>>;

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
  'Flax Seeds': '/assets/products/flax-seeds.webp',
};

/* Prices are transcribed from the supplied Happi Nuts menu card. */
const menuProducts: MenuProduct[] = [
  { name: 'Raw Cashews', tamilName: 'முழு முந்திரி பருப்பு', price: 900, category: 'nuts', badge: 'bestseller' },
  { name: 'Broken Cashews', tamilName: 'அரை முந்திரி பருப்பு', price: 840, category: 'nuts' },
  { name: 'Premium Almonds', tamilName: 'பாதாம் பருப்பு பெரியது', price: 1100, category: 'nuts', badge: 'bestseller' },
  { name: 'Regular Almonds', tamilName: 'பாதாம் பருப்பு ரெகுலர்', price: 1000, category: 'nuts' },
  { name: 'Pistachio Kernels', tamilName: 'பிஸ்தா பருப்பு ஓடையுது', price: 1500, category: 'nuts', badge: 'premium' },
  { name: 'Pistachios', tamilName: 'பிஸ்தா பருப்பு ஓடு இல்லாதது', price: 2700, category: 'nuts', badge: 'premium' },
  { name: 'Charoli Seeds', tamilName: 'சாரப்பருப்பு', price: 1500, category: 'nuts' },
  { name: 'Red Walnuts', tamilName: 'சிவி வால்நட் பருப்பு', price: 1600, category: 'nuts', badge: 'premium' },
  { name: 'Pumpkin Seeds', tamilName: 'பச்சை பூசணி விதை', price: 560, category: 'seeds', badge: 'bestseller' },
  { name: 'Melon Seeds', tamilName: 'வெண் பூசணி விதை', price: 700, category: 'seeds' },
  { name: 'Sunflower Seeds', tamilName: 'சூரிய காந்தி விதை', price: 260, category: 'seeds' },
  { name: 'Cucumber Seeds', tamilName: 'வெள்ளரி விதை', price: 750, category: 'seeds' },
  { name: 'Flax Seeds', tamilName: 'ஆளி விதை', price: 180, category: 'seeds' },
  { name: 'Sabja Seeds', tamilName: 'சப்ஜா விதை', price: 300, category: 'seeds' },
  { name: 'Chia Seeds', tamilName: 'சியா விதை', price: 320, category: 'seeds' },
  { name: 'Soya Seeds', tamilName: 'சோயா (ஹலீம்) விதை', price: 180, category: 'seeds' },
  { name: 'Lotus Seeds', tamilName: 'தாமரை விதை', price: 1100, category: 'seeds', badge: 'premium' },
  { name: 'Brown Raisins', tamilName: 'சாதா பேரிச்சம் பழம்', price: 200, category: 'dried' },
  { name: 'Black Raisins', tamilName: 'கருப்பு பேரிச்சம் பழம்', price: 450, category: 'dried' },
  { name: 'Dried Apricots', tamilName: 'உலர் அத்திப்பழம்', price: 800, category: 'dried' },
  { name: 'Black Dry Grapes', tamilName: 'கருப்பு உலர் திராட்சை', price: 580, category: 'dried' },
  { name: 'Golden Raisins', tamilName: 'மஞ்சள் உலர் திராட்சை', price: 480, category: 'dried', badge: 'bestseller' },
  { name: 'Dried Gooseberries', tamilName: 'உலர் நெல்லிக்காய்', price: 360, category: 'dried' },
  { name: 'Dates', tamilName: 'தேதி நெல்லிக்காய்', price: 240, category: 'dried' },
  { name: 'Dried Lemons', tamilName: 'உலர் எலுமிச்சை', price: 500, category: 'dried' },
  { name: 'Dried Kiwi', tamilName: 'உலர் கிவி பழம்', price: 560, category: 'dried' },
  { name: 'Dried Strawberries', tamilName: 'உலர் ஸ்ட்ராபெர்ரி பழம்', price: 760, category: 'dried' },
  { name: 'Dried Blueberries', tamilName: 'உலர் ப்ளூ பெர்ரி பழம்', price: 1300, category: 'dried', badge: 'premium' },
  { name: 'Dried Cherries', tamilName: 'உலர் செரி பழம்', price: 680, category: 'dried' },
  { name: 'Dried Black Cherries', tamilName: 'உலர் கலாக்காய் செரி பழம்', price: 240, category: 'dried' },
  { name: 'Dried Pomegranate', tamilName: 'உலர் மாதுளை பழம்', price: 540, category: 'dried' },
  { name: 'Dried Plums', tamilName: 'உலர் பிளாக் பளம்', price: 540, category: 'dried' },
  { name: 'Dried Mango', tamilName: 'உலர் மாம்பழம்', price: 540, category: 'dried' },
  { name: 'Dried Pineapple', tamilName: 'உலர் அன்னாசி பழம்', price: 520, category: 'dried' },
  { name: 'Dried Papaya', tamilName: 'உலர் பப்பாளி பழம்', price: 540, category: 'dried' },
  { name: 'Tutti Frutti', tamilName: 'டுட்டி புருட்டி', price: 90, category: 'sweets' },
  { name: 'Saffron', tamilName: 'குங்குமப்பூ', price: 250, category: 'pantry', badge: 'premium' },
  { name: 'Cardamom', tamilName: 'ஏலக்காய்', price: 3900, category: 'pantry', badge: 'premium' },
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
  { name: 'Bamboo Rice', tamilName: 'மூங்கில் சிப்ஸ்', price: 1200, category: 'pantry', badge: 'premium' },
  { name: 'Tamarind Candy', tamilName: 'புளி மிட்டாய்', price: 200, category: 'sweets' },
  { name: 'Jelly Candy', tamilName: 'ஜெல்லி மிட்டாய்', price: 250, category: 'sweets' },
  { name: 'Jelly Sponge Candy', tamilName: 'ஜெல்லி, ஸ்பான் கேண்டி', price: 250, category: 'sweets' },
];

const nutrition = { calories: 'See package', protein: 'See package', fat: 'See package', carbs: 'See package', fiber: 'See package' };

export const products: Product[] = menuProducts.map((item, index) => ({
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

const categoryNames: Record<string, string> = {
  nuts: 'Nuts & Dry Fruits',
  seeds: 'Seeds',
  dried: 'Dried Fruits',
  pantry: 'Healthy Pantry',
  sweets: 'Sweets & Treats',
};

export const categories = Object.entries(categoryNames).map(([id, name]) => ({
  id,
  name,
  count: products.filter((product) => product.category === id).length,
}));
