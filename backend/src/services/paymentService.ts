import db from "@/Drizzle/db";
import { PaymentTable, TIPayment } from "@/Drizzle/schema"
import { sql } from "drizzle-orm";



export const createPaymentService = async (payment:TIPayment) => {
    const newpayment = await db.insert(PaymentTable).values(payment).returning();
    return newpayment[0];
}

/// get all payments without pagination with joins
export const getAllPaymentsWithoutPaginationService = async (userId?: number) => {
    const allPayments = await db.query.PaymentTable.findMany({
        where: userId ? (table, { eq }) => eq(table.user_id, userId) : undefined,
        columns: {
            payment_id: true,
            booking_id: true,
            user_id: true,
            amount: true,
            payment_method: true,
            payment_status: true,
            transaction_id: true,
            payment_date: true,
        },
        with: {
            user: {
                columns: {
                    user_id: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                }
            },
            booking: {
                columns: {
                    booking_id: true,
                    check_in_date: true,
                    check_out_date: true,
                    total_amount: true,
                    status: true,
                },
                with: {
                    hotel: {
                        columns: {
                            hotel_id: true,
                            name: true,
                            location: true,
                            category: true,
                            rating: true,
                        }
                    },
                    room: {
                        columns: {
                            room_id: true,
                            room_number: true,
                            room_type: true,
                            price_per_night: true,
                        }
                    }
                }
            }
        }
    });
    return allPayments;
}

export const getAllPaymentsService = async (userId?: number, page: number = 1, limit: number = 10) => {
    const offset = (page - 1) * limit;
    
    // Get total count with user filter if provided
    const totalCount = await db.query.PaymentTable.findMany({
        where: userId ? (table, { eq }) => eq(table.user_id, userId) : undefined,
    });
    const total = totalCount.length;

    const payments = await db.query.PaymentTable.findMany({
        where: userId ? (table, { eq }) => eq(table.user_id, userId) : undefined,
        columns:{
            payment_id: true,
            booking_id: true,
            user_id: true,
            amount: true,
            payment_method: true,
            payment_status: true,
            transaction_id: true,
            payment_date: true,
           
        },
        with: {
            user: {
                columns: {
                    user_id: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                }
            },
            booking: {
                columns: {
                    booking_id: true,
                    check_in_date: true,
                    check_out_date: true,
                    total_amount: true,
                    status: true,
                },
                with: {
                    hotel: {
                        columns: {
                            hotel_id: true,
                            name: true,
                            location: true,
                            category: true,
                            rating: true,
                        }
                    },
                    room: {
                        columns: {
                            room_id: true,
                            room_number: true,
                            room_type: true,
                            price_per_night: true,
                        }
                    }
                }
            }
        },
        limit: limit,
        offset: offset
    })
    return {
        payments: payments,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            itemsPerPage: limit,
            hasNextPage: page < Math.ceil(total / limit),
            hasPrevPage: page > 1
        }
    }
}

export const getPaymentByIdService = async (paymentId: number) => {
    const payment = await db.query.PaymentTable.findFirst({
        where: (table, { eq }) => eq(table.payment_id, paymentId),
        columns: {
            payment_id: true,
            booking_id: true,
            user_id: true,
            amount: true,
            payment_method: true,
            payment_status: true,
            transaction_id: true,
            payment_date: true,
        },
        with: {
            user: {
                columns: {
                    user_id: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                }
            },
            booking: {
                columns: {
                    booking_id: true,
                    check_in_date: true,
                    check_out_date: true,
                    total_amount: true,
                    status: true,
                    created_at: true,
                },
                with: {
                    hotel: {
                        columns: {
                            hotel_id: true,
                            name: true,
                            location: true,
                            address: true,
                            category: true,
                            rating: true,
                            img_url: true,
                            description: true,
                        }
                    },
                    room: {
                        columns: {
                            room_id: true,
                            room_number: true,
                            room_type: true,
                            price_per_night: true,
                            capacity: true,
                            amenities: true,
                            img_url: true,
                            description: true,
                        }
                    }
                }
            }
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

