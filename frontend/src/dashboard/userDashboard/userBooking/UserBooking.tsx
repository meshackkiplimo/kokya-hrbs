import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../app/store';
import { useGetUserBookingsQuery, useGetAllBookingsQuery } from '../../../Features/bookings/bookingAPI';
import { useGetUserPaymentsQuery } from '../../../Features/payment/paymentAPI';
import PaymentOptions from '../../../components/payment/PaymentOptions';

const UserBooking = () => {
    const { user } = useSelector((state: RootState) => state.user);
    const userId = user?.id || user?.user_id; // Support both 'id' and 'user_id' fields
    
    // Payment modal state
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<any>(null);

    // Early return if user is not found
    if (!userId) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="text-red-500 text-center">
                    <h3 className="text-lg font-semibold mb-2">User not found</h3>
                    <p>Please log in to view your bookings.</p>
                </div>
            </div>
        );
    }

    // Try user-specific query first, fallback to getAllBookings
    const {
        data: userBookingsResponse,
        isLoading: isUserBookingsLoading,
        error: userBookingsError,
        refetch: refetchUserBookings
    } = useGetUserBookingsQuery({ userId, page: 1, limit: 50 }, {
        refetchOnMountOrArgChange: true,
        pollingInterval: 30000, // Poll every 30 seconds for real-time updates
        skip: !userId, // Skip the query if no userId
    });

    // Fallback to getAllBookings if user-specific fails
    const {
        data: allBookingsData = [],
        isLoading: isAllBookingsLoading,
        error: allBookingsError,
        refetch: refetchAllBookings
    } = useGetAllBookingsQuery(undefined, {
        skip: !!userBookingsResponse && !userBookingsError, // Only fetch if user-specific failed
    });

    // Get user payments to check payment status
    const {
        data: userPayments = [],
        isLoading: isPaymentsLoading,
        refetch: refetchPayments
    } = useGetUserPaymentsQuery(userId!, {
        skip: !userId,
    });

    // Determine which data to use
    const bookingsData = userBookingsResponse?.bookings || allBookingsData.filter(booking =>
        booking.user_id === userId || booking.user_id === user?.id
    );
    const isLoading = isUserBookingsLoading || isAllBookingsLoading;
    const error = userBookingsError || allBookingsError;
    const refetch = userBookingsResponse ? refetchUserBookings : refetchAllBookings;

    // Helper function to check if booking is paid
    const isBookingPaid = (bookingId: number) => {
        return userPayments.some(payment =>
            payment.booking_id === bookingId && payment.payment_status === 'completed'
        );
    };

    // Payment handlers
    const handlePayNow = (booking: any) => {
        setSelectedBooking(booking);
        setShowPaymentModal(true);
    };

    const handlePaymentSuccess = (transactionData: any, method: 'mpesa' | 'paystack') => {
        setShowPaymentModal(false);
        setSelectedBooking(null);
        // Refetch payments and bookings to update UI
        refetchPayments();
        refetch();
        // You can show a success toast here
        console.log('Payment successful:', transactionData, method);
        alert(`Payment successful! Your ${method === 'mpesa' ? 'M-PESA' : 'Card'} payment has been processed.`);
    };

    const handlePaymentError = (error: string) => {
        // You can show an error toast here
        console.error('Payment error:', error);
    };

    const handleCloseModal = () => {
        setShowPaymentModal(false);
        setSelectedBooking(null);
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your bookings...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Error loading bookings</h3>
                        <div className="mt-2 text-sm text-red-700">
                            <p>
                                {('data' in error && error.data && typeof error.data === 'object' && 'message' in error.data)
                                    ? String(error.data.message)
                                    : 'Failed to load bookings. Please try again.'}
                            </p>
                        </div>
                        <div className="mt-4">
                            <button
                                onClick={() => refetch()}
                                className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Empty state
    if (bookingsData.length === 0) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <div className="text-center p-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 max-w-md mx-auto shadow-sm">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-6">
                        <svg
                            className="w-8 h-8 text-amber-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
                    <p className="text-gray-600 mb-6">Start your journey by exploring our amazing hotels and making your first booking.</p>
                    <button
                        type="button"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Explore Hotels
                    </button>
                </div>
            </div>
        );
    }

    // Success state - display bookings
    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h2>
                        <p className="text-gray-600">Manage and track all your hotel reservations</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-amber-200">
                            <span className="text-2xl font-bold text-amber-600">{bookingsData.length}</span>
                            <p className="text-sm text-gray-600">Total Booking{bookingsData.length !== 1 ? 's' : ''}</p>
                        </div>
                        <button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5">
                            + New Booking
                        </button>
                    </div>
                </div>
            </div>

            {/* Bookings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {bookingsData.map((booking) => (
                    <div
                        key={booking.booking_id}
                        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-1"
                    >
                        {/* Card Header */}
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-white font-bold text-lg">
                                        Booking #{booking.booking_id}
                                    </h3>
                                </div>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                    booking.status === 'confirmed'
                                        ? 'bg-green-500 text-white'
                                        : booking.status === 'pending'
                                        ? 'bg-yellow-500 text-white'
                                        : booking.status === 'cancelled'
                                        ? 'bg-red-500 text-white'
                                        : 'bg-gray-500 text-white'
                                }`}>
                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </span>
                            </div>
                        </div>
                        
                        {/* Card Body */}
                        <div className="p-6 space-y-4">
                            {/* Hotel & Room Info */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <div className="flex items-center mb-2">
                                    <svg className="w-4 h-4 text-amber-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <p className="text-sm font-semibold text-gray-700">Accommodation</p>
                                </div>
                                <p className="text-sm text-gray-600">Hotel: <span className="font-medium">#{booking.hotel_id}</span></p>
                                <p className="text-sm text-gray-600">Room: <span className="font-medium">#{booking.room_id}</span></p>
                            </div>
                            
                            {/* Dates */}
                            <div className="bg-blue-50 rounded-xl p-4">
                                <div className="flex items-center mb-2">
                                    <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-sm font-semibold text-gray-700">Stay Period</p>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <p className="text-xs text-gray-500">Check-in</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {new Date(booking.check_in_date).toLocaleDateString('en-US', { 
                                                month: 'short', 
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Check-out</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {new Date(booking.check_out_date).toLocaleDateString('en-US', { 
                                                month: 'short', 
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Amount */}
                            <div className="bg-green-50 rounded-xl p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                        <p className="text-sm font-semibold text-gray-700">Total Amount</p>
                                    </div>
                                    <p className="text-2xl font-bold text-green-600">${booking.total_amount}</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Card Footer */}
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                            <div className="flex justify-between items-center">
                                <p className="text-xs text-gray-500 flex items-center">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Booked {new Date(booking.created_at || '').toLocaleDateString()}
                                </p>
                                <div className="flex items-center space-x-2">
                                    {!isBookingPaid(booking.booking_id) ? (
                                        <button
                                            onClick={() => handlePayNow(booking)}
                                            className="text-sm bg-green-600 hover:bg-green-700 text-white font-semibold px-3 py-1 rounded-lg transition-colors duration-200 flex items-center"
                                        >
                                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            Pay Now
                                        </button>
                                    ) : (
                                        <span className="text-sm bg-green-100 text-green-800 font-semibold px-3 py-1 rounded-lg flex items-center">
                                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Paid
                                        </span>
                                    )}
                                    <button className="text-sm text-amber-600 hover:text-amber-700 font-semibold hover:bg-amber-50 px-3 py-1 rounded-lg transition-colors duration-200 flex items-center">
                                        View Details
                                        <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Payment Modal */}
            {showPaymentModal && selectedBooking && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    {/* Backdrop */}
                    <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleCloseModal} />
                    
                    {/* Modal */}
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        Complete Payment
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Booking #{selectedBooking.booking_id}
                                    </p>
                                </div>
                                <button
                                    onClick={handleCloseModal}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Payment Options */}
                            <div className="p-6">
                                <PaymentOptions
                                    amount={selectedBooking.total_amount}
                                    bookingId={selectedBooking.booking_id}
                                    accountReference={`Booking #${selectedBooking.booking_id}`}
                                    transactionDesc={`Hotel Booking Payment - Booking #${selectedBooking.booking_id}`}
                                    metadata={{
                                        user_id: userId,
                                        booking_id: selectedBooking.booking_id,
                                        hotel_id: selectedBooking.hotel_id,
                                        room_id: selectedBooking.room_id,
                                    }}
                                    onSuccess={handlePaymentSuccess}
                                    onError={handlePaymentError}
                                    onCancel={handleCloseModal}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserBooking;
