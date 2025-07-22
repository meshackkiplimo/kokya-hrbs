import { Express } from 'express';
import { verifyToken } from '@/middleware/authMiddleware';
import {
  initializePaystackPayment,
  verifyPaystackPayment,
  paystackWebhook,
  getPaystackBanks,
  validatePaystackAccount,
  testPaystack
} from '@/controllers/paystackController';

export const paystackRoute = (app: Express) => {
  // Initialize payment (requires authentication)
  app.route("/api/v1/paystack/initialize").post(verifyToken,
    async (req, res, next) => {
      try {
        await initializePaystackPayment(req, res);
      } catch (error) {
        next(error);
      }
    }
  );

  // Verify payment (requires authentication)
  app.route("/api/v1/paystack/verify/:reference").get(verifyToken,
    async (req, res, next) => {
      try {
        await verifyPaystackPayment(req, res);
      } catch (error) {
        next(error);
      }
    }
  );

  // Webhook endpoint (no authentication - called by Paystack)
  app.route("/api/v1/paystack/webhook").post(
    async (req, res, next) => {
      try {
        await paystackWebhook(req, res);
      } catch (error) {
        next(error);
      }
    }
  );

  // Get supported banks (requires authentication)
  app.route("/api/v1/paystack/banks").get(verifyToken,
    async (req, res, next) => {
      try {
        await getPaystackBanks(req, res);
      } catch (error) {
        next(error);
      }
    }
  );

  // Validate account number (requires authentication)
  app.route("/api/v1/paystack/validate-account").post(verifyToken,
    async (req, res, next) => {
      try {
        await validatePaystackAccount(req, res);
      } catch (error) {
        next(error);
      }
    }
  );

  // Test endpoint (no authentication for development)
  app.route("/api/v1/paystack/test").get(
    async (req, res, next) => {
      try {
        await testPaystack(req, res);
      } catch (error) {
        next(error);
      }
    }
  );

  // Callback endpoint (for frontend redirects after payment)
  app.route("/api/v1/paystack/callback").get(
    async (req, res, next) => {
      try {
        const { reference, trxref } = req.query;
        const paymentReference = reference || trxref;
        
        if (!paymentReference) {
          res.status(400).json({
            success: false,
            message: 'Payment reference is required'
          });
          return;
        }

        // Redirect to frontend with payment reference for verification
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${frontendUrl}/payment/callback?reference=${paymentReference}`);
      } catch (error) {
        next(error);
      }
    }
  );
};