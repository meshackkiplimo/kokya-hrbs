import axios from 'axios';

interface STKPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

interface STKPushCallbackResponse {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: Array<{
          Name: string;
          Value: string | number;
        }>;
      };
    };
  };
}

/**
 * Get OAuth access token from Safaricom
 */
const getAccessToken = async (): Promise<string> => {
  try {
    const consumerKey = process.env.MPESA_CONSUMER_KEY!;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET!;
    const environment = process.env.MPESA_ENVIRONMENT || 'sandbox';
    
    // Validate required environment variables
    if (!consumerKey || !consumerSecret) {
      throw new Error('MPESA_CONSUMER_KEY and MPESA_CONSUMER_SECRET must be set');
    }
    
    const baseUrl = environment === 'production'
      ? 'https://api.safaricom.co.ke'
      : 'https://sandbox.safaricom.co.ke';
    
    const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    
    console.log(`Attempting to get M-PESA access token from: ${baseUrl}`);
    console.log(`Using environment: ${environment}`);
    console.log(`Consumer key (first 10 chars): ${consumerKey.substring(0, 10)}...`);
    
    const response = await axios.get(
      `${baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Node.js M-PESA Client',
        },
        timeout: 30000, // 30 second timeout
        validateStatus: (status) => status < 500, // Don't throw on 4xx errors
      }
    );

    if (response.status !== 200) {
      console.error('M-PESA API returned non-200 status:', response.status);
      console.error('Response data:', response.data);
      throw new Error(`M-PESA API returned status ${response.status}: ${JSON.stringify(response.data)}`);
    }

    if (!response.data.access_token) {
      console.error('No access token in response:', response.data);
      throw new Error('No access token received from M-PESA API');
    }

    console.log('Successfully obtained M-PESA access token');
    return response.data.access_token;
  } catch (error: any) {
    console.error('=== M-PESA ACCESS TOKEN ERROR ===');
    console.error('Error type:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request was made but no response received');
      console.error('Request config:', {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
        timeout: error.config?.timeout
      });
    }
    console.error('=================================');
    
    throw new Error(`Failed to get access token: ${error.message}`);
  }
};

/**
 * Generate password for STK Push
 */
const generatePassword = (): string => {
  const shortCode = process.env.MPESA_SHORTCODE!;
  const passKey = process.env.MPESA_PASSKEY!;
  const timestamp = getTimestamp();
  const password = Buffer.from(`${shortCode}${passKey}${timestamp}`).toString('base64');
  return password;
};

/**
 * Get timestamp in the required format
 */
const getTimestamp = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

/**
 * Format phone number to the required format
 */
const formatPhoneNumber = (phone: string): string => {
  // Remove any non-numeric characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Handle different phone number formats
  if (cleanPhone.startsWith('254')) {
    return cleanPhone;
  } else if (cleanPhone.startsWith('0')) {
    return `254${cleanPhone.substring(1)}`;
  } else if (cleanPhone.startsWith('7') || cleanPhone.startsWith('1')) {
    return `254${cleanPhone}`;
  } else {
    throw new Error('Invalid phone number format');
  }
};

/**
 * Initiate STK Push payment
 */
export const stkPush = async (
  phone: string,
  amount: number,
  accountReference: string = 'Hotel Booking',
  transactionDesc: string = 'Hotel Room Payment'
): Promise<STKPushResponse> => {
  try {
    const environment = process.env.MPESA_ENVIRONMENT || 'sandbox';
    const shortCode = process.env.MPESA_SHORTCODE!;
    const callbackUrl = process.env.CALLBACK_URL!;
    
    // Validate required environment variables
    if (!shortCode || !callbackUrl) {
      throw new Error('MPESA_SHORTCODE and CALLBACK_URL must be set');
    }
    
    const baseUrl = environment === 'production'
      ? 'https://api.safaricom.co.ke'
      : 'https://sandbox.safaricom.co.ke';

    console.log('=== STK PUSH REQUEST START ===');
    console.log(`Environment: ${environment}`);
    console.log(`Base URL: ${baseUrl}`);
    console.log(`Short Code: ${shortCode}`);
    console.log(`Phone: ${phone}`);
    console.log(`Amount: ${amount}`);
    console.log(`Callback URL: ${callbackUrl}`);

    const accessToken = await getAccessToken();
    const timestamp = getTimestamp();
    const password = generatePassword();
    const formattedPhone = formatPhoneNumber(phone);

    const requestBody = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount), // Ensure amount is an integer
      PartyA: formattedPhone,
      PartyB: shortCode,
      PhoneNumber: formattedPhone,
      CallBackURL: callbackUrl,
      AccountReference: accountReference,
      TransactionDesc: transactionDesc,
    };

    console.log('STK Push request body:', JSON.stringify(requestBody, null, 2));

    const response = await axios.post(
      `${baseUrl}/mpesa/stkpush/v1/processrequest`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Node.js M-PESA Client',
        },
        timeout: 60000, // 60 second timeout for STK push
        validateStatus: (status) => status < 500, // Don't throw on 4xx errors
      }
    );

    console.log('STK Push response status:', response.status);
    console.log('STK Push response data:', JSON.stringify(response.data, null, 2));
    console.log('=== STK PUSH REQUEST END ===');

    if (response.status !== 200) {
      console.error('STK Push failed with status:', response.status);
      console.error('Response data:', response.data);
      throw new Error(`STK Push failed with status ${response.status}: ${JSON.stringify(response.data)}`);
    }

    return response.data;
  } catch (error: any) {
    console.error('=== STK PUSH ERROR ===');
    console.error('Error type:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request was made but no response received');
      console.error('Request details:', {
        url: error.config?.url,
        method: error.config?.method,
        timeout: error.config?.timeout
      });
    }
    console.error('======================');
    
    throw new Error(`STK Push failed: ${error.response?.data?.errorMessage || error.message}`);
  }
};

/**
 * Query STK Push payment status
 */
export const stkPushQuery = async (checkoutRequestId: string): Promise<any> => {
  try {
    const environment = process.env.MPESA_ENVIRONMENT || 'sandbox';
    const shortCode = process.env.MPESA_SHORTCODE!;
    
    if (!shortCode) {
      throw new Error('MPESA_SHORTCODE must be set');
    }
    
    const baseUrl = environment === 'production'
      ? 'https://api.safaricom.co.ke'
      : 'https://sandbox.safaricom.co.ke';

    console.log(`=== STK PUSH QUERY START ===`);
    console.log(`Checking status for: ${checkoutRequestId}`);
    console.log(`Environment: ${environment}`);
    console.log(`Base URL: ${baseUrl}`);

    const accessToken = await getAccessToken();
    const timestamp = getTimestamp();
    const password = generatePassword();

    const requestBody = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId,
    };

    console.log('STK Push query request body:', JSON.stringify(requestBody, null, 2));

    const response = await axios.post(
      `${baseUrl}/mpesa/stkpushquery/v1/query`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Node.js M-PESA Client',
        },
        timeout: 30000, // 30 second timeout
        validateStatus: (status) => status < 500,
      }
    );

    console.log('STK Push query response:', JSON.stringify(response.data, null, 2));
    console.log(`=== STK PUSH QUERY END ===`);

    return response.data;
  } catch (error: any) {
    console.error('=== STK PUSH QUERY ERROR ===');
    console.error('Error type:', error.name);
    console.error('Error message:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('Request was made but no response received');
    }
    console.error('============================');
    
    throw new Error(`STK Push query failed: ${error.response?.data?.errorMessage || error.message}`);
  }
};

/**
 * Process STK Push callback
 */
export const processCallback = (callbackData: STKPushCallbackResponse): {
  success: boolean;
  transactionId?: string;
  amount?: number;
  phone?: string;
  merchantRequestId: string;
  checkoutRequestId: string;
  resultCode: number;
  resultDescription: string;
} => {
  const { stkCallback } = callbackData.Body;
  
  const result = {
    success: stkCallback.ResultCode === 0,
    merchantRequestId: stkCallback.MerchantRequestID,
    checkoutRequestId: stkCallback.CheckoutRequestID,
    resultCode: stkCallback.ResultCode,
    resultDescription: stkCallback.ResultDesc,
  };

  // If payment was successful, extract transaction details
  if (stkCallback.ResultCode === 0 && stkCallback.CallbackMetadata) {
    const metadata = stkCallback.CallbackMetadata.Item;
    
    const getMetadataValue = (name: string) => {
      const item = metadata.find(item => item.Name === name);
      return item ? item.Value : null;
    };

    return {
      ...result,
      transactionId: getMetadataValue('MpesaReceiptNumber') as string,
      amount: getMetadataValue('Amount') as number,
      phone: getMetadataValue('PhoneNumber') as string,
    };
  }

  return result;
};

/**
 * Validate phone number format
 */
export const validatePhoneNumber = (phone: string): boolean => {
  try {
    formatPhoneNumber(phone);
    return true;
  } catch {
    return false;
  }
};