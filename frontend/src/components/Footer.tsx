import React from 'react';
import { Mail, Phone, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-amber-900 text-white px-6 md:px-16 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand Info */}
        <div>
          <h2 className="text-2xl font-bold mb-2">TripNest</h2>
          <p>Your trusted hotel booking partner. Discover comfort anywhere, anytime.</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="/about" className="hover:underline">About Us</a></li>
            <li><a href="/contact" className="hover:underline">Contact</a></li>
            <li><a href="/explore" className="hover:underline">Explore</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-semibold mb-2">Contact</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Mail size={18} /> support@tripnest.com
            </li>
            <li className="flex items-center gap-2">
              <Phone size={18} /> +254 712 345 678
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="font-semibold mb-2">Follow Us</h3>
          <div className="flex gap-4 mt-2">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <Facebook size={22} className="hover:text-amber-300 transition" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <Twitter size={22} className="hover:text-amber-300 transition" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <Instagram size={22} className="hover:text-amber-300 transition" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="text-center mt-10 border-t border-amber-700 pt-6 text-sm text-gray-300">
        © {new Date().getFullYear()} TripNest. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
