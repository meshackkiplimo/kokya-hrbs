import db from "@/Drizzle/db";
import { HotelTable, UserTable } from "@/Drizzle/schema";
import bcrypt from "bcryptjs";
import { app } from "@/index";
import request from "supertest";
import { eq } from "drizzle-orm";


let userId: number;
let hotelId: number;



let testHotel ={
    name: "Test Hotel",
    location: "Test Location",
    address: "123 Test St, Test City, TC 12345",
    contact_number: "1234567890",
    category: "Luxury",
    rating: 5,
    img_url: "https://example.com/test-hotel.jpg",
    description: "A test hotel for integration testing."
}


beforeAll(async () => {
    
    // Insert hotel into the correct HotelTable (replace 'HotelTable' with your actual hotel table import)
    const hotelResponse = await db.insert(HotelTable).values({
        ...testHotel,
    }).returning();
    hotelId = hotelResponse[0].hotel_id;

})
afterAll(async () => {
    // Clean up the test data
    await db.delete(HotelTable).where(eq (HotelTable.hotel_id, hotelId));
})
describe("Hotel Integration Tests", () => {
    it("should create a new hotel", async () => {
        const response = await request(app)
            .post("/hotels")
            .send({
                ...testHotel,
               
            })
            .expect(201);

});
it("should get all hotels", async () => {
    const response = await request(app)
        .get("/hotels")
        .expect(200);
    expect(response.body).toBeInstanceOf(Array);
})
it ("should get a hotel by ID", async () => {
    const response = await request(app)
        .get(`/hotels/${hotelId}`)
        .expect(200);
    
})
it("should update a hotel", async () => {
    const updatedHotel = {
        ...testHotel,
        name: "Updated Test Hotel",
    };
    const response = await request(app)
        .put(`/hotels/${hotelId}`)
        .send(updatedHotel)
        .expect(200);
    expect(response.body).toHaveProperty("name", updatedHotel.name);
});

it("should delete a hotel", async () => {
    const response = await request(app)
        .delete(`/hotels/${hotelId}`)
        .expect(200);
    expect(response.body).toHaveProperty("message", "Hotel deleted successfully");
    const checkResponse = await request(app)
        .get(`/hotels/${hotelId}`)
        .expect(404);
    expect(checkResponse.body).toHaveProperty("message", "Hotel not found");
});
})
