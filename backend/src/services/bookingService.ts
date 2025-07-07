import db from "@/Drizzle/db";
import { BookingTable, TIBooking } from "@/Drizzle/schema";
import { sql } from "drizzle-orm";




export const createBookingService = async (booking:TIBooking) => {
    const newBooking = await db.insert(BookingTable).values(booking).returning();
    return newBooking;
    
}

export const getAllBookingService = async () => {
    const getAllBookings= await db.query.BookingTable.findMany({
        columns:{
            booking_id: true,
            user_id: true,
            hotel_id: true,
            room_id: true,
            check_in_date: true,
            check_out_date: true,
            total_amount: true,
            status: true,
            created_at: true,
            updated_at: true,

        }

    })
    return getAllBookings;
    
}

export const getBookingByIdService = async (bookingId: number) => {
    const oneBooking = await db.query.BookingTable.findFirst({
        where: (table, { eq }) => eq(table.booking_id, bookingId),
        columns: {
            booking_id: true,
            user_id: true,
            hotel_id: true,
            room_id: true,
            check_in_date: true,
            check_out_date: true,
            total_amount: true,
            status: true,
            created_at: true,
            updated_at: true,
        }
    });
    return oneBooking;
}
export const updateBookingService = async (bookingId: number, booking: TIBooking) => {
    const updatedBooking = await db.update(BookingTable)
        .set(booking)
        .where(sql`${BookingTable.booking_id} = ${bookingId}`)
        .returning();
    return updatedBooking;
}
export const deleteBookingService = async (bookingId: number) => {
    const deletedBooking = await db.delete(BookingTable)
        .where(sql`${BookingTable.booking_id} = ${bookingId}`)
        .returning();
    return deletedBooking;
}
