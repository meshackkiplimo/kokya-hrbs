import db from "@/Drizzle/db";
import { TIUser, UserTable } from "@/Drizzle/schema";
import { sql } from "drizzle-orm";







export const createAuthService = async (userData: TIUser) => {
    try {
        const userFields: TIUser = {
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email,
            password: userData.password,
           
        };

        // Basic field validation
        if (!userFields.first_name || !userFields.last_name || !userFields.email || !userFields.password) {
            throw new Error('Missing required user fields');
        }

        // Password validation
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
        if (!passwordRegex.test(userFields.password)) {
            throw new Error('Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character');
        }

      

        // Create user first
        const newUser = await db.transaction(async (tx) => {
            const [createdUser] = await tx.insert(UserTable).values(userFields).returning();

        // If user role is customer, create customer record
        

            return createdUser;
        });

        return newUser;
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Missing required user fields' ||
                error.message === 'Missing required customer fields') {
                throw error;
            }
        }
        // Re-throw any other errors
        throw new Error('Database error');
    }
}

export const loginAuthService = async (user: TIUser) => {
    const { email } = user;
    const result = await db.query.UserTable.findFirst({
        columns: {
            user_id: true,
            first_name: true,
            last_name: true,
            email: true,
            password: true,
            role: true,
            is_verified: true
        },
       
        where: sql`${UserTable.email}=${email}`
    });

    return result;
}

export const getAllUsersService = async () => {
    try {
        const allUsers = await db.query.UserTable.findMany({
            columns: {
                user_id: true,
                first_name: true,
                last_name: true,
                email: true,
                password: true
            }
        });
        return allUsers;
    } catch (error) {
        console.error("Error fetching all users:", error);
        throw new Error("Failed to fetch all users");
    }
}


export const updateVerificationStatus = async (email: string, isVerified: boolean) => {
    const [updatedUser] = await db.update(UserTable)
        .set({ is_verified: isVerified })
        .where(sql`${UserTable.email}=${email}`)
        .returning();
    return updatedUser;
}
export const getUserByIdService = async (userId: number) => {
    const user = await db.query.UserTable.findFirst({
        where: (table, { eq }) => eq(table.user_id, userId),
        columns: {
            user_id: true,
            first_name: true,
            last_name: true,
            email: true,
            password: true,
            role: true,
            is_verified: true,
            created_at: true,
            updated_at: true
        }
    });
    return user;
}
export const updateUserService = async (userId: number, user: Partial<TIUser>) => {
    const updatedUser = await db.update(UserTable)
        .set(user)
        .where(sql`${UserTable.user_id} = ${userId}`)
        .returning();
    return updatedUser;
}
export const deleteUserService = async (userId: number) => {
    const deletedUser = await db.delete(UserTable)
        .where(sql`${UserTable.user_id} = ${userId}`)
        .returning();
    return deletedUser;
}

