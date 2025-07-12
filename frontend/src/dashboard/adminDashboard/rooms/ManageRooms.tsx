import React, { useState } from 'react'
import { roomsApi } from '../../../Features/rooms/roomsAPI';

const ManageRooms = () => {
    const {data:roomsData, isLoading, error} = roomsApi.useGetRoomsQuery(
        undefined,
        {
            refetchOnMountOrArgChange: true,
            pollingInterval: 30000, // Poll every 30 seconds
        }
    );
    const [selectedRoom, setSelectedRoom] =useState(null);

  return (
    <div className="p-4">
        <h2 className='text-xl font-bold mb-4'>Manage Rooms</h2>
        {isLoading && <p>Loading rooms...</p>}
        {error && <p className='text-red-500'>Error loading rooms</p>}
        {roomsData && roomsData.length > 0 ? (
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
                        {roomsData.map((room) => (
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
            </div>
        ) : (
            !isLoading && <p>No rooms found.</p>
        )}
        
      
    </div>
  )
}

export default ManageRooms
