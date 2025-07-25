import { Request, Response } from 'express';
import {
  initializePayment,
  verifyPayment,
  generatePaymentReference,
  validateWebhookSignature,
  processWebhookEvent,
  getSupportedBanks,
  validateAccountNumber
} from '../services/paystackService';
import { createPaymentService, updatePaymentService, getPaymentByTransactionIdService } from '../services/paymentService';
import { updateBookingService } from '../services/bookingService';

import db from '../Drizzle/db';
import { PaymentTable } from '../Drizzle/schema';
import { eq } from 'drizzle-orm';

/**
 * Initialize a Paystack payment
 */
export const initializePaystackPayment = async (req: Request, res: Response) => {
  try {
    const { email, amount, bookingId, metadata } = req.body;

    // Validation
    if (!email || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Email and amount are required'
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Generate unique payment reference
    const reference = generatePaymentReference('HOTEL');

    // Initialize payment with Paystack
    const paymentData = await initializePayment(
      email,
      amount,
      reference,
      {
        bookingId,
        userId: (req as any).user?.id,
        ...metadata
      }
    );

    // Debug: Log entire request body and user
    console.log('Full request body:', req.body);
    console.log('Authenticated user:', (req as any).user);
    console.log('BookingId received:', bookingId);

    // Create payment record in database if booking ID is provided
    if (bookingId) {
      try {
        if (!bookingId) {
          console.error('ERROR: No booking ID provided');
          return res.status(400).json({
            success: false,
            message: 'Booking ID is required'
          });
        }

        // Get user ID from the booking record instead of authentication token
        // This ensures consistency since the booking already has the correct user_id
        const { getBookingByIdService } = require('../services/bookingService');
        const booking = await getBookingByIdService(parseInt(bookingId));
        
        if (!booking) {
          console.error('ERROR: Booking not found with ID:', bookingId);
          return res.status(404).json({
            success: false,
            message: 'Booking not found'
          });
        }

        console.log('Found booking:', booking);
        console.log('Using user_id from booking:', booking.user_id);

        const paymentData = {
          booking_id: parseInt(bookingId),
          user_id: booking.user_id, // Get user_id from the booking record
          amount: parseInt(amount),
          payment_method: 'paystack',
          payment_status: 'pending',
          transaction_id: reference,
        };

        console.log('Creating payment record with data from booking:', paymentData);
        
        const createdPayment = await createPaymentService(paymentData);
        
        console.log('Payment record created successfully:', createdPayment);
      } catch (paymentError: any) {
        console.error('CRITICAL ERROR creating payment record:', paymentError);
        console.error('Full error stack:', paymentError?.stack);
        
        // Don't continue if payment creation fails - this is critical
        return res.status(500).json({
          success: false,
          message: 'Failed to create payment record',
          error: paymentError?.message || 'Unknown error'
        });
      }
    } else {
      console.log('WARNING: No booking ID provided, skipping payment record creation');
    }

    res.status(200).json({
      success: true,
      message: 'Payment initialized successfully',
      data: {
        authorization_url: paymentData.data.authorization_url,
        access_code: paymentData.data.access_code,
        reference: paymentData.data.reference,
      }
    });

  } catch (error: any) {
    console.error('Paystack initialization error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Payment initialization failed',
      error: error.message
    });
  }
};

/**
 * Verify a Paystack payment
 */
export const verifyPaystackPayment = async (req: Request, res: Response) => {
  try {
    const { reference } = req.params;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: 'Payment reference is required'
      });
    }

    // Verify payment with Paystack
    const verificationResult = await verifyPayment(reference);

    if (!verificationResult.status) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
        data: verificationResult
      });
    }

    const { data } = verificationResult;

    // Update payment status in database
    try {
      console.log(`Looking for payment with reference: ${reference}`);
      
      // Find payment by transaction_id (reference) using our service
      const payment = await getPaymentByTransactionIdService(reference);

      if (payment) {
        console.log('Payment found:', payment);
        const paymentStatus = data.status === 'success' ? 'completed' : 'failed';
        
        console.log(`Updating payment ${payment.payment_id} status to: ${paymentStatus}`);
        
        await updatePaymentService(payment.payment_id, {
          ...payment,
          payment_status: paymentStatus,
          transaction_id: reference,
        });

        // If payment is successful, update booking status to confirmed
        if (data.status === 'success' && payment.booking) {
          console.log(`Updating booking ${payment.booking.booking_id} status to confirmed`);
          await updateBookingService(payment.booking.booking_id, {
            ...payment.booking,
            status: 'confirmed'
          });
          console.log(`Booking ${payment.booking.booking_id} status updated to confirmed`);
        }

        console.log(`Payment ${reference} status updated to: ${paymentStatus}`);
      } else {
        console.log(`No payment found with reference: ${reference}`);
      }
    } catch (updateError) {
      console.error('Error updating payment status:', updateError);
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        reference: data.reference,
        amount: data.amount / 100, // Convert from kobo to main currency
        status: data.status,
        gateway_response: data.gateway_response,
        paid_at: data.paid_at,
        channel: data.channel,
        customer: data.customer,
        authorization: data.authorization
      }
    });

  } catch (error: any) {
    console.error('Paystack verification error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    });
  }
};

