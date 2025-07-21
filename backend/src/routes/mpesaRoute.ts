

import { initiateSTKPush } from '@/controllers/mpesaController';
import { Express } from 'express';



export const mpesaRoute = (app: Express) => {
    app.route("/mpesa/stk-push").post(
        async (req, res, next) => {
            try {
                await initiateSTKPush(req, res);
            } catch (error) {
                next(error);
            }
        }
    );
}