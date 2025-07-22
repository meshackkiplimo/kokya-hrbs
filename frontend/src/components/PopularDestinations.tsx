import React, { useMemo } from 'react';
import { MapPin, Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { hotelApi } from '../Features/hotels/hotelAPI';
import { roomsApi } from '../Features/rooms/roomsAPI';

const PopularDestinations = () => {
  const navigate = useNavigate();

  // Fetch real data from APIs
  const { data: hotels = [], isLoading: hotelsLoading } = hotelApi.useGetAllHotelsQuery();
  const { data: rooms = [], isLoading: roomsLoading } = roomsApi.useGetAllRoomsQuery();

  // Process data to create destinations with real hotel data
  const destinations = useMemo(() => {
    if (hotelsLoading || roomsLoading || !hotels.length || !rooms.length) {
      return [];
    }

    // Group hotels by location and calculate stats
    const locationStats = hotels.reduce((acc: any, hotel) => {
      const location = hotel.location;
      if (!acc[location]) {
        acc[location] = {
          name: location,
          country: "Kenya",
          hotels: [],
          image: hotel.img_url || `https://images.unsplash.com/photo-1611348586804-61bf6c080437?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`,
          description: `Experience the best of ${location} with our curated selection of hotels`
        };
      }
      acc[location].hotels.push(hotel);
      return acc;
    }, {});

    // Calculate stats for each location
    return Object.values(locationStats).map((location: any) => {
      const locationRooms = rooms.filter(room =>
        location.hotels.some((hotel: any) => hotel.hotel_id === room.hotel_id)
      );
      
      const avgRating = location.hotels.reduce((sum: number, hotel: any) => sum + hotel.rating, 0) / location.hotels.length;
      const minPrice = locationRooms.length > 0 ? Math.min(...locationRooms.map(room => room.price_per_night)) : 0;

      return {
        id: location.name,
        name: location.name,
        country: location.country,
        image: location.image,
        hotels: location.hotels.length,
        rating: Math.round(avgRating * 10) / 10,
        priceFrom: minPrice,
        description: location.description
      };
    }).slice(0, 6); // Show top 6 destinations
  }, [hotels, rooms, hotelsLoading, roomsLoading]);

  // Fallback static data while loading or if no data
  const staticDestinations = [
    {
      id: 1,
      name: "Nairobi",
      country: "Kenya",
      image: "https://images.unsplash.com/photo-1611348586804-61bf6c080437?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      hotels: 45,
      rating: 4.8,
      priceFrom: 3500,
      description: "Kenya's vibrant capital with world-class hotels and safari access"
    },
    {
      id: 2,
      name: "Mombasa",
      country: "Kenya",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      hotels: 32,
      rating: 4.7,
      priceFrom: 4200,
      description: "Beautiful coastal city with pristine beaches and luxury resorts"
    },
    {
      id: 3,
      name: "Maasai Mara",
      country: "Kenya",
      image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      hotels: 18,
      rating: 4.9,
      priceFrom: 8500,
      description: "World-famous safari destination with luxury safari lodges"
    },
    {
      id: 4,
      name: "Diani Beach",
      country: "Kenya",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      hotels: 25,
      rating: 4.6,
      priceFrom: 5500,
      description: "Tropical paradise with white sand beaches and turquoise waters"
    },
    {
      id: 5,
      name: "Nakuru",
      country: "Kenya",
      image: "https://images.unsplash.com/photo-1549366021-9f761d040a94?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      hotels: 15,
      rating: 4.5,
      priceFrom: 3200,
      description: "Gateway to Lake Nakuru National Park with flamingo viewing"
    },
    {
      id: 6,
      name: "Kisumu",
      country: "Kenya",
      image: "https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      hotels: 12,
      rating: 4.4,
      priceFrom: 2800,
      description: "Lake Victoria's largest port city with cultural attractions"
    }
  ];

  // Use real data if available, otherwise use static data
  const displayDestinations = destinations.length > 0 ? destinations : staticDestinations;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={14}
        className={index < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-4">
            Popular Destinations
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Explore Kenya's
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
              Best Destinations
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From bustling cities to pristine beaches and world-renowned safari destinations, 
            discover the best places to stay in Kenya's most sought-after locations.
          </p>
        </div>

        {/* Destinations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayDestinations.map((destination) => (
            <div 
              key={destination.id} 
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={destination.image} 
                  alt={destination.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Hotels Count Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                  {destination.hotels} hotels
                </div>
                
                {/* Rating Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1">
                  <div className="flex items-center space-x-1">
                    {renderStars(destination.rating)}
                  </div>
                  <span className="text-sm font-medium text-gray-700 ml-1">
                    {destination.rating}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <span className="text-sm text-gray-500">{destination.country}</span>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors">
                  {destination.name}
                </h3>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {destination.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-gray-500">From</span>
                    <div className="text-2xl font-bold text-amber-600">
                      KSH {destination.priceFrom.toLocaleString()}
                    </div>
                    <span className="text-sm text-gray-500">per night</span>
                  </div>
                  
                  <button
                    onClick={() => navigate(`/hotels?location=${encodeURIComponent(destination.name)}`)}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center space-x-2 group-hover:scale-105"
                  >
                    <span className="font-medium">Explore</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-8 lg:p-12 border border-amber-200">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Can't Find Your Destination?
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              We're constantly adding new destinations and hotels. Let us know where you'd like to stay, 
              and we'll help you find the perfect accommodation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/contact')}
                className="bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold px-8 py-4 rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Request Destination
              </button>
              <button
                onClick={() => navigate('/hotels')}
                className="border-2 border-amber-600 text-amber-600 font-bold px-8 py-4 rounded-xl hover:bg-amber-600 hover:text-white transition-all duration-300"
              >
                View All Destinations
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;