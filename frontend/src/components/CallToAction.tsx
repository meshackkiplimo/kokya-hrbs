import React from 'react';
import { ArrowRight, Download, Smartphone, Bell } from 'lucide-react';

const CallToAction = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-amber-900 via-orange-800 to-amber-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute top-0 left-0 w-full h-full" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}>
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/5 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Main CTA Section */}
          <div className="mb-16">
            <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Ready to Start Your
              <span className="block bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
                Next Adventure?
              </span>
            </h2>
            <p className="text-xl lg:text-2xl text-amber-100 mb-8 leading-relaxed max-w-3xl mx-auto">
              Join thousands of travelers who have discovered their perfect stays with TripNest. 
              Your dream accommodation is just a click away.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button className="group bg-white text-amber-900 font-bold px-8 py-4 rounded-xl hover:bg-amber-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-3">
                <span className="text-lg">Book Your Stay Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="group border-2 border-white/30 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center space-x-3">
                <Bell className="w-5 h-5" />
                <span className="text-lg">Get Price Alerts</span>
              </button>
            </div>
          </div>

          {/* App Download Section */}
          <div className="border-t border-white/20 pt-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: App Info */}
              <div className="text-left">
                <div className="flex items-center space-x-3 mb-4">
                  <Smartphone className="w-8 h-8 text-amber-300" />
                  <span className="text-amber-300 font-semibold">Mobile App</span>
                </div>
                
                <h3 className="text-3xl lg:text-4xl font-bold mb-4">
                  Take TripNest With You
                </h3>
                
                <p className="text-amber-100 text-lg mb-8 leading-relaxed">
                  Download our mobile app for exclusive deals, instant notifications, 
                  and seamless booking on the go. Available for iOS and Android.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="group bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 flex items-center space-x-3">
                    <Download className="w-5 h-5" />
                    <div className="text-left">
                      <div className="text-xs">Download on the</div>
                      <div className="font-bold">App Store</div>
                    </div>
                  </button>
                  
                  <button className="group bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 flex items-center space-x-3">
                    <Download className="w-5 h-5" />
                    <div className="text-left">
                      <div className="text-xs">Get it on</div>
                      <div className="font-bold">Google Play</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Right: App Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    title: "Instant Booking",
                    description: "Book hotels in seconds with our streamlined mobile experience"
                  },
                  {
                    title: "Offline Maps",
                    description: "Access your bookings and hotel info even without internet"
                  },
                  {
                    title: "Push Notifications",
                    description: "Get real-time updates on deals and booking confirmations"
                  },
                  {
                    title: "Mobile Exclusive",
                    description: "Access special mobile-only discounts and last-minute deals"
                  }
                ].map((feature, index) => (
                  <div 
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
                  >
                    <h4 className="font-bold text-white mb-2">{feature.title}</h4>
                    <p className="text-amber-100 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="border-t border-white/20 pt-12 mt-16">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-amber-300 mb-2">50K+</div>
                <div className="text-amber-100">Happy Travelers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-amber-300 mb-2">500+</div>
                <div className="text-amber-100">Partner Hotels</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-amber-300 mb-2">4.9★</div>
                <div className="text-amber-100">App Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-amber-300 mb-2">24/7</div>
                <div className="text-amber-100">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;