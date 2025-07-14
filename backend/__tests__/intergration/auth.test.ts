import db from "@/Drizzle/db";
import { UserTable } from "@/Drizzle/schema";
import { app } from "@/index";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import request from "supertest";

let userId: number;
let userEmail: string;

const testUser = {
    first_name: "Test",
    last_name: "User",
    email: "testuser@gmail.com",
    password: "password123",
    role: "user",
    is_verified: false
};

const testAdminUser = {
    first_name: "Admin",
    last_name: "User",
    email: "admin@gmail.com",
    password: "adminpassword123",
    role: "admin",
    is_verified: true
};

beforeAll(async () => {
    // Create a test user for operations that require existing user
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    const userResponse = await db.insert(UserTable).values({
        ...testUser,
        password: hashedPassword
    }).returning();
    userId = userResponse[0].user_id;
    userEmail = userResponse[0].email;
});

afterAll(async () => {
    // Clean up test data
    await db.delete(UserTable).where(eq(UserTable.user_id, userId));
    // Clean up any additional users created during tests
    await db.delete(UserTable).where(eq(UserTable.email, "newuser@gmail.com"));
    await db.delete(UserTable).where(eq(UserTable.email, testAdminUser.email));
});

describe("Auth Integration Tests", () => {
    describe("POST /auth/register", () => {
        it("should register a new user successfully", async () => {
            const newUser = {
                first_name: "New",
                last_name: "User",
                email: "newuser@gmail.com",
                password: "newpassword123",
                role: "user"
            };

            const response = await request(app)
                .post("/auth/register")
                .send(newUser)
                .expect(201);

            expect(response.body).toHaveProperty("user_id");
            expect(response.body).toHaveProperty("email", newUser.email);
            expect(response.body).toHaveProperty("first_name", newUser.first_name);
            expect(response.body).toHaveProperty("last_name", newUser.last_name);
            expect(response.body).not.toHaveProperty("password");
        });

        it("should return 400 for duplicate email", async () => {
            const duplicateUser = {
                first_name: "Duplicate",
                last_name: "User",
                email: testUser.email, // Using existing email
                password: "password123",
                role: "user"
            };

            const response = await request(app)
                .post("/auth/register")
                .send(duplicateUser)
                .expect(400);

            expect(response.body).toHaveProperty("message");
        });

        it("should return 400 for missing required fields", async () => {
            const incompleteUser = {
                first_name: "Incomplete",
                // Missing last_name, email, password
                role: "user"
            };

            const response = await request(app)
                .post("/auth/register")
                .send(incompleteUser)
                .expect(400);

            expect(response.body).toHaveProperty("message");
        });
    });

    describe("POST /auth/login", () => {
        it("should login user with correct credentials", async () => {
            const loginData = {
                email: testUser.email,
                password: testUser.password
            };

            const response = await request(app)
                .post("/auth/login")
                .send(loginData)
                .expect(200);

            expect(response.body).toHaveProperty("user");
            expect(response.body).toHaveProperty("token");
            expect(response.body.user).toHaveProperty("email", testUser.email);
            expect(response.body.user).not.toHaveProperty("password");
        });

        it("should return 401 for incorrect password", async () => {
            const loginData = {
                email: testUser.email,
                password: "wrongpassword"
            };

            const response = await request(app)
                .post("/auth/login")
                .send(loginData)
                .expect(401);

            expect(response.body).toHaveProperty("message");
        });

        it("should return 404 for non-existent user", async () => {
            const loginData = {
                email: "nonexistent@gmail.com",
                password: "password123"
            };

            const response = await request(app)
                .post("/auth/login")
                .send(loginData)
                .expect(404);

            expect(response.body).toHaveProperty("message");
        });

        it("should return 400 for missing credentials", async () => {
            const loginData = {
                email: testUser.email
                // Missing password
            };

            const response = await request(app)
                .post("/auth/login")
                .send(loginData)
                .expect(400);

            expect(response.body).toHaveProperty("message");
        });
    });

    describe("POST /auth/verify-email", () => {
        it("should verify user email successfully", async () => {
            const verificationData = {
                email: testUser.email,
                is_verified: true
            };

            const response = await request(app)
                .post("/auth/verify-email")
                .send(verificationData)
                .expect(200);

            expect(response.body).toHaveProperty("message");
            
            // Verify the user is actually updated in database
            const updatedUser = await db.select().from(UserTable).where(eq(UserTable.user_id, userId));
            expect(updatedUser[0].is_verified).toBe(true);
        });

        it("should return 404 for non-existent email", async () => {
            const verificationData = {
                email: "nonexistent@gmail.com",
                is_verified: true
            };

            const response = await request(app)
                .post("/auth/verify-email")
                .send(verificationData)
                .expect(404);

            expect(response.body).toHaveProperty("message");
        });
    });

    describe("GET /users", () => {
        it("should get all users", async () => {
            const response = await request(app)
                .get("/users")
                .expect(200);

            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0]).toHaveProperty("user_id");
            expect(response.body[0]).toHaveProperty("email");
            expect(response.body[0]).not.toHaveProperty("password");
        });
    });

    describe("PUT /auth/users/:id", () => {
        it("should update user successfully", async () => {
            const updateData = {
                first_name: "Updated",
                last_name: "Name"
            };

            const response = await request(app)
                .put(`/auth/users/${userId}`)
                .send(updateData)
                .expect(200);

            expect(response.body).toHaveProperty("user_id", userId);
            expect(response.body).toHaveProperty("first_name", updateData.first_name);
            expect(response.body).toHaveProperty("last_name", updateData.last_name);
            expect(response.body).not.toHaveProperty("password");
        });

        it("should return 404 for non-existent user", async () => {
            const updateData = {
                first_name: "Updated",
                last_name: "Name"
            };

            const response = await request(app)
                .put("/auth/users/999999")
                .send(updateData)
                .expect(404);

            expect(response.body).toHaveProperty("message");
        });
    });

    describe("DELETE /auth/users/:id", () => {
        it("should delete user successfully", async () => {
            // Create a user specifically for deletion
            const hashedPassword = await bcrypt.hash(testAdminUser.password, 10);
            const userToDelete = await db.insert(UserTable).values({
                ...testAdminUser,
                password: hashedPassword
            }).returning();

            const response = await request(app)
                .delete(`/auth/users/${userToDelete[0].user_id}`)
                .expect(200);

            expect(response.body).toHaveProperty("message");

            // Verify user is deleted from database
            const deletedUser = await db.select().from(UserTable).where(eq(UserTable.user_id, userToDelete[0].user_id));
            expect(deletedUser.length).toBe(0);
        });

        it("should return 404 for non-existent user", async () => {
            const response = await request(app)
                .delete("/auth/users/999999")
                .expect(404);

            expect(response.body).toHaveProperty("message");
        });
    });
});