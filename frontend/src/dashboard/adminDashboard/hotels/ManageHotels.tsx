import React, { useState } from 'react'

import { hotelApi } from '../../../Features/hotels/hotelAPI';
import CreateRoom from '../rooms/CreateRoom';

const ManageHotels = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10; // 10 hotels per page
    
    const {data:hotelsResponse, isLoading, error} = hotelApi.useGetHotelsQuery(
        { page: currentPage, limit },
        {
            refetchOnMountOrArgChange: true,
            pollingInterval: 30000, // Poll every 30 seconds
        }
    );
    
    const [selectedHotel, setSelectedHotel] = useState<any>(null);
    const [showRoomModal, setShowRoomModal] = useState(false);
    
    const hotelsData = hotelsResponse?.hotels || [];
    const pagination = hotelsResponse?.pagination;
    
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };
    
    const renderPagination = () => {
        if (!pagination) return null;
        
        const { currentPage, totalPages, hasNextPage, hasPrevPage } = pagination;
        
        return (
            <div className="flex justify-center items-center space-x-2 mt-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!hasPrevPage}
                    className={`px-3 py-1 rounded ${
                        hasPrevPage
                            ? 'bg-blue-500 hover:bg-blue-600 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    Previous
                </button>
                
                <span className="px-3 py-1 bg-gray-100 rounded">
                    Page {currentPage} of {totalPages}
                </span>
                
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!hasNextPage}
                    className={`px-3 py-1 rounded ${
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
  return (
    <div className="p-4">
        <h2 className='text-xl font-bold mb-4'>Manage Hotels</h2>
        {isLoading && <p>Loading hotels...</p>}
        {error && <p className='text-red-500'>Error loading hotels</p>}
        
        {/* Pagination Info */}
        {pagination && (
            <div className="mb-4 text-sm text-gray-600">
                Showing {hotelsData.length} of {pagination.totalItems} hotels
            </div>
        )}
        
        {hotelsData && hotelsData.length > 0 ? (
            <>
                <div className="overflow-x-auto">
                    <table className="table table-xs w-full">
                        <thead>
                            <tr className="bg-gray-600 text-white text-md lg:text-lg">
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
                                    <td className="px-4 py-2 border-r border-gray-400">{hotel.hotel_id}</td>
                                    <td className="px-4 py-2 border-r border-gray-400">{hotel.name}</td>
                                    <td className="px-4 py-2 border-r border-gray-400">{hotel.location}</td>
                                    <td className="px-4 py-2 border-r border-gray-400">{hotel.address}</td>
                                    <td className="px-4 py-2 border-r border-gray-400">{hotel.contact_number}</td>
                                    <td className="px-4 py-2 border-r border-gray-400">{hotel.category}</td>
                                    <td className="px-4 py-2 border-r border-gray-400">{hotel.rating}</td>
                                    <td className="px-4 py-2 border-r border-gray-400">
                                        <button
                                            onClick={() => handleManageRooms(hotel)}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
                                        >
                                            Add Room
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination Controls */}
                {renderPagination()}
            </>
        ) : (
            !isLoading && <p>No hotels found.</p>
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
    </div>
  )
}

export default ManageHotels
