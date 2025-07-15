import { createPaymentService, deletePaymentService, getAllPaymentsService, getPaymentByIdService, updatePaymentService } from "@/services/paymentService";
import { Request, Response } from "express";

export const createPaymentController = async (req: Request, res: Response) => {
    try {
        const payment = req.body;
        
        // Basic validation
        if (!payment.booking_id || !payment.amount || !payment.payment_method) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        
        if (typeof payment.amount !== 'number' || payment.amount <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        const newPayment = await createPaymentService(payment);
        if (!newPayment) {
            return res.status(400).json({ message: "Payment creation failed" });
        }
        
        // Return payment data directly (as expected by tests)
        res.status(201).json(newPayment);
        
    } catch (error) {
        console.error("Error in createPaymentController:", error);
        res.status(400).json({ message: "Payment creation failed" });
    }
};

export const getAllPaymentsController = async (req: Request, res: Response) => {
    try {
        const payments = await getAllPaymentsService();
        // Return wrapped in data property (as expected by tests)
        res.status(200).json({ data: payments || [] });
        
    } catch (error) {
        console.error("Error in getAllPaymentsController:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getPaymentByIdController = async (req: Request, res: Response) => {
    try {
        const paymentId = parseInt(req.params.id);
        if (isNaN(paymentId)) {
            return res.status(400).json({ message: "Invalid payment ID" });
        }
        
        const payment = await getPaymentByIdService(paymentId);
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }
        
        // Return payment data directly (as expected by tests)
        res.status(200).json(payment);
        
    } catch (error) {
        console.error("Error in getPaymentByIdController:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updatePaymentController = async (req: Request, res: Response) => {
    try {
        const paymentId = parseInt(req.params.id);
        if (isNaN(paymentId)) {
            return res.status(400).json({ message: "Invalid payment ID" });
        }
        
        const paymentUpdates = req.body;
        const updatedPayment = await updatePaymentService(paymentId, paymentUpdates);
        if (!updatedPayment) {
            return res.status(404).json({ message: "Payment not found" });
        }
        
        // Return payment data directly (as expected by tests)
        res.status(200).json(updatedPayment);
        
    } catch (error) {
        console.error("Error in updatePaymentController:", error);
        res.status(400).json({ message: "Payment update failed" });
    }
};

export const deletePaymentController = async (req: Request, res: Response) => {
    try {
        const paymentId = parseInt(req.params.id);
        if (isNaN(paymentId)) {
            return res.status(400).json({ message: "Invalid payment ID" });
        }
        
        const deletedPayment = await deletePaymentService(paymentId);
        if (!deletedPayment) {
            return res.status(404).json({ message: "Payment not found" });
        }
        
        res.status(200).json({ message: "Payment deleted successfully" });
        
    } catch (error) {
        console.error("Error in deletePaymentController:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};