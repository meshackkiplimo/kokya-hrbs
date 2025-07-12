import React, { useState } from 'react'

import { hotelApi } from '../../../Features/hotels/hotelAPI';

const ManageHotels = () => {
    const {data:hotelsData, isLoading, error} = hotelApi.useGetHotelsQuery(
        undefined,
        {
            refetchOnMountOrArgChange: true,
            pollingInterval: 30000, // Poll every 30 seconds
        }
    );
    const [selectedHotel, setSelectedHotel] = useState(null);
  return (
    <div className="p-4">
        <h2 className='text-xl font-bold mb-4'>Manage Hotels</h2>
        {isLoading && <p>Loading hotels...</p>}
        {error && <p className='text-red-500'>Error loading hotels</p>}
        {hotelsData && hotelsData.length > 0 ? (
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            !isLoading && <p>No hotels found.</p>
        )}
        

      
    </div>
  )
}

export default ManageHotels
