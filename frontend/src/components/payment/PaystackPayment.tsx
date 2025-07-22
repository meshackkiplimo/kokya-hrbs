import React, { useState, useEffect } from 'react';
import { CreditCard, Mail, Loader, CheckCircle, XCircle, ExternalLink, ArrowLeft } from 'lucide-react';
import { useInitializePaystackPaymentMutation, useVerifyPaystackPaymentQuery } from '../../Features/payment/paymentAPI';

interface PaystackPaymentProps {
  amount: number;
  bookingId?: number;
  metadata?: any;
  onSuccess?: (transactionData: any) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
}

type PaymentStatus = 'idle' | 'initiating' | 'redirecting' | 'verifying' | 'success' | 'failed' | 'cancelled';

const PaystackPayment: React.FC<PaystackPaymentProps> = ({
  amount,
  bookingId,
  metadata,
  onSuccess,
  onError,
  onCancel,
}) => {
  const [email, setEmail] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [paymentReference, setPaymentReference] = useState<string>('');
  const [authorizationUrl, setAuthorizationUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

  const [initializePaystackPayment, { isLoading: isInitiating }] = useInitializePaystackPaymentMutation();
  
  // Query to verify payment (only when we have paymentReference and status is verifying)
  const { 
    data: verificationData, 
    isLoading: isVerifying,
    refetch: refetchVerification 
  } = useVerifyPaystackPaymentQuery(paymentReference, {
    skip: !paymentReference || paymentStatus !== 'verifying',
  });

  // Handle payment verification results
  useEffect(() => {
    if (verificationData?.data) {
      const { status, gateway_response } = verificationData.data;
      if (status === 'success') {
        setPaymentStatus('success');
        onSuccess?.(verificationData.data);
      } else {
        setPaymentStatus('failed');
        setError(gateway_response || 'Payment was not successful');
        onError?.(gateway_response || 'Payment was not successful');
      }
    }
  }, [verificationData, onSuccess, onError]);

  // Listen for payment callback from popup window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'PAYSTACK_PAYMENT_CALLBACK') {
        const { reference, success } = event.data;
        if (reference) {
          setPaymentReference(reference);
          if (success) {
            setPaymentStatus('verifying');
          } else {
            setPaymentStatus('failed');
            setError('Payment was cancelled or failed');
            onError?.('Payment was cancelled or failed');
          }
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onError]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handlePayment = async () => {
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    setPaymentStatus('initiating');

    try {
      const result = await initializePaystackPayment({
        email,
        amount,
        bookingId,
        metadata: {
          ...metadata,
          customer_email: email,
        },
      }).unwrap();

      if (result.success) {
        setPaymentReference(result.data.reference);
        setAuthorizationUrl(result.data.authorization_url);
        setPaymentStatus('redirecting');
        
        // Open payment in a popup window
        const popup = window.open(
          result.data.authorization_url,
          'paystack-payment',
          'width=500,height=600,scrollbars=yes,resizable=yes'
        );

        // Monitor popup closure
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            // If payment status is still redirecting, assume it was cancelled
            if (paymentStatus === 'redirecting') {
              setPaymentStatus('failed');
              setError('Payment window was closed');
              onError?.('Payment window was closed');
            }
          }
        }, 1000);

      } else {
        setPaymentStatus('failed');
        setError('Failed to initialize payment. Please try again.');
        onError?.('Failed to initialize payment');
      }
    } catch (err: any) {
      setPaymentStatus('failed');
      const errorMessage = err?.data?.message || 'Payment initialization failed. Please try again.';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  };

  const handleVerifyPayment = () => {
    if (paymentReference) {
      setPaymentStatus('verifying');
      refetchVerification();
    }
  };

  const handleCancel = () => {
    setPaymentStatus('cancelled');
    onCancel?.();
  };

  const handleTryAgain = () => {
    setPaymentStatus('idle');
    setError('');
    setPaymentReference('');
    setAuthorizationUrl('');
  };

  const renderContent = () => {
    switch (paymentStatus) {
      case 'idle':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Pay with Card</h3>
              <p className="text-gray-600">Secure payment via Paystack</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Amount to pay:</span>
                <span className="text-xl font-bold text-blue-900">KSH {amount.toLocaleString()}</span>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                Supports Visa, MasterCard, Verve, and bank transfers
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Enter your email address for payment confirmation
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
                disabled={isInitiating || !email}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isInitiating ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Pay with Card</span>
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

            <div className="text-center">
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <span>Secured by</span>
                <img 
                  src="https://paystack.com/assets/img/paystack-badge-cards.png" 
                  alt="Paystack" 
                  className="h-6"
                />
              </div>
            </div>
          </div>
        );

      case 'initiating':
        return (
          <div className="text-center space-y-4">
            <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
            <h3 className="text-lg font-semibold text-gray-900">Initializing Payment...</h3>
            <p className="text-gray-600">Please wait while we prepare your payment</p>
          </div>
        );

      case 'redirecting':
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <ExternalLink className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Complete Your Payment</h3>
              <p className="text-gray-600 mb-4">
                A secure payment window has opened. Complete your payment and return here.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-blue-800 text-sm">
                  • Enter your card details in the secure window<br/>
                  • Follow the payment instructions<br/>
                  • Return to this page after completion
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => window.open(authorizationUrl, 'paystack-payment', 'width=500,height=600')}
                className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open Payment Window</span>
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

      case 'verifying':
        return (
          <div className="text-center space-y-4">
            <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
            <h3 className="text-lg font-semibold text-gray-900">Verifying Payment...</h3>
            <p className="text-gray-600">Please wait while we confirm your payment</p>
            <button
              onClick={handleVerifyPayment}
              disabled={isVerifying}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isVerifying ? 'Verifying...' : 'Check Again'}
            </button>
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
                Reference: <strong>{paymentReference}</strong><br/>
                Email: <strong>{email}</strong>
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
                onClick={handleTryAgain}
                className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Try Again</span>
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

export default PaystackPayment;