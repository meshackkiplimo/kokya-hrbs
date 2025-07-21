import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const getAccessToken = async (): Promise<string> => {
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString('base64');

  const response = await axios.get(
    `https://${process.env.MPESA_ENVIRONMENT}.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );

  return response.data.access_token;
};

export const stkPush = async (phone: string, amount: number) => {
  const accessToken = await getAccessToken();
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
  const password = Buffer.from(
    `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
  ).toString('base64');

  const payload = {
    BusinessShortCode: process.env.MPESA_SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: amount,
    PartyA: phone,
    PartyB: process.env.MPESA_SHORTCODE,
    PhoneNumber: phone,
    CallBackURL: 'https://yourdomain.com/api/mpesa/callback',
    AccountReference: 'Test123',
    TransactionDesc: 'Payment for service',
  };

  const response = await axios.post(
    `https://${process.env.MPESA_ENVIRONMENT}.safaricom.co.ke/mpesa/stkpush/v1/processrequest`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};
