
import { createBookingService, deleteBookingService, getAllBookingService, getBookingByIdService, updateBookingService } from "@/services/bookingService"
import db from "../../src/Drizzle/db"
import { BookingTable } from "@/Drizzle/schema"



jest.mock('../../src/Drizzle/db', () => ({
    insert: jest.fn(),
    query: {
        BookingTable: {
            findFirst: jest.fn(),
            findMany: jest.fn(),
        }
    },
    update: jest.fn(),
    delete: jest.fn(),


}))

describe('Booking test service', () => {
    const mockBooking = {
        booking_id: 1,
        user_id: 1,
        hotel_id: 1,
        room_id: 1,
        check_in_date: new Date(),
        check_out_date: new Date(),
        total_amount: 100,
        status: 'confirmed',
        created_at: new Date(),
        updated_at: new Date(),
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('createBooking', () => {
        it('should create a booking', async () => {
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue(mockBooking)
                })
            })

            const result = await createBookingService(mockBooking)

            expect(result).toEqual(mockBooking)
            expect(db.insert).toHaveBeenCalledWith(BookingTable)
        })
    })

    describe('getAllBookings', () => {
        it('should get all bookings', async () => {
            (db.query.BookingTable.findMany as jest.Mock).mockResolvedValue([mockBooking])

            const result = await getAllBookingService()

            expect(result).toEqual([mockBooking])
            expect(db.query.BookingTable.findMany).toHaveBeenCalled()
        })
    })

    describe('getBookingById', () => {
        it('should get a booking by id', async () => {
            (db.query.BookingTable.findFirst as jest.Mock).mockResolvedValue(mockBooking)

            const result = await getBookingByIdService(1)

            expect(result).toEqual(mockBooking)
            expect(db.query.BookingTable.findFirst).toHaveBeenCalledWith(expect.objectContaining({
                where: expect.any(Function),
                columns: expect.any(Object),
            }))
        })
    })
    describe('updateBooking', () => {
        it('should update a booking', async () => {
            (db.update as jest.Mock).mockReturnValue({
                set: jest.fn().mockReturnValue({
                    where: jest.fn().mockReturnValue({
                        returning: jest.fn().mockResolvedValue([mockBooking])
                    })
                })
            })

            const result = await updateBookingService(1, mockBooking)

            expect(result).toEqual([mockBooking])
            expect(db.update).toHaveBeenCalledWith(BookingTable)
        })
    })
    describe('deleteBooking', () => {
        it('should delete a booking', async () => {
            (db.delete as jest.Mock).mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue([mockBooking])
                })
            })

            const result = await deleteBookingService(1)

            expect(result).toEqual([mockBooking])
            expect(db.delete).toHaveBeenCalledWith(BookingTable)
        })
    })
    describe('status erros',()=>{
        // 200 if booking is created successfully
        it('should return status 200 if booking is created successfully', async () => {
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue(mockBooking)
                })
            })

            const result = await createBookingService(mockBooking)

            expect(result).toEqual(mockBooking)
            expect(db.insert).toHaveBeenCalledWith(BookingTable)
        })
        // 404 if booking is not found
        it('should return status 404 if booking is not found', async () => {
            (db.query.BookingTable.findFirst as jest.Mock).mockResolvedValue(null)

            const result = await getBookingByIdService(999)

            expect(result).toBeNull()
            expect(db.query.BookingTable.findFirst).toHaveBeenCalledWith(expect.objectContaining({
                where: expect.any(Function),
                columns: expect.any(Object),
            }))
        })
        // 200 if booking is updated successfully
        it('should return status 200 if booking is updated successfully', async () => {
            (db.update as jest.Mock).mockReturnValue({
                set: jest.fn().mockReturnValue({
                    where: jest.fn().mockReturnValue({
                        returning: jest.fn().mockResolvedValue([mockBooking])
                    })
                })
            })

            const result = await updateBookingService(1, mockBooking)

            expect(result).toEqual([mockBooking])
            expect(db.update).toHaveBeenCalledWith(BookingTable)
        })
        // 200 if booking is deleted successfully
        it('should return status 200 if booking is deleted successfully', async () => {
            (db.delete as jest.Mock).mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue([mockBooking])
                })
            })

            const result = await deleteBookingService(1)

            expect(result).toEqual([mockBooking])
            expect(db.delete).toHaveBeenCalledWith(BookingTable)
        })
        // 404 if booking is not deleted
        it('should return status 404 if booking is not deleted', async () => {
            (db.delete as jest.Mock).mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue([])
                })
            })

            const result = await deleteBookingService(999)

            expect(result).toEqual([])
            expect(db.delete).toHaveBeenCalledWith(BookingTable)
        })
        // 500 if there is an error in booking service
        it('should return status 500 if there is an error in booking service', async () => {
            (db.insert as jest.Mock).mockImplementation(() => {
                throw new Error('Database error')
            })

            await expect(createBookingService(mockBooking)).rejects.toThrow('Database error')
            expect(db.insert).toHaveBeenCalledWith(BookingTable)
        })
        // 
        

    })

})
