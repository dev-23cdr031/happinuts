import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Menu, X, Search, Heart, ShoppingCart, User, LogOut, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import BrandLogo from './BrandLogo';
import { getCartCount, setCartUser } from '@/lib/cart';
import { getWishlistItems } from '@/lib/wishlist';
import { supabase } from '@/lib/supabase';
import { checkIsAdmin } from '@/lib/admin-store';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Categories', href: '/categories' },
  { label: 'Gifting', href: '/gifting' },
  { label: 'About Us', href: '/about' },
  { label: 'Why Happi Nuts', href: '/why-happi-nuts' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(getCartCount());
  const [wishlistCount, setWishlistCount] = useState(getWishlistItems().length);
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const syncCartCount = () => setCartCount(getCartCount());
    const syncWishlistCount = () => setWishlistCount(getWishlistItems().length);

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setCartUser(data.session?.user?.email ?? null);
      setIsAdmin(await checkIsAdmin());
    };

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      // Switch the cart context so each email sees its own cart.
      setCartUser(nextSession?.user?.email ?? null);
      if (nextSession) {
        checkIsAdmin().then(setIsAdmin);
      } else {
        setIsAdmin(false);
      }
    });

    loadSession();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('storage', syncCartCount);
    window.addEventListener('storage', syncWishlistCount);
    window.addEventListener('happi-nuts-cart-updated', syncCartCount);
    window.addEventListener('happi-nuts-wishlist-updated', syncWishlistCount);
    syncCartCount();
    syncWishlistCount();

    return () => {
      authListener.subscription.unsubscribe();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', syncCartCount);
      window.removeEventListener('storage', syncWishlistCount);
      window.removeEventListener('happi-nuts-cart-updated', syncCartCount);
      window.removeEventListener('happi-nuts-wishlist-updated', syncWishlistCount);
    };
  }, []);

  const handleSignOut = async () => {
    setShowLogoutConfirm(false);
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Signed out successfully.');
    setSession(null);
    window.location.href = '/';
  };

  return (
    <>
      {/* Desktop Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-md border-b border-white/20 shadow-lg'
            : 'bg-white/50 backdrop-blur-md border-b border-white/10'
        }`}
      >
        <div className="container flex items-center justify-between h-20">
          {/* Brand logo */}
          <a href="/" className="flex items-center group" aria-label="Happi Nuts home">
            <span className="group-hover:scale-[1.02] transition-transform"><BrandLogo /></span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`font-medium text-sm transition-all duration-200 pb-2 border-b-2 ${
                  location === item.href
                    ? 'text-happi-pink border-happi-pink'
                    : 'text-happi-charcoal border-transparent hover:text-happi-pink'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-4">
            <button
              type="button"
              aria-label="Search products"
              className="hidden sm:inline-flex h-9 w-9 items-center justify-center border border-happi-charcoal/70 bg-transparent text-happi-charcoal transition-colors hover:border-happi-pink hover:text-happi-pink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-happi-pink/40"
            >
              <Search className="w-5 h-5 stroke-[2]" aria-hidden="true" />
            </button>
            <a
              href="/wishlist"
              className="p-2 hover:bg-happi-pink/10 rounded-lg transition-colors relative"
            >
              <Heart className="w-5 h-5 text-happi-charcoal" />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-happi-pink text-white text-xs rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </a>
            <a
              href="/cart"
              className="p-2 hover:bg-happi-pink/10 rounded-lg transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5 text-happi-charcoal" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-happi-pink text-white text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </a>
            {session ? (
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="hidden lg:flex items-center rounded-full border border-happi-pink/20 bg-happi-pink/5 px-3 py-1.5 text-xs text-happi-charcoal">
                  {session.user?.email?.split('@')[0] || 'User'}
                </div>
                <a
                  href="/my-orders"
                  className="hidden lg:inline-flex items-center rounded-full border border-happi-cyan/20 bg-happi-cyan/5 px-3 py-1.5 text-xs font-semibold text-happi-cyan hover:bg-happi-cyan hover:text-white transition-colors"
                >
                  My Orders
                </a>
                {isAdmin && (
                  <a
                    href="/admin"
                    className="hidden lg:inline-flex items-center rounded-full border border-happi-pink/20 bg-white px-3 py-1.5 text-xs font-semibold text-happi-pink"
                  >
                    Admin
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(true)}
                  className="p-2 hover:bg-happi-pink/10 rounded-lg transition-colors"
                  aria-label="Sign out"
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5 text-happi-charcoal" />
                </button>
              </div>
            ) : (
              <a
                href="/login"
                className="p-2 hover:bg-happi-pink/10 rounded-lg transition-colors"
                aria-label="Login"
              >
                <User className="w-5 h-5 text-happi-charcoal" />
              </a>
            )}
            <a
              href="/shop"
              className="hidden md:inline-block btn-primary text-sm"
            >
              Shop Now
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-happi-charcoal" />
            ) : (
              <Menu className="w-6 h-6 text-happi-charcoal" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-0 top-20 bg-white z-40 lg:hidden overflow-y-auto"
        >
          <nav className="flex flex-col p-6 gap-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`py-3 px-4 rounded-lg font-medium transition-all ${
                  location === item.href
                    ? 'bg-happi-pink text-white'
                    : 'text-happi-charcoal hover:bg-happi-cream'
                }`}
              >
                {item.label}
              </a>
            ))}
            {isAdmin && (
              <a
                href="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="py-3 px-4 rounded-lg font-semibold text-happi-pink hover:bg-happi-cream transition-all"
              >
                Admin Dashboard
              </a>
            )}
            <a
              href="/shop"
              className="btn-primary text-center mt-4"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop Now
            </a>
          </nav>
        </motion.div>
      )}

      {/* Spacer */}
      <div className="h-20" />

      {/* Two-Step Logout Confirmation */}
      {showLogoutConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-5">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-happi-charcoal mb-2">
              Are you sure you want to sign out?
            </h3>
            <p className="text-gray-600 mb-8">
              You will need to sign in again to access your account and place orders.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
              >
                Yes, Sign Out
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
