import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Heart, ArrowRight, PackageOpen, ShoppingBag, ShieldCheck, BadgeCheck, Minus, Plus, Sparkle } from 'lucide-react';
import { getCartItems, removeFromCart, updateCartItemQuantity } from '@/lib/cart';
import { getDeliveryCharge, getDefaultDiscount } from '@/lib/settings';
import { isWishlisted, toggleWishlistItem } from '@/lib/wishlist';
import ThemedScene from '@/components/three/ThemedScene';

export default function Cart() {
  const [cartItems, setCartItems] = useState(getCartItems());
  const [wishlistState, setWishlistState] = useState<Record<string, boolean>>(() => {
    const items = getCartItems();
    const state: Record<string, boolean> = {};
    items.forEach((item) => {
      state[item.id] = isWishlisted(item.id);
    });
    return state;
  });

  useEffect(() => {
    const syncCart = () => {
      const items = getCartItems();
      setCartItems(items);
      setWishlistState((prev) => {
        const next = { ...prev };
        items.forEach((item) => {
          next[item.id] = isWishlisted(item.id);
        });
        return next;
      });
    };
    window.addEventListener('happi-nuts-cart-updated', syncCart);
    window.addEventListener('happi-nuts-wishlist-updated', syncCart);
    return () => {
      window.removeEventListener('happi-nuts-cart-updated', syncCart);
      window.removeEventListener('happi-nuts-wishlist-updated', syncCart);
    };
  }, []);

  const handleToggleWishlist = (item: (typeof cartItems)[number]) => {
    setWishlistState((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
    toggleWishlistItem({
      id: item.id,
      name: item.name,
      tamilName: item.tamilName,
      price: item.price,
      weight: item.weight,
      image: item.image,
    });
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = getDefaultDiscount(subtotal);
  const delivery = getDeliveryCharge(subtotal);
  const total = subtotal - discount + delivery;

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ===== HEADER WITH 3D ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-happi-cream via-white to-happi-cream pb-14 md:pb-16">
        <div className="blob-decoration w-96 h-96 bg-happi-pink -top-32 -left-32 animate-blob" />
        <div className="blob-decoration w-80 h-80 bg-happi-cyan top-40 -right-24 animate-blob" style={{ animationDelay: '2.5s' }} />
        <div className="absolute inset-0 bg-dots-pattern opacity-40" />

        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-8">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur border border-happi-pink/20 text-happi-pink text-sm font-semibold px-4 py-2 rounded-full mb-5">
                <ShoppingBag className="w-4 h-4" />
                Your Cart
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-happi-charcoal mb-4">
                Shopping <span className="text-gradient-happi">Cart</span>
              </h1>
              <p className="text-lg text-gray-600">
                {cartItems.length > 0
                  ? `${cartItems.length} item${cartItems.length === 1 ? '' : 's'} ready for checkout`
                  : 'Your cart is waiting to be filled with happiness'}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative h-[200px] md:h-[240px]"
            >
              <ThemedScene className="w-full h-full" variant="boxes" color="#19A9E5" count={8} />
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
                className="absolute top-4 right-2 glass-card-light rounded-2xl px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-happi-green" />
                  <span className="font-semibold text-sm text-happi-charcoal">Secure Checkout</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== CART CONTENT ===== */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-white to-happi-cream">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 items-start gap-8 lg:gap-10 xl:gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              {cartItems.length > 0 ? (
                <div className="space-y-5 sm:space-y-6">
                  {cartItems.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group relative bg-white border border-gray-100 rounded-3xl p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all"
                    >
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-happi-pink via-happi-cyan to-happi-gold opacity-0 group-hover:opacity-100 transition-opacity rounded-t-3xl" />

                      <div className="flex flex-col gap-5 sm:flex-row sm:gap-6 lg:gap-8">
                        {/* Image */}
                        <div className="grid h-24 w-24 sm:h-32 sm:w-32 shrink-0 place-items-center rounded-2xl bg-happi-cream text-happi-green overflow-hidden mx-auto sm:mx-0">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          ) : (
                            <PackageOpen className="h-9 w-9" aria-hidden="true" />
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 text-center sm:text-left">
                          <h3 className="font-semibold text-base sm:text-lg text-happi-charcoal mb-1 group-hover:text-happi-pink transition-colors">
                            {item.name}
                          </h3>
                          <p lang="ta" className="text-sm font-medium text-happi-green mb-1">{item.tamilName}</p>
                          <p className="text-sm text-gray-500 mb-2">
                            Weight: <span className="font-medium text-gray-700">{item.weight}</span>
                          </p>
                          <p className="text-lg sm:text-xl font-bold text-happi-pink">
                            ₹{item.price}
                          </p>
                        </div>

                        {/* Quantity & Actions */}
                        <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end sm:gap-4">
                          <div className="flex items-center gap-2 bg-happi-cream px-2 py-1.5 rounded-xl">
                            <button
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-happi-pink hover:bg-white rounded-lg transition-all active:scale-90"
                              onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-bold text-happi-charcoal">{item.quantity}</span>
                            <button
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-happi-pink hover:bg-white rounded-lg transition-all active:scale-90"
                              onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex gap-2">
                            <button
                              className="p-2 hover:bg-happi-pink/10 rounded-xl transition-all hover:scale-110"
                              onClick={() => handleToggleWishlist(item)}
                              aria-label={wishlistState[item.id] ? 'Remove from wishlist' : 'Add to wishlist'}
                            >
                              <Heart
                                className={`w-5 h-5 transition-colors duration-150 ${
                                  wishlistState[item.id]
                                    ? 'fill-happi-pink text-happi-pink'
                                    : 'text-gray-500'
                                }`}
                              />
                            </button>
                            <button
                              className="p-2 hover:bg-red-50 rounded-xl transition-all hover:scale-110"
                              onClick={() => removeFromCart(item.id)}
                              aria-label="Remove from cart"
                            >
                              <Trash2 className="w-5 h-5 text-red-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20 bg-white rounded-3xl shadow-lg border border-gray-100 relative overflow-hidden"
                >
                  <div className="blob-decoration w-64 h-64 bg-happi-cyan -top-20 -left-20 opacity-20 animate-blob" />
                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-happi-cream mb-6 pulse-ring">
                      <ShoppingBag className="w-12 h-12 text-happi-pink" />
                    </div>
                    <h2 className="text-3xl font-bold text-happi-charcoal mb-3">
                      Your cart is <span className="text-gradient-happi">empty</span>
                    </h2>
                    <p className="text-gray-600 text-lg mb-8">
                      Let's fill it with premium dry fruits & health
                    </p>
                    <a href="/shop" className="btn-primary inline-flex items-center gap-2 btn-shine">
                      Continue Shopping
                      <ArrowRight className="w-5 h-5" />
                    </a>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-3xl p-6 sm:p-8 h-fit sticky top-28 border border-gray-100 shadow-xl">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkle className="w-5 h-5 text-happi-pink" />
                  <h2 className="text-2xl font-bold text-happi-charcoal">
                    Order Summary
                  </h2>
                </div>

                <div className="space-y-4 mb-6 pb-6 border-b border-gray-100">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-happi-charcoal">₹{subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-happi-green font-semibold">
                      <span>Discount</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span className={delivery === 0 ? 'text-happi-green font-semibold' : ''}>
                      {delivery === 0 ? (
                        <span className="inline-flex items-center gap-1">
                          <BadgeCheck className="w-4 h-4" />
                          FREE
                        </span>
                      ) : (
                        `₹${delivery}`
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6 p-4 bg-happi-cream rounded-2xl">
                  <span className="text-lg font-bold text-happi-charcoal">Total</span>
                  <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-happi-pink to-happi-cyan">
                    ₹{total}
                  </span>
                </div>

                {/* Coupon */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-happi-charcoal mb-2">
                    Coupon Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon"
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-happi-pink focus:ring-4 focus:ring-happi-pink/10 transition-all"
                    />
                    <button className="btn-outline text-sm shrink-0">Apply</button>
                  </div>
                </div>

                {/* Trust badges */}
                <div className="mb-6 flex items-center justify-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-happi-green" />
                    Secure Payment
                  </span>
                  <span className="flex items-center gap-1">
                    <BadgeCheck className="w-4 h-4 text-happi-green" />
                    Fresh Packed
                  </span>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                  <a
                    href="/checkout"
                    className="btn-primary w-full text-center flex items-center justify-center gap-2 btn-shine"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5" />
                  </a>
                  <a
                    href="/shop"
                    className="btn-outline w-full text-center"
                  >
                    Continue Shopping
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
