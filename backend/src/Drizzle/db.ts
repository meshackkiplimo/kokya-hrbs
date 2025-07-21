import "dotenv/config";
import {Client} from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";


export const client = new Client({
  connectionString: process.env.DATABASE_URL as string,
  
});
export const main = async () => {
    await client.connect();
    console.log("Connected to the database successfully");

    
}
main().catch((err) => {
    console.error("Error connecting to the database:", err);
    process.exit(1);
});

const db = drizzle(client,
    {
        schema: schema,
        logger: true, 
    }
)

export default db;