import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Candy, Heart, PackageOpen, ShoppingCart, Sprout, Wheat } from 'lucide-react';
import { motion } from 'framer-motion';
import { addToCart } from '@/lib/cart';
import { isWishlisted, toggleWishlistItem } from '@/lib/wishlist';
import { isProductEnabled } from '@/lib/page-controls';

interface ProductCardProps {
  id: string;
  name: string;
  tamilName: string;
  price: number;
  originalPrice?: number;
  weight: string;
  rating: number;
  reviews: number;
  badge?: 'bestseller' | 'new' | 'premium';
  category: string;
  image?: string;
  onAddToCart?: () => void;
  onToggleWishlist?: () => void;
}

const visualByCategory = {
  nuts: { icon: PackageOpen, label: 'Premium nuts', tone: 'from-amber-100 to-orange-50 text-amber-800' },
  seeds: { icon: Sprout, label: 'Wholesome seeds', tone: 'from-lime-100 to-emerald-50 text-emerald-800' },
  dried: { icon: Wheat, label: 'Dried fruit', tone: 'from-rose-100 to-orange-50 text-rose-800' },
  pantry: { icon: Wheat, label: 'Healthy pantry', tone: 'from-cyan-100 to-sky-50 text-cyan-800' },
  sweets: { icon: Candy, label: 'Happi treat', tone: 'from-pink-100 to-fuchsia-50 text-pink-800' },
} as const;

export function ProductVisual({
  category,
  name,
  image,
  size = 'card',
}: {
  category: string;
  name: string;
  image?: string;
  size?: 'card' | 'large';
}) {
  const [hasImageError, setHasImageError] = useState(false);
  const visual = visualByCategory[category as keyof typeof visualByCategory] ?? visualByCategory.nuts;
  const VisualIcon = visual.icon;
  const iconSize = size === 'large' ? 'h-16 w-16' : 'h-8 w-8';
  const circleSize = size === 'large' ? 'h-28 w-28' : 'h-16 w-16';
  const titleSize = size === 'large' ? 'text-3xl md:text-4xl' : 'text-lg';

  if (image && !hasImageError) {
    return (
      <img
        src={image}
        alt={name}
        loading="lazy"
        onError={() => setHasImageError(true)}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    );
  }

  return (
    <div className={`h-full w-full bg-gradient-to-br ${visual.tone} flex flex-col items-center justify-center p-5 text-center`}>
      <div className={`mb-3 grid ${circleSize} place-items-center rounded-full bg-white/70 shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
        <VisualIcon className={iconSize} aria-hidden="true" />
      </div>
      <span className="text-xs font-bold uppercase tracking-[0.18em] opacity-70">{visual.label}</span>
      <span className={`mt-2 line-clamp-2 font-bold leading-tight text-happi-charcoal ${titleSize}`}>{name}</span>
    </div>
  );
}

export default function ProductCard({
  id,
  name,
  tamilName,
  price,
  originalPrice,
  weight,
  rating,
  reviews,
  badge,
  category,
  image,
  onAddToCart,
  onToggleWishlist,
}: ProductCardProps) {
  const [isWishlistedState, setIsWishlistedState] = useState(() => isWishlisted(id));
  const [showAddedNotification, setShowAddedNotification] = useState(false);
  const [enabled, setEnabled] = useState(() => isProductEnabled(id));
  const [, navigate] = useLocation();

  useEffect(() => {
    const syncWishlist = () => setIsWishlistedState(isWishlisted(id));
    const syncEnabled = () => setEnabled(isProductEnabled(id));
    window.addEventListener('happi-nuts-wishlist-updated', syncWishlist);
    window.addEventListener('happi-nuts-product-toggles-updated', syncEnabled);
    return () => {
      window.removeEventListener('happi-nuts-wishlist-updated', syncWishlist);
      window.removeEventListener('happi-nuts-product-toggles-updated', syncEnabled);
    };
  }, [id]);

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart();
      return;
    }

    addToCart({
      id,
      name,
      tamilName,
      price,
      weight,
      image,
    });

    setShowAddedNotification(true);
    setTimeout(() => {
      setShowAddedNotification(false);
      navigate('/cart');
    }, 800);
  };

  const handleToggleWishlist = () => {
    // Optimistic synchronous update — heart fills instantly on click,
    // before localStorage writes or event dispatch round-trips.
    setIsWishlistedState((previous) => !previous);
    toggleWishlistItem({
      id,
      name,
      tamilName,
      price,
      weight,
      image,
      category,
    });
    onToggleWishlist?.();
  };

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="product-card group"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-happi-cream h-48 md:h-56">
        <ProductVisual category={category} name={name} image={image} />

        {/* Badge */}
        {badge && (
          <div className="absolute top-3 right-3">
            {badge === 'bestseller' && (
              <span className="bg-happi-gold text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">★ Bestseller</span>
            )}
            {badge === 'new' && (
              <span className="bg-happi-pink text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">✨ New</span>
            )}
            {badge === 'premium' && (
              <span className="bg-happi-cyan text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">👑 Premium</span>
            )}
          </div>
        )}

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-happi-pink text-white text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className="absolute bottom-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all hover:scale-110"
        >
          <Heart
            className={`w-5 h-5 transition-colors duration-150 ${
              isWishlistedState
                ? 'fill-happi-pink text-happi-pink'
                : 'text-happi-charcoal'
            }`}
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Name */}
        <h3 className="font-semibold text-base text-happi-charcoal mb-2 line-clamp-2 hover:text-happi-pink transition-colors">
          <a href={`/product/${id}`}>{name}</a>
        </h3>
        <p lang="ta" className="-mt-1 mb-2 text-sm font-medium leading-snug text-happi-green line-clamp-1">{tamilName}</p>

        {/* Weight */}
        <p className="text-xs text-gray-500 mb-3">{weight}</p>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-bold text-happi-pink">₹{price}</span>
          {originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              ₹{originalPrice}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        {enabled ? (
          <button
            onClick={handleAddToCart}
            className="w-full bg-happi-pink hover:bg-happi-pink/90 text-white font-semibold py-2.5 px-4 rounded-lg text-sm flex items-center justify-center gap-2 transition-all hover:shadow-lg active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        ) : (
          <div className="w-full bg-gray-100 text-gray-500 font-semibold py-2.5 px-4 rounded-lg text-sm flex items-center justify-center gap-2 border border-gray-200">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Out of Stock
          </div>
        )}
      </div>

      {/* Added Notification */}
      {showAddedNotification && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute inset-0 bg-happi-pink/90 rounded-lg flex items-center justify-center text-white font-semibold"
        >
          ✓ Added to Cart
        </motion.div>
      )}
    </motion.div>
  );
}
