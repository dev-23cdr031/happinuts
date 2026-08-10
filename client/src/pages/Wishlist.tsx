import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowRight, PackageOpen, Trash2, ShoppingCart, Sparkle, ShieldCheck } from 'lucide-react';
import { getWishlistItems, removeFromWishlist, type WishlistItem } from '@/lib/wishlist';
import { addToCart } from '@/lib/cart';
import ThemedScene from '@/components/three/ThemedScene';

function WishlistCard({
  item,
}: {
  item: WishlistItem;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group relative bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-happi-pink via-happi-cyan to-happi-gold opacity-60 group-hover:opacity-100 transition-opacity" />

      {/* Image */}
      <div className="relative overflow-hidden bg-happi-cream h-48 md:h-56">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              (e.target as HTMLImageElement).className = 'hidden';
              const fallback = e.target as HTMLImageElement;
              fallback.parentElement!.innerHTML = '<div class="h-full w-full bg-happi-cream flex items-center justify-center"><PackageOpen class="w-10 h-10 text-happi-green" /></div>';
            }}
          />
        ) : (
          <div className="h-full w-full bg-happi-cream flex items-center justify-center">
            <PackageOpen className="w-10 h-10 text-happi-green" />
          </div>
        )}

        {/* Heart badge */}
        <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-md flex items-center justify-center">
          <Heart className="w-5 h-5 text-happi-pink fill-happi-pink" />
        </div>

        {/* Remove from list button */}
        <button
          onClick={() => removeFromWishlist(item.id)}
          className="absolute top-3 right-3 bg-white/90 hover:bg-red-50 p-2 rounded-full shadow-md transition-all hover:scale-110"
          aria-label="Remove from wishlist"
        >
          <Trash2 className="w-5 h-5 text-red-600" />
        </button>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-base text-happi-charcoal mb-2 line-clamp-2 group-hover:text-happi-pink transition-colors">
          <a href={`/product/${item.id}`} className="hover:text-happi-pink transition-colors">
            {item.name}
          </a>
        </h3>
        {item.tamilName && (
          <p lang="ta" className="-mt-1 mb-2 text-sm font-medium leading-snug text-happi-green line-clamp-1">
            {item.tamilName}
          </p>
        )}
        <p className="text-xs text-gray-500 mb-3">{item.weight}</p>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-bold text-happi-pink">₹{item.price}</span>
        </div>

        <button
          onClick={() =>
            addToCart({
              id: item.id,
              name: item.name,
              tamilName: item.tamilName,
              price: item.price,
              weight: item.weight,
              image: item.image,
            })
          }
          className="mt-auto w-full bg-gradient-to-r from-happi-pink to-happi-cyan text-white font-semibold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all hover:shadow-lg active:scale-95 btn-shine"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState(getWishlistItems());

  useEffect(() => {
    const syncWishlist = () => setWishlistItems(getWishlistItems());
    window.addEventListener('happi-nuts-wishlist-updated', syncWishlist);
    return () => window.removeEventListener('happi-nuts-wishlist-updated', syncWishlist);
  }, []);

  const items = wishlistItems;

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Header with 3D */}
      <section className="relative overflow-hidden bg-gradient-to-br from-happi-pink via-[#E91E73] to-happi-cyan text-white">
        <div className="blob-decoration w-96 h-96 bg-white top-0 -left-20 opacity-10 animate-blob" />
        <div className="blob-decoration w-80 h-80 bg-happi-gold -bottom-20 right-0 opacity-20 animate-blob" style={{ animationDelay: '3s' }} />
        <div className="absolute inset-0 bg-dots-pattern opacity-10" />

        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-8 pb-14 md:pb-16">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="relative z-10"
            >
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/25 text-white text-sm font-semibold px-4 py-2 rounded-full mb-5">
                <Heart className="w-4 h-4 fill-white" />
                Your Favorites
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Your Happi <span className="text-shimmer-white">List</span>
              </h1>
              <p className="text-xl opacity-90">
                {items.length > 0
                  ? `You have ${items.length} item${items.length === 1 ? '' : 's'} waiting to be loved`
                  : 'Save your favorites and they will appear here'}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative h-[220px] md:h-[280px]"
            >
              <ThemedScene className="w-full h-full" variant="hearts" color="#FF8FB3" count={8} />
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
                className="absolute bottom-4 left-2 glass-morphism rounded-2xl px-5 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">Saved for Later</div>
                    <div className="text-xs text-white/70">Always in stock for you</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Wishlist Content */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-white to-happi-cream">
        <div className="container">
          {items.length > 0 ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
                <div className="inline-flex items-center gap-2 bg-happi-cream border border-happi-pink/20 text-happi-pink px-4 py-2 rounded-full text-sm font-semibold">
                  <Sparkle className="w-4 h-4" />
                  {items.length} saved item{items.length === 1 ? '' : 's'} in your list
                </div>
                <button
                  onClick={() => {
                    items.forEach((item) => removeFromWishlist(item.id));
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl text-sm font-semibold transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear all
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {items.map((product) => (
                  <WishlistCard key={product.id} item={product} />
                ))}
              </div>

              <div className="mt-14 text-center">
                <a href="/shop" className="btn-primary inline-flex items-center gap-2 btn-shine">
                  Continue Shopping
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-white rounded-3xl shadow-lg border border-gray-100 relative overflow-hidden"
            >
              <div className="blob-decoration w-64 h-64 bg-happi-pink -top-20 -right-20 opacity-20 animate-blob" />
              <div className="relative">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-happi-cream mb-6 pulse-ring">
                  <Heart className="w-12 h-12 text-happi-pink fill-happi-pink/20" />
                </div>
                <h2 className="text-3xl font-bold text-happi-charcoal mb-3">
                  Nothing <span className="text-gradient-happi">here yet</span>
                </h2>
                <p className="text-gray-600 text-lg mb-8">
                  Let's add some happiness to your wishlist
                </p>
                <a href="/shop" className="btn-primary inline-flex items-center gap-2 btn-shine">
                  Shop Now
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}