import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  PackageCheck,
  Truck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ShoppingBag,
  CreditCard,
  Banknote,
  BadgeCheck,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Sparkle,
  AlertTriangle,
} from 'lucide-react';
import { useLocation } from 'wouter';
import { supabase } from '@/lib/supabase';
import { fetchOrders, type AdminOrder, type OrderStatus } from '@/lib/admin-store';
import ThemedScene from '@/components/three/ThemedScene';

const STATUS_STEPS: OrderStatus[] = ['Pending', 'Packed', 'Shipped', 'Delivered'];

const STATUS_META: Record<OrderStatus, { label: string; icon: typeof Package; color: string; bg: string }> = {
  Pending: { label: 'Pending', icon: Package, color: 'text-amber-600', bg: 'bg-amber-100' },
  Packed: { label: 'Packed', icon: PackageCheck, color: 'text-blue-600', bg: 'bg-blue-100' },
  Shipped: { label: 'Shipped', icon: Truck, color: 'text-cyan-600', bg: 'bg-cyan-100' },
  Delivered: { label: 'Delivered', icon: CheckCircle2, color: 'text-happi-green', bg: 'bg-happi-green/15' },
  Cancelled: { label: 'Cancelled', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
};

function OrderStatusTracker({ status }: { status: OrderStatus }) {
  const currentIndex = STATUS_STEPS.indexOf(status);

  if (status === 'Cancelled') {
    return (
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200">
        <AlertTriangle className="w-6 h-6 text-red-500" />
        <div>
          <p className="font-bold text-red-700">Order Cancelled</p>
          <p className="text-sm text-red-500">This order has been cancelled.</p>
        </div>
      </div>
    );
  }

  const isCompleted = status === 'Delivered';

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-6">
        {STATUS_STEPS.map((step, idx) => {
          const Icon = STATUS_META[step].icon;
          const isActive = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          return (
            <div key={step} className="flex-1 flex flex-col items-center relative">
              {idx < STATUS_STEPS.length - 1 && (
                <div
                  className={`absolute top-5 left-[calc(50%+22px)] right-[calc(-50%+22px)] h-1 rounded-full transition-colors duration-500 ${
                    idx < currentIndex ? 'bg-happi-green' : 'bg-gray-200'
                  }`}
                />
              )}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 z-10 ${
                  isActive
                    ? isCurrent && !isCompleted
                      ? 'bg-happi-pink border-happi-pink text-white animate-pulse'
                      : 'bg-happi-green border-happi-green text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`mt-2 text-xs font-semibold ${
                  isActive ? (isCurrent && !isCompleted ? 'text-happi-pink' : 'text-happi-green') : 'text-gray-400'
                }`}
              >
                {STATUS_META[step].label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="text-center">
        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${isCompleted ? 'bg-happi-green/15 text-happi-green' : 'bg-happi-pink/10 text-happi-pink'}`}>
          <Sparkle className="w-4 h-4" />
          {isCompleted ? 'Delivered — Enjoy your Happi nuts! 🎉' : `Currently ${STATUS_META[status].label}`}
        </span>
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: AdminOrder }) {
  const [expanded, setExpanded] = useState(false);
  const meta = STATUS_META[order.status];
  const Icon = meta.icon;
  const itemCount = (order.items || []).reduce((sum, item) => sum + item.quantity, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-happi-cream/40 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl ${meta.bg} flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${meta.color}`} />
          </div>
          <div>
            <p className="font-bold text-happi-charcoal">Order #{order.order_number}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <Calendar className="w-3 h-3" />
              {new Date(order.created_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-bold text-happi-pink">₹{order.total}</p>
            <p className="text-xs text-gray-500">{itemCount} item{itemCount === 1 ? '' : 's'}</p>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${meta.bg} ${meta.color}`}>
            <Icon className="w-3.5 h-3.5" />
            {meta.label}
          </span>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-gray-100"
          >
            <div className="p-6 space-y-6">
              {/* Order Status Tracker */}
              <OrderStatusTracker status={order.status} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Items */}
                <div>
                  <h4 className="text-sm font-bold text-happi-charcoal uppercase tracking-wide mb-3">
                    Order Items
                  </h4>
                  <div className="space-y-2">
                    {(order.items || []).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between bg-happi-cream rounded-lg px-4 py-2.5 text-sm"
                      >
                        <div>
                          <span className="font-medium text-happi-charcoal">{item.name}</span>
                          <span className="text-gray-400 ml-2">× {item.quantity}</span>
                        </div>
                        <span className="font-semibold text-happi-charcoal">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment & Delivery */}
                <div className="space-y-3">
                  {/* Payment */}
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Payment</span>
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold capitalize">
                        {order.payment_method === 'cod' ? (
                          <>
                            <Banknote className="w-4 h-4 text-happi-green" />
                            Cash on Delivery
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4 text-happi-cyan" />
                            {order.payment_method}
                          </>
                        )}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm text-gray-500">Status</span>
                      {order.payment_method === 'cod' ? (
                        <span className="text-sm font-semibold text-amber-600">Pay on delivery</span>
                      ) : order.payment_id ? (
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-happi-green">
                          <BadgeCheck className="w-4 h-4" /> Paid
                        </span>
                      ) : (
                        <span className="text-sm font-semibold text-red-500">Not paid</span>
                      )}
                    </div>
                  </div>

                  {/* Delivery info */}
                  <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-happi-cyan shrink-0" />
                      <span className="truncate">{order.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-happi-green shrink-0" />
                      <span>{order.phone}</span>
                    </div>
                    {(order.address || order.city) && (
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-happi-pink shrink-0 mt-0.5" />
                        <span className="flex-1">
                          {[order.address, order.city, order.state, order.pincode].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Summary */}
                  <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-1.5 text-sm">
                    <div className="flex justify-between text-gray-500">
                      <span>Subtotal</span>
                      <span>₹{order.subtotal}</span>
                    </div>
                    <div className={`flex justify-between ${order.discount > 0 ? 'text-happi-green' : 'text-gray-400'}`}>
                      <span>Discount</span>
                      <span>{order.discount > 0 ? `-₹${order.discount}` : '₹0'}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Delivery</span>
                      <span>{order.delivery === 0 ? 'FREE' : `₹${order.delivery}`}</span>
                    </div>
                    <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-happi-charcoal">
                      <span>Total</span>
                      <span className="text-happi-pink">₹{order.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function MyOrders() {
  const [, navigate] = useLocation();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    const allOrders = await fetchOrders();
    const userOrders = sessionUserId
      ? allOrders.filter((order) => order.user_id === sessionUserId)
      : allOrders.filter((order) => !order.user_id);
    setOrders(userOrders);
    setLoading(false);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!session) {
        navigate('/login');
        return;
      }

      setSessionUserId(session.user.id);
      setIsAuthenticated(true);
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (isAuthenticated && sessionUserId) {
      loadOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, sessionUserId]);

  const ordersByStatus = useMemo(() => {
    const active = orders.filter((o) => o.status !== 'Cancelled' && o.status !== 'Delivered');
    const delivered = orders.filter((o) => o.status === 'Delivered');
    const cancelled = orders.filter((o) => o.status === 'Cancelled');
    return { active, delivered, cancelled };
  }, [orders]);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-happi-cream via-white to-happi-cream pb-12 md:pb-16">
        <div className="blob-decoration w-96 h-96 bg-happi-pink -top-32 -left-32 animate-blob" />
        <div className="blob-decoration w-80 h-80 bg-happi-cyan top-40 -right-24 animate-blob" style={{ animationDelay: '3s' }} />
        <div className="absolute inset-0 bg-dots-pattern opacity-40" />

        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur border border-happi-pink/20 text-happi-pink text-sm font-semibold px-4 py-2 rounded-full mb-5">
                <ShoppingBag className="w-4 h-4" />
                Order Tracking
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-happi-charcoal mb-4">
                My <span className="text-gradient-happi">Orders</span>
              </h1>
              <p className="text-lg text-gray-600">
                Track your orders, view delivery status, and manage your purchases all in one place.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative h-[220px] md:h-[280px]"
            >
              <ThemedScene className="w-full h-full" variant="boxes" color="#19A9E5" count={9} />
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
                className="absolute bottom-4 right-2 glass-card-light rounded-2xl px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-happi-cyan" />
                  <span className="font-semibold text-sm text-happi-charcoal">
                    {orders.length > 0 ? `${orders.length} orders placed` : 'Track your order'}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Orders Content */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-white to-happi-cream">
        <div className="container">
          {loading ? (
            <div className="text-center py-20">
              <RefreshCw className="w-10 h-10 text-happi-pink animate-spin mx-auto" />
              <p className="mt-4 text-gray-500">Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-white rounded-3xl shadow-lg border border-gray-100"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-happi-cream mb-6 pulse-ring">
                <ShoppingBag className="w-12 h-12 text-happi-pink" />
              </div>
              <h2 className="text-3xl font-bold text-happi-charcoal mb-3">
                No orders <span className="text-gradient-happi">yet</span>
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                When you place an order, it will appear here with live tracking.
              </p>
              <a href="/shop" className="btn-primary inline-flex items-center gap-2 btn-shine">
                Start Shopping
              </a>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {/* Active Orders */}
              {ordersByStatus.active.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-3 h-3 rounded-full bg-happi-pink animate-pulse" />
                    <h2 className="text-xl md:text-2xl font-bold text-happi-charcoal">
                      Active Orders ({ordersByStatus.active.length})
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {ordersByStatus.active.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                  </div>
                </div>
              )}

              {/* Delivered Orders */}
              {ordersByStatus.delivered.length > 0 && (
                <div className="mt-10">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-3 h-3 rounded-full bg-happi-green" />
                    <h2 className="text-xl md:text-2xl font-bold text-happi-charcoal">
                      Delivered ({ordersByStatus.delivered.length})
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {ordersByStatus.delivered.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                  </div>
                </div>
              )}

              {/* Cancelled Orders */}
              {ordersByStatus.cancelled.length > 0 && (
                <div className="mt-10">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <h2 className="text-xl md:text-2xl font-bold text-happi-charcoal">
                      Cancelled ({ordersByStatus.cancelled.length})
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {ordersByStatus.cancelled.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}