/**
 * Handle Paystack webhook events
 */
export const paystackWebhook = async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-paystack-signature'] as string;
    const payload = JSON.stringify(req.body);

    // Validate webhook signature
    if (!validateWebhookSignature(payload, signature)) {
      console.log('Invalid webhook signature');
      return res.status(400).json({
        success: false,
        message: 'Invalid signature'
      });
    }

    console.log('Paystack webhook received:', JSON.stringify(req.body, null, 2));

    const event = req.body;
    const processedEvent = processWebhookEvent(event);

    console.log('Processed webhook event:', processedEvent);

    // Handle different event types
    switch (processedEvent.eventType) {
      case 'charge.success':
        await handleSuccessfulPayment(processedEvent);
        break;
      case 'charge.failed':
        await handleFailedPayment(processedEvent);
        break;
      default:
        console.log(`Unhandled event type: ${processedEvent.eventType}`);
    }

    // Always respond with success to acknowledge receipt
    res.status(200).json({
      success: true,
      message: 'Webhook processed successfully'
    });

  } catch (error: any) {
    console.error('Webhook processing error:', error.message);
    res.status(200).json({
      success: true,
      message: 'Webhook received'
    });
  }
};

/**
 /**
  * Handle successful payment from webhook
  */
 const handleSuccessfulPayment = async (eventData: any) => {
   try {
     // Find payment by transaction_id (reference) using our service
     const payment = await getPaymentByTransactionIdService(eventData.reference);
 
     if (payment) {
       await updatePaymentService(payment.payment_id, {
         ...payment,
         payment_status: 'completed',
         transaction_id: eventData.reference,
       });

       // Update booking status to confirmed
       if (payment.booking) {
         await updateBookingService(payment.booking.booking_id, {
           ...payment.booking,
           status: 'confirmed'
         });
         console.log(`Booking ${payment.booking.booking_id} status updated to confirmed via webhook`);
       }
 
       console.log(`Payment ${eventData.reference} marked as completed via webhook`);
     } else {
       console.log(`Payment with reference ${eventData.reference} not found in database`);
     }
   } catch (error) {
     console.error('Error handling successful payment:', error);
   }
 };
 
 /**
  * Handle failed payment from webhook
  */
 const handleFailedPayment = async (eventData: any) => {
   try {
     // Find payment by transaction_id (reference)
     const existingPayment = await db.query.PaymentTable.findFirst({
       where: eq(PaymentTable.transaction_id, eventData.reference)
     });
 
     if (existingPayment) {
       await updatePaymentService(existingPayment.payment_id, {
         ...existingPayment,
         payment_status: 'failed',
         transaction_id: eventData.reference,
       });
 
       console.log(`Payment ${eventData.reference} marked as failed via webhook`);
     } else {
       console.log(`Payment with reference ${eventData.reference} not found in database`);
     }
   } catch (error) {
     console.error('Error handling failed payment:', error);
   }
 };
/**
 * Get supported banks
 */
export const getPaystackBanks = async (req: Request, res: Response) => {
  try {
    const banks = await getSupportedBanks();

    res.status(200).json({
      success: true,
      message: 'Banks retrieved successfully',
      data: banks.data
    });

  } catch (error: any) {
    console.error('Error fetching banks:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch banks',
      error: error.message
    });
  }
};

/**
 * Validate account number
 */
export const validatePaystackAccount = async (req: Request, res: Response) => {
  try {
    const { account_number, bank_code } = req.body;

    if (!account_number || !bank_code) {
      return res.status(400).json({
        success: false,
        message: 'Account number and bank code are required'
      });
    }

    const validation = await validateAccountNumber(account_number, bank_code);

    res.status(200).json({
      success: true,
      message: 'Account validated successfully',
      data: validation.data
    });

  } catch (error: any) {
    console.error('Account validation error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Account validation failed',
      error: error.message
    });
  }
};

/**
 * Test Paystack configuration
 */
export const testPaystack = async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Paystack service is working',
      data: {
        public_key: process.env.PAYSTACK_TEST_PUBLIC_KEY ? 'Set' : 'Not set',
        secret_key: process.env.PAYSTACK_TEST_SECRET_KEY ? 'Set' : 'Not set',
        callback_url: process.env.PAYSTACK_CALLBACK_URL,
        webhook_url: process.env.PAYSTACK_WEBHOOK_SECRET,
      }
    });
  } catch (error: any) {
    console.error('Paystack test error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Paystack service test failed',
      error: error.message
    });
  }
};