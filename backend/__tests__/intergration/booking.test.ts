import db from "@/Drizzle/db";
import { BookingTable, HotelTable, RoomTable, UserTable } from "@/Drizzle/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";



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
        const response = await db.insert(BookingTable).values({
            user_id: userId,
            hotel_id: hotelId,
            room_id: roomId,
            check_in_date: new Date("2023-10-01"),
            check_out_date: new Date("2023-10-05"),
            total_amount: 800,
            status: "confirmed"
        }).returning();
        
        expect(response.length).toBe(1);
        expect(response[0].user_id).toBe(userId);
        expect(response[0].hotel_id).toBe(hotelId);
        expect(response[0].room_id).toBe(roomId);
    });

    it("should fetch all bookings for a user", async () => {
        const bookings = await db.query.BookingTable.findMany({
            where: eq(BookingTable.user_id, userId)
        });
        
        expect(bookings.length).toBeGreaterThan(0);
        expect(bookings[0].user_id).toBe(userId);
    });

    it("should update a booking status", async () => {
        const updatedBooking = await db.update(BookingTable)
            .set({ status: "completed" })
            .where(eq(BookingTable.booking_id, bookingId))
            .returning();
        
        expect(updatedBooking.length).toBe(1);
        expect(updatedBooking[0].status).toBe("completed");
    });

    it("should delete a booking", async () => {
        const deletedBooking = await db.delete(BookingTable)
            .where(eq(BookingTable.booking_id, bookingId))
            .returning();
        
        expect(deletedBooking.length).toBe(1);
        expect(deletedBooking[0].booking_id).toBe(bookingId);
    });

})