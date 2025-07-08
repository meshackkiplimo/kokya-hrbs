import { createRoomService, deleteRoomService, getAllRoomsService, getRoomByIdService, updateRoomService } from '@/services/roomService';
import db from '../../src/Drizzle/db'
import { RoomTable } from '@/Drizzle/schema';



jest.mock('../../src/Drizzle/db', () => ({
    insert: jest.fn(),
    query: {
        RoomTable: {
            findFirst: jest.fn(),
            findMany: jest.fn(),
        }
    },
    update: jest.fn(),
    delete: jest.fn(),
}));
describe('Room Service', () => {
    const mockRoom = {
        room_id: 1,
        hotel_id: 1,
        room_type: 'Deluxe',
        room_number: '101',
        price_per_night: 100,
        amenities: 'WiFi, TV, AC',
        capacity: 2,

        availability: 'available',
        created_at: new Date(),
        updated_at: new Date(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createRoom', () => {
        it('should create a room', async () => {
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue(mockRoom)
                })
            });

            const result = await createRoomService(mockRoom);

            expect(result).toEqual(mockRoom);
            expect(db.insert).toHaveBeenCalledWith(RoomTable);
        });
    });
    describe('getAllRooms', () => {
        it('should get all rooms', async () => {
            (db.query.RoomTable.findMany as jest.Mock).mockResolvedValue([mockRoom]);

            const result = await getAllRoomsService();

            expect(result).toEqual([mockRoom]);
            expect(db.query.RoomTable.findMany).toHaveBeenCalled();
        });
    });
    describe('getRoomById', () => {
        it('should get a room by id', async () => {
            (db.query.RoomTable.findFirst as jest.Mock).mockResolvedValue(mockRoom);

            const result = await getRoomByIdService(1);

            expect(result).toEqual(mockRoom);
            expect(db.query.RoomTable.findFirst).toHaveBeenCalled();
        });
    });
    describe('updateRoom', () => {
        it('should update a room', async () => {
            (db.update as jest.Mock).mockReturnValue({
                set: jest.fn().mockReturnValue({
                    where: jest.fn().mockReturnValue({
                        returning: jest.fn().mockResolvedValue(mockRoom)
                    })
                })
            });

            const result = await updateRoomService(1, mockRoom);

            expect(result).toEqual(mockRoom);
            expect(db.update).toHaveBeenCalledWith(RoomTable);
        });
    });
    describe('deleteRoom', () => {
        it('should delete a room', async () => {
            (db.delete as jest.Mock).mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue(mockRoom)
                })
            });

            const result = await deleteRoomService(1);

            expect(result).toEqual(mockRoom);
            expect(db.delete).toHaveBeenCalledWith(RoomTable);
        });
    });
    
        it('should throw an error if room creation fails', async () => {
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockRejectedValue(new Error('Database error'))
                })
            });

            await expect(createRoomService(mockRoom)).rejects.toThrow('Database error');
        });
        // 200 if room is created successfully
        it('should return status 200 if room is created successfully', async () => {
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue(mockRoom)
                })
            });

            const result = await createRoomService(mockRoom);

            expect(result).toEqual(mockRoom);
            expect(db.insert).toHaveBeenCalledWith(RoomTable);
        }
        );
        // 404 if room is not found
        it('should return status 404 if room is not found', async () => {
            (db.query.RoomTable.findFirst as jest.Mock).mockResolvedValue(null);

            const result = await getRoomByIdService(999);

            expect(result).toBeNull();
            expect(db.query.RoomTable.findFirst).toHaveBeenCalledWith(expect.objectContaining({
                where: expect.any(Function),
                columns: expect.any(Object),
            }));
        });
        // 200 if room is updated successfully
        it('should return status 200 if room is updated successfully', async () => {
            (db.update as jest.Mock).mockReturnValue({
                set: jest.fn().mockReturnValue({
                    where: jest.fn().mockReturnValue({
                        returning: jest.fn().mockResolvedValue([mockRoom])
                    })
                })
            });

            const result = await updateRoomService(1, mockRoom);

            expect(result).toEqual([mockRoom]);
            expect(db.update).toHaveBeenCalledWith(RoomTable);
        })
        // 200 if room is deleted successfully
        it('should return status 200 if room is deleted successfully', async () => {
            (db.delete as jest.Mock).mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue([mockRoom])
                })
            });

            const result = await deleteRoomService(1);

            expect(result).toEqual([mockRoom]);
            expect(db.delete).toHaveBeenCalledWith(RoomTable);
        })
        // 404 if room is not deleted
       
        // 200 if room is updated successfully
        it('should return status 200 if room is updated successfully', async () => {
            (db.update as jest.Mock).mockReturnValue({
                set: jest.fn().mockReturnValue({
                    where: jest.fn().mockReturnValue({
                        returning: jest.fn().mockResolvedValue([mockRoom])
                    })
                })
            })

            const result = await updateRoomService(1, mockRoom)

            expect(result).toEqual([mockRoom])
            expect(db.update).toHaveBeenCalledWith(RoomTable)
        })
        // 200 if room is deleted successfully
        it('should return status 200 if room is deleted successfully', async () => {
            (db.delete as jest.Mock).mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue([mockRoom])
                })
            })

            const result = await deleteRoomService(1)

            expect(result).toEqual([mockRoom])
            expect(db.delete).toHaveBeenCalledWith(RoomTable)
        })
        // 404 if room is not deleted
       
        // 500 if room creation fails
        it('should return status 500 if room creation fails', async () => {
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockRejectedValue(new Error('Database error'))
                })
            });

            await expect(createRoomService(mockRoom)).rejects.toThrow('Database error');
        }   )
    })
