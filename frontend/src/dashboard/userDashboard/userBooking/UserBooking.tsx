import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import type { RootState } from '../../../app/store';
import { bookingApi } from '../../../Features/bookings/bookingAPI';

const UserBooking = () => {
    const [loading, setLoading] = useState(true);
    const user = useSelector((state: RootState) => state.user);
    const userId = user?.user?.user_id;
    if (!userId) {
        return <div className="text-red-500">User not found. Please log in.</div>;
    }
    // Fetch user-specific bookings
    
   
    
    // Use the new user-specific query with conditional fetching
    const { data: bookingsData = [], isLoading, error } = bookingApi.useGetAllBookingsQuery(
        undefined,
        {
            refetchOnMountOrArgChange: true,
            pollingInterval: 30000, // Poll every 30 seconds
            
          
        }
    );
    // Handle loading and error states
    
  return (
    <div>
        hello user booking
        {loading ? (
            <div>Loading...</div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookingsData.map((booking) => (
                    <div key={booking.booking_id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-4">
                        <h3 className="text-lg font-semibold">Booking ID: {booking.booking_id}</h3>
                        <p>User ID: {booking.user_id}</p>
                        <p>Hotel ID: {booking.hotel_id}</p>
                        <p>Room ID: {booking.room_id}</p>
                        <p>Check-in Date: {booking.check_in_date}</p>
                        <p>Check-out Date: {booking.check_out_date}</p>
                        <p>Total Amount: ${booking.total_amount}</p>
                        <p>Status: {booking.status}</p>
                    </div>
                ))}
            </div>
        )}
        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">
                    {('message' in error) ? error.message : 'Failed to load bookings. Please try again.'}
                </span>
            </div>
        )}
        {isLoading && (
            <div className="flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
                <span className="ml-2">Loading bookings...</span>
            </div>
        )}
        {bookingsData.length === 0 && !isLoading && (
            <div className="text-center text-gray-500">No bookings found.</div>
        )}
        {bookingsData.map((booking) => (
            <div key={booking.booking_id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-4">
                <h3 className="text-lg font-semibold">Booking ID: {booking.booking_id}</h3>
                <p>User ID: {booking.user_id}</p>
                <p>Hotel ID: {booking.hotel_id}</p>
                <p>Room ID: {booking.room_id}</p>
                <p>Check-in Date: {new Date(booking.check_in_date).toLocaleDateString()}</p>
                <p>Check-out Date: {new Date(booking.check_out_date).toLocaleDateString()}</p>
                <p>Total Amount: ${booking.total_amount}</p>
                <span className={`badge text-xs px-2 py-1 rounded-full ${
                    booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
            </div>
        ))}
    </div>
  )
}

export default UserBooking
