import React, { useState } from 'react'
import { paymentApi } from '../../../Features/payment/paymentAPI';

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
    <div className="p-4">
      <h2 className='text-xl font-bold mb-4'>Manage Payments</h2>
      {isLoading && <p>Loading payments...</p>}
      {error && <p className='text-red-500'>Error loading payments</p>}
      {pagination && (
        <div className="mb-4 text-sm text-gray-600">
                Showing {paymentsData.length} of {pagination.totalItems} payments
            </div>
      )}
      {paymentsData && paymentsData.length > 0 ? (
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
                <th className='px-4 py-2'>payment date</th>
              </tr>
            </thead>
            <tbody>
              {paymentsData.map((payment) => (
                <tr key={payment.payment_id} className="hover:bg-gray-300 border-b border-gray-400">
                  <td className="px-4 py-2 border-r border-gray-400">{payment.payment_id}</td>
                  <td className="px-4 py-2 border-r border-gray-400">{payment.user_id}</td>
                  <td className="px-4 py-2 border-r border-gray-400">{payment.booking_id}</td>
                  <td className="px-4 py-2 border-r border-gray-400">{payment.amount}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
          {renderPagination()}
        </div>

      ) : (
        !isLoading && <p>No payments found.</p>
      )}

      
    </div>
  )
}

export default ManagePayment
