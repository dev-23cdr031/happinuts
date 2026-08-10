import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Pencil,
  Trash2,
  ShieldCheck,
  PackageCheck,
  TrendingUp,
  ShoppingBag,
  Users,
  LayoutDashboard,
  X,
  Save,
  Search,
  Percent,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  RefreshCw,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ToggleLeft,
  ToggleRight,
  Settings2,
  Globe,
  CreditCard,
  Banknote,
  Phone,
  Mail,
  MapPin,
  BadgeCheck,
  User,
} from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';
import { supabase } from '@/lib/supabase';
import {
  checkIsAdmin,
  isOwnerEmail,
  fetchProducts,
  fetchOrders,
  fetchCustomers,
  saveProductToSupabase,
  deleteProductFromSupabase,
  seedProductsToSupabase,
  updateOrderStatus,
  updateOrderDiscount,
  updateOrderDelivery,
  deleteOrder,
  createOrderInSupabase,
  updateCustomerRole,
  type AdminOrder,
  type AdminCustomer,
  type OrderStatus,
} from '@/lib/admin-store';
import { getCatalogProducts, setCatalogProducts, type Product } from '@/data/products';
import {
  getStoreSettings,
  saveStoreSettings,
  getDeliveryCharge,
  getDefaultDiscount,
  type StoreSettings,
} from '@/lib/settings';
import {
  getPageControls,
  setPageControl,
  setAllPageControls,
  getProductToggles,
  setProductToggle,
  type PageControl,
} from '@/lib/page-controls';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';

// ============================================
// Types & Constants
// ============================================

type AdminTab = 'dashboard' | 'controls' | 'products' | 'orders' | 'customers' | 'messages';

const CATEGORIES = [
  { value: 'nuts', label: 'Nuts & Dry Fruits' },
  { value: 'seeds', label: 'Seeds' },
  { value: 'dried', label: 'Dried Fruits' },
  { value: 'pantry', label: 'Healthy Pantry' },
  { value: 'sweets', label: 'Sweets & Treats' },
];

const BADGES = [
  { value: 'bestseller', label: 'Bestseller' },
  { value: 'new', label: 'New' },
  { value: 'premium', label: 'Premium' },
];

const ORDER_STATUSES: OrderStatus[] = ['Pending', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];

const STATUS_COLORS: Record<OrderStatus, string> = {
  Pending: 'bg-amber-100 text-amber-700 border-amber-200',
  Packed: 'bg-blue-100 text-blue-700 border-blue-200',
  Shipped: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  Delivered: 'bg-green-100 text-green-700 border-green-200',
  Cancelled: 'bg-red-100 text-red-700 border-red-200',
};

const emptyProductForm = (): Product => ({
  id: crypto.randomUUID(),
  name: '',
  tamilName: '',
  price: 0,
  originalPrice: undefined,
  weight: '1 kg',
  rating: 4.5,
  reviews: 0,
  badge: undefined,
  description: '',
  benefits: ['Freshly packed', 'Premium quality'],
  ingredients: '',
  category: 'nuts',
  nutritionalInfo: {
    calories: 'See package',
    protein: 'See package',
    fat: 'See package',
    carbs: 'See package',
    fiber: 'See package',
  },
  storageInstructions: 'Store in an airtight container in a cool, dry place.',
  image: '/assets/products/raw-cashews.jpg',
});

const formatCurrency = (value: number) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

// ============================================
// Sub-components
// ============================================

function StatCard({
  icon: Icon,
  label,
  value,
  accent = 'text-happi-pink',
  bg = 'bg-happi-pink/10',
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  accent?: string;
  bg?: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-200">
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${bg} ${accent}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="mt-4 text-3xl font-black text-happi-charcoal">{value}</p>
      <p className="mt-1 text-sm font-medium text-gray-500">{label}</p>
    </div>
  );
}

