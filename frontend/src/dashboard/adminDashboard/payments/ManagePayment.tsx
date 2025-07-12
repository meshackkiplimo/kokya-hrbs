import React, { useState } from 'react'
import { paymentApi } from '../../../Features/payment/paymentAPI';

const ManagePayment = () => {

  const {data:paymentsData, isLoading, error} = paymentApi.useGetPaymentsQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
      pollingInterval: 30000, // Poll every 30 seconds
    }
  );
  const [selectedPayment, setSelectedPayment] = useState(null);
  return (
    <div className="p-4">
      <h2 className='text-xl font-bold mb-4'>Manage Payments</h2>
      {isLoading && <p>Loading payments...</p>}
      {error && <p className='text-red-500'>Error loading payments</p>}
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
        </div>
      ) : (
        !isLoading && <p>No payments found.</p>
      )}

      
    </div>
  )
}

export default ManagePayment
