import React, { useState, useMemo } from 'react';
import { Search, Star, MapPin, Calendar, Users, ArrowRight, Play, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { hotelApi } from '../Features/hotels/hotelAPI';
import { roomsApi } from '../Features/rooms/roomsAPI';
import bgImg from '../assets/img/bg.jpg';

const Hero = () => {
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const navigate = useNavigate();

  // Fetch real data for stats
  const { data: hotels = [] } = hotelApi.useGetAllHotelsQuery();
  const { data: rooms = [] } = roomsApi.useGetAllRoomsQuery();

  // Calculate real stats
  const stats = useMemo(() => {
    const hotelCount = hotels.length;
    const avgRating = hotels.length > 0
      ? Math.round((hotels.reduce((sum, hotel) => sum + hotel.rating, 0) / hotels.length) * 10) / 10
      : 4.9;
    
    return {
      hotels: hotelCount > 0 ? hotelCount : 500,
      guests: '50K+', // This would typically come from booking data
      rating: avgRating
    };
  }, [hotels]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to hotels page with search parameters
    const searchParams = new URLSearchParams();
    if (location) searchParams.set('location', location);
    if (checkIn) searchParams.set('checkIn', checkIn);
    if (checkOut) searchParams.set('checkOut', checkOut);
    if (guests) searchParams.set('guests', guests);
    
    navigate(`/hotels?${searchParams.toString()}`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background with Gradient Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-amber-900 to-slate-800 opacity-95"></div>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/70"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="text-white space-y-8">
              {/* Trust Badge */}
              <div className="flex items-center space-x-2 text-amber-400">
                <Star className="w-5 h-5 fill-current" />
                <span className="text-sm font-medium">Trusted by 50,000+ travelers worldwide</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  Find Your
                  <span className="block bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                    Perfect Stay
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-gray-200 leading-relaxed max-w-lg">
                  Discover exceptional hotels, luxury resorts, and unique accommodations
                  tailored to your journey with our AI-powered recommendations.
                </p>
              </div>

              {/* Key Features */}
              <div className="flex flex-wrap gap-6">
                {[
                  { icon: CheckCircle, text: "Best Price Guarantee" },
                  { icon: CheckCircle, text: "24/7 Customer Support" },
                  { icon: CheckCircle, text: "Instant Confirmation" }
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 text-green-400">
                    <feature.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Video Button */}
              <div className="flex items-center space-x-4">
                <button className="group flex items-center space-x-3 bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-full hover:bg-white/20 transition-all duration-300">
                  <Play className="w-5 h-5 text-white group-hover:text-amber-400 transition-colors" />
                  <span className="text-white font-medium">Watch How It Works</span>
                </button>
              </div>
            </div>

            {/* Right Column - Search Form */}
            <div className="lg:flex lg:justify-end">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-lg w-full border border-white/20">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Book Your Stay</h3>
                  <p className="text-gray-600">Find and reserve the perfect accommodation</p>
                </div>

                <form onSubmit={handleSearch} className="space-y-6">
                  {/* Location */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Destination
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Where are you going?"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Check-in and Check-out */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Check-in
                      </label>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Check-out</label>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Guests */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      Guests
                    </label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                      <option value="5+">5+ Guests</option>
                    </select>
                  </div>

                  {/* Search Button */}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold py-4 px-6 rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    <Search className="w-5 h-5" />
                    <span>Search Hotels</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-600">{stats.hotels}+</div>
                    <div className="text-xs text-gray-600">Hotels</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-600">{stats.guests}</div>
                    <div className="text-xs text-gray-600">Happy Guests</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-600">{stats.rating}★</div>
                    <div className="text-xs text-gray-600">Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <div className="flex flex-col items-center space-y-2">
          <span className="text-sm opacity-75">Discover More</span>
          <div className="w-1 h-8 bg-white/50 rounded-full">
            <div className="w-1 h-4 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
