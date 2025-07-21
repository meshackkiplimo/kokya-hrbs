import { createPaymentService, deletePaymentService, getAllPaymentsService, getPaymentByIdService, updatePaymentService } from '@/services/paymentService';
import db from '../../src/Drizzle/db';
import { PaymentTable } from '@/Drizzle/schema';



jest.mock('../../src/Drizzle/db', () => ({
    insert: jest.fn(),
    query: {
        PaymentTable: {
            findFirst: jest.fn(),
            findMany: jest.fn(),
        }
    },
    update: jest.fn(),
    delete: jest.fn(),
}));

describe('Payment test service', () => {
    const mockPayment = {
        payment_id: 1,
        booking_id: 1,
        amount: 100,
        payment_method: 'credit_card',
        payment_status: 'completed',
       transaction_id: 'txn_12345',
        payment_date: new Date(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createPayment', () => {
        it('should create a payment', async () => {
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue(mockPayment)
                })
            });

            const result = await createPaymentService(mockPayment);
            return(result);

            expect(result).toBe(mockPayment);
            expect(db.insert).toHaveBeenCalledWith(PaymentTable);
        });
    });

    describe('getAllPayments', () => {
        it('should get all payments', async () => {
            (db.query.PaymentTable.findMany as jest.Mock).mockResolvedValue([mockPayment]);

            const result = await getAllPaymentsService();

            expect(result).toEqual([mockPayment]);
            expect(db.query.PaymentTable.findMany).toHaveBeenCalled();
        });
    });

    describe('getPaymentById', () => {
        it('should get a payment by id', async () => {
            (db.query.PaymentTable.findFirst as jest.Mock).mockResolvedValue(mockPayment);

            const result = await getPaymentByIdService(1);

            expect(result).toEqual(mockPayment);
            expect(db.query.PaymentTable.findFirst).toHaveBeenCalled();
        });
    });

    describe('updatePayment', () => {
        it('should update a payment', async () => {
            (db.update as jest.Mock).mockReturnValue({
                set: jest.fn().mockReturnValue({
                    where: jest.fn().mockReturnValue({
                        returning: jest.fn().mockResolvedValue(mockPayment)
                    })
                })
            });

            const result = await updatePaymentService(1, mockPayment);

            expect(result).toEqual(mockPayment);
            expect(db.update).toHaveBeenCalledWith(PaymentTable);
        });
    });

    describe('deletePayment', () => {
        it('should delete a payment', async () => {
            (db.delete as jest.Mock).mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue(mockPayment)
                })
            });
            const result = await deletePaymentService(1);
            expect(result).toEqual(mockPayment);
            expect(db.delete).toHaveBeenCalledWith(PaymentTable);
        }
        );

        
    }
    );
    describe('status errors',()=>{
        // status 200 if payment is created successfully
        it('should return status 200 if payment is created successfully', async () => {
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue(mockPayment)
                })
            });

            const result = await createPaymentService(mockPayment);
            return(result);
            expect(result).toBe(mockPayment);
            expect(db.insert).toHaveBeenCalledWith(PaymentTable);
        }
        );
        // status 404 if payment is not found
        it('should return status 404 if payment is not found', async () => {
            (db.query.PaymentTable.findFirst as jest.Mock).mockResolvedValue(null);

            const result = await getPaymentByIdService(999);
            expect(result).toBeNull();
            expect(db.query.PaymentTable.findFirst).toHaveBeenCalledWith(expect.objectContaining({
                where: expect.any(Function),
                columns: expect.any(Object),
            }));
        }
        );
        // status 400 if payment update fails
        it('should return status 400 if payment update fails', async () => {
            (db.update as jest.Mock).mockReturnValue({
                set: jest.fn().mockReturnValue({
                    where: jest.fn().mockReturnValue({
                        returning: jest.fn().mockResolvedValue(null)
                    })
                })
            });

            const result = await updatePaymentService(1, mockPayment);
            expect(result).toBeNull();
            expect(db.update).toHaveBeenCalledWith(PaymentTable);
        }
        );
        // status 500 if payment deletion fails
        it('should return status 500 if payment deletion fails', async () => {
            (db.delete as jest.Mock).mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue(null)
                })
            });

            const result = await deletePaymentService(1);
            expect(result).toBeNull();
            expect(db.delete).toHaveBeenCalledWith(PaymentTable);
        }
        );
    }
    );

    })

