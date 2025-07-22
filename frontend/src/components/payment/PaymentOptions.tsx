import React, { useState } from 'react';
import { Phone, CreditCard, ArrowLeft } from 'lucide-react';
import MpesaPayment from './MpesaPayment';
import PaystackPayment from './PaystackPayment';

interface PaymentOptionsProps {
  amount: number;
  bookingId?: number;
  accountReference?: string;
  transactionDesc?: string;
  metadata?: any;
  onSuccess?: (transactionData: any, method: 'mpesa' | 'paystack') => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
}

type PaymentMethod = 'selection' | 'mpesa' | 'paystack';

const PaymentOptions: React.FC<PaymentOptionsProps> = ({
  amount,
  bookingId,
  accountReference,
  transactionDesc,
  metadata,
  onSuccess,
  onError,
  onCancel,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('selection');

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
  };

  const handleBackToSelection = () => {
    setSelectedMethod('selection');
  };

  const handlePaymentSuccess = (transactionData: any, method: 'mpesa' | 'paystack') => {
    onSuccess?.(transactionData, method);
  };

  const renderMethodSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">Choose Payment Method</h3>
        <p className="text-gray-600">Select your preferred payment option</p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Amount to pay:</span>
          <span className="text-2xl font-bold text-blue-900">KSH {amount.toLocaleString()}</span>
        </div>
        {accountReference && (
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-600 text-sm">Reference:</span>
            <span className="text-sm text-gray-800">{accountReference}</span>
          </div>
        )}
      </div>

      <div className="grid gap-4">
        {/* M-Pesa Option */}
        <button
          onClick={() => handleMethodSelect('mpesa')}
          className="group p-6 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all duration-200 text-left"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200">
              <Phone className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900 mb-1">M-PESA</h4>
              <p className="text-gray-600 text-sm">Pay using your M-PESA mobile money</p>
              <div className="flex items-center mt-2 space-x-2">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-xs text-gray-500">Instant • Secure • Local</span>
              </div>
            </div>
            <div className="text-green-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </button>

        {/* Card Payment Option */}
        <button
          onClick={() => handleMethodSelect('paystack')}
          className="group p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-left"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900 mb-1">Card Payment</h4>
              <p className="text-gray-600 text-sm">Pay with Visa, MasterCard, or bank transfer</p>
              <div className="flex items-center mt-2 space-x-4">
                <div className="flex items-center space-x-1">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span className="text-xs text-gray-500">International</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span className="text-xs text-gray-500">Secure</span>
                </div>
              </div>
            </div>
            <div className="text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </button>
      </div>

      {onCancel && (
        <div className="text-center">
          <button
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="text-center text-xs text-gray-500">
        <p>All payments are secured with end-to-end encryption</p>
      </div>
    </div>
  );

  const renderPaymentMethod = () => {
    switch (selectedMethod) {
      case 'mpesa':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-6">
              <button
                onClick={handleBackToSelection}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h3 className="text-lg font-semibold text-gray-900">M-PESA Payment</h3>
            </div>
            <MpesaPayment
              amount={amount}
              bookingId={bookingId}
              accountReference={accountReference}
              transactionDesc={transactionDesc}
              onSuccess={(data) => handlePaymentSuccess(data, 'mpesa')}
              onError={onError}
              onCancel={handleBackToSelection}
            />
          </div>
        );

      case 'paystack':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-6">
              <button
                onClick={handleBackToSelection}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h3 className="text-lg font-semibold text-gray-900">Card Payment</h3>
            </div>
            <PaystackPayment
              amount={amount}
              bookingId={bookingId}
              metadata={{
                ...metadata,
                account_reference: accountReference,
                transaction_desc: transactionDesc,
              }}
              onSuccess={(data) => handlePaymentSuccess(data, 'paystack')}
              onError={onError}
              onCancel={handleBackToSelection}
            />
          </div>
        );

      default:
        return renderMethodSelection();
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      {renderPaymentMethod()}
    </div>
  );
};

export default PaymentOptions;