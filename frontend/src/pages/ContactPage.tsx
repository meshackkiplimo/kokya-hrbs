import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="bg-white text-gray-800 px-6 md:px-16 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-amber-900 mb-4">Contact Us</h1>
        <p className="text-lg max-w-xl mx-auto">
          Have questions, feedback, or need support? Reach out to the TripNest team — we're here to help.
        </p>
      </div>

      {/* Main content: Form + Info */}
      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <form className="space-y-6 bg-gray-50 p-8 rounded-lg shadow">
          <div>
            <label className="block mb-1 font-medium">Full Name</label>
            <input
              type="text"
              placeholder="Your Name"
              className="input input-bordered w-full"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="input input-bordered w-full"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Message</label>
            <textarea
              className="textarea textarea-bordered w-full h-32"
              placeholder="Type your message here..."
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary bg-amber-900 hover:bg-amber-800 text-white">
            Send Message
          </button>
        </form>

        {/* Contact Info */}
        <div className="space-y-6 text-gray-700">
          <div className="flex items-start gap-4">
            <Mail className="text-amber-900" />
            <div>
              <h4 className="font-semibold">Email</h4>
              <p>support@tripnest.com</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Phone className="text-amber-900" />
            <div>
              <h4 className="font-semibold">Phone</h4>
              <p>+254 712 345 678</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <MapPin className="text-amber-900" />
            <div>
              <h4 className="font-semibold">Location</h4>
              <p>Westlands, Nairobi, Kenya</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
