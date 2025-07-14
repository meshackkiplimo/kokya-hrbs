import db from "@/Drizzle/db";
import { HotelTable } from "@/Drizzle/schema";
import { app } from "@/index";
import request from "supertest";
import { eq } from "drizzle-orm";

let hotelId: number;

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

beforeAll(async () => {
    // Create test hotel
    const hotelResponse = await db.insert(HotelTable).values({
        ...testHotel,
    }).returning();
    hotelId = hotelResponse[0].hotel_id;
});

afterAll(async () => {
    // Clean up test data
    await db.delete(HotelTable).where(eq(HotelTable.hotel_id, hotelId));
});
describe("Hotel Integration Tests", () => {
    it("should create a new hotel", async () => {
        const newHotel = {
            ...testHotel,
            name: "New Test Hotel",
            contact_number: "0987654321"
        };

        const response = await request(app)
            .post("/hotels")
            .send(newHotel)
            .expect(201);

        expect(response.body).toHaveProperty("hotel_id");
        expect(response.body).toHaveProperty("name", newHotel.name);
        expect(response.body).toHaveProperty("location", newHotel.location);
        expect(response.body).toHaveProperty("address", newHotel.address);
        expect(response.body).toHaveProperty("contact_number", newHotel.contact_number);
        expect(response.body).toHaveProperty("category", newHotel.category);
        expect(response.body).toHaveProperty("rating", newHotel.rating);

        // Clean up the created hotel
        await db.delete(HotelTable).where(eq(HotelTable.hotel_id, response.body.hotel_id));
    });

    it("should get all hotels", async () => {
        const response = await request(app)
            .get("/hotels")
            .expect(200);

        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toHaveProperty("hotel_id");
        expect(response.body[0]).toHaveProperty("name");
        expect(response.body[0]).toHaveProperty("location");
        expect(response.body[0]).toHaveProperty("address");
        expect(response.body[0]).toHaveProperty("contact_number");
        expect(response.body[0]).toHaveProperty("category");
        expect(response.body[0]).toHaveProperty("rating");
    });

    it("should get a hotel by ID", async () => {
        const response = await request(app)
            .get(`/hotels/${hotelId}`)
            .expect(200);

        expect(response.body).toHaveProperty("hotel_id", hotelId);
        expect(response.body).toHaveProperty("name", testHotel.name);
        expect(response.body).toHaveProperty("location", testHotel.location);
        expect(response.body).toHaveProperty("address", testHotel.address);
        expect(response.body).toHaveProperty("contact_number", testHotel.contact_number);
        expect(response.body).toHaveProperty("category", testHotel.category);
        expect(response.body).toHaveProperty("rating", testHotel.rating);
    });

    it("should update a hotel", async () => {
        const updatedHotel = {
            ...testHotel,
            name: "Updated Test Hotel",
            rating: 4
        };

        const response = await request(app)
            .put(`/hotels/${hotelId}`)
            .send(updatedHotel)
            .expect(200);

        expect(response.body).toHaveProperty("hotel_id", hotelId);
        expect(response.body).toHaveProperty("name", updatedHotel.name);
        expect(response.body).toHaveProperty("rating", updatedHotel.rating);
    });

    it("should return 404 for non-existent hotel", async () => {
        const response = await request(app)
            .get("/hotels/999999")
            .expect(404);

        expect(response.body).toHaveProperty("message", "Hotel not found");
    });

    it("should return 400 for invalid hotel data", async () => {
        const invalidHotel = {
            name: "",
            location: "",
            rating: "not-a-number"
        };

        const response = await request(app)
            .post("/hotels")
            .send(invalidHotel)
            .expect(400);

        expect(response.body).toHaveProperty("message");
    });

    it("should return 400 for missing required fields", async () => {
        const incompleteHotel = {
            name: "Incomplete Hotel"
            // Missing other required fields
        };

        const response = await request(app)
            .post("/hotels")
            .send(incompleteHotel)
            .expect(400);

        expect(response.body).toHaveProperty("message");
    });

    it("should delete a hotel", async () => {
        // Create a hotel specifically for deletion
        const hotelToDelete = await db.insert(HotelTable).values({
            ...testHotel,
            name: "Hotel to Delete"
        }).returning();

        const response = await request(app)
            .delete(`/hotels/${hotelToDelete[0].hotel_id}`)
            .expect(200);

        expect(response.body).toHaveProperty("message", "Hotel deleted successfully");

        // Verify hotel is deleted
        const checkResponse = await request(app)
            .get(`/hotels/${hotelToDelete[0].hotel_id}`)
            .expect(404);
        expect(checkResponse.body).toHaveProperty("message", "Hotel not found");
    });

    it("should return 404 when deleting non-existent hotel", async () => {
        const response = await request(app)
            .delete("/hotels/999999")
            .expect(404);

        expect(response.body).toHaveProperty("message", "Hotel not found");
    });
});
