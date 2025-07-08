import db from "@/Drizzle/db";
import { BookingTable, HotelTable, RoomTable, UserTable } from "@/Drizzle/schema";
import { app } from "@/index";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import request from "supertest";




let userId: number;
let hotelId: number;
let roomId: number;
let bookingId: number;


let testUser ={
    first_name: "Test",
    last_name: "User",
    email: "testUser@gmail.com",
    password: "testPassword123",
    role: "user",
    is_verified: false

}
let testHotel = {
    name: "Test Hotel",
    location: "Test Location",
    address: "123 Test St, Test City, TC 12345",
    contact_number: "1234567890",
    category: "Luxury",
    rating: 5
}
let testRoom = {
    
   
    room_number: "101",
    room_type: "Deluxe",
    price_per_night: 200,
    capacity: 2,
    amenities: "WiFi, TV, Air Conditioning",
    availability: "available"
}
let testBooking = {
    
    check_in_date: new Date("2023-10-01"),
    check_out_date: new Date("2023-10-05"),
    total_amount: 800,
    status: "confirmed"
}

beforeAll(async () => {
    const hashedPassword = await bcrypt.hashSync(testUser.password,10);
    const userResponse = await db.insert(UserTable).values({
        ...testUser,
        password: hashedPassword
    }).returning();
    userId = userResponse[0].user_id;

    // Insert hotel into the correct HotelTable (replace 'HotelTable' with your actual hotel table import)
    const hotelResponse = await db.insert(HotelTable).values({
        ...testHotel
    }).returning();
    hotelId = hotelResponse[0].hotel_id;

    const roomResponse = await db.insert(RoomTable).values({
        ...testRoom,
        hotel_id:hotelId,


    }).returning();
    roomId = roomResponse[0].room_id;
    const bookingResponse = await db.insert(BookingTable).values({
        ...testBooking,
        user_id: userId,
        hotel_id: hotelId,
        room_id: roomId
    }).returning();
    bookingId = bookingResponse[0].booking_id;
})

afterAll(async () => {
   await db.delete(BookingTable).where(eq(BookingTable.booking_id, bookingId));
   await db.delete(RoomTable).where(eq(RoomTable.room_id, roomId));
    await db.delete(HotelTable).where(eq(HotelTable.hotel_id, hotelId));
    await db.delete(UserTable).where(eq(UserTable.user_id, userId));
    
}
)

describe("Booking Integration Tests", () => {
    it("should create a booking", async () => {
        try {
            const newBooking = {
                user_id: userId,
                hotel_id: hotelId,
                room_id: roomId,
                check_in_date: new Date("2023-10-10"),
                check_out_date: new Date("2023-10-15"),
                total_amount: 1000,
                status: "confirmed"
            };
            const res =await request(app)
            .post("/bookings")
            .send(newBooking)
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("booking_id");
            
        } catch (error) {
            console.error("Error creating booking:", error);
            throw error;
            
        }
        
    })

})
        