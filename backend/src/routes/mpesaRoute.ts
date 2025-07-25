
import { initiateSTKPush, mpesaCallback, checkPaymentStatus, testMpesa, fixMpesaPaymentStatus } from '../controllers/mpesaController';
import { Express } from 'express';
import { verifyToken } from '../middleware/authMiddleware';

export const mpesaRoute = (app: Express) => {
    // STK Push initiation (requires authentication)
    app.route("/api/v1/mpesa/stk-push").post(verifyToken,
        async (req, res, next) => {
            try {
                await initiateSTKPush(req, res);
            } catch (error) {
                next(error);
            }
        }
    );

    // MPESA callback (no authentication needed - called by Safaricom)
    app.route("/api/v1/mpesa/callback").post(
        async (req, res, next) => {
            try {
                console.log('=== M-PESA CALLBACK RECEIVED ===');
                console.log('Headers:', req.headers);
                console.log('Body:', JSON.stringify(req.body, null, 2));
                console.log('URL:', req.url);
                console.log('Method:', req.method);
                console.log('================================');
                
                await mpesaCallback(req, res);
            } catch (error) {
                console.error('M-PESA Callback Error:', error);
                next(error);
            }
        }
    );

    // Check payment status (requires authentication)
    app.route("/api/v1/mpesa/status/:checkoutRequestId").get(verifyToken,
        async (req, res, next) => {
            try {
                await checkPaymentStatus(req, res);
            } catch (error) {
                next(error);
            }
        }
    );

    // Test endpoint (no authentication for development)
    app.route("/api/v1/mpesa/test").get(
        async (req, res, next) => {
            try {
                await testMpesa(req, res);
            } catch (error) {
                next(error);
            }
        }
    );

    // Health check endpoint for callback URL testing
    app.route("/api/v1/mpesa/callback/health").get(
        async (req, res, next) => {
            try {
                res.status(200).json({
                    success: true,
                    message: 'M-Pesa callback endpoint is accessible',
                    timestamp: new Date().toISOString(),
                    url: req.originalUrl,
                    method: req.method
                });
            } catch (error) {
                next(error);
            }
        }
    );

    // Manual payment status fix endpoint
    app.route("/api/v1/mpesa/fix-payment/:checkoutRequestId").post(verifyToken,
        async (req, res, next) => {
            try {
                await fixMpesaPaymentStatus(req, res);
            } catch (error) {
                next(error);
            }
        }
    );
}