import React from 'react'
import { bookingApi } from '../../../Features/bookings/bookingAPI'

const ManageBookings = () => {
    const {data:bookingsData, isLoading, error} = bookingApi.useGetBookingsQuery(
        undefined,
        {
            refetchOnMountOrArgChange: true,
            pollingInterval: 30000, // Poll every 30 seconds
        }
    )
  return (
    <div className='p-4'>
        <h2 className='text-xl font-bold mb-4'>Manage Bookings page</h2>
        {isLoading && <p>Loading bookings...</p>}
        {error && <p className='text-red-500'>Error loading bookings</p>}
        {bookingsData && bookingsData.length > 0 ? (
            <div className="overflow-x-auto">
                <table className="table table-xs w-full">
                    <thead>
                        <tr className="bg-gray-600 text-white text-md lg:text-lg">  
                            <th className="px-4 py-2">Booking ID</th>
                            <th className="px-4 py-2">User ID</th>
                            <th className="px-4 py-2">Hotel ID</th>
                            <th className="px-4 py-2">Room ID</th>
                            <th className="px-4 py-2">Check-in Date</th>
                            <th className="px-4 py-2">Check-out Date</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2">Total Amount</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookingsData.map((booking) => (    
                            <tr key={booking.booking_id} className="hover:bg-gray-300 border-b border-gray-400">
                                <td className="px-4 py-2 border-r border-gray-400">{
                                    booking.booking_id
                                }</td>
                                <td className="px-4 py-2 border-r border-gray-400">{
                                    booking.user_id
                                }</td>
                                <td className="px-4 py-2 border-r border-gray-400">{
                                    booking.room_id
                                }</td>
                                <td className="px-4 py-2 border-r border-gray-400">{
                                    booking.check_in_date
                                }</td>
                               
                                <td className="px-4 py-2 border-r border-gray-400">
                                    {new Date(booking.check_out_date).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-2 border-r border-gray-400">
                                    <span className={`badge ${booking.status === 'confirmed' ? 'badge-success' : 'badge-warning'}`}>
                                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                    </span>
                                </td>
                                <td className="px-4 py-2">
                                    <button className="btn btn-sm btn-primary mr-2">
                                        Update
                                    </button>
                                    <button className="btn btn-sm btn-danger">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            !isLoading && <p>No bookings found.</p>
        )}


       
      
    </div>
  )
}

export default ManageBookings
