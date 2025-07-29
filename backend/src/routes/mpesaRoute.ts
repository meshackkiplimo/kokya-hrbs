
import { initiateSTKPush, mpesaCallback, checkPaymentStatus, testMpesa, fixMpesaPaymentStatus } from '../controllers/mpesaController';
import { Express } from 'express';
import { verifyToken } from '../middleware/authMiddleware';

export const mpesaRoute = (app: Express) => {
    // STK Push initiation (requires authentication)
    app.route("/mpesa/stk-push").post(verifyToken,
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
                    method: req.method,
                    environment: process.env.MPESA_ENVIRONMENT || 'sandbox',
                    callbackUrl: process.env.CALLBACK_URL
                });
            } catch (error) {
                next(error);
            }
        }
    );

    // Validation endpoint for M-Pesa (Safaricom may use this to validate the URL)
    app.route("/api/v1/mpesa/callback/validate").get(
        async (req, res, next) => {
            try {
                res.status(200).json({
                    ResultCode: 0,
                    ResultDesc: "Validation Successful"
                });
            } catch (error) {
                next(error);
            }
        }
    );

    // Alternative callback endpoint with proper headers
    app.route("/api/v1/mpesa/callback").all(
        async (req, res, next) => {
            try {
                // Set proper headers for M-Pesa callback
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
                res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

                if (req.method === 'OPTIONS') {
                    res.status(200).end();
                    return;
                }

                if (req.method === 'GET') {
                    res.status(200).json({
                        success: true,
                        message: 'M-Pesa callback endpoint is active',
                        timestamp: new Date().toISOString(),
                        environment: process.env.MPESA_ENVIRONMENT || 'sandbox'
                    });
                    return;
                }

                if (req.method === 'POST') {
                    console.log('=== M-PESA CALLBACK RECEIVED ===');
                    console.log('Headers:', req.headers);
                    console.log('Body:', JSON.stringify(req.body, null, 2));
                    console.log('URL:', req.url);
                    console.log('Method:', req.method);
                    console.log('================================');
                    
                    await mpesaCallback(req, res);
                } else {
                    res.status(405).json({
                        success: false,
                        message: 'Method not allowed'
                    });
                }
            } catch (error) {
                console.error('M-Pesa Callback Error:', error);
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