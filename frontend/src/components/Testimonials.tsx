import React, { useState, useEffect, useMemo } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { hotelApi } from '../Features/hotels/hotelAPI';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch real data for stats
  const { data: hotels = [] } = hotelApi.useGetAllHotelsQuery();

  // Calculate real stats
  const stats = useMemo(() => {
    const hotelCount = hotels.length;
    const avgRating = hotels.length > 0
      ? Math.round((hotels.reduce((sum, hotel) => sum + hotel.rating, 0) / hotels.length) * 10) / 10
      : 4.9;
    
    return {
      travelers: '50K+', // This would typically come from booking/user data
      hotels: hotelCount > 0 ? `${hotelCount}+` : '500+',
      rating: avgRating,
      support: '24/7'
    };
  }, [hotels]);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      location: "New York, USA",
      rating: 5,
      text: "TripNest made our honeymoon planning so easy! The personalized recommendations were spot-on, and we found the perfect beachfront resort in Maldives. The booking process was seamless.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      trip: "Honeymoon in Maldives"
    },
    {
      id: 2,
      name: "Michael Chen",
      location: "San Francisco, USA",
      rating: 5,
      text: "As a frequent business traveler, I need reliability. TripNest's instant booking and 24/7 support have saved me countless times. The mobile app is fantastic for last-minute changes.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      trip: "Business Travel"
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      location: "Madrid, Spain",
      rating: 5,
      text: "Our family vacation to Kenya was incredible! TripNest helped us find family-friendly hotels with amazing amenities. The kids loved the pools, and we loved the cultural experiences.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      trip: "Family Safari in Kenya"
    },
    {
      id: 4,
      name: "David Thompson",
      location: "London, UK",
      rating: 5,
      text: "The best price guarantee is real! I found a cheaper rate elsewhere, and TripNest not only matched it but gave me additional perks. Outstanding customer service.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      trip: "Weekend Getaway"
    },
    {
      id: 5,
      name: "Priya Patel",
      location: "Mumbai, India",
      rating: 5,
      text: "TripNest's local insights feature is a game-changer! We discovered hidden gems in Tokyo that we never would have found otherwise. The recommendations were authentic and amazing.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      trip: "Cultural Trip to Tokyo"
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-advance testimonials
  useEffect(() => {
    const timer = setInterval(nextTestimonial, 5000);
    return () => clearInterval(timer);
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-4">
            What Our Guests Say
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Stories from Happy
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
              Travelers
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join thousands of satisfied travelers who have created unforgettable memories 
            with our carefully curated accommodations and exceptional service.
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 border border-gray-100">
            <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
              {/* Quote Icon */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Quote className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Testimonial Content */}
              <div className="flex-1 text-center lg:text-left">
                {/* Rating */}
                <div className="flex justify-center lg:justify-start items-center space-x-1 mb-4">
                  {renderStars(testimonials[currentIndex].rating)}
                </div>

                {/* Quote */}
                <blockquote className="text-xl lg:text-2xl text-gray-700 leading-relaxed mb-6 font-medium">
                  "{testimonials[currentIndex].text}"
                </blockquote>

                {/* Author Info */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                  <img
                    src={testimonials[currentIndex].image}
                    alt={testimonials[currentIndex].name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-amber-200"
                  />
                  <div className="text-center sm:text-left">
                    <div className="font-bold text-gray-900 text-lg">
                      {testimonials[currentIndex].name}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {testimonials[currentIndex].location}
                    </div>
                    <div className="text-amber-600 text-sm font-medium">
                      {testimonials[currentIndex].trip}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-amber-50 transition-all duration-300 border border-gray-200"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={nextTestimonial}
              className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-amber-50 transition-all duration-300 border border-gray-200"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-amber-600 scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16 pt-16 border-t border-gray-200">
          <div className="text-center">
            <div className="text-4xl lg:text-5xl font-bold text-amber-600 mb-2">{stats.travelers}</div>
            <div className="text-gray-600 font-medium">Happy Travelers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl lg:text-5xl font-bold text-amber-600 mb-2">{stats.hotels}</div>
            <div className="text-gray-600 font-medium">Partner Hotels</div>
          </div>
          <div className="text-center">
            <div className="text-4xl lg:text-5xl font-bold text-amber-600 mb-2">{stats.rating}</div>
            <div className="text-gray-600 font-medium">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-4xl lg:text-5xl font-bold text-amber-600 mb-2">{stats.support}</div>
            <div className="text-gray-600 font-medium">Customer Support</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;