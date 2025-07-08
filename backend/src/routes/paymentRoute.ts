import { createPaymentController, deletePaymentController, getAllPaymentsController, getPaymentByIdController, updatePaymentController } from "@/controllers/paymentController";
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
    app.route("/payments").post(
        async (req, res, next) => {
            try {
                await createPaymentController(req, res);
            } catch (error) {
                next(error);
            }
        }
    );
    app.route("/payments/:id").put(
        async (req, res, next) => {
            try {
                await updatePaymentController(req, res);
            } catch (error) {
                next(error);
            }
        }
    );
    app.route("/payments/:id").delete(
        async (req, res, next) => {
            try {
                await deletePaymentController(req, res);
            } catch (error) {
                next(error);
            }
        }
    );
}