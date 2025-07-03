import db from "@/Drizzle/db";
import { PaymentTable, TIPayment } from "@/Drizzle/schema"



export const createPaymentService = async (payment:TIPayment) => {
    const newpayment = await db.insert(PaymentTable).values(payment)
    return newpayment;

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

