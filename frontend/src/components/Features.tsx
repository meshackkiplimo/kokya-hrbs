import React from 'react';
import {
  Shield,
  Clock,
  Award,
  Heart,
  Smartphone,
  Globe,
  CreditCard,
  Headphones,
  MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Features = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: "Best Price Guarantee",
      description: "We guarantee the lowest prices. Find a better deal elsewhere and we'll match it.",
      color: "text-green-500"
    },
    {
      icon: Clock,
      title: "Instant Booking",
      description: "Book your perfect stay in under 60 seconds with our streamlined process.",
      color: "text-blue-500"
    },
    {
      icon: Award,
      title: "Premium Selection",
      description: "Handpicked hotels and accommodations that meet our strict quality standards.",
      color: "text-purple-500"
    },
    {
      icon: Heart,
      title: "Personalized Experience",
      description: "AI-powered recommendations based on your preferences and travel history.",
      color: "text-red-500"
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description: "Seamless experience across all devices with our responsive design.",
      color: "text-indigo-500"
    },
    {
      icon: Globe,
      title: "Global Coverage",
      description: "Access to over 500+ hotels worldwide in the most popular destinations.",
      color: "text-cyan-500"
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description: "Bank-grade security with multiple payment options and fraud protection.",
      color: "text-yellow-500"
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Round-the-clock customer support to assist you whenever you need help.",
      color: "text-orange-500"
    },
    {
      icon: MapPin,
      title: "Local Insights",
      description: "Get insider tips and local recommendations for your destination.",
      color: "text-teal-500"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-4">
            Why Choose TripNest
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need for the
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
              Perfect Stay
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We've revolutionized hotel booking with cutting-edge technology and personalized service 
            to make your travel planning effortless and enjoyable.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-amber-200 hover:-translate-y-1"
            >
              <div className="flex items-start space-x-4">
                <div className={`flex-shrink-0 w-12 h-12 ${feature.color} bg-gray-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/hotels')}
              className="bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold px-8 py-4 rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Start Your Journey
            </button>
            <button
              onClick={() => navigate('/about')}
              className="border-2 border-gray-300 text-gray-700 font-bold px-8 py-4 rounded-xl hover:border-amber-600 hover:text-amber-600 transition-all duration-300"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;