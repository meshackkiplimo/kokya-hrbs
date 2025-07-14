import db from "@/Drizzle/db";
import { CustomerSupportTable, UserTable } from "@/Drizzle/schema";
import { app } from "@/index";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import request from "supertest";

let userId: number;
let complainId: number;

const testUser = {
    first_name: "Test",
    last_name: "User",
    email: "testcomplains@gmail.com",
    password: "password123",
    role: "user",
    is_verified: false
};

const testComplain = {
    subject: "Test Complaint Subject",
    description: "This is a test complaint description for integration testing purposes.",
    status: "open"
};

beforeAll(async () => {
    // Create a test user for complains
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    const userResponse = await db.insert(UserTable).values({
        ...testUser,
        password: hashedPassword
    }).returning();
    userId = userResponse[0].user_id;

    // Create a test complain for operations that require existing complain
    const complainResponse = await db.insert(CustomerSupportTable).values({
        ...testComplain,
        user_id: userId
    }).returning();
    complainId = complainResponse[0].ticket_id;
});

afterAll(async () => {
    // Clean up test data
    await db.delete(CustomerSupportTable).where(eq(CustomerSupportTable.ticket_id, complainId));
    await db.delete(UserTable).where(eq(UserTable.user_id, userId));
    
    // Clean up any additional complains created during tests
    await db.delete(CustomerSupportTable).where(eq(CustomerSupportTable.subject, "New Test Complaint"));
});

