import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Banknote } from 'lucide-react';
import { useLocation } from 'wouter';
import { clearCart, getCartItems, setCartUser } from '@/lib/cart';
import { getDeliveryCharge, getDefaultDiscount, loadStoreSettingsFromSupabase, SETTINGS_UPDATED_EVENT } from '@/lib/settings';
import { supabase } from '@/lib/supabase';
import { createOrderInSupabase } from '@/lib/admin-store';

export default function Checkout() {
  const [, navigate] = useLocation();
  const [cartItems, setCartItems] = useState(getCartItems());
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState<{ full_name: string | null; email: string | null; phone: string | null } | null>(null);
  const [placedOrderNumber, setPlacedOrderNumber] = useState<string | null>(null);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  );
  const discount = getDefaultDiscount(subtotal);
  const delivery = getDeliveryCharge(subtotal);
  const total = subtotal - discount + delivery;

  useEffect(() => {
    // Load the admin-configured store settings from the database so the
    // delivery/discount shown at checkout matches what customers on every
    // other device see.
    loadStoreSettingsFromSupabase();

    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      setSessionUserId(session?.user?.id ?? null);
      setIsAuthenticated(Boolean(session));

      // Ensure the cart context matches the signed-in user before reading it,
      // so the order summary reflects the correct email's cart.
      setCartUser(session?.user?.email ?? null);
      setCartItems(getCartItems());

      if (!session) {
        navigate('/login');
        return;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      const nextProfile = {
        full_name: profileData?.full_name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '',
        email: profileData?.email || session.user.email || '',
        phone: profileData?.phone || session.user.user_metadata?.phone || '',
      };

      setProfile(nextProfile);
      setFormData((prev) => ({
        ...prev,
        name: prev.name || nextProfile.full_name || '',
        phone: prev.phone || nextProfile.phone || '',
      }));
    };

    checkAuth();
  }, [navigate]);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const saveOrder = async (): Promise<boolean> => {
    if (isSavingOrder) return false;

    setIsSavingOrder(true);
    try {
      const orderNumber = `HN-${Date.now().toString().slice(-6)}`;

      const order = await createOrderInSupabase({
        order_number: orderNumber,
        user_id: sessionUserId,
        customer_name: formData.name,
        email: profile?.email || '',
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        payment_method: 'cod',
        payment_id: null,
        subtotal,
        discount,
        delivery,
        total,
        items: cartItems.map((item) => ({
          product_id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      });

      if (order) {
        setPlacedOrderNumber(order.order_number);
        // IMPORTANT: Only clear the cart after the database has confirmed
        // the order was saved. If the backend/database insert fails, the
        // order is NOT considered successful and the cart stays intact so
        // the customer can retry.
        clearCart();
        return true;
      } else {
        // The database did not confirm the order — keep the cart and inform.
        console.error('Order was NOT saved to the database. Cart kept intact for retry.');
        alert(
          'We could not save your order right now. Please check your connection and try again. Your cart has been kept for you.',
        );
        return false;
      }
    } catch (error) {
      console.warn('Failed to persist order:', error);
      alert(
        'We could not save your order right now. Please check your connection and try again. Your cart has been kept for you.',
      );
      return false;
    } finally {
      setIsSavingOrder(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step < 3) {
      setStep(step + 1);
      return;
    }

    if (step === 3) {
      // Cash on Delivery: save the order to the DATABASE first.
      // Only advance to the confirmation step when the database confirms
      // the order was saved successfully.
      const order = await saveOrder();
      if (order) {
        setIsProcessing(false);
        setStep(4);
      }
      return;
    }

    console.log('Order placed:', { ...formData, total, items: cartItems, orderNumber: placedOrderNumber });
  };

  const steps = [
    { number: 1, title: 'Customer Details' },
    { number: 2, title: 'Delivery Address' },
    { number: 3, title: 'Payment' },
    { number: 4, title: 'Confirmation' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-happi-cream py-8 md:py-12">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold text-happi-charcoal">
            Checkout
          </h1>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-8 md:py-12 bg-white border-b border-gray-200">
        <div className="container">
          <div className="flex items-center justify-between">
            {steps.map((s, idx) => (
              <div key={s.number} className="flex items-center flex-1">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    step >= s.number
                      ? 'bg-happi-pink text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step > s.number ? <Check className="w-5 h-5" /> : s.number}
                </motion.div>
                <div className="ml-3 hidden sm:block">
                  <p className="text-sm font-semibold text-happi-charcoal">
                    {s.title}
                  </p>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${
                      step > s.number ? 'bg-happi-pink' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Content */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              <motion.form
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Step 1: Customer Details */}
                {step === 1 && (
                  <>
                    <h2 className="text-2xl font-bold text-happi-charcoal mb-6">
                      Your Details
                    </h2>
                    <div>
                      <label className="block text-sm font-semibold text-happi-charcoal mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-happi-pink"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-happi-charcoal mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-happi-pink"
                          placeholder="+91 XXXX XXXX XX"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Step 2: Delivery Address */}
                {step === 2 && (
                  <>
                    <h2 className="text-2xl font-bold text-happi-charcoal mb-6">
                      Delivery Address
                    </h2>
                    <div>
                      <label className="block text-sm font-semibold text-happi-charcoal mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-happi-pink"
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-happi-charcoal mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-happi-pink"
                          placeholder="Mumbai"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-happi-charcoal mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-happi-pink"
                          placeholder="Maharashtra"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-happi-charcoal mb-2">
                          Pincode
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-happi-pink"
                          placeholder="400001"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Step 3: Payment */}
                {step === 3 && (
                  <>
                    <h2 className="text-2xl font-bold text-happi-charcoal mb-6">
                      Payment Method
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-center p-4 border-2 border-happi-pink bg-happi-pink/5 rounded-lg">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={formData.paymentMethod === 'cod'}
                          onChange={handleChange}
                          className="w-4 h-4 text-happi-pink"
                        />
                        <span className="ml-3 font-semibold text-happi-charcoal flex items-center gap-2">
                          <Banknote className="w-5 h-5 text-happi-green" />
                          Cash on Delivery
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 px-1">
                        Pay in cash when your order is delivered to your doorstep.
                      </p>
                    </div>
                  </>
                )}

                {/* Step 4: Confirmation */}
                {step === 4 && (
                  <div className="text-center py-12">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-20 h-20 bg-happi-green rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                      <Check className="w-10 h-10 text-white" />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-happi-charcoal mb-4">
                      Order Confirmed!
                    </h2>
                    <p className="text-gray-600 text-lg mb-2">
                      Thank you for your order. You'll receive a confirmation email shortly.
                    </p>
                    {placedOrderNumber && (
                      <p className="text-happi-charcoal font-semibold mb-8">
                        Order number: <span className="text-happi-pink">{placedOrderNumber}</span>
                      </p>
                    )}
                    <a href="/shop" className="btn-primary">
                      Continue Shopping
                    </a>
                  </div>
                )}

                {/* Navigation Buttons */}
                {step < 4 && (
                  <div className="flex gap-4 pt-6">
                    {step > 1 && (
                      <button
                        type="button"
                        onClick={() => setStep(step - 1)}
                        className="btn-outline flex-1"
                      >
                        Back
                      </button>
                    )}
                    <button type="submit" className="btn-primary flex-1">
                      {step === 3 ? 'Place Order' : 'Continue'}
                    </button>
                  </div>
                )}
              </motion.form>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-happi-cream rounded-xl p-8 h-fit sticky top-28"
            >
              <h2 className="text-2xl font-bold text-happi-charcoal mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-300">
                <div className="flex justify-between text-gray-600">
                  <span>{itemCount} item{itemCount === 1 ? '' : 's'}</span>
                  <span>₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-happi-green font-semibold">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex items-center justify-between gap-4 text-gray-600">
                  <span>Delivery</span>
                  <span className={`text-right text-sm ${delivery === 0 ? 'text-gray-500' : 'font-semibold text-happi-charcoal'}`}>
                    {delivery === 0 ? (
                      <span className="inline-block max-w-[180px] leading-snug">
                        Applicable to transportation charge
                      </span>
                    ) : (
                      `₹${delivery}`
                    )}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-happi-charcoal">Total</span>
                <span className="text-3xl font-bold text-happi-pink">₹{total}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
