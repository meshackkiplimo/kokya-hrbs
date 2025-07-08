
import { createPaymentService, deletePaymentService, getAllPaymentsService, getPaymentByIdService, updatePaymentService } from "@/services/paymentService";
import { Request, Response } from "express";



export const createPaymentController = async (req:Request,res:Response) => {
    try {

        const payment = req.body;
        const newPayment = await createPaymentService(payment);
        if (!newPayment) {
            return res.status(400).json({ error: "Payment creation failed" });
        }
        res.status(201).json({
            message: "Payment created successfully",
            payment: newPayment
        });
        
    } catch (error) {
        console.error("Error in createPaymentController:", error);
        res.status(500).json({ error: "Internal Server Error" });
        
    }
    
}

export const getAllPaymentsController = async (req:Request,res:Response) => {
    try {

        const payments = await getAllPaymentsService();
        if (!payments || payments.length === 0) {
            return res.status(404).json({ error: "No payments found" });
        }
        res.status(200).json({
            message: "Payments retrieved successfully",
            payments: payments
        });
        
    } catch (error) {
        console.error("Error in getAllPaymentsController:", error);
        res.status(500).json({ error: "Internal Server Error" });
        
    }
}

export const getPaymentByIdController = async (req:Request,res:Response) => {
    try {
        const paymentId = parseInt(req.params.id);
        const payment = await getPaymentByIdService(paymentId);
        if (!payment) {
            return res.status(404).json({ error: "Payment not found" });
        }
        res.status(200).json({
            message: "Payment found successfully",
            payment: payment
        });
        
    } catch (error) {
        console.error("Error in getPaymentByIdController:", error);
        res.status(500).json({ error: "Internal Server Error" });
        
    }
}
export const updatePaymentController = async (req:Request,res:Response) => {
    try {
        const paymentId = parseInt(req.params.id);
        const paymentUpdates = req.body;
        const updatedPayment = await updatePaymentService(paymentId, paymentUpdates);
        if (!updatedPayment) {
            return res.status(404).json({ error: "Payment not found" });
        }
        res.status(200).json({
            message: "Payment updated successfully",
            payment: updatedPayment
        });
        
    } catch (error) {
        console.error("Error in updatePaymentController:", error);
        res.status(500).json({ error: "Internal Server Error" });
        
    }
}
export const deletePaymentController = async (req: Request, res: Response) => {
    try {
        const paymentId = parseInt(req.params.id);
        const deletedPayment = await deletePaymentService(paymentId);
        if (!deletedPayment) {
            return res.status(404).json({ error: "Payment not found" });
        }
        res.status(200).json({
            message: "Payment deleted successfully",
            payment: deletedPayment
        });
        
    } catch (error) {
        console.error("Error in deletePaymentController:", error);
        res.status(500).json({ error: "Internal Server Error" });
        
    }
}