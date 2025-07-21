

import { initiateSTKPush, mpesaCallback, checkPaymentStatus, testMpesa } from '@/controllers/mpesaController';
import { Express } from 'express';
import { verifyToken } from '@/middleware/authMiddleware';

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
    app.route("/v1/mpesa/callback").post(
        async (req, res, next) => {
            try {
                await mpesaCallback(req, res);
            } catch (error) {
                next(error);
            }
        }
    );

    // Check payment status (requires authentication)
    app.route("/v1/mpesa/status/:checkoutRequestId").get(verifyToken,
        async (req, res, next) => {
            try {
                await checkPaymentStatus(req, res);
            } catch (error) {
                next(error);
            }
        }
    );

    // Test endpoint (no authentication for development)
    app.route("/v1/mpesa/test").get(
        async (req, res, next) => {
            try {
                await testMpesa(req, res);
            } catch (error) {
                next(error);
            }
        }
    );
}