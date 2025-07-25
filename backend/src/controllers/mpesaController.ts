import { stkPush, stkPushQuery, processCallback, validatePhoneNumber } from '../services/mpesaService';
import { createPaymentService, updatePaymentService, getPaymentByTransactionIdService } from '../services/paymentService';
import { updateBookingService } from '../services/bookingService';
import { Request, Response } from 'express';

export const initiateSTKPush = async (req: Request, res: Response) => {
  try {
    const { phone, amount, bookingId, accountReference, transactionDesc } = req.body;

    if (!phone || !amount) {
      return res.status(400).json({ error: 'Phone and amount are required.' });
    }

    // Validate phone number format
    if (!validatePhoneNumber(phone)) {
      return res.status(400).json({ error: 'Invalid phone number format. Use format: 0712345678 or 254712345678' });
    }

    // Validate amount
    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    const result = await stkPush(
      phone, 
      amount, 
      accountReference || 'Hotel Booking', 
      transactionDesc || 'Hotel Room Payment'
    );

    // If booking ID is provided, create a payment record
    if (bookingId) {
      try {
        // Get user ID from the booking record instead of authentication token
        // This ensures consistency since the booking already has the correct user_id
        const { getBookingByIdService } = require('../services/bookingService');
        const booking = await getBookingByIdService(parseInt(bookingId));
        
        if (!booking) {
          console.error('M-PESA ERROR: Booking not found with ID:', bookingId);
          return res.status(404).json({
            success: false,
            error: 'Booking not found'
          });
        }

        console.log('M-PESA - Found booking:', booking);
        console.log('M-PESA - Using user_id from booking:', booking.user_id);
        
        await createPaymentService({
          booking_id: bookingId,
          user_id: booking.user_id, // Get user_id from the booking record
          amount: amount,
          payment_method: 'mpesa',
          payment_status: 'pending',
          transaction_id: result.CheckoutRequestID,
        });
        
        console.log('M-PESA payment record created successfully with user_id:', booking.user_id);
      } catch (paymentError) {
        console.error('Error creating M-PESA payment record:', paymentError);
        return res.status(500).json({
          success: false,
          error: 'Failed to create payment record'
        });
      }
    }

    res.status(200).json({
      success: true,
      message: result.CustomerMessage || 'Payment request sent. Please check your phone.',
      data: {
        MerchantRequestID: result.MerchantRequestID,
        CheckoutRequestID: result.CheckoutRequestID,
        ResponseCode: result.ResponseCode,
        ResponseDescription: result.ResponseDescription,
      }
    });
  } catch (error: any) {
    console.error('STK Push error:', error.message);
    res.status(500).json({ 
      success: false,
      error: 'Payment initiation failed. Please try again.' 
    });
  }
};

export const mpesaCallback = async (req: Request, res: Response) => {
  try {
    console.log('=== MPESA CALLBACK START ===');
    console.log('MPESA Callback received:', JSON.stringify(req.body, null, 2));
    
    const callbackData = req.body;
    const result = processCallback(callbackData);

    console.log('Processed callback result:', JSON.stringify(result, null, 2));
    
    // Update payment status in database
    if (result.checkoutRequestId) {
      try {
        console.log(`Looking for payment with transaction ID: ${result.checkoutRequestId}`);
        
        // Find payment by transaction_id (CheckoutRequestID)
        const payment = await getPaymentByTransactionIdService(result.checkoutRequestId);
        
        console.log('Found payment:', payment ? JSON.stringify(payment, null, 2) : 'No payment found');
        
        if (payment) {
          const paymentStatus = result.success ? 'completed' : 'failed';
          console.log(`Updating payment ${payment.payment_id} status to: ${paymentStatus}`);
          
          // Follow the exact same pattern as Paystack
          await updatePaymentService(payment.payment_id, {
            ...payment,
            payment_status: paymentStatus,
            transaction_id: result.transactionId || result.checkoutRequestId,
          });

          // If payment is successful, update booking status to confirmed
          if (result.success && payment.booking) {
            console.log(`Updating booking ${payment.booking.booking_id} status to confirmed`);
            await updateBookingService(payment.booking.booking_id, {
              ...payment.booking,
              status: 'confirmed'
            });
            console.log(`Booking ${payment.booking.booking_id} status updated to confirmed`);
          }

          console.log(`Payment ${result.checkoutRequestId} status updated to: ${paymentStatus}`);
        } else {
          console.error(`ERROR: Payment with transaction ID ${result.checkoutRequestId} not found in database`);
          console.log('This could be because:');
          console.log('1. The payment record was not created during STK push');
          console.log('2. The transaction ID format is different');
          console.log('3. There is a timing issue');
        }
      } catch (updateError) {
        console.error('Error updating payment status:', updateError);
        console.error('Error stack:', updateError instanceof Error ? updateError.stack : 'No stack available');
      }
    } else {
      console.error('ERROR: No checkoutRequestId found in callback result');
    }

    console.log('=== MPESA CALLBACK END ===');
    
    // Always respond with success to acknowledge receipt
    res.status(200).json({
      ResultCode: 0,
      ResultDesc: "Confirmation Received Successfully"
    });
  } catch (error: any) {
    console.error('Callback processing error:', error.message);
    console.error('Error stack:', error.stack);
    res.status(200).json({
      ResultCode: 0,
      ResultDesc: "Confirmation Received Successfully"
    });
  }
};


export const checkPaymentStatus = async (req: Request, res: Response) => {
  try {
    const { checkoutRequestId } = req.params;

    if (!checkoutRequestId) {
      return res.status(400).json({ error: 'CheckoutRequestID is required' });
    }

    const result = await stkPushQuery(checkoutRequestId);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('Payment status check error:', error.message);
    res.status(500).json({ 
      success: false,
      error: 'Failed to check payment status' 
    });
  }
};

// Manual payment status fix for debugging
export const fixMpesaPaymentStatus = async (req: Request, res: Response) => {
  try {
    const { checkoutRequestId } = req.params;
    const { status = 'completed' } = req.body;
    
    console.log(`Manual payment fix requested for: ${checkoutRequestId}`);
    
    const payment = await getPaymentByTransactionIdService(checkoutRequestId);
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found',
        checkoutRequestId
      });
    }
    
    console.log('Found payment for manual fix:', JSON.stringify(payment, null, 2));
    
    // Update payment status using regular payment service (same as Paystack)
    await updatePaymentService(payment.payment_id, {
      ...payment,
      payment_status: status,
      transaction_id: checkoutRequestId,
    });
    
    // Update booking status if payment is successful
    if (status === 'completed' && payment.booking) {
      await updateBookingService(payment.booking.booking_id, {
        ...payment.booking,
        status: 'confirmed'
      });
      console.log(`Booking ${payment.booking.booking_id} status updated to confirmed`);
    }
    
    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      data: {
        payment_id: payment.payment_id,
        old_status: payment.payment_status,
        new_status: status,
        transaction_id: checkoutRequestId,
        booking_updated: payment.booking ? true : false
      }
    });
  } catch (error: any) {
    console.error('Manual payment fix error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Test endpoint for development
export const testMpesa = async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      message: 'MPESA service is working',
      environment: process.env.MPESA_ENVIRONMENT || 'sandbox',
      shortcode: process.env.MPESA_SHORTCODE,
    });
  } catch (error: any) {
    console.error('MPESA test error:', error.message);
    res.status(500).json({ 
      success: false,
      error: 'MPESA service test failed' 
    });
  }
};