function ProductFormModal({
  open,
  onClose,
  product,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onSave: (product: Product) => Promise<void>;
}) {
  const [draft, setDraft] = useState<Product>(product || emptyProductForm());
  const [saving, setSaving] = useState(false);
  const [benefitsText, setBenefitsText] = useState(
    (product?.benefits || []).join(', '),
  );

  useEffect(() => {
    if (open) {
      setDraft(product || emptyProductForm());
      setBenefitsText((product?.benefits || []).join(', '));
    }
  }, [open, product]);

  if (!open) return null;

  const handleInput = (field: keyof Product, value: string | number | undefined) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!draft.name.trim()) {
      toast.error('Product name is required.');
      return;
    }

    const normalized = {
      ...draft,
      name: draft.name.trim(),
      tamilName: draft.tamilName.trim() || 'நல்ல பொருள்',
      description: draft.description.trim() || `${draft.name} by Happi Nuts.`,
      price: Number(draft.price) || 0,
      originalPrice: draft.originalPrice ? Number(draft.originalPrice) : undefined,
      reviews: Number(draft.reviews) || 0,
      rating: Number(draft.rating) || 4.5,
      badge: (draft.badge || undefined) as Product['badge'],
      benefits: benefitsText
        .split(',')
        .map((benefit) => benefit.trim())
        .filter(Boolean),
      category: draft.category || 'nuts',
    };

    if (normalized.benefits.length === 0) {
      normalized.benefits = ['Freshly packed'];
    }

    setSaving(true);
    try {
      await onSave(normalized);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-happi-pink focus:ring-1 focus:ring-happi-pink/30';
  const labelClass = 'block text-sm font-semibold text-happi-charcoal mb-1.5';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-black text-happi-charcoal">
              {product ? 'Edit product' : 'Add new product'}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {product ? `Editing: ${product.name}` : 'Fill in the details to create a new product'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Name row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Product name *</label>
              <input
                value={draft.name}
                onChange={(e) => handleInput('name', e.target.value)}
                placeholder="Raw Cashews"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Tamil name</label>
              <input
                value={draft.tamilName}
                onChange={(e) => handleInput('tamilName', e.target.value)}
                placeholder="முழு முந்திரி பருப்பு"
                className={inputClass}
              />
            </div>
          </div>

          {/* Price row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className={labelClass}>Price (₹) *</label>
              <input
                type="number"
                min="0"
                value={draft.price || ''}
                onChange={(e) => handleInput('price', Number(e.target.value))}
                placeholder="900"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Original price</label>
              <input
                type="number"
                min="0"
                value={draft.originalPrice || ''}
                onChange={(e) => handleInput('originalPrice', Number(e.target.value))}
                placeholder="1000 (optional)"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Weight</label>
              <input
                value={draft.weight}
                onChange={(e) => handleInput('weight', e.target.value)}
                placeholder="1 kg"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select
                value={draft.category}
                onChange={(e) => handleInput('category', e.target.value)}
                className={inputClass}
              >
                {CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Rating row */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Rating</label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={draft.rating}
                onChange={(e) => handleInput('rating', Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Reviews</label>
              <input
                type="number"
                min="0"
                value={draft.reviews}
                onChange={(e) => handleInput('reviews', Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Badge</label>
              <select
                value={draft.badge || ''}
                onChange={(e) => handleInput('badge', e.target.value || undefined)}
                className={inputClass}
              >
                <option value="">None</option>
                {BADGES.map((badge) => (
                  <option key={badge.value} value={badge.value}>
                    {badge.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image */}
          <div>
            <label className={labelClass}>Image URL</label>
            <div className="flex gap-3">
              <input
                value={draft.image || ''}
                onChange={(e) => handleInput('image', e.target.value)}
                placeholder="/assets/products/raw-cashews.jpg"
                className={inputClass}
              />
              {draft.image && (
                <div className="w-14 h-14 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                  <img
                    src={draft.image}
                    alt={draft.name || 'Product preview'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.opacity = '0.2';
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={draft.description}
              onChange={(e) => handleInput('description', e.target.value)}
              rows={3}
              placeholder="Product description..."
              className={inputClass}
            />
          </div>

          {/* Benefits */}
          <div>
            <label className={labelClass}>Benefits (comma separated)</label>
            <input
              value={benefitsText}
              onChange={(e) => setBenefitsText(e.target.value)}
              placeholder="Quality-picked, Packed for freshness, Everyday pantry essential"
              className={inputClass}
            />
          </div>

          {/* Ingredients + Storage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Ingredients</label>
              <input
                value={draft.ingredients}
                onChange={(e) => handleInput('ingredients', e.target.value)}
                placeholder="Cashews / முந்திரி பருப்பு"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Storage instructions</label>
              <input
                value={draft.storageInstructions}
                onChange={(e) => handleInput('storageInstructions', e.target.value)}
                placeholder="Store in an airtight container..."
                className={inputClass}
              />
            </div>
          </div>

          {/* Nutrition */}
          <div>
            <p className="text-sm font-semibold text-happi-charcoal mb-2">Nutritional info (per serving)</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {(
                ['calories', 'protein', 'fat', 'carbs', 'fiber'] as const
              ).map((field) => (
                <div key={field}>
                  <label className="block text-xs font-medium text-gray-500 capitalize mb-1">
                    {field}
                  </label>
                  <input
                    value={draft.nutritionalInfo[field]}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        nutritionalInfo: {
                          ...prev.nutritionalInfo,
                          [field]: e.target.value,
                        },
                      }))
                    }
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center gap-2 btn-primary text-sm"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : product ? 'Save changes' : 'Create product'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  productName,
  deleting,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  productName: string;
  deleting: boolean;
}) {
  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100 text-red-600 mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-black text-happi-charcoal text-center mt-4">
          Delete product?
        </h3>
        <p className="text-sm text-gray-600 text-center mt-2">
          Are you sure you want to delete <strong>{productName}</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function OrdersSection({
  orders,
  loading,
  onStatusChange,
  onDiscountChange,
  onDeliveryChange,
  onDelete,
  products,
}: {
  orders: AdminOrder[];
  loading: boolean;
  onStatusChange: (orderId: string, status: OrderStatus) => Promise<void>;
  onDiscountChange: (orderId: string, discount: number) => Promise<void>;
  onDeliveryChange: (orderId: string, delivery: number) => Promise<void>;
  onDelete: (order: AdminOrder) => Promise<void>;
  products: Product[];
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [orderTypeFilter, setOrderTypeFilter] = useState<'all' | 'online' | 'offline'>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [discountDrafts, setDiscountDrafts] = useState<Record<string, string>>({});
  const [deliveryDrafts, setDeliveryDrafts] = useState<Record<string, string>>({});
  const [showManualOrder, setShowManualOrder] = useState(false);
  const [manualOrder, setManualOrder] = useState({
    customer_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    payment_method: 'cash',
    items: [] as { product_id: string; name: string; price: number; quantity: number }[],
  });
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedQty, setSelectedQty] = useState(1);

  const addManualItem = () => {
    if (!selectedProductId) return;
    const product = products.find((p) => p.id === selectedProductId);
    if (!product) return;
    setManualOrder((prev) => ({
      ...prev,
      items: [...prev.items, { product_id: product.id, name: product.name, price: product.price, quantity: selectedQty }],
    }));
    setSelectedProductId('');
    setSelectedQty(1);
  };

  const removeManualItem = (index: number) => {
    setManualOrder((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const manualSubtotal = manualOrder.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const manualDelivery = manualSubtotal > 500 ? 0 : 50;
  const manualTotal = manualSubtotal + manualDelivery;

  const saveManualOrder = () => {
    if (!manualOrder.customer_name || !manualOrder.phone || manualOrder.items.length === 0) {
      toast.error('Please fill customer name, phone, and add at least one product.');
      return;
    }

    const orderNumber = `HN-OFF-${Date.now().toString().slice(-6)}`;
    const newOrder: AdminOrder = {
      id: `manual-${Date.now()}`,
      order_number: orderNumber,
      user_id: null,
      customer_name: manualOrder.customer_name,
      email: manualOrder.email || 'offline@happinuts.com',
      phone: manualOrder.phone,
      address: manualOrder.address || null,
      city: manualOrder.city || null,
      state: manualOrder.state || null,
      pincode: manualOrder.pincode || null,
      payment_method: manualOrder.payment_method,
      payment_id: manualOrder.payment_method === 'cash' ? null : `manual-${Date.now()}`,
      subtotal: manualSubtotal,
      discount: 0,
      delivery: manualDelivery,
      total: manualTotal,
      status: 'Pending',
      created_at: new Date().toISOString(),
      items: manualOrder.items.map((item, index) => ({
        id: String(index),
        product_id: item.product_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    };

    // Save locally so it persists
    const localOrders = JSON.parse(localStorage.getItem('happi-nuts-admin-orders') || '[]');
    localOrders.unshift(newOrder);
    localStorage.setItem('happi-nuts-admin-orders', JSON.stringify(localOrders));

    // Also try to save to Supabase
    createOrderInSupabase({
      order_number: orderNumber,
      user_id: null,
      customer_name: manualOrder.customer_name,
      email: manualOrder.email || 'offline@happinuts.com',
      phone: manualOrder.phone,
      address: manualOrder.address,
      city: manualOrder.city,
      state: manualOrder.state,
      pincode: manualOrder.pincode,
      payment_method: manualOrder.payment_method,
      payment_id: manualOrder.payment_method === 'cash' ? null : `manual-${Date.now()}`,
      subtotal: manualSubtotal,
      discount: 0,
      delivery: manualDelivery,
      total: manualTotal,
      items: manualOrder.items,
    });

    toast.success(`Offline order ${orderNumber} created successfully!`);
    setShowManualOrder(false);
    setManualOrder({
      customer_name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      payment_method: 'cash',
      items: [],
    });
    // Refresh orders
    window.dispatchEvent(new Event('happi-nuts-orders-updated'));
  };

  const isOfflineOrder = (order: AdminOrder) =>
    order.id.startsWith('manual-') || order.order_number.startsWith('HN-OFF-');

  const onlineCount = orders.filter((o) => !isOfflineOrder(o)).length;
  const offlineCount = orders.filter((o) => isOfflineOrder(o)).length;

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        !search ||
        order.order_number.toLowerCase().includes(search.toLowerCase()) ||
        order.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        order.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchesType =
        orderTypeFilter === 'all' ||
        (orderTypeFilter === 'online' && !isOfflineOrder(order)) ||
        (orderTypeFilter === 'offline' && isOfflineOrder(order));
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [orders, search, statusFilter, orderTypeFilter]);

  if (loading) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center">
        <RefreshCw className="w-6 h-6 text-happi-pink animate-spin mx-auto" />
        <p className="mt-3 text-gray-500">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters + Manual Order Button */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order number, customer name, or email..."
            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-happi-pink"
          />
        </div>

        {/* Order Type Toggle */}
        <div className="inline-flex rounded-lg border border-gray-300 overflow-hidden shrink-0">
          <button
            onClick={() => setOrderTypeFilter('all')}
            className={`px-3 py-2.5 text-sm font-semibold transition-colors ${
              orderTypeFilter === 'all'
                ? 'bg-happi-pink text-white'
                : 'bg-white text-gray-600 hover:bg-happi-cream'
            }`}
          >
            All ({orders.length})
          </button>
          <button
            onClick={() => setOrderTypeFilter('online')}
            className={`px-3 py-2.5 text-sm font-semibold transition-colors ${
              orderTypeFilter === 'online'
                ? 'bg-happi-cyan text-white'
                : 'bg-white text-gray-600 hover:bg-happi-cream'
            }`}
          >
            Online ({onlineCount})
          </button>
          <button
            onClick={() => setOrderTypeFilter('offline')}
            className={`px-3 py-2.5 text-sm font-semibold transition-colors ${
              orderTypeFilter === 'offline'
                ? 'bg-happi-green text-white'
                : 'bg-white text-gray-600 hover:bg-happi-cream'
            }`}
          >
            Offline ({offlineCount})
          </button>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-happi-pink"
        >
          <option value="all">All statuses</option>
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <button
          onClick={() => setShowManualOrder(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-happi-green text-white text-sm font-semibold hover:bg-green-600 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Offline Order
        </button>
      </div>

      {/* Manual Order Modal */}
      {showManualOrder && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowManualOrder(false)}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-black text-happi-charcoal">Add Offline Order</h3>
                <p className="text-sm text-gray-500 mt-0.5">Record a manual sale made at the store</p>
              </div>
              <button onClick={() => setShowManualOrder(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="px-6 py-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Customer Details */}
              <div>
                <h4 className="text-sm font-bold text-happi-charcoal uppercase tracking-wide mb-3">Customer Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    value={manualOrder.customer_name}
                    onChange={(e) => setManualOrder({ ...manualOrder, customer_name: e.target.value })}
                    placeholder="Customer Name *"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-happi-pink"
                  />
                  <input
                    value={manualOrder.phone}
                    onChange={(e) => setManualOrder({ ...manualOrder, phone: e.target.value })}
                    placeholder="Phone *"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-happi-pink"
                  />
                  <input
                    value={manualOrder.email}
                    onChange={(e) => setManualOrder({ ...manualOrder, email: e.target.value })}
                    placeholder="Email (optional)"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-happi-pink md:col-span-2"
                  />
                  <input
                    value={manualOrder.address}
                    onChange={(e) => setManualOrder({ ...manualOrder, address: e.target.value })}
                    placeholder="Address (optional)"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-happi-pink md:col-span-2"
                  />
                  <input
                    value={manualOrder.city}
                    onChange={(e) => setManualOrder({ ...manualOrder, city: e.target.value })}
                    placeholder="City"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-happi-pink"
                  />
                  <input
                    value={manualOrder.pincode}
                    onChange={(e) => setManualOrder({ ...manualOrder, pincode: e.target.value })}
                    placeholder="Pincode"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-happi-pink"
                  />
                </div>
              </div>

              {/* Add Items */}
              <div>
                <h4 className="text-sm font-bold text-happi-charcoal uppercase tracking-wide mb-3">Add Products</h4>
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-happi-pink"
                  >
                    <option value="">Select product...</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} - ₹{p.price}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={selectedQty}
                    onChange={(e) => setSelectedQty(Math.max(1, Number(e.target.value)))}
                    className="w-20 rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-happi-pink"
                  />
                  <button
                    onClick={addManualItem}
                    className="inline-flex items-center justify-center gap-1 px-4 py-2.5 rounded-lg bg-happi-pink text-white text-sm font-semibold hover:bg-pink-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>

                {/* Selected Items */}
                {manualOrder.items.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {manualOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-happi-cream rounded-lg px-4 py-2.5 text-sm">
                        <div>
                          <span className="font-medium text-happi-charcoal">{item.name}</span>
                          <span className="text-gray-400 ml-2">× {item.quantity}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-happi-charcoal">₹{item.price * item.quantity}</span>
                          <button onClick={() => removeManualItem(idx)} className="text-red-500 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div>
                <h4 className="text-sm font-bold text-happi-charcoal uppercase tracking-wide mb-3">Payment Method</h4>
                <div className="flex gap-3">
                  {['cash', 'upi', 'card'].map((method) => (
                    <button
                      key={method}
                      onClick={() => setManualOrder({ ...manualOrder, payment_method: method })}
                      className={`px-4 py-2 rounded-lg border-2 text-sm font-semibold capitalize transition-colors ${
                        manualOrder.payment_method === method
                          ? 'border-happi-pink bg-happi-pink text-white'
                          : 'border-gray-300 text-gray-600 hover:border-happi-pink'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{manualSubtotal}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery</span>
                  <span>{manualDelivery === 0 ? 'FREE' : `₹${manualDelivery}`}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-happi-charcoal">
                  <span>Total</span>
                  <span className="text-happi-pink">₹{manualTotal}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-gray-200">
              <button
                onClick={() => setShowManualOrder(false)}
                className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveManualOrder}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-happi-green text-white text-sm font-semibold hover:bg-green-600 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Offline Order
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Orders table */}
      <div className="rounded-3xl border border-gray-200 bg-white overflow-hidden overflow-x-auto">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
            <p className="mt-4 text-lg font-semibold text-happi-charcoal">No orders found</p>
            <p className="text-sm text-gray-500 mt-1">
              {search || statusFilter !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'Orders placed by customers will appear here.'}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-happi-cream">
                <TableHead className="px-4">Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const isExpanded = expandedOrder === order.id;
                const discountDraft = discountDrafts[order.id] ?? String(order.discount);
                const deliveryDraft = deliveryDrafts[order.id] ?? String(order.delivery);

                return (
                  <>
                    <TableRow key={order.id}>
                      <TableCell className="px-4 font-semibold text-happi-charcoal">
                        {order.order_number}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-happi-charcoal">{order.customer_name}</div>
                        <div className="text-xs text-gray-500">{order.email}</div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-700">
                        {order.items?.length || 0} item{(order.items?.length || 0) === 1 ? '' : 's'}
                      </TableCell>
                      <TableCell className="font-semibold text-happi-charcoal">
                        {formatCurrency(order.total)}
                      </TableCell>
                      <TableCell>
                        <select
                          value={order.status}
                          onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
                          className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${STATUS_COLORS[order.status]}`}
                        >
                          {ORDER_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Percent className="w-3 h-3 text-happi-green" />
                          <input
                            type="number"
                            min="0"
                            value={discountDraft}
                            onChange={(e) =>
                              setDiscountDrafts((prev) => ({
                                ...prev,
                                [order.id]: e.target.value,
                              }))
                            }
                            onBlur={() => {
                              const value = Number(discountDraft) || 0;
                              if (value !== order.discount) {
                                onDiscountChange(order.id, Math.min(value, order.subtotal));
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const value = Number(discountDraft) || 0;
                                if (value !== order.discount) {
                                  onDiscountChange(order.id, Math.min(value, order.subtotal));
                                }
                                (e.target as HTMLInputElement).blur();
                              }
                            }}
                            className="w-20 rounded-lg border border-gray-300 px-2 py-1 text-sm"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Banknote className="w-3 h-3 text-happi-cyan" />
                          <input
                            type="number"
                            min="0"
                            value={deliveryDraft}
                            onChange={(e) =>
                              setDeliveryDrafts((prev) => ({
                                ...prev,
                                [order.id]: e.target.value,
                              }))
                            }
                            onBlur={() => {
                              const value = Number(deliveryDraft) || 0;
                              if (value !== order.delivery) {
                                onDeliveryChange(order.id, value);
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const value = Number(deliveryDraft) || 0;
                                if (value !== order.delivery) {
                                  onDeliveryChange(order.id, value);
                                }
                                (e.target as HTMLInputElement).blur();
                              }
                            }}
                            className="w-20 rounded-lg border border-gray-300 px-2 py-1 text-sm"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">{formatDate(order.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label={isExpanded ? 'Collapse order' : 'Expand order'}
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-gray-500" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-500" />
                            )}
                          </button>
                          <button
                            onClick={() => onDelete(order)}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                            aria-label={`Delete order ${order.order_number}`}
                            title="Delete order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow>
                        <TableCell colSpan={9} className="bg-happi-cream/50 p-6">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Items */}
                            <div>
                              <h4 className="text-sm font-bold text-happi-charcoal uppercase tracking-wide mb-3">
                                Items
                              </h4>
                              <div className="space-y-2">
                                {order.items?.map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex items-center justify-between bg-white rounded-lg px-4 py-2.5 border border-gray-200 text-sm"
                                  >
                                    <div>
                                      <span className="font-medium text-happi-charcoal">{item.name}</span>
                                      <span className="text-gray-400 ml-2">× {item.quantity}</span>
                                    </div>
                                    <span className="font-semibold text-happi-charcoal">
                                      {formatCurrency(item.price * item.quantity)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Summary & Details */}
                            <div className="space-y-4">
                              {/* Payment Status */}
                              <div>
                                <h4 className="text-sm font-bold text-happi-charcoal uppercase tracking-wide mb-3">
                                  Payment Status
                                </h4>
                                <div className="bg-white rounded-lg border border-gray-200 p-4">
                                  <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm text-gray-500">Payment Method</span>
                                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-happi-charcoal capitalize">
                                      {order.payment_method === 'cod' ? (
                                        <Banknote className="w-4 h-4 text-happi-green" />
                                      ) : (
                                        <CreditCard className="w-4 h-4 text-happi-cyan" />
                                      )}
                                      {order.payment_method}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">Payment Received</span>
                                    {order.payment_method === 'cod' ? (
                                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600">
                                        <Banknote className="w-4 h-4" />
                                        Cash on Delivery
                                      </span>
                                    ) : order.payment_id ? (
                                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-happi-green">
                                        <BadgeCheck className="w-4 h-4" />
                                        Paid
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-500">
                                        <AlertTriangle className="w-4 h-4" />
                                        Not Paid
                                      </span>
                                    )}
                                  </div>
                                  {order.payment_id && (
                                    <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-400">
                                      Payment ID: {order.payment_id}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Customer Info */}
                              <div>
                                <h4 className="text-sm font-bold text-happi-charcoal uppercase tracking-wide mb-3">
                                  Customer Information
                                </h4>
                                <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-happi-pink/10 text-happi-pink flex items-center justify-center font-bold text-sm shrink-0">
                                      {order.customer_name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <p className="font-semibold text-happi-charcoal text-sm">{order.customer_name}</p>
                                      <p className="text-xs text-gray-500 flex items-center gap-1">
                                        <User className="w-3 h-3" />
                                        Customer
                                      </p>
                                    </div>
                                  </div>
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
                                      <span>
                                        {[order.address, order.city, order.state, order.pincode]
                                          .filter(Boolean)
                                          .join(', ')}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Order Summary */}
                              <div>
                                <h4 className="text-sm font-bold text-happi-charcoal uppercase tracking-wide mb-3">
                                  Order Summary
                                </h4>
                                <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-medium">{formatCurrency(order.subtotal)}</span>
                                  </div>
                                  <div className="flex justify-between text-happi-green">
                                    <span>Discount</span>
                                    <span>-{formatCurrency(order.discount)}</span>
                                  </div>
                                  <div className="flex justify-between text-gray-500">
                                    <span>Delivery</span>
                                    <span>{order.delivery === 0 ? 'FREE' : formatCurrency(order.delivery)}</span>
                                  </div>
                                  <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-happi-charcoal">
                                    <span>Total</span>
                                    <span>{formatCurrency(order.total)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

// ============================================
// Controls Section — Page Locks & Product Visibility
// ============================================

function ControlsSection({
  products,
}: {
  products: Product[];
}) {
  const [controls, setControls] = useState<PageControl[]>(() => getPageControls());
  const [productToggles, setProductToggles] = useState<Record<string, boolean>>(() => getProductToggles());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'enabled' | 'locked' | 'out'>('all');

  const enabledCount = controls.filter((c) => c.enabled).length;
  const lockedCount = controls.filter((c) => !c.enabled).length;
  const outOfStockCount = products.filter((p) => getProductToggles()[p.id] === false).length;

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !searchTerm ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tamilName.includes(searchTerm);
      const toggled = productToggles[p.id] !== false;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'enabled' && toggled) ||
        (statusFilter === 'out' && !toggled) ||
        (statusFilter === 'locked' && false);
      return matchesSearch && matchesStatus;
    });
  }, [products, searchTerm, statusFilter, productToggles]);

  const handleTogglePage = (key: PageControl['key']) => {
    const next = setPageControl(key, !controls.find((c) => c.key === key)?.enabled);
    setControls([...next]);
    const control = next.find((c) => c.key === key);
    toast.success(
      control?.enabled
        ? `"${control?.label}" is now LIVE`
        : `"${control?.label}" is now LOCKED`,
    );
  };

  const handleToggleAll = (enabled: boolean) => {
    const next = setAllPageControls(enabled);
    setControls([...next]);
    toast.success(enabled ? 'All pages are now ENABLED' : 'All pages are now LOCKED');
  };

  const handleToggleProduct = (productId: string, enabled: boolean) => {
    setProductToggle(productId, enabled);
    setProductToggles({ ...getProductToggles() });
    const product = products.find((p) => p.id === productId);
    toast.success(
      enabled
        ? `${product?.name} is now AVAILABLE in store`
        : `${product?.name} is now OUT OF STOCK`,
    );
  };

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Pages Online</p>
              <p className="text-3xl font-black text-happi-green mt-1">{enabledCount}<span className="text-base text-gray-400 font-medium">/{controls.length}</span></p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-happi-green/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-happi-green" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Pages Locked</p>
              <p className="text-3xl font-black text-red-500 mt-1">{lockedCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <Lock className="w-5 h-5 text-red-500" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Products Live</p>
              <p className="text-3xl font-black text-happi-cyan mt-1">{products.length - outOfStockCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-happi-cyan/10 flex items-center justify-center">
              <PackageCheck className="w-5 h-5 text-happi-cyan" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Out of Stock</p>
              <p className="text-3xl font-black text-amber-500 mt-1">{outOfStockCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <EyeOff className="w-5 h-5 text-amber-500" />
            </div>
          </div>
        </div>
      </div>

      {/* ===== PAGE CONTROLS ===== */}
      <div className="rounded-3xl bg-white border border-gray-200 shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-happi-pink to-happi-cyan flex items-center justify-center shrink-0">
                <Settings2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-happi-charcoal">Page Controls</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Lock or unlock any page in the store. Locked pages show "Temporarily locked by owner".
                </p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => handleToggleAll(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-happi-green/10 text-happi-green text-sm font-semibold hover:bg-happi-green hover:text-white transition-all"
              >
                <Unlock className="w-4 h-4" />
                Enable All
              </button>
              <button
                onClick={() => handleToggleAll(false)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 text-sm font-semibold hover:bg-red-500 hover:text-white transition-all"
              >
                <Lock className="w-4 h-4" />
                Lock All
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {controls.map((control) => {
              const isEnabled = control.enabled;
              return (
                <motion.div
                  key={control.key}
                  layout
                  animate={{ opacity: 1, scale: 1 }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ scale: 1.02 }}
                  className={`relative rounded-2xl border-2 p-5 transition-all ${
                    isEnabled
                      ? 'border-happi-green/30 bg-happi-green/5 hover:border-happi-green/60'
                      : 'border-red-300 bg-red-50/50 hover:border-red-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isEnabled ? 'bg-happi-green/15 text-happi-green' : 'bg-red-500/15 text-red-500'}`}>
                        {isEnabled ? (
                          <Eye className="w-4.5 h-4.5" />
                        ) : (
                          <Lock className="w-4.5 h-4.5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-happi-charcoal text-sm truncate">{control.label}</p>
                        <p className="text-xs text-gray-500 truncate">{control.description}</p>
                        <span className={`inline-flex items-center gap-1 mt-1.5 text-xs font-semibold ${isEnabled ? 'text-happi-green' : 'text-red-500'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isEnabled ? 'bg-happi-green' : 'bg-red-500'}`} />
                          {isEnabled ? 'Live' : 'Locked'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleTogglePage(control.key)}
                      className={`relative inline-flex shrink-0 w-12 h-7 rounded-full transition-colors duration-300 focus:outline-none ${
                        isEnabled ? 'bg-happi-green' : 'bg-gray-300'
                      }`}
                      aria-label={`${isEnabled ? 'Lock' : 'Enable'} ${control.label}`}
                    >
                      <span
                        className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform duration-300 ${
                          isEnabled ? 'translate-x-5.5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===== PRODUCT VISIBILITY ===== */}
      <div className="rounded-3xl bg-white border border-gray-200 shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-happi-cyan to-happi-green flex items-center justify-center shrink-0">
                <PackageCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-happi-charcoal">Product Visibility</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Toggle products on/off. Disabled products show "Out of Stock" in the store.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-3 md:items-center">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-happi-pink"
              >
                <option value="all">All Products</option>
                <option value="enabled">In Stock</option>
                <option value="out">Out of Stock</option>
              </select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="w-full md:w-64 rounded-xl border border-gray-300 pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-happi-pink"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <PackageCheck className="w-12 h-12 text-gray-300 mx-auto" />
              <p className="mt-4 text-sm text-gray-500">No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => {
                const isEnabled = productToggles[product.id] !== false;
                return (
                  <motion.div
                    key={product.id}
                    layout
                    animate={{ opacity: 1 }}
                    initial={{ opacity: 0 }}
                    className={`relative rounded-2xl border-2 p-4 transition-all ${
                      isEnabled
                        ? 'border-gray-200 bg-white hover:border-happi-green/50'
                        : 'border-red-200 bg-red-50/40 hover:border-red-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-happi-cream border border-gray-200 shrink-0">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No img</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-happi-charcoal text-sm truncate">{product.name}</p>
                        <p lang="ta" className="text-xs text-happi-green truncate">{product.tamilName}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          ₹{product.price} · {product.category}
                        </p>
                      </div>
                      <button
                        onClick={() => handleToggleProduct(product.id, !isEnabled)}
                        className={`relative inline-flex shrink-0 w-12 h-7 rounded-full transition-colors duration-300 focus:outline-none ${
                          isEnabled ? 'bg-happi-green' : 'bg-gray-300'
                        }`}
                        aria-label={`${isEnabled ? 'Disable' : 'Enable'} ${product.name}`}
                      >
                        <span
                          className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform duration-300 ${
                            isEnabled ? 'translate-x-5.5' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                    <div className="mt-2">
                      {isEnabled ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-happi-green">
                          <ToggleRight className="w-3.5 h-3.5" />
                          In Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-500">
                          <ToggleLeft className="w-3.5 h-3.5" />
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Store Settings Section — Delivery & Discount
// ============================================

function StoreSettingsSection() {
  const [settings, setSettings] = useState<StoreSettings>(() => getStoreSettings());

  const handleSave = () => {
    const next = saveStoreSettings({
      deliveryCharge: Number(settings.deliveryCharge) || 0,
      freeDeliveryThreshold: Number(settings.freeDeliveryThreshold) || 0,
      defaultDiscountPercent: Number(settings.defaultDiscountPercent) || 0,
    });
    setSettings(next);
    toast.success('Store settings saved. Customers will see the updated delivery & discount.');
  };

  const inputClass =
    'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-happi-pink focus:ring-1 focus:ring-happi-pink/30';
  const labelClass = 'block text-sm font-semibold text-happi-charcoal mb-1.5';

  return (
    <div className="rounded-3xl bg-white border border-gray-200 shadow-sm overflow-hidden">
      <div className="border-b border-gray-100 p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-happi-gold to-happi-pink flex items-center justify-center shrink-0">
            <Banknote className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black text-happi-charcoal">Store Settings</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Configure the delivery charge, free-delivery threshold, and default discount applied at checkout.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={labelClass}>Delivery Charge (₹)</label>
            <input
              type="number"
              min="0"
              value={settings.deliveryCharge}
              onChange={(e) => setSettings({ ...settings, deliveryCharge: Number(e.target.value) })}
              placeholder="50"
              className={inputClass}
            />
            <p className="text-xs text-gray-400 mt-1">Flat fee charged when subtotal is below the free threshold.</p>
          </div>
          <div>
            <label className={labelClass}>Free Delivery Above (₹)</label>
            <input
              type="number"
              min="0"
              value={settings.freeDeliveryThreshold}
              onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })}
              placeholder="500"
              className={inputClass}
            />
            <p className="text-xs text-gray-400 mt-1">Orders at or above this subtotal get FREE delivery.</p>
          </div>
          <div>
            <label className={labelClass}>Default Discount (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={settings.defaultDiscountPercent}
              onChange={(e) => setSettings({ ...settings, defaultDiscountPercent: Number(e.target.value) })}
              placeholder="0"
              className={inputClass}
            />
            <p className="text-xs text-gray-400 mt-1">Percentage discount applied to every customer order.</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={() => setSettings(getStoreSettings())}
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 btn-primary text-sm"
          >
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Messages Section — Contact Form Submissions
// ============================================

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  created_at: string;
};

function MessagesSection() {
  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('happi-nuts-contact-messages') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const sync = () => {
      try {
        setMessages(JSON.parse(localStorage.getItem('happi-nuts-contact-messages') || '[]'));
      } catch {
        setMessages([]);
      }
    };
    window.addEventListener('happi-nuts-contact-messages-updated', sync);
    return () => window.removeEventListener('happi-nuts-contact-messages-updated', sync);
  }, []);

  const deleteMessage = (id: string) => {
    const next = messages.filter((m) => m.id !== id);
    localStorage.setItem('happi-nuts-contact-messages', JSON.stringify(next));
    setMessages(next);
    toast.success('Message deleted.');
  };

  const clearAll = () => {
    localStorage.setItem('happi-nuts-contact-messages', '[]');
    setMessages([]);
    toast.success('All messages cleared.');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-happi-charcoal">Contact Messages</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Messages submitted from the contact page
          </p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearAll}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 text-sm font-semibold hover:bg-red-500 hover:text-white transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {messages.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center">
          <Mail className="w-12 h-12 text-gray-300 mx-auto" />
          <p className="mt-4 text-lg font-semibold text-happi-charcoal">No messages yet</p>
          <p className="text-sm text-gray-500 mt-1">Messages from the contact page will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-happi-pink/10 text-happi-pink flex items-center justify-center font-bold text-sm shrink-0">
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-happi-charcoal">{msg.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(msg.created_at).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => deleteMessage(msg.id)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Delete message"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4 text-happi-cyan shrink-0" />
                  <span className="truncate">{msg.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4 text-happi-green shrink-0" />
                  <span>{msg.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <BadgeCheck className="w-4 h-4 text-happi-pink shrink-0" />
                  <span className="capitalize">{msg.subject}</span>
                </div>
              </div>

              <div className="mt-3 bg-happi-cream rounded-xl p-4 text-sm text-gray-700">
                {msg.message}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// Main Admin Page
// ============================================

export default function AdminPage() {
  const [, navigate] = useLocation();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // Data
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [customersLoading, setCustomersLoading] = useState(true);

  // Modal state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const refreshProducts = useCallback(async () => {
    setProductsLoading(true);
    const data = await fetchProducts();
    setProducts(data);
    setProductsLoading(false);
  }, []);

  const refreshOrders = useCallback(async () => {
    setOrdersLoading(true);
    const data = await fetchOrders();
    setOrders(data);
    setOrdersLoading(false);
  }, []);

  const refreshCustomers = useCallback(async () => {
    setCustomersLoading(true);
    const data = await fetchCustomers();
    setCustomers(data);
    setCustomersLoading(false);
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const current = data.session;
      setSession(current);

      if (!current) {
        navigate('/login');
        return;
      }

      const admin = await checkIsAdmin();
      setIsAdmin(admin);

      if (!admin) {
        setLoading(false);
        navigate('/login');
        toast.error('You do not have admin access.');
        return;
      }

      // Seed the default catalog to Supabase if it's empty
      await seedProductsToSupabase(getCatalogProducts());

      await Promise.all([refreshProducts(), refreshOrders(), refreshCustomers()]);
      setLoading(false);
    };

    init();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!nextSession) {
        navigate('/login');
        return;
      }
      setSession(nextSession);
    });

    // Auto-refresh orders every 30s so new customer orders appear
    // in the admin dashboard without needing a manual page reload.
    const ordersInterval = window.setInterval(() => {
      refreshOrders();
    }, 30_000);

    return () => {
      authListener.subscription.unsubscribe();
      window.clearInterval(ordersInterval);
    };
  }, [navigate, refreshProducts, refreshOrders, refreshCustomers]);

  // ============================================
  // Stats
  // ============================================

  const stats = useMemo(() => {
    const totalRevenue = orders
      .filter((order) => order.status !== 'Cancelled')
      .reduce((sum, order) => sum + order.total, 0);
    const pending = orders.filter((order) => order.status === 'Pending').length;
    const totalDiscounts = orders.reduce((sum, order) => sum + Number(order.discount || 0), 0);
    return { totalRevenue, pending, totalDiscounts };
  }, [orders]);

  // ============================================
  // Product handlers
  // ============================================

  const syncProductToStorefront = (product: Product) => {
    try {
      const catalog = getCatalogProducts();
      const existing = catalog.some((p) => p.id === product.id || p.name === product.name);
      const next = existing
        ? catalog.map((p) =>
            p.id === product.id || p.name === product.name
              ? { ...product, id: p.id }
              : p,
          )
        : [product, ...catalog];
      setCatalogProducts(next);
    } catch {
      // ignore — storefront sync is best-effort
    }
  };

  // Only show products that exist in the verified catalog (or were added by admin).
  // Recompute whenever `products` changes so newly added admin products appear
  // immediately in the table without needing a full page reload.
  const catalogNames = useMemo(() => new Set(getCatalogProducts().map((p) => p.name)), [products]);
  const adminProducts = useMemo(
    () => products.filter((p) => catalogNames.has(p.name)),
    [products, catalogNames],
  );

  const handleSaveProduct = async (product: Product) => {
    const isEditing = products.some((p) => p.id === product.id || p.name === product.name);

    setProducts((prev) => {
      if (isEditing) {
        return prev.map((p) => (p.id === product.id || p.name === product.name ? product : p));
      }
      return [product, ...prev];
    });

    // Always sync to the storefront catalog so badges assigned by the
    // admin (bestseller / new / premium) appear immediately on the product page.
    syncProductToStorefront(product);

    const saved = await saveProductToSupabase(product);

    if (saved) {
      toast.success(isEditing ? 'Product updated successfully.' : 'Product added successfully.');
    } else {
      toast.success('Product saved locally.');
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    setDeleting(true);
    try {
      const deleted = await deleteProductFromSupabase(productToDelete.id);

      if (deleted) {
        setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));

        // Also remove the product from the storefront catalog so it disappears
        // from the customer's Shop page immediately.
        try {
          const catalog = getCatalogProducts();
          const next = catalog.filter((p) => p.id !== productToDelete.id && p.name !== productToDelete.name);
          setCatalogProducts(next);
        } catch {
          // ignore — storefront sync is best-effort
        }

        toast.success('Product deleted successfully.');
      } else {
        toast.error('Failed to delete product. Check your admin permissions.');
      }

      setDeleteModalOpen(false);
      setProductToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  // ============================================
  // Order handlers
  // ============================================

  const handleOrderStatusChange = async (orderId: string, status: OrderStatus) => {
    const previous = orders.find((order) => order.id === orderId);
    // Optimistic update
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status } : order)));

    const updated = await updateOrderStatus(orderId, status);

    if (updated) {
      toast.success(`Order marked as ${status}.`);
    } else {
      if (previous) {
        setOrders((prev) => prev.map((order) => (order.id === orderId ? previous : order)));
      }
      toast.error('Failed to update order status.');
    }
  };

  const handleOrderDiscountChange = async (orderId: string, discount: number) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const safeDiscount = Math.min(Math.max(0, discount), order.subtotal);
    const newTotal = order.subtotal - safeDiscount + order.delivery;

    // Optimistic update
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, discount: safeDiscount, total: newTotal } : o)),
    );

    const updated = await updateOrderDiscount(orderId, safeDiscount, newTotal);

    if (updated) {
      toast.success(`Discount of ${formatCurrency(safeDiscount)} applied.`);
    } else {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, discount: order.discount, total: order.total } : o)),
      );
      toast.error('Failed to apply discount.');
    }
  };

  const handleOrderDeliveryChange = async (orderId: string, delivery: number) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const safeDelivery = Math.max(0, delivery);
    const newTotal = order.subtotal - order.discount + safeDelivery;

    // Optimistic update
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, delivery: safeDelivery, total: newTotal } : o)),
    );

    const updated = await updateOrderDelivery(orderId, safeDelivery, newTotal);

    if (updated) {
      toast.success(`Delivery charge of ${formatCurrency(safeDelivery)} applied.`);
    } else {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, delivery: order.delivery, total: order.total } : o)),
      );
      toast.error('Failed to update delivery charge.');
    }
  };

  const handleDeleteOrder = async (order: AdminOrder) => {
    const confirmed = window.confirm(
      `Delete order ${order.order_number} for ${order.customer_name}? This cannot be undone.`,
    );
    if (!confirmed) return;

    const deleted = await deleteOrder(order.id);
    if (deleted) {
      setOrders((prev) => prev.filter((item) => item.id !== order.id));
      toast.success(`Order ${order.order_number} deleted.`);
    } else {
      toast.error('Could not delete this order. Check your admin permissions.');
    }
  };

  // ============================================
  // Customer handlers
  // ============================================

  const handleCustomerRoleChange = async (userId: string, role: 'customer' | 'admin') => {
    const updated = await updateCustomerRole(userId, role);

    if (updated) {
      setCustomers((prev) => prev.map((c) => (c.id === userId ? { ...c, role } : c)));
      toast.success(`Role updated to ${role}.`);
    } else {
      toast.error('Failed to update role.');
    }
  };

  // ============================================
  // Render
  // ============================================

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-happi-cream">
        <RefreshCw className="w-8 h-8 text-happi-pink animate-spin" />
        <div className="mt-4 text-lg font-semibold text-happi-charcoal">
          Loading admin dashboard...
        </div>
      </div>
    );
  }

  // Strict owner-only guard: the admin dashboard must NEVER render for
  // anyone other than the owner (devdharrshans.23csd@kongu.edu).
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-happi-cream px-4">
        <ShieldCheck className="w-12 h-12 text-happi-pink" />
        <h1 className="mt-4 text-2xl font-black text-happi-charcoal text-center">
          Access denied
        </h1>
        <p className="mt-2 text-sm text-gray-500 text-center max-w-sm">
          Only the owner can access the admin dashboard. You will be redirected to the login page.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="mt-6 inline-flex items-center gap-2 btn-primary text-sm"
        >
          Go to login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-happi-cream/50 py-10 px-4">
      <div className="container max-w-7xl space-y-8">
        {/* Header */}
        <div className="rounded-3xl bg-white border border-gray-200 p-8 md:p-10 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-happi-pink">
                Admin panel
              </p>
              <h1 className="mt-3 text-3xl md:text-4xl font-black text-happi-charcoal">
                Happi Nuts Dashboard
              </h1>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-happi-cream px-4 py-2 border border-happi-pink/20 text-sm font-semibold text-happi-charcoal">
              <ShieldCheck className="w-4 h-4 text-happi-green" />
              {session?.user?.email || 'Admin'}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            <StatCard
              icon={PackageCheck}
              label="Products"
              value={adminProducts.length}
            />
            <StatCard
              icon={TrendingUp}
              label="Revenue"
              value={formatCurrency(stats.totalRevenue)}
              accent="text-happi-green"
              bg="bg-happi-green/10"
            />
            <StatCard
              icon={ShoppingBag}
              label="Orders"
              value={orders.length}
              accent="text-happi-cyan"
              bg="bg-happi-cyan/10"
            />
            <StatCard
              icon={ShieldCheck}
              label="Pending"
              value={stats.pending}
              accent="text-happi-gold"
              bg="bg-happi-gold/10"
            />
            <StatCard
              icon={Users}
              label="Customers"
              value={customers.length}
              accent="text-happi-pink"
              bg="bg-happi-pink/10"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as AdminTab)}
          className="w-full"
        >
          <TabsList className="w-full h-auto min-h-12 justify-start overflow-x-auto p-1 bg-white border border-gray-200 gap-1 [scrollbar-width:thin]">
            <TabsTrigger
              value="dashboard"
              className="flex-none shrink-0 items-center gap-2 px-3 sm:px-4 py-2.5 data-[state=active]:bg-happi-pink data-[state=active]:text-white"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="controls"
              className="flex-none shrink-0 items-center gap-2 px-3 sm:px-4 py-2.5 data-[state=active]:bg-happi-pink data-[state=active]:text-white"
            >
              <Settings2 className="w-4 h-4" />
              Controls
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="flex-none shrink-0 items-center gap-2 px-3 sm:px-4 py-2.5 data-[state=active]:bg-happi-pink data-[state=active]:text-white"
            >
              <PackageCheck className="w-4 h-4" />
              Products
              <span className="rounded-full bg-happi-pink/10 px-2 py-0.5 text-xs data-[state=active]:bg-white/20 data-[state=active]:text-white">
                {adminProducts.length}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="flex-none shrink-0 items-center gap-2 px-3 sm:px-4 py-2.5 data-[state=active]:bg-happi-pink data-[state=active]:text-white"
            >
              <ShoppingBag className="w-4 h-4" />
              Orders
              {stats.pending > 0 && (
                <span className="rounded-full bg-amber-100 text-amber-700 px-2 py-0.5 text-xs font-bold">
                  {stats.pending}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="customers"
              className="flex items-center gap-2 px-4 py-2.5 data-[state=active]:bg-happi-pink data-[state=active]:text-white"
            >
              <Users className="w-4 h-4" />
              Customers
            </TabsTrigger>
            <TabsTrigger
              value="messages"
              className="flex items-center gap-2 px-4 py-2.5 data-[state=active]:bg-happi-pink data-[state=active]:text-white"
            >
              <Mail className="w-4 h-4" />
              Messages
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-black text-happi-charcoal mb-4">Quick actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setProductModalOpen(true);
                    }}
                    className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-happi-pink/30 bg-happi-pink/5 p-6 hover:border-happi-pink hover:bg-happi-pink/10 transition-all"
                  >
                    <Plus className="w-8 h-8 text-happi-pink" />
                    <span className="font-semibold text-happi-charcoal text-sm">Add product</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-happi-cyan/30 bg-happi-cyan/5 p-6 hover:border-happi-cyan hover:bg-happi-cyan/10 transition-all"
                  >
                    <ShoppingBag className="w-8 h-8 text-happi-cyan" />
                    <span className="font-semibold text-happi-charcoal text-sm">View orders</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('customers')}
                    className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-happi-green/30 bg-happi-green/5 p-6 hover:border-happi-green hover:bg-happi-green/10 transition-all"
                  >
                    <Users className="w-8 h-8 text-happi-green" />
                    <span className="font-semibold text-happi-charcoal text-sm">View customers</span>
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-black text-happi-charcoal mb-4">Recent orders</h2>
                {orders.length === 0 ? (
                  <p className="text-sm text-gray-500">No orders yet.</p>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((order) => (
                      <button
                        key={order.id}
                        onClick={() => setActiveTab('orders')}
                        className="w-full flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 hover:border-happi-pink/40 hover:bg-happi-cream transition-colors"
                      >
                        <div>
                          <p className="text-sm font-semibold text-happi-charcoal">{order.order_number}</p>
                          <p className="text-xs text-gray-500">{order.customer_name}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-happi-charcoal">{formatCurrency(order.total)}</p>
                          <Badge className={`mt-1 ${STATUS_COLORS[order.status]}`}>{order.status}</Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Controls Tab */}
          <TabsContent value="controls" className="mt-6 space-y-8">
            <StoreSettingsSection />
            <ControlsSection products={products} />
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="mt-6 space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-happi-charcoal">Product catalog</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Add, edit, delete, and manage all your products.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProductModalOpen(true);
                }}
                className="inline-flex items-center gap-2 btn-primary text-sm shrink-0"
              >
                <Plus className="w-4 h-4" />
                Add product
              </button>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white overflow-hidden">
              {productsLoading ? (
                <div className="p-12 text-center">
                  <RefreshCw className="w-6 h-6 text-happi-pink animate-spin mx-auto" />
                  <p className="mt-3 text-gray-500">Loading products...</p>
                </div>
              ) : adminProducts.length === 0 ? (
                <div className="p-12 text-center">
                  <PackageCheck className="w-12 h-12 text-gray-300 mx-auto" />
                  <p className="mt-4 text-lg font-semibold text-happi-charcoal">No verified products found</p>
                  <p className="text-sm text-gray-500 mt-1">Only products from the official catalog are shown here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                <Table className="min-w-[760px]">
                  <TableHeader>
                    <TableRow className="bg-happi-cream">
                      <TableHead className="px-4">Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Weight</TableHead>
                      <TableHead>Badge</TableHead>
                      <TableHead className="text-right pr-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-happi-cream border border-gray-200 shrink-0">
                              {product.image && (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.opacity = '0.2';
                                  }}
                                />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-happi-charcoal">{product.name}</p>
                              <p className="text-xs text-gray-500">{product.tamilName}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm capitalize text-gray-700">{product.category}</span>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <span className="font-semibold text-happi-charcoal">
                              {formatCurrency(product.price)}
                            </span>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="text-gray-400 line-through ml-1 text-xs">
                                {formatCurrency(product.originalPrice)}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-700">{product.weight}</TableCell>
                        <TableCell>
                          {product.badge ? (
                            <Badge
                              className={
                                product.badge === 'premium'
                                  ? 'bg-happi-gold text-white border-happi-gold'
                                  : product.badge === 'new'
                                    ? 'bg-happi-pink text-white border-happi-pink'
                                    : 'bg-happi-cyan text-white border-happi-cyan'
                              }
                            >
                              {product.badge}
                            </Badge>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right pr-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingProduct(product);
                                setProductModalOpen(true);
                              }}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-happi-cyan hover:text-happi-cyan transition-colors"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setProductToDelete(product);
                                setDeleteModalOpen(true);
                              }}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="mt-6">
            <OrdersSection
              orders={orders}
              loading={ordersLoading}
              onStatusChange={handleOrderStatusChange}
              onDiscountChange={handleOrderDiscountChange}
              onDeliveryChange={handleOrderDeliveryChange}
              onDelete={handleDeleteOrder}
              products={products}
            />
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="mt-6">
            <MessagesSection />
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="mt-6 space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-white overflow-hidden">
              {customersLoading ? (
                <div className="p-12 text-center">
                  <RefreshCw className="w-6 h-6 text-happi-pink animate-spin mx-auto" />
                  <p className="mt-3 text-gray-500">Loading customers...</p>
                </div>
              ) : customers.length === 0 ? (
                <div className="p-12 text-center">
                  <Users className="w-12 h-12 text-gray-300 mx-auto" />
                  <p className="mt-4 text-lg font-semibold text-happi-charcoal">No customers yet</p>
                  <p className="text-sm text-gray-500 mt-1">Registered customers will appear here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                <Table className="min-w-[760px]">
                  <TableHeader>
                    <TableRow className="bg-happi-cream">
                      <TableHead className="px-4">Customer</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Total spent</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-happi-pink/10 text-happi-pink flex items-center justify-center font-bold text-sm shrink-0">
                              {(customer.full_name || customer.email || '?')
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-happi-charcoal">
                                {customer.full_name || 'No name'}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600">{customer.email}</div>
                          {customer.phone && (
                            <div className="text-xs text-gray-400">{customer.phone}</div>
                          )}
                        </TableCell>
                        <TableCell className="text-sm font-medium">{customer.order_count || 0}</TableCell>
                        <TableCell className="text-sm font-semibold text-happi-charcoal">
                          {formatCurrency(customer.total_spent || 0)}
                        </TableCell>
                        <TableCell>
                          <select
                            value={customer.role}
                            onChange={(e) =>
                              handleCustomerRoleChange(
                                customer.id,
                                e.target.value as 'customer' | 'admin',
                              )
                            }
                            className="rounded-full border border-gray-300 px-3 py-1 text-xs font-semibold"
                          >
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                          </select>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {formatDate(customer.created_at)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <AnimatePresence>
          {productModalOpen && (
            <ProductFormModal
              open={productModalOpen}
              onClose={() => setProductModalOpen(false)}
              product={editingProduct}
              onSave={handleSaveProduct}
            />
          )}
          {deleteModalOpen && productToDelete && (
            <DeleteConfirmModal
              open={deleteModalOpen}
              onClose={() => {
                setDeleteModalOpen(false);
                setProductToDelete(null);
              }}
              onConfirm={handleDeleteProduct}
              productName={productToDelete.name}
              deleting={deleting}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
