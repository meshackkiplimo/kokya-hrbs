import { HotelTable } from '@/Drizzle/schema'
import db from '../../src/Drizzle/db'
import { createHotelService, deleteHotelService, getAllHotelService, getHotelByIdService, updateHotelService } from '@/services/hotelService'


let hotel_id: number;



jest.mock('../../src/Drizzle/db', () => ({
    insert : jest.fn(),
    query:{
        HotelTable:{
            findFirst: jest.fn(),
            findMany: jest.fn(),
          
        }
    },
    update: jest.fn(),
    delete: jest.fn(),


}))

describe('Hotel test service',()=>{
    const mockHotel ={
        hotel_id:1,
        name: 'Test Hotel',
        location: 'Test Location',
        address: '123 Test St',
        contact_number: '1234567890',
        category: 'Test Category',
        rating: 5,
        img_url: 'http://test.jpg',
        description: 'Test description',
        created_at: new Date(),
        updated_at: new Date(),
    }
    beforeEach(() => {
        jest.clearAllMocks()
    }
    )
    describe('createHotel',()=>{
        it('should create a hotel', async () => {
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue([mockHotel])
                })
            })

            const result = await createHotelService(mockHotel)

            expect(result).toEqual(mockHotel)
            expect(db.insert).toHaveBeenCalledWith(HotelTable)
          
        })
    })

  
    describe('getHotelById',()=>{
        it('should get a hotel by id', async () => {
            (db.query.HotelTable.findFirst as jest.Mock).mockResolvedValue(mockHotel)

            const result = await getHotelByIdService(1)

            expect(result).toEqual(mockHotel)
            expect(db.query.HotelTable.findFirst).toHaveBeenCalled()
        })
    })
    describe('getAllHotels',()=>{
        it('should get all hotels', async () => {
            (db.query.HotelTable.findMany as jest.Mock).mockResolvedValue([mockHotel])

            const result = await getAllHotelService()

            expect(result).toEqual([mockHotel])
            expect(db.query.HotelTable.findMany).toHaveBeenCalled()
        })
    })
    describe('updateHotel',()=>{
          const updatedHotel = {
                ...mockHotel,
                name: 'Updated Hotel',
                location: 'Updated Location',
                address: '456 Updated St',
                contact_number: '0987654321',
                category: 'Updated Category',
                rating: 4,
                created_at: new Date(),
                updated_at: new Date(),
            }
        it('should update a hotel', async () => {
            (db.update as jest.Mock).mockReturnValue({
                set: jest.fn().mockReturnValue({
                    where: jest.fn().mockReturnValue({
                        returning: jest.fn().mockResolvedValue([updatedHotel])
                    })
                })
            })

            const result = await updateHotelService(1, updatedHotel)

            expect(result).toEqual(updatedHotel)
            expect(db.update).toHaveBeenCalledWith(HotelTable)
        })
    })
    describe('deleteHotel',()=>{
        it('should delete a hotel', async () => {
            (db.delete as jest.Mock).mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue([mockHotel])
                })
            })

            const result = await deleteHotelService(1)

            expect(result).toEqual(mockHotel)
            expect(db.delete).toHaveBeenCalledWith(HotelTable)
        })
    })

})
