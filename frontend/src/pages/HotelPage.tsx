import React, { useState, useMemo, useEffect } from 'react';
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
  CreditCard,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { hotelApi } from '../Features/hotels/hotelAPI';
import { roomsApi, parseImageUrls } from '../Features/rooms/roomsAPI';
import { bookingApi } from '../Features/bookings/bookingAPI';
import { useSelector } from 'react-redux';
import { type RootState } from '../app/store';
import PaymentOptions from '../components/payment/PaymentOptions';

const HotelPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [selectedHotel, setSelectedHotel] = useState<number | null>(null);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [showRoomDetailsModal, setShowRoomDetailsModal] = useState(false);
  const [roomForDetails, setRoomForDetails] = useState<any>(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Get user info from Redux store
  const user = useSelector((state: RootState) => state.user);
  
  // Booking mutation
  const [createBooking, { isLoading: isBookingLoading }] = bookingApi.useCreateBookingMutation();

  // Fetch data - use getAllHotels and getAllRooms for the public page to get all data without pagination
  const { data: hotels = [], isLoading: hotelsLoading, error: hotelsError } = hotelApi.useGetAllHotelsQuery();
  const { data: rooms = [], isLoading: roomsLoading, error: roomsError } = roomsApi.useGetAllRoomsQuery();

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
    // Check if user is logged in
    if (!user.token || !user.user?.id) {
      alert('Please log in to make a booking');
      return;
    }
    
    // Find the selected room
    const room = rooms.find(r => r.room_id === roomId);
    if (!room) {
      alert('Room not found');
      return;
    }
    
    setSelectedRoom({ ...room, hotel_id: hotelId });
    setShowBookingModal(true);
  };

  const handleViewRoomDetails = (room: any) => {
    setRoomForDetails(room);
    setCurrentImageIndex(0); // Reset to first image
    setShowRoomDetailsModal(true);
  };

  // Image navigation functions
  const nextImage = (imageUrls: string[]) => {
    setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length);
  };

  const prevImage = (imageUrls: string[]) => {
    setCurrentImageIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!showRoomDetailsModal || !roomForDetails) return;
      
      const imageUrls = parseImageUrls(roomForDetails.img_url);
      if (imageUrls.length <= 1) return;

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        prevImage(imageUrls);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        nextImage(imageUrls);
      } else if (event.key === 'Escape') {
        event.preventDefault();
        setShowRoomDetailsModal(false);
        setRoomForDetails(null);
      }
    };

    if (showRoomDetailsModal) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [showRoomDetailsModal, roomForDetails]);

  const handleConfirmBooking = async () => {
    if (!selectedRoom || !checkInDate || !checkOutDate) {
      alert('Please fill in all booking details');
      return;
    }

    // Calculate total amount (number of nights * price per night)
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff <= 0) {
      alert('Check-out date must be after check-in date');
      return;
    }

    const totalAmount = daysDiff * selectedRoom.price_per_night;

    const newBookingData = {
      user_id: user.user.id,
      hotel_id: selectedRoom.hotel_id,
      room_id: selectedRoom.room_id,
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      total_amount: totalAmount,
      status: 'pending'
    };

    try {
      const bookingResult = await createBooking(newBookingData).unwrap();
      
      // Store booking data and show MPESA payment
      setBookingData({
        ...newBookingData,
        booking_id: bookingResult.booking_id,
        totalAmount,
        daysDiff,
        roomDetails: selectedRoom
      });
      
      setShowBookingModal(false);
      setShowPaymentOptions(true);
      
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed. Please try again.');
    }
  };

  const handlePaymentSuccess = (transactionData: any, method: 'mpesa' | 'paystack') => {
    console.log('Payment successful:', { transactionData, method });
    
    // Create appropriate success message based on payment method
    let successMessage = '';
    if (method === 'mpesa') {
      successMessage = `Payment successful via M-PESA! Your booking is confirmed. Transaction ID: ${transactionData.MpesaReceiptNumber || transactionData.transactionId || 'N/A'}`;
    } else if (method === 'paystack') {
      successMessage = `Payment successful via Card! Your booking is confirmed. Reference: ${transactionData.reference || 'N/A'}`;
    }
    
    alert(successMessage);
    setShowPaymentOptions(false);
    setCheckInDate('');
    setCheckOutDate('');
    setSelectedRoom(null);
    setBookingData(null);
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment failed:', error);
    alert(`Payment failed: ${error}`);
  };

  const handlePaymentCancel = () => {
    setShowPaymentOptions(false);
    // Optionally, you might want to cancel the booking here
    // or keep it as pending for later payment
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
                {/* Hotel Image */}
                <div className="relative">
                  {hotel.img_url ? (
                    <img
                      src={hotel.img_url}
                      alt={hotel.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-48 bg-gray-200 flex items-center justify-center"><div class="text-center"><div class="w-12 h-12 mx-auto text-gray-400 mb-2"><svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></div><span class="text-gray-500 font-medium">No Image Available</span></div></div>';
                      }}
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin size={48} className="mx-auto text-gray-400 mb-2" />
                        <span className="text-gray-500 font-medium">{hotel.name}</span>
                      </div>
                    </div>
                  )}
                  {/* Hotel category badge overlay */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-block bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                      {hotel.category}
                    </span>
                  </div>
                  {/* Rating badge overlay */}
                  <div className="absolute top-4 right-4 bg-white rounded-full px-2 py-1 shadow-md">
                    <div className="flex items-center space-x-1">
                      <Star size={14} className="text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{hotel.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Hotel Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{hotel.name}</h3>
                    <div className="flex items-center space-x-1 mb-2">
                      {renderStars(hotel.rating)}
                      <span className="text-sm text-gray-600 ml-2">({hotel.rating}/5)</span>
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
                    <p className="text-sm text-gray-600">{hotel.address}</p>
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
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {hotelRooms.map((room) => (
                        <div
                          key={room.room_id}
                          className={`border rounded-lg overflow-hidden ${room.availability === 'available' ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}
                        >
                          {/* Room Image and Info Layout */}
                          <div className="flex">
                            {/* Room Image */}
                            <div className="flex-shrink-0 w-24 h-20 rounded-l-lg overflow-hidden">
                              {room.img_url ? (
                                <img
                                  src={room.img_url}
                                  alt={`${room.room_type} - Room ${room.room_number}`}
                                  className="w-full h-full object-cover cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full bg-gray-200 flex items-center justify-center"><div class="text-center"><svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></div></div>';
                                  }}
                                  title={`View ${room.room_type} image`}
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                  <Bed size={16} className="text-gray-400" />
                                </div>
                              )}
                            </div>

                            {/* Room Details */}
                            <div className="flex-1 p-3">
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

                              {/* Amenities and Actions */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  {getAmenitiesIcons(room.amenities)}
                                  <span className="text-xs text-gray-500">
                                    {room.amenities.split(',').slice(0, 2).join(', ')}
                                    {room.amenities.split(',').length > 2 && '...'}
                                  </span>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handleViewRoomDetails(room)}
                                    className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors flex items-center space-x-1"
                                  >
                                    <span>View Details</span>
                                  </button>
                                  
                                  {room.availability === 'available' && (
                                    <button
                                      onClick={() => handleBookRoom(room.room_id, hotel.hotel_id)}
                                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center space-x-1"
                                    >
                                      <CreditCard size={14} />
                                      <span>Book</span>
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Room Description (if available) */}
                              {room.description && (
                                <div className="mt-2 pt-2 border-t border-gray-200">
                                  <p className="text-xs text-gray-600 overflow-hidden" style={{
                                    display: '-webkit-box',
                                    WebkitBoxOrient: 'vertical',
                                    WebkitLineClamp: 2
                                  }}>{room.description}</p>
                                </div>
                              )}
                            </div>
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

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-bold mb-4">Book Room</h3>
              
              {selectedRoom && (
                <div className="mb-4 p-3 bg-gray-50 rounded">
                  <p className="font-medium">{selectedRoom.room_type}</p>
                  <p className="text-sm text-gray-600">Room #{selectedRoom.room_number}</p>
                  <p className="text-sm text-gray-600">KSH {selectedRoom.price_per_night.toLocaleString()}/night</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    min={checkInDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {checkInDate && checkOutDate && (
                  <div className="p-3 bg-blue-50 rounded">
                    <p className="text-sm text-blue-800">
                      Total nights: {Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 3600 * 24))}
                    </p>
                    <p className="font-medium text-blue-900">
                      Total amount: KSH {(Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 3600 * 24)) * (selectedRoom?.price_per_night || 0)).toLocaleString()}
                    </p>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setShowBookingModal(false);
                      setCheckInDate('');
                      setCheckOutDate('');
                      setSelectedRoom(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmBooking}
                    disabled={isBookingLoading || !checkInDate || !checkOutDate}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isBookingLoading ? 'Booking...' : 'Confirm Booking'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Room Details Modal */}
        {showRoomDetailsModal && roomForDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">
                  {roomForDetails.room_type} - Room #{roomForDetails.room_number}
                </h3>
                <button
                  onClick={() => {
                    setShowRoomDetailsModal(false);
                    setRoomForDetails(null);
                    setCurrentImageIndex(0);
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Room Images Carousel */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Room Images</h4>
                  {(() => {
                    const imageUrls = parseImageUrls(roomForDetails.img_url);
                    return imageUrls.length > 0 ? (
                      <div className="relative">
                        {/* Main Image Display */}
                        <div className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden">
                          <img
                            src={imageUrls[currentImageIndex]}
                            alt={`${roomForDetails.room_type} - Image ${currentImageIndex + 1}`}
                            className="w-full h-full object-cover transition-opacity duration-300 ease-in-out"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full bg-gray-200 flex items-center justify-center"><div class="text-center"><div class="w-16 h-16 mx-auto text-gray-400 mb-2"><svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></div><span class="text-gray-500 font-medium">Image not available</span></div></div>';
                            }}
                          />
                          
                          {/* Image Counter Overlay */}
                          <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white text-sm px-3 py-1 rounded-full">
                            {currentImageIndex + 1} / {imageUrls.length}
                          </div>
                          
                          {/* Navigation Arrows */}
                          {imageUrls.length > 1 && (
                            <>
                              <button
                                onClick={() => prevImage(imageUrls)}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                                aria-label="Previous image"
                              >
                                <ChevronLeft size={24} />
                              </button>
                              <button
                                onClick={() => nextImage(imageUrls)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                                aria-label="Next image"
                              >
                                <ChevronRight size={24} />
                              </button>
                            </>
                          )}
                          
                          {/* Click zones for navigation */}
                          {imageUrls.length > 1 && (
                            <>
                              <div
                                className="absolute left-0 top-0 w-1/3 h-full cursor-pointer"
                                onClick={() => prevImage(imageUrls)}
                                title="Previous image (← key)"
                              />
                              <div
                                className="absolute right-0 top-0 w-1/3 h-full cursor-pointer"
                                onClick={() => nextImage(imageUrls)}
                                title="Next image (→ key)"
                              />
                            </>
                          )}
                        </div>
                        
                        {/* Image Indicators/Dots */}
                        {imageUrls.length > 1 && (
                          <div className="flex justify-center mt-4 space-x-2">
                            {imageUrls.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => goToImage(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                                  index === currentImageIndex
                                    ? 'bg-blue-600 scale-125'
                                    : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                                aria-label={`Go to image ${index + 1}`}
                              />
                            ))}
                          </div>
                        )}
                        
                        {/* Thumbnail Navigation */}
                        {imageUrls.length > 1 && (
                          <div className="mt-4">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">All Images</h5>
                            <div className="flex space-x-2 overflow-x-auto pb-2">
                              {imageUrls.map((imageUrl, index) => (
                                <button
                                  key={index}
                                  onClick={() => goToImage(index)}
                                  className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    index === currentImageIndex
                                      ? 'border-blue-600 scale-105'
                                      : 'border-gray-300 hover:border-gray-400'
                                  }`}
                                >
                                  <img
                                    src={imageUrl}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                      e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></div>';
                                    }}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Keyboard Navigation Hint */}
                        {imageUrls.length > 1 && (
                          <div className="mt-2 text-center">
                            <p className="text-xs text-gray-500">
                              Use ← → arrow keys or click on images to navigate
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Bed size={48} className="mx-auto text-gray-400 mb-2" />
                          <span className="text-gray-500">No images available</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Room Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Basic Info */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-gray-800 mb-3">Room Information</h5>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Room Type:</span>
                        <span className="font-medium">{roomForDetails.room_type}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Room Number:</span>
                        <span className="font-medium">#{roomForDetails.room_number}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Capacity:</span>
                        <span className="font-medium flex items-center">
                          <Users size={16} className="mr-1" />
                          {roomForDetails.capacity} guests
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Availability:</span>
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                          roomForDetails.availability === 'available'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {roomForDetails.availability}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Amenities */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-gray-800 mb-3">Pricing & Amenities</h5>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Price per night:</span>
                        <span className="font-bold text-lg text-green-600">
                          KSH {roomForDetails.price_per_night.toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-3">
                        <span className="text-gray-600 block mb-2">Amenities:</span>
                        <div className="flex flex-wrap gap-2">
                          {roomForDetails.amenities.split(',').map((amenity: string, index: number) => (
                            <span
                              key={index}
                              className="bg-white px-2 py-1 rounded text-sm text-gray-700 border"
                            >
                              {amenity.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Room Description */}
                <div className="mb-6">
                  <h5 className="font-semibold text-gray-800 mb-3">Room Description</h5>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">
                      {roomForDetails.description || 'No description available for this room.'}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowRoomDetailsModal(false);
                      setRoomForDetails(null);
                      setCurrentImageIndex(0);
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  {roomForDetails.availability === 'available' && (
                    <button
                      onClick={() => {
                        setShowRoomDetailsModal(false);
                        setRoomForDetails(null);
                        setCurrentImageIndex(0);
                        handleBookRoom(roomForDetails.room_id, roomForDetails.hotel_id);
                      }}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <CreditCard size={16} />
                      <span>Book This Room</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Options Modal */}
        {showPaymentOptions && bookingData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Complete Payment</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-700 space-y-1">
                    <p><strong>Room:</strong> {bookingData.roomDetails.room_type} #{bookingData.roomDetails.room_number}</p>
                    <p><strong>Nights:</strong> {bookingData.daysDiff}</p>
                    <p><strong>Dates:</strong> {bookingData.check_in_date} to {bookingData.check_out_date}</p>
                  </div>
                </div>
              </div>
              
              <PaymentOptions
                amount={bookingData.totalAmount}
                bookingId={bookingData.booking_id}
                accountReference={`Booking-${bookingData.booking_id}`}
                transactionDesc={`${bookingData.roomDetails.room_type} booking payment`}
                metadata={{
                  hotel_name: bookingData.roomDetails.hotel_name || 'Hotel',
                  room_type: bookingData.roomDetails.room_type,
                  room_number: bookingData.roomDetails.room_number,
                  check_in_date: bookingData.check_in_date,
                  check_out_date: bookingData.check_out_date,
                  nights: bookingData.daysDiff,
                }}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                onCancel={handlePaymentCancel}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelPage;
