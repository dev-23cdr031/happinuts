import { Mail, Phone, MapPin, Facebook, Instagram, MessageCircle } from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Footer() {
  return (
    <footer className="bg-happi-charcoal text-white mt-20">
      {/* Main Footer Content */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="mb-4"><BrandLogo dark /></div>
            <p className="text-sm text-gray-300 mb-6">
              HappiNuts Gives Healthy. HappiNuts Gives Happiness.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/happinuts2017" target="_blank" rel="noopener noreferrer" className="hover:text-happi-pink transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/happi_nuts_2017/" target="_blank" rel="noopener noreferrer" className="hover:text-happi-pink transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="/shop" className="hover:text-happi-pink transition-colors">
                  All Products
                </a>
              </li>
              <li>
                <a href="/shop" className="hover:text-happi-pink transition-colors">
                  Best Sellers
                </a>
              </li>
              <li>
                <a href="/shop" className="hover:text-happi-pink transition-colors">
                  New Arrivals
                </a>
              </li>
              <li>
                <a href="/gifting" className="hover:text-happi-pink transition-colors">
                  Gift Boxes
                </a>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="/about" className="hover:text-happi-pink transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/why-happi-nuts" className="hover:text-happi-pink transition-colors">
                  Why Happi Nuts
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-happi-pink transition-colors">
                  Our Story
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-happi-pink transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="/faq" className="hover:text-happi-pink transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="/shipping-info" className="hover:text-happi-pink transition-colors">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="/returns" className="hover:text-happi-pink transition-colors">
                  Returns
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-happi-pink transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="/privacy-policy" className="hover:text-happi-pink transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Newsletter</h4>
            <p className="text-sm text-gray-300 mb-4">
              Get Happi updates in your inbox.
            </p>
            <form className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-happi-pink"
              />
              <button
                type="submit"
                className="btn-primary text-sm text-center"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div>
              <h5 className="font-semibold mb-4">Get in Touch</h5>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-happi-pink" />
                  <a href="tel:+919585750990" className="hover:text-white">+91 95857 59990</a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-happi-pink" />
                  <span>hello@happinuts.com</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-happi-pink mt-1" />
                  <span>6/432, Sivanantham St, Hanumaan Nagar, Allampatti, Tamil Nadu 626001</span>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div>
              <h5 className="font-semibold mb-4">Business Hours</h5>
              <div className="space-y-2 text-sm text-gray-300">
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>

            {/* Copyright */}
            <div className="flex flex-col justify-center">
              <p className="text-sm text-gray-400">
                © 2026 Happi Nuts. All Rights Reserved.
              </p>
              <div className="flex gap-4 mt-4 text-xs text-gray-400">
                <a href="/terms" className="hover:text-happi-pink transition-colors">
                  Terms & Conditions
                </a>
                <a href="/privacy-policy" className="hover:text-happi-pink transition-colors">
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/919585750990"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-happi-green hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 z-40"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </footer>
  );
}
