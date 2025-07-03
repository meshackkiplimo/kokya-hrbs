import { getAllPaymentsController, getPaymentByIdController } from "@/controllers/paymentController";
import { Express } from "express";



export const paymentRoute = (app: Express) => {
    app.route("/payments").get(
        async (req, res, next) => {
            try {
                await getAllPaymentsController(req, res);
            } catch (error) {
                next(error);
            }
        }
    );

    app.route("/payments/:id").get(
        async (req, res, next) => {
            try {
                await getPaymentByIdController(req, res);
            } catch (error) {
                next(error);
            }
        }
    );
}