import db from "../Drizzle/db";
import { CustomerSupportTable, TICustomerSupport } from "../Drizzle/schema";
import { sql } from "drizzle-orm";











export const createNewComplainsService = async (complains:TICustomerSupport) => {
 const newComplains = await db.insert(CustomerSupportTable).values(complains).returning();
    
 return newComplains;

    
    
}

export const getAllComplainsService = async () => {
    const allComplains = await db.query.CustomerSupportTable.findMany({
        columns:{
            ticket_id: true,
            user_id: true,
            subject: true,
            description: true,
            status: true,
            created_at: true,
            updated_at: true,

        },
        with: {
            user: {
                columns: {
                    user_id: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                    role: true,
                }
            }
        }
    })
    return allComplains;
}

export const getComplainsByIdService = async (ticketId: number) => {
    const complain = await db.query.CustomerSupportTable.findFirst({
        where: (table, { eq }) => eq(table.ticket_id, ticketId),
        columns: {
            ticket_id: true,
            user_id: true,
            subject: true,
            description: true,
            status: true,
            created_at: true,
            updated_at: true,
        },
        with: {
            user: {
                columns: {
                    user_id: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                    role: true,
                    created_at: true,
                }
            }
        }
    });
    return complain;
}

export const updateComplainsService = async (ticketId: number, updates: Partial<TICustomerSupport>) => {
    const updatedComplain = await db.update(CustomerSupportTable)
        .set(updates)
        .where(sql`${CustomerSupportTable.ticket_id} = ${ticketId}`)
        .returning();
    
    return updatedComplain;
}
export const deleteComplainsService = async (ticketId: number) => {
    const deletedComplain = await db.delete(CustomerSupportTable)
        .where(sql`${CustomerSupportTable.ticket_id} = ${ticketId}`)
        .returning();
    
    return deletedComplain;
}

