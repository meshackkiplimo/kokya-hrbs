import { createNewComplainsService, deleteComplainsService, getAllComplainsService, getComplainsByIdService, updateComplainsService } from '@/services/customerComplainsService';
import db from '../../src/Drizzle/db'
import { CustomerSupportTable } from '@/Drizzle/schema';





jest.mock('../../src/Drizzle/db', () => ({
    insert: jest.fn(),
    query: {
        CustomerSupportTable: {
            findFirst: jest.fn(),
            findMany: jest.fn(),
        }
    },
    update: jest.fn(),
    delete: jest.fn(),



}));

describe('Customer Complains Service', () => {
    const mockComplaint = {
        ticket_id: 1,
        user_id: 1,
        subject: 'Test Subject',
        description: 'Test Description',
        status: 'open',
        created_at: new Date(),
        updated_at: new Date(),
       
       
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createComplaint', () => {
        it('should create a complaint', async () => {
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue(mockComplaint)
                })
            });

            const result = await createNewComplainsService(mockComplaint);

            expect(result).toEqual(mockComplaint);
            expect(db.insert).toHaveBeenCalledWith(CustomerSupportTable);
        });
    });

    describe('getAllComplaints', () => {
        it('should get all complaints', async () => {
            (db.query.CustomerSupportTable.findMany as jest.Mock).mockResolvedValue([mockComplaint]);

            const result = await getAllComplainsService();

            expect(result).toEqual([mockComplaint]);
            expect(db.query.CustomerSupportTable.findMany).toHaveBeenCalled();
        });
    });
    describe('getComplaintById', () => {
        it('should get a complaint by id', async () => {
            (db.query.CustomerSupportTable.findFirst as jest.Mock).mockResolvedValue(mockComplaint);

            const result = await getComplainsByIdService(1);

            expect(result).toEqual(mockComplaint);
            expect(db.query.CustomerSupportTable.findFirst).toHaveBeenCalled();
        });
    });
    describe('updateComplaint', () => {
        it('should update a complaint', async () => {
            const updates = { status: 'resolved' };
            (db.update as jest.Mock).mockReturnValue({
                set: jest.fn().mockReturnValue({
                    where: jest.fn().mockReturnValue({
                        returning: jest.fn().mockResolvedValue({ ...mockComplaint, ...updates })
                    })
                })
            });

            const result = await updateComplainsService(1, updates);

            expect(result).toEqual({ ...mockComplaint, ...updates });
            expect(db.update).toHaveBeenCalledWith(CustomerSupportTable);
        });
    });

    describe('deleteComplaint', () => {
        it('should delete a complaint', async () => {
            (db.delete as jest.Mock).mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue([mockComplaint])
                })
            });

            const result = await deleteComplainsService(1);
              

            expect(result).toEqual([mockComplaint]);
            expect(db.delete).toHaveBeenCalledWith(CustomerSupportTable);
        });
    });
    describe('status errors', () => {

    
       
    
    // 200 if complaint is created successfully
    it('should return status 200 if complaint is created successfully', async () => {
        (db.insert as jest.Mock).mockReturnValue({
            values: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValue(mockComplaint)
            })
        });

        const result = await createNewComplainsService(mockComplaint);

        expect(result).toEqual(mockComplaint);
        expect(db.insert).toHaveBeenCalledWith(CustomerSupportTable);
    })
    // 404 if complaint is not found
    it('should return status 404 if complaint is not found', async () => {
        (db.query.CustomerSupportTable.findFirst as jest.Mock).mockResolvedValue(null);

        const result = await getComplainsByIdService(999);

        expect(result).toBeNull();
        expect(db.query.CustomerSupportTable.findFirst).toHaveBeenCalledWith(expect.objectContaining({
            where: expect.any(Function),
            columns: expect.any(Object),
        }));
    })

});
})

