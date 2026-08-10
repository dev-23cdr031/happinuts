import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star, Check } from 'lucide-react';
import ProductCard, { ProductVisual } from '@/components/ProductCard';
import { getCatalogProducts, syncCatalogFromSupabase } from '@/data/products';
import { addToCart } from '@/lib/cart';
import { isProductEnabled } from '@/lib/page-controls';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [products, setProducts] = useState(() => getCatalogProducts());
  const product = products.find((p) => p.id === id);

  // Pull in any products the admin added/saved to Supabase so they
  // appear on the customer's Product Details page across browsers.
  useEffect(() => {
    let cancelled = false;
    syncCatalogFromSupabase().then((catalog) => {
      if (!cancelled) setProducts(catalog);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  const [quantity, setQuantity] = useState(1);
  const [weight, setWeight] = useState(product?.weight);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showAddedNotification, setShowAddedNotification] = useState(false);
  const productEnabled = product ? isProductEnabled(product.id) : true;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-happi-charcoal mb-4">
            Product Not Found
          </h1>
          <a href="/shop" className="btn-primary">
            Back to Shop
          </a>
        </div>
      </div>
    );
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!productEnabled) return;
    addToCart(
      {
        id: product.id,
        name: product.name,
        tamilName: product.tamilName,
        price: product.price,
        weight: weight || product.weight,
        image: product.image,
      },
      quantity,
    );
    setShowAddedNotification(true);
    setTimeout(() => {
      setShowAddedNotification(false);
      navigate('/cart');
    }, 900);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Product Section */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left: Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative bg-happi-cream rounded-2xl overflow-hidden h-96 md:h-full md:min-h-[600px] group">
                <ProductVisual category={product.category} name={product.name} image={product.image} size="large" />
                {product.badge && (
                  <div className="absolute top-4 right-4">
                    {product.badge === 'bestseller' && (
                      <span className="badge-premium">Bestseller</span>
                    )}
                    {product.badge === 'new' && (
                      <span className="badge-new">New</span>
                    )}
                    {product.badge === 'premium' && (
                      <span className="badge-premium">Premium</span>
                    )}
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 gap-4 mt-6">
                {Array.from({ length: 4 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="aspect-square bg-happi-cream rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-happi-pink transition-all"
                    >
                      <ProductVisual category={product.category} name={product.name} image={product.image} />
                    </div>
                  )
                )}
              </div>
            </motion.div>

            {/* Right: Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-happi-charcoal mb-4">
                {product.name}
              </h1>
              <p lang="ta" className="-mt-2 mb-5 text-xl font-semibold text-happi-green">{product.tamilName}</p>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(product.rating)
                          ? 'fill-happi-gold text-happi-gold'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-4xl font-bold text-happi-pink">
                    ₹{product.price}
                  </span>
                  <span className="text-sm font-medium text-gray-500">per {product.weight}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-2xl text-gray-400 line-through">
                        ₹{product.originalPrice}
                      </span>
                      <span className="bg-happi-pink text-white px-3 py-1 rounded-full text-sm font-semibold">
                        -
                        {Math.round(
                          ((product.originalPrice - product.price) /
                            product.originalPrice) *
                            100
                        )}
                        %
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Weight Selector */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-happi-charcoal mb-3">
                  Weight
                </label>
                <div className="flex gap-3">
                  {[product.weight].map((w) => (
                    <button
                      key={w}
                      onClick={() => setWeight(w)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        weight === w
                          ? 'border-happi-pink bg-happi-pink text-white'
                          : 'border-gray-300 hover:border-happi-pink'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-happi-charcoal mb-3">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-happi-cream transition-colors"
                  >
                    −
                  </button>
                  <span className="text-2xl font-semibold w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-happi-cream transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                {productEnabled ? (
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 btn-primary text-lg flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                ) : (
                  <div className="flex-1 bg-gray-100 text-gray-500 font-semibold py-3.5 px-4 rounded-lg text-lg flex items-center justify-center gap-2 border border-gray-200">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    Out of Stock
                  </div>
                )}
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="flex-1 btn-outline text-lg flex items-center justify-center gap-2"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isWishlisted ? 'fill-happi-pink text-happi-pink' : ''
                    }`}
                  />
                  {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                </button>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Delivery Info */}
              <div className="bg-happi-cream p-4 rounded-lg flex items-start gap-3">
                <Check className="w-5 h-5 text-happi-green mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-happi-charcoal">
                    Free Delivery on orders above ₹500
                  </p>
                  <p className="text-sm text-gray-600">
                    Delivery within 3-5 business days
                  </p>
                </div>
              </div>

              {/* Added Notification */}
              {showAddedNotification && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-4 bg-happi-green text-white p-4 rounded-lg flex items-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  <span>Added to cart successfully!</span>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs */}
      <section className="border-t border-gray-200 py-12 md:py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-happi-charcoal mb-4">
                Benefits
              </h3>
              <ul className="space-y-3">
                {product.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-600">
                    <Check className="w-5 h-5 text-happi-green flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-happi-charcoal mb-4">
                Ingredients
              </h3>
              <p className="text-gray-600 mb-6">{product.ingredients}</p>

              <h3 className="text-2xl font-bold text-happi-charcoal mb-4">
                Storage Instructions
              </h3>
              <p className="text-gray-600">{product.storageInstructions}</p>
            </div>
          </div>

          {/* Nutritional Info */}
          <div className="mt-12 bg-happi-cream p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-happi-charcoal mb-6">
              Nutritional Information (per 100g)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(product.nutritionalInfo).map(([key, value]) => (
                <div key={key} className="text-center">
                  <p className="text-sm text-gray-600 capitalize mb-2">{key}</p>
                  <p className="text-lg font-bold text-happi-pink">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-12 md:py-16 bg-white border-t border-gray-200">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-happi-charcoal mb-12">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
