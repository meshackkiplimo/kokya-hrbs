import React, { useState } from 'react'

import { hotelApi } from '../../../Features/hotels/hotelAPI';
import CreateRoom from '../rooms/CreateRoom';
import AddHotel from './AddHotel';
import DeleteHotel from './DeleteHotel';

const ManageHotels = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10; // 10 hotels per page
    
    const {data:hotelsResponse, isLoading, error} = hotelApi.useGetHotelsQuery(
        { page: currentPage, limit },
        {
            refetchOnMountOrArgChange: false,
            // Remove polling to prevent excessive API calls
        }
    );
    
    const [selectedHotel, setSelectedHotel] = useState<any>(null);
    const [showRoomModal, setShowRoomModal] = useState(false);
    const [showAddHotelModal, setShowAddHotelModal] = useState(false);
    
    const hotelsData = hotelsResponse?.hotels || [];
    const pagination = hotelsResponse?.pagination;
    
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };
    
    const renderPagination = () => {
        if (!pagination) return null;
        
        const { currentPage, totalPages, hasNextPage, hasPrevPage } = pagination;
        
        return (
            <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!hasPrevPage}
                    className={`px-3 py-2 rounded text-sm md:text-base ${
                        hasPrevPage
                            ? 'bg-blue-500 hover:bg-blue-600 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    Previous
                </button>
                
                <span className="px-3 py-2 bg-gray-100 rounded text-sm md:text-base">
                    Page {currentPage} of {totalPages}
                </span>
                
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!hasNextPage}
                    className={`px-3 py-2 rounded text-sm md:text-base ${
                        hasNextPage
                            ? 'bg-blue-500 hover:bg-blue-600 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    Next
                </button>
            </div>
        );
    };
    
    const handleManageRooms = (hotel: any) => {
        setSelectedHotel(hotel);
        setShowRoomModal(true);
    };
    
    const closeModal = () => {
        setShowRoomModal(false);
        setSelectedHotel(null);
    };

    const handleCreateHotel = () => {
        setShowAddHotelModal(true);
    };

    const closeAddHotelModal = () => {
        setShowAddHotelModal(false);
    };

    // Mobile Card Component
    const HotelCard = ({ hotel }: { hotel: any }) => (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-4">
            {/* Hotel Image */}
            <div className="mb-3">
                {hotel.img_url ? (
                    <img
                        src={hotel.img_url}
                        alt={hotel.name}
                        className="w-full h-32 object-cover rounded-lg border"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-32 bg-gray-200 rounded-lg border flex items-center justify-center"><span class="text-gray-500">No Image Available</span></div>';
                        }}
                    />
                ) : (
                    <div className="w-full h-32 bg-gray-200 rounded-lg border flex items-center justify-center">
                        <span className="text-gray-500">No Image Available</span>
                    </div>
                )}
            </div>

            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="font-semibold text-lg text-gray-900">{hotel.name}</h3>
                    <p className="text-sm text-gray-600">ID: {hotel.hotel_id}</p>
                </div>
                <div className="flex items-center space-x-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm font-medium">{hotel.rating}</span>
                </div>
            </div>
            
            <div className="space-y-2 mb-4">
                <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-sm text-gray-600">Location:</span>
                    <span className="text-sm font-medium">{hotel.location}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-sm text-gray-600">Address:</span>
                    <span className="text-sm font-medium text-right sm:text-left">{hotel.address}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-sm text-gray-600">Contact:</span>
                    <span className="text-sm font-medium">{hotel.contact_number}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-sm text-gray-600">Category:</span>
                    <span className="text-sm font-medium">{hotel.category}</span>
                </div>
            </div>
            
            <button
                onClick={() => handleManageRooms(hotel)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
                Add Room
            </button>
        </div>
    );

    return (
        <div className="p-3 md:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-4">
                <h2 className='text-xl md:text-2xl font-bold'>Manage Hotels</h2>
                <button
                    onClick={handleCreateHotel}
                    className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                    Create Hotel
                </button>
            </div>
            
            {isLoading && (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className="ml-2">Loading hotels...</span>
                </div>
            )}
            
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    Error loading hotels
                </div>
            )}
            
            {/* Pagination Info */}
            {pagination && (
                <div className="mb-4 text-sm text-gray-600">
                    Showing {hotelsData.length} of {pagination.totalItems} hotels
                </div>
            )}
            
            {hotelsData && hotelsData.length > 0 ? (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden lg:block">
                        <div className="overflow-x-auto">
                            <table className="table table-xs w-full">
                                <thead>
                                    <tr className="bg-gray-600 text-white text-md lg:text-lg">
                                       <th className="px-4 py-2">Hotel Name</th>
                                          <th className="px-4 py-2">Location</th>
                                        <th className="px-4 py-2">Hotel ID</th>
                                        <th className="px-4 py-2">Name</th>
                                        <th className="px-4 py-2">Location</th>
                                        <th className="px-4 py-2">Address</th>
                                        <th className="px-4 py-2">Contact Number</th>
                                        <th className="px-4 py-2">Category</th>
                                        <th className="px-4 py-2">Rating</th>
                                        <th className="px-4 py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {hotelsData.map((hotel) => (
                                        <tr key={hotel.hotel_id} className="hover:bg-gray-300 border-b border-gray-400">
                                            
                                              <td className="px-4 py-2 border-r border-gray-400">{hotel.name}</td>
                                                <td className="px-4 py-2 border-r border-gray-400">{hotel.location}</td>
                                            <td className="px-4 py-2 border-r border-gray-400">{hotel.hotel_id}</td>
                                            <td className="px-4 py-2 border-r border-gray-400">{hotel.name}</td>
                                            <td className="px-4 py-2 border-r border-gray-400">{hotel.location}</td>
                                            <td className="px-4 py-2 border-r border-gray-400">{hotel.address}</td>
                                            <td className="px-4 py-2 border-r border-gray-400">{hotel.contact_number}</td>
                                            <td className="px-4 py-2 border-r border-gray-400">{hotel.category}</td>
                                            <td className="px-4 py-2 border-r border-gray-400">{hotel.rating}</td>
                                            <td className="px-4 py-2 border-r border-gray-400 ">
                                                <div className='flex space-x-2'>
                                                    <button
                                                    onClick={() => handleManageRooms(hotel)}
                                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
                                                >
                                                    Add Room
                                                </button>
                                                <DeleteHotel hotelId={hotel.hotel_id} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="lg:hidden">
                        {hotelsData.map((hotel) => (
                            <HotelCard key={hotel.hotel_id} hotel={hotel} />
                        ))}
                    </div>
                    
                    {/* Pagination Controls */}
                    {renderPagination()}
                </>
            ) : (
                !isLoading && (
                    <div className="text-center py-8 text-gray-500">
                        <p>No hotels found.</p>
                    </div>
                )
            )}
            
            {/* Room Management Modal */}
            <CreateRoom
                selectedHotel={selectedHotel}
                isOpen={showRoomModal}
                onClose={closeModal}
                onSuccess={() => {
                    // Optional: Add any additional success handling here
                    console.log('Room created successfully');
                }}
            />

            {/* Add Hotel Modal */}
            <AddHotel
                isOpen={showAddHotelModal}
                onClose={closeAddHotelModal}
                onSuccess={() => {
                    // Optional: Add any additional success handling here
                    console.log('Hotel created successfully');
                }}
            />
        </div>
    )
}

export default ManageHotels
