import React, { useState } from 'react'
import { roomsApi } from '../../../Features/rooms/roomsAPI';

const ManageRooms = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10; // 10 rooms per page
    const {data:roomsData, isLoading, error} = roomsApi.useGetRoomsQuery(
        { page: currentPage, limit },
        {
            refetchOnMountOrArgChange: true,
            pollingInterval: 30000, // Poll every 30 seconds
        }
    );
    const [selectedRoom, setSelectedRoom] =useState(null);
    const roomsResponse = roomsData?.rooms || [];
    const pagination = roomsData?.pagination;
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    }
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
    }
        

  return (
    <div className="p-4">
        <h2 className='text-xl font-bold mb-4'>Manage Rooms</h2>
        {isLoading && <p>Loading rooms...</p>}
        {error && <p className='text-red-500'>Error loading rooms</p>}

        {pagination && (
             <div className="mb-4 text-sm text-gray-600">
                Showing {roomsData.rooms.length} of {pagination.totalItems} rooms
            </div>
            
        )}
        {roomsData && roomsData.rooms.length > 0 ? (
            <div className="overflow-x-auto">
                <table className="table table-xs w-full">
                    <thead>
                        <tr className="bg-gray-600 text-white text-md lg:text-lg">
                            <th className="px-4 py-2">Room ID</th>
                            <th className="px-4 py-2">Hotel ID</th>
                            <th className="px-4 py-2">Room Type</th>
                            <th className="px-4 py-2">Room Number</th>
                            <th className="px-4 py-2">Price per night</th>
                            <th className="px-4 py-2">Capacity</th>
                            <th className="px-4 py-2">Amenities</th>
                            <th className="px-4 py-2">Availability</th>
                           
                          
                        </tr>
                    </thead>
                    <tbody>
                        {roomsData.rooms.map((room) => (
                            <tr key={room.room_id} className="hover:bg-gray-300 border-b border-gray-400">
                                <td className="px-4 py-2 border-r border-gray-400">{room.room_id}</td>
                                <td className="px-4 py-2 border-r border-gray-400">{room.hotel_id}</td>
                                <td className="px-4 py-2 border-r border-gray-400">{room.room_type}</td>
                                <td className="px-4 py-2 border-r border-gray-400">{room.room_number}</td>
                                <td className="px-4 py-2 border-r border-gray-400">{room.price_per_night}</td>
                                <td className="px-4 py-2 border-r border-gray-400">{room.capacity}</td>
                                <td className="px-4 py-2 border-r border-gray-400">{room.amenities}</td>
                               
                                <td className="px-4 py-2 border-r border-gray-400">
                                    <span className={`badge ${room.availability === 'available' ? 'badge-success' : 'badge-warning'}`}>
                                        {room.availability}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Pagination Controls */}
                {renderPagination()}
            </div>
            
        ) : (
            !isLoading && <p>No rooms found.</p>
        )}
        
      
    </div>
  )
}

export default ManageRooms
