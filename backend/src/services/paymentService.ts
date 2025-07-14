import db from "@/Drizzle/db";
import { PaymentTable, TIPayment } from "@/Drizzle/schema"
import { sql } from "drizzle-orm";



export const createPaymentService = async (payment:TIPayment) => {
    const newpayment = await db.insert(PaymentTable).values(payment).returning();
    return newpayment[0];
}

export const getAllPaymentsService = async () => {
    const payments = await db.query.PaymentTable.findMany({
        columns:{
            payment_id: true,
            booking_id: true,
            amount: true,
            payment_method: true,
            payment_status: true,
            transaction_id: true,
            payment_date: true,
           
        }
    })
    return payments;
}

export const getPaymentByIdService = async (paymentId: number) => {
    const payment = await db.query.PaymentTable.findFirst({
        where: (table, { eq }) => eq(table.payment_id, paymentId),
        columns: {
            payment_id: true,
            booking_id: true,
            amount: true,
            payment_method: true,
            payment_status: true,
            transaction_id: true,
            payment_date: true,
        }
    });
    return payment;
}

export const updatePaymentService = async (paymentId: number, payment: TIPayment) => {
    const updatedPayment = await db.update(PaymentTable)
        .set(payment)
        .where(sql`${PaymentTable.payment_id} = ${paymentId}`)
        .returning();
    
    // Handle both real database (returns array) and mocked database (might return single object or null)
    if (!updatedPayment) return null;
    if (Array.isArray(updatedPayment)) {
        return updatedPayment.length > 0 ? updatedPayment[0] : null;
    }
    return updatedPayment; // For unit tests that return single object
}
export const deletePaymentService = async (paymentId: number) => {
    const deletedPayment = await db.delete(PaymentTable)
        .where(sql`${PaymentTable.payment_id} = ${paymentId}`)
        .returning();
    
    // Handle both real database (returns array) and mocked database (might return single object or null)
    if (!deletedPayment) return null;
    if (Array.isArray(deletedPayment)) {
        return deletedPayment.length > 0 ? deletedPayment[0] : null;
    }
    return deletedPayment; // For unit tests that return single object
}

