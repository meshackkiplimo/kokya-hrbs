
import { connect } from "http2";
import { Client } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import dotenv from "dotenv";
dotenv.config();



export const client = new Client ({
    connectionString: process.env.DATABASE_URL 
});

const main = async () => {
    try {
        await client.connect();
        console.log("Connected to the database successfully");
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
}
main().catch((error) => {
    console.error("Error in main function:", error);
}).finally(() => {
    client.end();
});

const db =drizzle(client, {
    schema: {},
    logger: true,
});
export default db;
    