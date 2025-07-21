import React, { useState } from 'react'
import { paymentApi } from '../../../Features/payment/paymentAPI';
import DeletePayment from './DeletePayment';

const ManagePayment = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10; // 10 payments per page

  const {data:paymentResponse, isLoading, error} = paymentApi.useGetPaymentsQuery(
   { page: currentPage, limit },
    {
      refetchOnMountOrArgChange: true,
      pollingInterval: 30000, // Poll every 30 seconds
    }
  );
  const [selectedPayment, setSelectedPayment] = useState(null);
  const paymentsData = paymentResponse?.payments || [];
  const pagination = paymentResponse?.pagination;
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
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
    };

    // Mobile Card Component
    const PaymentCard = ({ payment }: { payment: any }) => (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-4">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="font-semibold text-lg text-gray-900">Payment #{payment.payment_id}</h3>
                    <p className="text-sm text-gray-600">Transaction: {payment.transaction_id}</p>
                </div>
                <div className="flex flex-col items-end space-y-1">
                    <span className="text-lg font-bold text-green-600">${payment.amount}</span>
                    <span className={`badge text-xs px-2 py-1 rounded-full ${
                        payment.payment_status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                    }`}>
                        {payment.payment_status.charAt(0).toUpperCase() + payment.payment_status.slice(1)}
                    </span>
                </div>
            </div>
            
            <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-sm text-gray-600">User ID:</span>
                    <span className="text-sm font-medium">{payment.user_id}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-sm text-gray-600">Booking ID:</span>
                    <span className="text-sm font-medium">{payment.booking_id}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-sm text-gray-600">Payment Method:</span>
                    <span className="text-sm font-medium">{payment.payment_method}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-sm text-gray-600">Payment Date:</span>
                    <span className="text-sm font-medium">
                        {new Date(payment.payment_date).toLocaleDateString()}
                    </span>
                </div>
            </div>
        </div>
    );

  return (
    <div className="p-3 md:p-6">
      <h2 className='text-xl md:text-2xl font-bold mb-4 md:mb-6'>Manage Payments</h2>
      
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading payments...</span>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          Error loading payments
        </div>
      )}
      
      {pagination && (
        <div className="mb-4 text-sm text-gray-600">
          Showing {paymentsData.length} of {pagination.totalItems} payments
        </div>
      )}
      
      {paymentsData && paymentsData.length > 0 ? (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <div className="overflow-x-auto">
              <table className="table table-xs w-full">
                <thead>
                  <tr className="bg-gray-600 text-white text-md lg:text-lg">
                    <th className="px-4 py-2">Payment ID</th>
                    <th className="px-4 py-2">User ID</th>
                    <th className="px-4 py-2">Booking ID</th>
                    <th className="px-4 py-2">Amount</th>
                    <th className="px-4 py-2">Payment Method</th>
                    <th className="px-4 py-2">Status</th>
                    <th className='px-4 py-2'>Transaction ID</th>
                    <th className='px-4 py-2'>Payment Date</th>
                      <th className='px-4 py-2'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentsData.map((payment) => (
                    <tr key={payment.payment_id} className="hover:bg-gray-300 border-b border-gray-400">
                      <td className="px-4 py-2 border-r border-gray-400">{payment.payment_id}</td>
                      <td className="px-4 py-2 border-r border-gray-400">{payment.user_id}</td>
                      <td className="px-4 py-2 border-r border-gray-400">{payment.booking_id}</td>
                      <td className="px-4 py-2 border-r border-gray-400">${payment.amount}</td>
                      <td className="px-4 py-2 border-r border-gray-400">{payment.payment_method}</td>
                      <td className="px-4 py-2 border-r border-gray-400">
                        <span className={`badge ${payment.payment_status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                          {payment.payment_status.charAt(0).toUpperCase() + payment.payment_status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-2 border-r border-gray-400">{payment.transaction_id}</td>
                      <td className="px-4 py-2 border-r border-gray-400">
                        {new Date(payment.payment_date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">
                        <DeletePayment payment_id={payment.payment_id} />
                        </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden">
            {paymentsData.map((payment) => (
              <PaymentCard key={payment.payment_id} payment={payment} />
            ))}
          </div>
          
          {/* Pagination Controls */}
          {renderPagination()}
        </>
      ) : (
        !isLoading && (
          <div className="text-center py-8 text-gray-500">
            <p>No payments found.</p>
          </div>
        )
      )}
    </div>
  )
}

export default ManagePayment
