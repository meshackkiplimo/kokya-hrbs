import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Star, 
  Phone, 
  Users, 
  Bed, 
  Wifi, 
  Car, 
  Coffee,
  Search,
  Filter,
  Calendar,
  CreditCard
} from 'lucide-react';
import { hotelApi } from '../Features/hotels/hotelAPI';
import { roomsApi } from '../Features/rooms/roomsAPI';

const HotelPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [selectedHotel, setSelectedHotel] = useState<number | null>(null);

  // Fetch data
  const { data: hotels = [], isLoading: hotelsLoading, error: hotelsError } = hotelApi.useGetHotelsQuery();
  const { data: rooms = [], isLoading: roomsLoading, error: roomsError } = roomsApi.useGetRoomsQuery();

  const isLoading = hotelsLoading || roomsLoading;

  // Group rooms by hotel
  const hotelRoomsMap = useMemo(() => {
    return rooms.reduce((acc, room) => {
      if (!acc[room.hotel_id]) {
        acc[room.hotel_id] = [];
      }
      acc[room.hotel_id].push(room);
      return acc;
    }, {} as Record<number, typeof rooms>);
  }, [rooms]);

  // Filter hotels based on search and filters
  const filteredHotels = useMemo(() => {
    return hotels.filter(hotel => {
      const matchesSearch = hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           hotel.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || hotel.category === selectedCategory;
      
      const hotelRooms = hotelRoomsMap[hotel.hotel_id] || [];
      const matchesPriceRange = priceRange === 'all' || 
        (priceRange === 'budget' && hotelRooms.some(room => room.price_per_night < 5000)) ||
        (priceRange === 'mid' && hotelRooms.some(room => room.price_per_night >= 5000 && room.price_per_night <= 15000)) ||
        (priceRange === 'luxury' && hotelRooms.some(room => room.price_per_night > 15000));

      return matchesSearch && matchesCategory && matchesPriceRange;
    });
  }, [hotels, searchTerm, selectedCategory, priceRange, hotelRoomsMap]);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(hotels.map(hotel => hotel.category))];
    return uniqueCategories;
  }, [hotels]);

  const handleBookRoom = (roomId: number, hotelId: number) => {
    // Here you would implement booking logic
    console.log(`Booking room ${roomId} in hotel ${hotelId}`);
    alert(`Booking functionality would be implemented here for room ${roomId}`);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  const getAmenitiesIcons = (amenities: string) => {
    const amenityList = amenities.toLowerCase();
    const icons = [];
    
    if (amenityList.includes('wifi')) icons.push(<Wifi key="wifi" size={16} className="text-blue-500" />);
    if (amenityList.includes('parking')) icons.push(<Car key="parking" size={16} className="text-green-500" />);
    if (amenityList.includes('coffee') || amenityList.includes('breakfast')) icons.push(<Coffee key="coffee" size={16} className="text-brown-500" />);
    
    return icons;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4 text-gray-600">Loading hotels and rooms...</p>
        </div>
      </div>
    );
  }

  if (hotelsError || roomsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading hotels or rooms data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Stay</h1>
          <p className="text-gray-600">Discover amazing hotels with comfortable rooms</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search hotels or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Prices</option>
                <option value="budget">Budget (Under KSH 5,000)</option>
                <option value="mid">Mid-Range (KSH 5,000 - 15,000)</option>
                <option value="luxury">Luxury (Above KSH 15,000)</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-center">
              <span className="text-gray-600 font-medium">
                {filteredHotels.length} hotel{filteredHotels.length !== 1 ? 's' : ''} found
              </span>
            </div>
          </div>
        </div>

        {/* Hotels Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredHotels.map((hotel) => {
            const hotelRooms = hotelRoomsMap[hotel.hotel_id] || [];
            const availableRooms = hotelRooms.filter(room => room.availability === 'available');
            const minPrice = hotelRooms.length > 0 ? Math.min(...hotelRooms.map(room => room.price_per_night)) : 0;

            return (
              <div key={hotel.hotel_id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Hotel Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{hotel.name}</h3>
                    <div className="flex items-center space-x-1">
                      {renderStars(hotel.rating)}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin size={16} className="mr-2" />
                    <span className="text-sm">{hotel.location}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-3">
                    <Phone size={16} className="mr-2" />
                    <span className="text-sm">{hotel.contact_number}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {hotel.category}
                    </span>
                    <span className="text-lg font-bold text-green-600">
                      From KSH {minPrice.toLocaleString()}/night
                    </span>
                  </div>
                </div>

                {/* Rooms Section */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-800">Available Rooms</h4>
                    <span className="text-sm text-gray-600">
                      {availableRooms.length} of {hotelRooms.length} available
                    </span>
                  </div>

                  {hotelRooms.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No rooms available</p>
                  ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {hotelRooms.map((room) => (
                        <div 
                          key={room.room_id} 
                          className={`border rounded-lg p-4 ${room.availability === 'available' ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Bed size={16} className="text-gray-600" />
                              <span className="font-medium text-gray-800">{room.room_type}</span>
                              <span className="text-sm text-gray-600">#{room.room_number}</span>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              room.availability === 'available' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {room.availability}
                            </span>
                          </div>

                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Users size={14} className="text-gray-500" />
                              <span className="text-sm text-gray-600">Up to {room.capacity} guests</span>
                            </div>
                            <span className="font-bold text-gray-900">
                              KSH {room.price_per_night.toLocaleString()}/night
                            </span>
                          </div>

                          {/* Amenities */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {getAmenitiesIcons(room.amenities)}
                              <span className="text-xs text-gray-500">
                                {room.amenities.split(',').slice(0, 2).join(', ')}
                                {room.amenities.split(',').length > 2 && '...'}
                              </span>
                            </div>
                            
                            {room.availability === 'available' && (
                              <button
                                onClick={() => handleBookRoom(room.room_id, hotel.hotel_id)}
                                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center space-x-1"
                              >
                                <CreditCard size={14} />
                                <span>Book Now</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Hotel Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedHotel(selectedHotel === hotel.hotel_id ? null : hotel.hotel_id)}
                    className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    View Hotel Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredHotels.length === 0 && (
          <div className="text-center py-12">
            <Filter size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No hotels found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelPage;
