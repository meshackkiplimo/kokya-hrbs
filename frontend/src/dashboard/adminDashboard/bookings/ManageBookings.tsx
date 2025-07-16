import React, {  useState } from 'react'
import { bookingApi } from '../../../Features/bookings/bookingAPI'

const ManageBookings = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10; // 10 bookings per page
    const {data:bookingResponse, isLoading, error} = bookingApi.useGetBookingsQuery(
        { page: currentPage, limit },
        {
            refetchOnMountOrArgChange: true,
            pollingInterval: 30000, // Poll every 30 seconds
        }
    )
    const [selectedBooking, setSelectedBooking] = useState(null);
   const bookingsData = bookingResponse?.bookings || [];
    const pagination = bookingResponse?.pagination;
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
    };
        
  return (
    <div className='p-4'>
        <h2 className='text-xl font-bold mb-4'>Manage Bookings page</h2>
        {isLoading && <p>Loading bookings...</p>}
        {error && <p className='text-red-500'>Error loading bookings</p>}
        {pagination && (
            <div className="mb-4 text-sm text-gray-600">
                Showing {bookingsData.length} of {pagination.totalItems} bookings
            </div>

        )}
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
                                    booking.hotel_id
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
                                 <td className="px-4 py-2 border-r border-gray-400">{
                                    booking.total_amount
                                }</td>
                                
                            </tr>
                        ))}
                    </tbody>
                </table>
                {renderPagination()}
            </div>
            
        ) : (
            !isLoading && <p>No bookings found.</p>
        )}


       
      
    </div>
  )
}

export default ManageBookings
