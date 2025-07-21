import db from "@/Drizzle/db";
import { HotelTable, RoomTable } from "@/Drizzle/schema";
import { app } from "@/index";
import { eq } from "drizzle-orm";
import request from "supertest";

let hotelId: number;
let roomId: number;

const testHotel = {
    name: "Test Hotel",
    location: "Test Location",
    address: "123 Test St, Test City, TC 12345",
    contact_number: "1234567890",
    category: "Luxury",
    rating: 5,
    img_url: "https://example.com/test-hotel.jpg",
    description: "A test hotel for integration testing."
};

const testRoom = {
    room_number: "101",
    room_type: "Deluxe",
    price_per_night: 200,
    capacity: 2,
    amenities: "WiFi, TV, Air Conditioning",
    img_url: "https://example.com/test-room.jpg",
    description: "A test room for integration testing.",
    availability: "available"
};

beforeAll(async () => {
    // Create test hotel
    const hotelResponse = await db.insert(HotelTable).values({
        ...testHotel,
    }).returning();
    hotelId = hotelResponse[0].hotel_id;
    
    // Create test room
    const roomResponse = await db.insert(RoomTable).values({
        ...testRoom,
        hotel_id: hotelId,
    }).returning();
    roomId = roomResponse[0].room_id;
});

afterAll(async () => {
    // Clean up test data
    await db.delete(RoomTable).where(eq(RoomTable.room_id, roomId));
    await db.delete(HotelTable).where(eq(HotelTable.hotel_id, hotelId));
});

describe("Room Integration Tests", () => {
    it("should create a new room", async () => {
        const newRoom = {
            ...testRoom,
            hotel_id: hotelId,
            room_number: "102"
        };

        const response = await request(app)
            .post("/rooms")
            .send(newRoom)
            .expect(201);

        expect(response.body).toHaveProperty("room_id");
        expect(response.body).toHaveProperty("hotel_id", hotelId);
        expect(response.body).toHaveProperty("room_number", newRoom.room_number);
        expect(response.body).toHaveProperty("room_type", newRoom.room_type);
        expect(response.body).toHaveProperty("price_per_night", newRoom.price_per_night);
        expect(response.body).toHaveProperty("capacity", newRoom.capacity);
        expect(response.body).toHaveProperty("amenities", newRoom.amenities);
        expect(response.body).toHaveProperty("availability", newRoom.availability);

        // Clean up the created room
        await db.delete(RoomTable).where(eq(RoomTable.room_id, response.body.room_id));
    });

    it("should get all rooms", async () => {
        const response = await request(app)
            .get("/rooms")
            .expect(200);

        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toHaveProperty("room_id");
        expect(response.body[0]).toHaveProperty("hotel_id");
        expect(response.body[0]).toHaveProperty("room_number");
        expect(response.body[0]).toHaveProperty("room_type");
        expect(response.body[0]).toHaveProperty("price_per_night");
        expect(response.body[0]).toHaveProperty("capacity");
        expect(response.body[0]).toHaveProperty("amenities");
        expect(response.body[0]).toHaveProperty("availability");
    });

    it("should get a room by ID", async () => {
        const response = await request(app)
            .get(`/rooms/${roomId}`)
            .expect(200);

        expect(response.body).toHaveProperty("room_id", roomId);
        expect(response.body).toHaveProperty("hotel_id", hotelId);
        expect(response.body).toHaveProperty("room_number", testRoom.room_number);
        expect(response.body).toHaveProperty("room_type", testRoom.room_type);
        expect(response.body).toHaveProperty("price_per_night", testRoom.price_per_night);
        expect(response.body).toHaveProperty("capacity", testRoom.capacity);
        expect(response.body).toHaveProperty("amenities", testRoom.amenities);
        expect(response.body).toHaveProperty("availability", testRoom.availability);
    });

    it("should update a room", async () => {
        const updatedRoom = {
            ...testRoom,
            room_type: "Suite",
            price_per_night: 350,
            capacity: 4
        };

        const response = await request(app)
            .put(`/rooms/${roomId}`)
            .send(updatedRoom)
            .expect(200);

        expect(response.body).toHaveProperty("room_id", roomId);
        expect(response.body).toHaveProperty("room_type", updatedRoom.room_type);
        expect(response.body).toHaveProperty("price_per_night", updatedRoom.price_per_night);
        expect(response.body).toHaveProperty("capacity", updatedRoom.capacity);
    });

    it("should return 404 for non-existent room", async () => {
        const response = await request(app)
            .get("/rooms/999999")
            .expect(404);

        expect(response.body).toHaveProperty("message");
    });

    it("should return 400 for invalid room data", async () => {
        const invalidRoom = {
            hotel_id: "invalid",
            room_number: "",
            price_per_night: "not-a-number",
        };

        const response = await request(app)
            .post("/rooms")
            .send(invalidRoom)
            .expect(400);

        expect(response.body).toHaveProperty("message");
    });

    it("should return 400 for missing required fields", async () => {
        const incompleteRoom = {
            hotel_id: hotelId,
            room_number: "103"
            // Missing other required fields
        };

        const response = await request(app)
            .post("/rooms")
            .send(incompleteRoom)
            .expect(400);

        expect(response.body).toHaveProperty("message");
    });

    it("should delete a room", async () => {
        // Create a room specifically for deletion
        const roomToDelete = await db.insert(RoomTable).values({
            ...testRoom,
            hotel_id: hotelId,
            room_number: "999"
        }).returning();

        const response = await request(app)
            .delete(`/rooms/${roomToDelete[0].room_id}`)
            .expect(200);

        expect(response.body).toHaveProperty("message", "Room deleted successfully");

        // Verify room is deleted
        const checkResponse = await request(app)
            .get(`/rooms/${roomToDelete[0].room_id}`)
            .expect(404);
        expect(checkResponse.body).toHaveProperty("message");
    });

    it("should return 404 when deleting non-existent room", async () => {
        const response = await request(app)
            .delete("/rooms/999999")
            .expect(404);

        expect(response.body).toHaveProperty("message");
    });

    it("should handle room availability updates", async () => {
        const availabilityUpdate = {
            availability: "occupied"
        };

        const response = await request(app)
            .put(`/rooms/${roomId}`)
            .send(availabilityUpdate)
            .expect(200);

        expect(response.body).toHaveProperty("room_id", roomId);
        expect(response.body).toHaveProperty("availability", availabilityUpdate.availability);

        // Reset availability for other tests
        await request(app)
            .put(`/rooms/${roomId}`)
            .send({ availability: "available" })
            .expect(200);
    });
});