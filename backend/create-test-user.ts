import db from "./src/Drizzle/db";
import { UserTable } from "./src/Drizzle/schema";
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

async function createTestUser() {
    console.log('Creating test user for load testing...');

    const testUser = {
        first_name: "Test",
        last_name: "User",
        email: "smeski2111@ueab.ac.ke",
        password: await bcrypt.hash("1234567", 10),
        role: "user",
        is_verified: true, // Set to true so login can succeed
        created_at: new Date(),
        updated_at: new Date(),
    };

    try {
        // Check if user already exists
        const existingUser = await db.query.UserTable.findFirst({
            where: eq(UserTable.email, testUser.email)
        });

        if (existingUser) {
            console.log('Test user already exists, updating password...');
            await db.update(UserTable)
                .set({
                    password: testUser.password,
                    is_verified: true
                })
                .where(eq(UserTable.email, testUser.email));
            console.log('Test user updated successfully');
        } else {
            await db.insert(UserTable).values(testUser);
            console.log('Test user created successfully');
        }

        console.log('Test user details:');
        console.log('Email: smeski2111@ueab.ac.ke');
        console.log('Password: 1234567');
        console.log('Verified: true');

    } catch (error) {
        console.error('Error creating test user:', error);
        throw error;
    }
}

createTestUser()
    .then(() => {
        console.log('Test user creation completed.');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Error creating test user:', error);
        process.exit(1);
    });