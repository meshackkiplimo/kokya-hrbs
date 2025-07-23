import React, { useState } from 'react'
import { roomsApi } from '../../../Features/rooms/roomsAPI';
import { hotelApi } from '../../../Features/hotels/hotelAPI';
import CreateRoom from './CreateRoom';
import { Delete } from 'lucide-react';
import DeleteRoom from './DeleteRoom';

const ManageRooms = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10; // 10 rooms per page
    const {data:roomsData, isLoading, error, refetch} = roomsApi.useGetRoomsQuery(
        { page: currentPage, limit },
        {
            refetchOnMountOrArgChange: false,
            refetchOnFocus: false,
            refetchOnReconnect: false,
            // Remove polling completely to prevent continuous server hits
        }
    );
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState<{hotel_id: number; name: string} | null>(null);
    
    // Get all hotels for selection (without continuous polling)
    const {data: hotels} = hotelApi.useGetAllHotelsQuery(undefined, {
        refetchOnMountOrArgChange: false,
        refetchOnFocus: false,
        refetchOnReconnect: false,
    });
    const roomsResponse = roomsData?.rooms || [];
    const pagination = roomsData?.pagination;
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    }

    const handleAddRoom = () => {
        if (!selectedHotel) {
            alert('Please select a hotel first');
            return;
        }
        setIsCreateRoomOpen(true);
    }

    const handleCloseCreateRoom = () => {
        setIsCreateRoomOpen(false);
    }

    const handleRoomCreated = () => {
        // Manually refresh the rooms list after creation
        refetch();
        setCurrentPage(1);
    }

    const handleRefresh = () => {
        refetch();
    }
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
    }

    // Mobile Card Component
    const RoomCard = ({ room }: { room: any }) => (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-4">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="font-semibold text-lg text-gray-900">Room #{room.room_number}</h3>
                    <p className="text-sm text-gray-600">ID: {room.room_id} | Hotel: {room.hotel_id}</p>
                </div>
                <div className="flex flex-col items-end space-y-1">
                    <span className="text-lg font-bold text-green-600">${room.price_per_night}/night</span>
                    <span className={`badge text-xs px-2 py-1 rounded-full ${
                        room.availability === 'available'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                    }`}>
                        {room.availability}
                    </span>
                </div>
            </div>
            
            <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-sm text-gray-600">Room Type:</span>
                    <span className="text-sm font-medium">{room.room_type}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-sm text-gray-600">Capacity:</span>
                    <span className="text-sm font-medium">{room.capacity} guests</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-sm text-gray-600">Amenities:</span>
                    <span className="text-sm font-medium text-right sm:text-left">{room.amenities}</span>
                </div>
            </div>
        </div>
    );
        

  return (
    <div className="p-3 md:p-6">
        <h2 className='text-xl md:text-2xl font-bold mb-4 md:mb-6'>Manage Rooms</h2>
        
        {/* Hotel Selection and Add Room Button */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Hotel to Add Room</label>
                <select
                    value={selectedHotel?.hotel_id || ''}
                    onChange={(e) => {
                        const hotelId = Number(e.target.value);
                        const hotel = hotels?.find(h => h.hotel_id === hotelId);
                        setSelectedHotel(hotel ? { hotel_id: hotel.hotel_id, name: hotel.name } : null);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="">Choose a hotel...</option>
                    {hotels?.map(hotel => (
                        <option key={hotel.hotel_id} value={hotel.hotel_id}>
                            {hotel.name} - {hotel.location}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={handleRefresh}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-medium transition-colors"
                >
                    Refresh
                </button>
                <button
                    onClick={handleAddRoom}
                    disabled={!selectedHotel}
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                        selectedHotel
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    Add Room
                </button>
            </div>
        </div>
        
        {isLoading && (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2">Loading rooms...</span>
            </div>
        )}
        
        {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                Error loading rooms
            </div>
        )}

        {pagination && (
             <div className="mb-4 text-sm text-gray-600">
                Showing {roomsData.rooms.length} of {pagination.totalItems} rooms
            </div>
        )}
        
        {roomsData && roomsData.rooms.length > 0 ? (
            <>
                {/* Desktop Table View */}
                <div className="hidden lg:block">
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
                                    <th className="px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roomsData.rooms.map((room) => (
                                    <tr key={room.room_id} className="hover:bg-gray-300 border-b border-gray-400">
                                        <td className="px-4 py-2 border-r border-gray-400">{room.room_id}</td>
                                        <td className="px-4 py-2 border-r border-gray-400">{room.hotel_id}</td>
                                        <td className="px-4 py-2 border-r border-gray-400">{room.room_type}</td>
                                        <td className="px-4 py-2 border-r border-gray-400">{room.room_number}</td>
                                        <td className="px-4 py-2 border-r border-gray-400">${room.price_per_night}</td>
                                        <td className="px-4 py-2 border-r border-gray-400">{room.capacity}</td>
                                        <td className="px-4 py-2 border-r border-gray-400">{room.amenities}</td>
                                        <td className="px-4 py-2 border-r border-gray-400">
                                            <span className={`badge ${room.availability === 'available' ? 'badge-success' : 'badge-warning'}`}>
                                                {room.availability}
                                            </span>
                                        </td>

                                        <td>
                                            <DeleteRoom roomId={room.room_id} />
                                        </td>
                                        
                                        
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden">
                    {roomsData.rooms.map((room) => (
                        <RoomCard key={room.room_id} room={room} />
                    ))}
                </div>
                
                {/* Pagination Controls */}
                {renderPagination()}
            </>
        ) : (
            !isLoading && (
                <div className="text-center py-8 text-gray-500">
                    <p>No rooms found.</p>
                </div>
            )
        )}
        
        {/* CreateRoom Modal */}
        <CreateRoom
            selectedHotel={selectedHotel}
            isOpen={isCreateRoomOpen}
            onClose={handleCloseCreateRoom}
            onSuccess={handleRoomCreated}
        />
    </div>
  )
}

export default ManageRooms
