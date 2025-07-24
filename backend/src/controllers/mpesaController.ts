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
    console.log('MPESA Callback received:', JSON.stringify(req.body, null, 2));
    
    const callbackData = req.body;
    const result = processCallback(callbackData);

    console.log('Processed callback result:', result);
// Update payment status in database
if (result.checkoutRequestId) {
  try {
    // Find payment by transaction_id (CheckoutRequestID)
    const payment = await getPaymentByTransactionIdService(result.checkoutRequestId);
    
    if (payment) {
      const paymentStatus = result.success ? 'completed' : 'failed';
      
      // Update payment status
      await updatePaymentService(payment.payment_id, {
        ...payment,
        payment_status: paymentStatus,
        transaction_id: result.transactionId || result.checkoutRequestId,
      });

      // If payment is successful, update booking status to confirmed
      if (result.success && payment.booking) {
        await updateBookingService(payment.booking.booking_id, {
          ...payment.booking,
          status: 'confirmed'
        });
        console.log(`Booking ${payment.booking.booking_id} status updated to confirmed`);
      }

        console.log(`Payment ${result.checkoutRequestId} status updated to: ${paymentStatus}`);
      } else {
        console.log(`Payment with transaction ID ${result.checkoutRequestId} not found`);
      }
    } catch (updateError) {
      console.error('Error updating payment status:', updateError);
    }
  }

  // Always respond with success to acknowledge receipt
  res.status(200).json({
    ResultCode: 0,
    ResultDesc: "Confirmation Received Successfully"
  });
} catch (error: any) {
  console.error('Callback processing error:', error.message);
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