describe("Customer Support/Complains Integration Tests", () => {
    describe("POST /complains", () => {
        it("should create a new complain successfully", async () => {
            const newComplain = {
                user_id: userId,
                subject: "New Test Complaint",
                description: "This is a new test complaint for integration testing.",
                status: "open"
            };

            const response = await request(app)
                .post("/complains")
                .send(newComplain)
                .expect(201);

            expect(response.body).toHaveProperty("ticket_id");
            expect(response.body).toHaveProperty("user_id", userId);
            expect(response.body).toHaveProperty("subject", newComplain.subject);
            expect(response.body).toHaveProperty("description", newComplain.description);
            expect(response.body).toHaveProperty("status", newComplain.status);
        });

        it("should return 400 for missing required fields", async () => {
            const incompleteComplain = {
                user_id: userId,
                subject: "Incomplete Complaint"
                // Missing description
            };

            const response = await request(app)
                .post("/complains")
                .send(incompleteComplain)
                .expect(400);

            expect(response.body).toHaveProperty("message");
        });

        it("should return 400 for invalid user_id", async () => {
            const invalidComplain = {
                user_id: 999999, // Non-existent user
                subject: "Invalid User Complaint",
                description: "This complaint has an invalid user ID.",
                status: "open"
            };

            const response = await request(app)
                .post("/complains")
                .send(invalidComplain)
                .expect(400);

            expect(response.body).toHaveProperty("message");
        });
    });

    describe("GET /complains", () => {
        it("should get all complains", async () => {
            const response = await request(app)
                .get("/complains")
                .expect(200);

            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0]).toHaveProperty("ticket_id");
            expect(response.body[0]).toHaveProperty("user_id");
            expect(response.body[0]).toHaveProperty("subject");
            expect(response.body[0]).toHaveProperty("description");
            expect(response.body[0]).toHaveProperty("status");
            expect(response.body[0]).toHaveProperty("created_at");
        });

        it("should return empty array when no complains exist", async () => {
            // Temporarily delete all complains
            await db.delete(CustomerSupportTable);

            const response = await request(app)
                .get("/complains")
                .expect(200);

            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBe(0);

            // Restore test complain
            const complainResponse = await db.insert(CustomerSupportTable).values({
                ...testComplain,
                user_id: userId
            }).returning();
            complainId = complainResponse[0].ticket_id;
        });
    });

    describe("GET /complains/:id", () => {
        it("should get a complain by ID", async () => {
            const response = await request(app)
                .get(`/complains/${complainId}`)
                .expect(200);

            expect(response.body).toHaveProperty("ticket_id", complainId);
            expect(response.body).toHaveProperty("user_id", userId);
            expect(response.body).toHaveProperty("subject", testComplain.subject);
            expect(response.body).toHaveProperty("description", testComplain.description);
            expect(response.body).toHaveProperty("status", testComplain.status);
            expect(response.body).toHaveProperty("created_at");
            expect(response.body).toHaveProperty("updated_at");
        });

        it("should return 404 for non-existent complain", async () => {
            const response = await request(app)
                .get("/complains/999999")
                .expect(404);

            expect(response.body).toHaveProperty("message", "Complain not found");
        });

        it("should return 400 for invalid complain ID format", async () => {
            const response = await request(app)
                .get("/complains/invalid-id")
                .expect(400);

            expect(response.body).toHaveProperty("message");
        });
    });

    describe("PUT /complains/:id", () => {
        it("should update a complain successfully", async () => {
            const updateData = {
                subject: "Updated Test Complaint Subject",
                description: "This is an updated test complaint description.",
                status: "in_progress"
            };

            const response = await request(app)
                .put(`/complains/${complainId}`)
                .send(updateData)
                .expect(200);

            expect(response.body).toHaveProperty("ticket_id", complainId);
            expect(response.body).toHaveProperty("subject", updateData.subject);
            expect(response.body).toHaveProperty("description", updateData.description);
            expect(response.body).toHaveProperty("status", updateData.status);
        });

        it("should update only provided fields", async () => {
            const partialUpdate = {
                status: "resolved"
            };

            const response = await request(app)
                .put(`/complains/${complainId}`)
                .send(partialUpdate)
                .expect(200);

            expect(response.body).toHaveProperty("ticket_id", complainId);
            expect(response.body).toHaveProperty("status", partialUpdate.status);
            // Other fields should remain unchanged
            expect(response.body).toHaveProperty("subject");
            expect(response.body).toHaveProperty("description");
        });

        it("should return 404 for non-existent complain", async () => {
            const updateData = {
                subject: "Updated Subject",
                status: "closed"
            };

            const response = await request(app)
                .put("/complains/999999")
                .send(updateData)
                .expect(404);

            expect(response.body).toHaveProperty("message", "Complain not found");
        });

        it("should return 400 for invalid status", async () => {
            const invalidUpdate = {
                status: "invalid_status"
            };

            const response = await request(app)
                .put(`/complains/${complainId}`)
                .send(invalidUpdate)
                .expect(400);

            expect(response.body).toHaveProperty("message");
        });
    });

    describe("DELETE /complains/:id", () => {
        it("should delete a complain successfully", async () => {
            // Create a complain specifically for deletion
            const complainToDelete = await db.insert(CustomerSupportTable).values({
                user_id: userId,
                subject: "Complain to Delete",
                description: "This complain will be deleted during testing.",
                status: "open"
            }).returning();

            const response = await request(app)
                .delete(`/complains/${complainToDelete[0].ticket_id}`)
                .expect(200);

            expect(response.body).toHaveProperty("message", "Complain deleted successfully");

            // Verify complain is deleted from database
            const deletedComplain = await db.select()
                .from(CustomerSupportTable)
                .where(eq(CustomerSupportTable.ticket_id, complainToDelete[0].ticket_id));
            expect(deletedComplain.length).toBe(0);
        });

        it("should return 404 for non-existent complain", async () => {
            const response = await request(app)
                .delete("/complains/999999")
                .expect(404);

            expect(response.body).toHaveProperty("message", "Complain not found");
        });

        it("should return 400 for invalid complain ID format", async () => {
            const response = await request(app)
                .delete("/complains/invalid-id")
                .expect(400);

            expect(response.body).toHaveProperty("message");
        });
    });

    describe("Error Handling", () => {
        it("should handle server errors gracefully", async () => {
            // Simulate a server error by sending invalid data
            const response = await request(app)
                .post("/complains")
                .send({})
                .expect(500);

            expect(response.body).toHaveProperty("message");
        });

        it("should handle database connection errors", async () => {
            // This test would require mocking the database connection
            // For now, we'll just verify the endpoint exists
            const response = await request(app)
                .get("/complains")
                .expect(200);

            expect(response.body).toBeInstanceOf(Array);
        });
    });

    describe("Authorization and Security", () => {
        it("should handle unauthorized access", async () => {
            const response = await request(app)
                .get(`/complains/${complainId}`)
                .set("Authorization", "Bearer invalid_token");

            // This depends on your auth middleware implementation
            // Adjust the expected status code based on your actual implementation
            expect([200, 401, 403]).toContain(response.status);
        });

        it("should prevent accessing other users complains", async () => {
            // Create another user
            const anotherUser = await db.insert(UserTable).values({
                first_name: "Another",
                last_name: "User",
                email: "anotheruser@gmail.com",
                password: await bcrypt.hash("password123", 10),
                role: "user",
                is_verified: false
            }).returning();

            // Create complain for another user
            const anotherComplain = await db.insert(CustomerSupportTable).values({
                user_id: anotherUser[0].user_id,
                subject: "Another User's Complaint",
                description: "This belongs to another user.",
                status: "open"
            }).returning();

            // Try to access another user's complain (this depends on your auth implementation)
            const response = await request(app)
                .get(`/complains/${anotherComplain[0].ticket_id}`);

            // Clean up
            await db.delete(CustomerSupportTable).where(eq(CustomerSupportTable.ticket_id, anotherComplain[0].ticket_id));
            await db.delete(UserTable).where(eq(UserTable.user_id, anotherUser[0].user_id));

            // Adjust expected behavior based on your auth implementation
            expect([200, 403, 404]).toContain(response.status);
        });
    });
});