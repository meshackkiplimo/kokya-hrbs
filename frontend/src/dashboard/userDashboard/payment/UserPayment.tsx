import React, { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../../../app/store'
import { paymentApi } from '../../../Features/payment/paymentAPI'
import { generatePDFReceipt, formatReceiptData } from '../../../utils/receiptGenerator'
import {
    FaCreditCard,
    FaCalendarAlt,
    FaMoneyBillWave,
    FaCheckCircle,
    FaTimesCircle,
    FaClock,
    FaSearch,
    FaFilter,
    FaMobile,
    FaUniversity,
    FaDownload
} from 'react-icons/fa'

const UserPayment = () => {
    const { user } = useSelector((state: RootState) => state.user)
    const userId = user?.id || user?.user_id; // Support both 'id' and 'user_id' fields
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    if (!userId) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                    <FaTimesCircle className="text-red-500 text-6xl mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
                    <p className="text-red-500">User ID not found. Please log in again.</p>
                </div>
            </div>
        )
    }
    // Fetch user-specific payments directly (no pagination needed for individual users)
    const {
        data: payments = [],
        isLoading,
        error: errorPayments,
        refetch
    } = paymentApi.useGetUserPaymentsQuery(userId, {
        refetchOnMountOrArgChange: true,
        pollingInterval: 30000, // Poll every 30 seconds for real-time updates
        skip: !userId, // Skip the query if no userId
    });

    const error = errorPayments;

    // Filter payments based on search term and status
    const filteredPayments = useMemo(() => {
        if (!Array.isArray(payments)) return [];
        
        return payments.filter(payment => {
            const matchesSearch = payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 payment.payment_method?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 payment.amount?.toString().includes(searchTerm)
            
            const matchesStatus = statusFilter === 'all' || payment.payment_status === statusFilter
            
            return matchesSearch && matchesStatus
        });
    }, [payments, searchTerm, statusFilter]);

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
            case 'success':
                return <FaCheckCircle className="text-green-500" />
            case 'failed':
            case 'declined':
                return <FaTimesCircle className="text-red-500" />
            case 'pending':
                return <FaClock className="text-yellow-500" />
            default:
                return <FaClock className="text-gray-500" />
        }
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
            case 'success':
                return 'bg-green-100 text-green-800'
            case 'failed':
            case 'declined':
                return 'bg-red-100 text-red-800'
            case 'pending':
                return 'bg-yellow-100 text-yellow-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getPaymentMethodIcon = (method: string) => {
        switch (method.toLowerCase()) {
            case 'mpesa':
            case 'm-pesa':
                return <FaMobile className="text-green-600" />
            case 'card':
            case 'paystack':
            case 'credit_card':
                return <FaCreditCard className="text-blue-600" />
            case 'bank':
            case 'bank_transfer':
                return <FaUniversity className="text-purple-600" />
            default:
                return <FaMoneyBillWave className="text-gray-600" />
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES'
        }).format(amount)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const handleDownloadReceipt = (payment: any) => {
        const receiptData = formatReceiptData(payment, undefined, user);
        generatePDFReceipt(receiptData);
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your payment history...</p>
                </div>
            </div>
        )
    }

    if (errorPayments) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                    <FaTimesCircle className="text-red-500 text-6xl mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Payments</h2>
                    <p className="text-red-500 mb-4">
                        {error && 'data' in error ? error.data as string : 'Failed to load payment history'}
                    </p>
                    <button
                        onClick={() => refetch()}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
                        <p className="text-gray-600 mt-1">Track all your payment transactions</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <FaCreditCard className="text-4xl text-amber-600" />
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-600 text-sm font-medium">Total Paid</p>
                                <p className="text-2xl font-bold text-green-700">
                                    {formatCurrency(Array.isArray(payments) ? payments.reduce((sum: number, payment: any) =>
                                        payment.payment_status?.toLowerCase() === 'completed' || payment.payment_status?.toLowerCase() === 'success'
                                            ? sum + (payment.amount || 0) : sum, 0) : 0)}
                                </p>
                            </div>
                            <FaCheckCircle className="text-3xl text-green-500" />
                        </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-600 text-sm font-medium">Total Transactions</p>
                                <p className="text-2xl font-bold text-blue-700">{Array.isArray(payments) ? payments.length : 0}</p>
                            </div>
                            <FaCreditCard className="text-3xl text-blue-500" />
                        </div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-yellow-600 text-sm font-medium">Pending</p>
                                <p className="text-2xl font-bold text-yellow-700">
                                    {Array.isArray(payments) ? payments.filter((p: any) => p.payment_status?.toLowerCase() === 'pending').length : 0}
                                </p>
                            </div>
                            <FaClock className="text-3xl text-yellow-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by transaction ID, method, or amount..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none bg-white"
                        >
                            <option value="all">All Status</option>
                            <option value="completed">Completed</option>
                            <option value="success">Success</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Payments List */}
            <div className="bg-white rounded-lg shadow-sm">
                {filteredPayments.length === 0 ? (
                    <div className="text-center py-12">
                        <FaCreditCard className="text-6xl text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Payments Found</h3>
                        <p className="text-gray-500">
                            {payments.length === 0
                                ? "You haven't made any payments yet."
                                : "No payments match your current filters."}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Transaction
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Method
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredPayments.map((payment) => (
                                    <tr key={payment.payment_id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                        {getStatusIcon(payment.payment_status)}
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {payment.transaction_id}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        Booking #{payment.booking_id}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {getPaymentMethodIcon(payment.payment_method)}
                                                <span className="ml-2 text-sm text-gray-900 capitalize">
                                                    {payment.payment_method}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-900">
                                                {formatCurrency(payment.amount)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.payment_status)}`}>
                                                {payment.payment_status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <FaCalendarAlt className="mr-2 text-gray-400" />
                                                {formatDate(payment.payment_date)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {(payment.payment_status?.toLowerCase() === 'completed' ||
                                              payment.payment_status?.toLowerCase() === 'success') && (
                                                <button
                                                    onClick={() => handleDownloadReceipt(payment)}
                                                    className="inline-flex items-center px-3 py-1 border border-blue-300 text-blue-700 rounded-md hover:bg-blue-50 transition-colors text-xs"
                                                    title="Download Receipt"
                                                >
                                                    <FaDownload className="mr-1" />
                                                    Receipt
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default UserPayment
