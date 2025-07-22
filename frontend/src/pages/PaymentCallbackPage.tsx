import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader, AlertCircle } from 'lucide-react';
import { useVerifyPaystackPaymentQuery } from '../Features/payment/paymentAPI';

const PaymentCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed' | 'invalid'>('verifying');
  const [paymentData, setPaymentData] = useState<any>(null);

  const reference = searchParams.get('reference') || searchParams.get('trxref');
  const success = searchParams.get('success') !== 'false';

  // Verify payment if we have a reference
  const { 
    data: verificationData, 
    isLoading: isVerifying,
    error: verificationError 
  } = useVerifyPaystackPaymentQuery(reference!, {
    skip: !reference,
  });

  useEffect(() => {
    if (!reference) {
      setStatus('invalid');
      return;
    }

    if (!success) {
      setStatus('failed');
      return;
    }

    // Send message to parent window if this is a popup
    if (window.opener) {
      window.opener.postMessage({
        type: 'PAYSTACK_PAYMENT_CALLBACK',
        reference,
        success,
      }, window.location.origin);
      
      // Close popup after a short delay
      setTimeout(() => {
        window.close();
      }, 2000);
    }
  }, [reference, success]);

  useEffect(() => {
    if (verificationData?.data) {
      setPaymentData(verificationData.data);
      if (verificationData.data.status === 'success') {
        setStatus('success');
      } else {
        setStatus('failed');
      }
    } else if (verificationError) {
      setStatus('failed');
    }
  }, [verificationData, verificationError]);

  const handleContinue = () => {
    // Navigate to appropriate page based on payment status
    if (status === 'success') {
      navigate('/bookings'); // or wherever successful payments should redirect
    } else {
      navigate('/'); // or back to payment page
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Loader className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment</h1>
              <p className="text-gray-600">Please wait while we confirm your payment...</p>
              {reference && (
                <p className="text-sm text-gray-500 mt-2">
                  Reference: <code className="bg-gray-100 px-2 py-1 rounded">{reference}</code>
                </p>
              )}
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
              <p className="text-gray-600 mb-4">Your payment has been processed successfully.</p>
              
              {paymentData && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left max-w-md mx-auto">
                  <h3 className="font-semibold text-green-800 mb-2">Payment Details</h3>
                  <div className="space-y-1 text-sm text-green-700">
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span className="font-medium">KSH {paymentData.amount?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reference:</span>
                      <span className="font-mono text-xs">{paymentData.reference}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Method:</span>
                      <span className="font-medium capitalize">{paymentData.channel}</span>
                    </div>
                    {paymentData.paid_at && (
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span>{new Date(paymentData.paid_at).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {!window.opener && (
              <button
                onClick={handleContinue}
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Continue
              </button>
            )}
            
            {window.opener && (
              <p className="text-sm text-gray-500">
                This window will close automatically...
              </p>
            )}
          </div>
        );

      case 'failed':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
              <p className="text-gray-600 mb-4">
                {paymentData?.gateway_response || 'Your payment could not be processed.'}
              </p>
              
              {reference && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left max-w-md mx-auto">
                  <h3 className="font-semibold text-red-800 mb-2">Transaction Details</h3>
                  <div className="space-y-1 text-sm text-red-700">
                    <div className="flex justify-between">
                      <span>Reference:</span>
                      <span className="font-mono text-xs">{reference}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="font-medium">Failed</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {!window.opener && (
              <div className="space-x-4">
                <button
                  onClick={() => navigate('/')}
                  className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={handleContinue}
                  className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Go Home
                </button>
              </div>
            )}
            
            {window.opener && (
              <p className="text-sm text-gray-500">
                This window will close automatically...
              </p>
            )}
          </div>
        );

      case 'invalid':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-10 h-10 text-yellow-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Payment Reference</h1>
              <p className="text-gray-600 mb-4">
                No payment reference was provided or the reference is invalid.
              </p>
            </div>
            
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Home
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default PaymentCallbackPage;