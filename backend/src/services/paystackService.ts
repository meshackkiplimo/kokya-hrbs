import axios from 'axios';

interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    message: string | null;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: any;
    fees_breakdown: any;
    log: any;
    fees: number;
    fees_split: any;
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string;
      account_name: string | null;
    };
    customer: {
      id: number;
      first_name: string | null;
      last_name: string | null;
      email: string;
      customer_code: string;
      phone: string | null;
      metadata: any;
      risk_action: string;
      international_format_phone: string | null;
    };
    plan: any;
    split: any;
    order_id: any;
    paidAt: string;
    createdAt: string;
    requested_amount: number;
    pos_transaction_data: any;
    source: any;
    fees_breakdown_json: any;
  };
}

interface PaystackWebhookEvent {
  event: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    message: string | null;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: any;
    fees_breakdown: any;
    log: any;
    fees: number;
    customer: {
      id: number;
      first_name: string | null;
      last_name: string | null;
      email: string;
      customer_code: string;
      phone: string | null;
      metadata: any;
      risk_action: string;
    };
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string;
      account_name: string | null;
    };
    plan: any;
  };
}

/**
 * Initialize a payment with Paystack
 */
export const initializePayment = async (
  email: string,
  amount: number,
  reference: string,
  metadata?: any
): Promise<PaystackInitializeResponse> => {
  try {
    const secretKey = process.env.PAYSTACK_TEST_SECRET_KEY!;
    const callbackUrl = process.env.PAYSTACK_CALLBACK_URL!;

    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount: amount * 100, // Paystack expects amount in kobo (smallest currency unit)
        reference,
        callback_url: callbackUrl,
        metadata,
        currency: 'KES', // Kenyan Shillings
      },
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Paystack initialization error:', error.response?.data || error.message);
    throw new Error(`Payment initialization failed: ${error.response?.data?.message || error.message}`);
  }
};

/**
 * Verify a payment transaction
 */
export const verifyPayment = async (reference: string): Promise<PaystackVerifyResponse> => {
  try {
    const secretKey = process.env.PAYSTACK_TEST_SECRET_KEY!;

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Paystack verification error:', error.response?.data || error.message);
    throw new Error(`Payment verification failed: ${error.response?.data?.message || error.message}`);
  }
};

/**
 * Generate a unique payment reference
 */
export const generatePaymentReference = (prefix: string = 'TXN'): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}_${timestamp}_${random}`;
};

/**
 * Validate webhook signature from Paystack
 */
export const validateWebhookSignature = (payload: string, signature: string): boolean => {
  try {
    const crypto = require('crypto');
    const secretKey = process.env.PAYSTACK_TEST_SECRET_KEY!;
    
    const hash = crypto
      .createHmac('sha512', secretKey)
      .update(payload, 'utf-8')
      .digest('hex');

    return hash === signature;
  } catch (error) {
    console.error('Webhook signature validation error:', error);
    return false;
  }
};

/**
 * Process Paystack webhook event
 */
export const processWebhookEvent = (event: PaystackWebhookEvent): {
  eventType: string;
  reference: string;
  status: string;
  amount: number;
  customer: {
    email: string;
    first_name: string | null;
    last_name: string | null;
  };
  authorization?: any;
  metadata?: any;
} => {
  return {
    eventType: event.event,
    reference: event.data.reference,
    status: event.data.status,
    amount: event.data.amount / 100, // Convert from kobo to main currency
    customer: {
      email: event.data.customer.email,
      first_name: event.data.customer.first_name,
      last_name: event.data.customer.last_name,
    },
    authorization: event.data.authorization,
    metadata: event.data.metadata,
  };
};

/**
 * Get all supported banks for bank transfer
 */
export const getSupportedBanks = async (): Promise<any> => {
  try {
    const secretKey = process.env.PAYSTACK_TEST_SECRET_KEY!;

    const response = await axios.get(
      'https://api.paystack.co/bank',
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Error fetching banks:', error.response?.data || error.message);
    throw new Error(`Failed to fetch banks: ${error.response?.data?.message || error.message}`);
  }
};

/**
 * Create a transfer recipient
 */
export const createTransferRecipient = async (
  name: string,
  account_number: string,
  bank_code: string
): Promise<any> => {
  try {
    const secretKey = process.env.PAYSTACK_TEST_SECRET_KEY!;

    const response = await axios.post(
      'https://api.paystack.co/transferrecipient',
      {
        type: 'nuban',
        name,
        account_number,
        bank_code,
        currency: 'KES',
      },
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Error creating transfer recipient:', error.response?.data || error.message);
    throw new Error(`Failed to create transfer recipient: ${error.response?.data?.message || error.message}`);
  }
};

/**
 * Validate account number
 */
export const validateAccountNumber = async (
  account_number: string,
  bank_code: string
): Promise<any> => {
  try {
    const secretKey = process.env.PAYSTACK_TEST_SECRET_KEY!;

    const response = await axios.get(
      `https://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Error validating account:', error.response?.data || error.message);
    throw new Error(`Account validation failed: ${error.response?.data?.message || error.message}`);
  }
};