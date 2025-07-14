import db from "@/Drizzle/db";
import { HotelTable, RoomTable } from "@/Drizzle/schema";
import { app } from "@/index";
import { sql } from "drizzle-orm";
import  request  from "supertest";


let hotelId: number;
let roomId: number;

const testHotel ={
    name: "Test Hotel",
    location: "Test Location",
    address: "123 Test St, Test City, TC 12345",
    contact_number: "1234567890",
    category: "Luxury",
    rating: 5,
    img_url: "https://example.com/test-hotel.jpg",
    description: "A test hotel for integration testing."

}

const testRoom ={
    room_number: "101",
    room_type: "Deluxe",
    price_per_night: 200,
    capacity: 2,
    amenities: "WiFi, TV, Air Conditioning",
    img_url: "https://example.com/test-room.jpg",
    description: "A test room for integration testing.",
    availability: "available"

}

beforeAll(async () => {
    // Insert hotel into the correct HotelTable (replace 'HotelTable' with your actual hotel table import)
    const hotelResponse = await db.insert(HotelTable).values({
        ...testHotel,
    }).returning();
    hotelId = hotelResponse[0].hotel_id;
    const roomResponse = await db.insert(RoomTable).values({
        ...testRoom,
        hotel_id: hotelId,
    }).returning();
    roomId = roomResponse[0].room_id;
})
afterAll(async () => {
    // Clean up the test data
    await db.delete(RoomTable).where(sql`${RoomTable.room_id} = ${roomId}`);
    await db.delete(HotelTable).where(sql`${HotelTable.hotel_id} = ${hotelId}`);
})
describe("Room Integration Tests", () => {
    it("should create a new room", async () => {
        const response = await request(app)
            .post("/rooms")
            .send({
                ...testRoom,
                hotel_id: hotelId,
            })
            .expect(201);
      
    });
    it("should get all rooms", async () => {
        const response = await request(app)

            .get("/rooms")
            .expect(200);
        expect(response.body).toBeInstanceOf(Array);
    })
    it("should get a room by ID", async () => {
        const response = await request(app)
            .get(`/rooms/${roomId}`)
            .expect(200);
    });
    it("should update a room", async () => {
        const updatedRoom = {
            ...testRoom,
            room_type: "Suite",
        };
        const response = await request(app)
            .put(`/rooms/${roomId}`)
            .send(updatedRoom)
            .expect(200);
        expect(response.body).toHaveProperty("room_type", updatedRoom.room_type);
    });
    
    
})