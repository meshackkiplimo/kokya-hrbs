import React, { useState, useEffect } from 'react';
import { Phone, CreditCard, Loader, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useInitiateMpesaPaymentMutation, useCheckMpesaPaymentStatusQuery } from '../../Features/payment/paymentAPI';

interface MpesaPaymentProps {
  amount: number;
  bookingId?: number;
  accountReference?: string;
  transactionDesc?: string;
  onSuccess?: (transactionData: any) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
}

type PaymentStatus = 'idle' | 'initiating' | 'pending' | 'checking' | 'success' | 'failed' | 'cancelled';

const MpesaPayment: React.FC<MpesaPaymentProps> = ({
  amount,
  bookingId,
  accountReference = 'Hotel Booking',
  transactionDesc = 'Hotel Room Payment',
  onSuccess,
  onError,
  onCancel,
}) => {
  const [phone, setPhone] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [checkoutRequestId, setCheckoutRequestId] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [countdown, setCountdown] = useState(0);

  const [initiateMpesaPayment, { isLoading: isInitiating }] = useInitiateMpesaPaymentMutation();
  
  // Query to check payment status (only when we have checkoutRequestId)
  const { 
    data: statusData, 
    isLoading: isCheckingStatus,
    refetch: refetchStatus 
  } = useCheckMpesaPaymentStatusQuery(checkoutRequestId, {
    skip: !checkoutRequestId || paymentStatus !== 'checking',
    pollingInterval: paymentStatus === 'checking' ? 3000 : 0, // Poll every 3 seconds
  });

  // Handle countdown for payment timeout
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setPaymentStatus('failed');
            setError('Payment timeout. Please try again.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  // Handle payment status updates
  useEffect(() => {
    if (statusData?.data) {
      const { ResultCode, ResultDesc } = statusData.data;
      if (ResultCode === '0') {
        setPaymentStatus('success');
        setCountdown(0);
        onSuccess?.(statusData.data);
      } else if (ResultCode && ResultCode !== '1032') { // 1032 means still pending
        setPaymentStatus('failed');
        setCountdown(0);
        setError(ResultDesc || 'Payment failed');
        onError?.(ResultDesc || 'Payment failed');
      }
    }
  }, [statusData, onSuccess, onError]);

  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, '');
    
    // Format as 0XXX XXX XXX
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `${numbers.slice(0, 4)} ${numbers.slice(4)}`;
    } else {
      return `${numbers.slice(0, 4)} ${numbers.slice(4, 7)} ${numbers.slice(7, 10)}`;
    }
  };

  const validatePhoneNumber = (phoneNumber: string): boolean => {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    // Kenyan phone numbers: 10 digits starting with 07 or 01, or 12 digits starting with 254
    return /^(07|01)\d{8}$/.test(cleanPhone) || /^254[17]\d{8}$/.test(cleanPhone);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    if (formatted.length <= 12) { // Limit input length
      setPhone(formatted);
    }
  };

  const handlePayment = async () => {
    if (!validatePhoneNumber(phone)) {
      setError('Please enter a valid Kenyan phone number (e.g., 0712345678)');
      return;
    }

    setError('');
    setPaymentStatus('initiating');

    try {
      const result = await initiateMpesaPayment({
        phone: phone.replace(/\D/g, ''), // Send clean phone number
        amount,
        bookingId,
        accountReference,
        transactionDesc,
      }).unwrap();

      if (result.success) {
        setCheckoutRequestId(result.data.CheckoutRequestID);
        setPaymentStatus('pending');
        setCountdown(120); // 2 minutes timeout
      } else {
        setPaymentStatus('failed');
        setError('Failed to initiate payment. Please try again.');
        onError?.('Failed to initiate payment');
      }
    } catch (err: any) {
      setPaymentStatus('failed');
      const errorMessage = err?.data?.error || 'Payment initiation failed. Please try again.';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  };

  const handleCheckStatus = () => {
    if (checkoutRequestId) {
      setPaymentStatus('checking');
      refetchStatus();
    }
  };

  const handleCancel = () => {
    setPaymentStatus('cancelled');
    setCountdown(0);
    onCancel?.();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderContent = () => {
    switch (paymentStatus) {
      case 'idle':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Pay with M-PESA</h3>
              <p className="text-gray-600">Enter your phone number to complete payment</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Amount to pay:</span>
                <span className="text-xl font-bold text-blue-900">KSH {amount.toLocaleString()}</span>
              </div>
              {accountReference && (
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600 text-sm">Reference:</span>
                  <span className="text-sm text-gray-800">{accountReference}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                M-PESA Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="0712 345 678"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Enter your M-PESA registered phone number
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={handlePayment}
                disabled={isInitiating || !phone}
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isInitiating ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Initiating...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Pay Now</span>
                  </>
                )}
              </button>
              {onCancel && (
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        );

      case 'initiating':
        return (
          <div className="text-center space-y-4">
            <Loader className="w-12 h-12 animate-spin text-green-600 mx-auto" />
            <h3 className="text-lg font-semibold text-gray-900">Initiating Payment...</h3>
            <p className="text-gray-600">Please wait while we process your request</p>
          </div>
        );

      case 'pending':
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Check Your Phone</h3>
              <p className="text-gray-600 mb-4">
                We've sent a payment request to <strong>{phone}</strong>
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 text-sm">
                  • Check your phone for the M-PESA popup<br/>
                  • Enter your M-PESA PIN<br/>
                  • Confirm the payment
                </p>
              </div>
              {countdown > 0 && (
                <p className="text-sm text-gray-500">
                  Time remaining: <span className="font-mono font-bold">{formatTime(countdown)}</span>
                </p>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleCheckStatus}
                disabled={isCheckingStatus}
                className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isCheckingStatus ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Checking...</span>
                  </>
                ) : (
                  <span>Check Status</span>
                )}
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        );

      case 'checking':
        return (
          <div className="text-center space-y-4">
            <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
            <h3 className="text-lg font-semibold text-gray-900">Checking Payment Status...</h3>
            <p className="text-gray-600">Please wait while we verify your payment</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Payment Successful!</h3>
            <p className="text-gray-600">Your payment has been completed successfully</p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 text-sm">
                Amount: <strong>KSH {amount.toLocaleString()}</strong><br/>
                Reference: <strong>{accountReference}</strong>
              </p>
            </div>
          </div>
        );

      case 'failed':
        return (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Payment Failed</h3>
            <p className="text-gray-600">{error || 'Something went wrong with your payment'}</p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setPaymentStatus('idle');
                  setError('');
                  setCheckoutRequestId('');
                }}
                className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
              {onCancel && (
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        );

      case 'cancelled':
        return (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Payment Cancelled</h3>
            <p className="text-gray-600">The payment process was cancelled</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      {renderContent()}
    </div>
  );
};

export default MpesaPayment;