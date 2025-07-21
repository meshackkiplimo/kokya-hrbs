import { createAuthService, deleteUserService, getAllUsersService, getUserByIdService, updateUserService } from '@/services/authService';
import db from '../../src/Drizzle/db';
import { UserTable } from '@/Drizzle/schema';
import { is } from 'drizzle-orm';




jest.mock('../../src/Drizzle/db', () => ({
    insert: jest.fn(),
    query: {
        UserTable: {
            findFirst: jest.fn(),
            findMany: jest.fn(),
        }
    },
    update: jest.fn(),
    delete: jest.fn(),
    transaction: jest.fn(),
}));
describe('User test service', () => {
    const mockUser = {
        user_id: 1,
        first_name: 'Test',
        last_name: 'User',
        email: 'testuser@gmail.com',
        password: 'Password123!', // Valid password that meets requirements
        role: 'user',
        is_verified: false,
        created_at: new Date(),
        updated_at: new Date(),
    };
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('createUser', () => {
        it('should create a user', async () => {
            // Mock the existing user check to return null (no existing user)
            (db.query.UserTable.findFirst as jest.Mock).mockResolvedValue(null);
            
            // Mock the transaction function
            (db.transaction as jest.Mock).mockImplementation(async (callback) => {
                const mockTx = {
                    insert: jest.fn().mockReturnValue({
                        values: jest.fn().mockReturnValue({
                            returning: jest.fn().mockResolvedValue([mockUser])
                        })
                    })
                };
                return await callback(mockTx);
            });

            const result = await createAuthService(mockUser);

            expect(result).toEqual(mockUser);
            expect(db.query.UserTable.findFirst).toHaveBeenCalled();
            expect(db.transaction).toHaveBeenCalled();
        });
    });
    describe('getAllUsers', () => {
        it('should get all users', async () => {
            (db.query.UserTable.findMany as jest.Mock).mockResolvedValue([mockUser]);

            const result = await getAllUsersService();

            expect(result).toEqual([mockUser]);
            expect(db.query.UserTable.findMany).toHaveBeenCalled();
        });
    });
    describe('getUserById', () => {
        it('should get a user by id', async () => {
            (db.query.UserTable.findFirst as jest.Mock).mockResolvedValue(mockUser);

            const result = await getUserByIdService(1);

            expect(result).toEqual(mockUser);
            expect(db.query.UserTable.findFirst).toHaveBeenCalled();
        });
    });
    describe('updateUser', () => {
        it('should update a user', async () => {
            (db.update as jest.Mock).mockReturnValue({
                set: jest.fn().mockReturnValue({
                    where: jest.fn().mockReturnValue({
                        returning: jest.fn().mockResolvedValue(mockUser)
                    })
                })
            });

            const result = await updateUserService(1, mockUser);

            expect(result).toEqual(mockUser);
            expect(db.update).toHaveBeenCalledWith(UserTable);
        });
    });
    describe('deleteUser', () => {
        it('should delete a user', async () => {
            (db.delete as jest.Mock).mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue(mockUser)
                })
            });

            const result = await deleteUserService(1);

            expect(result).toEqual(mockUser);
            expect(db.delete).toHaveBeenCalledWith(UserTable);
        });
    });
});
