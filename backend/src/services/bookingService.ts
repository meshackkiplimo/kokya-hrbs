import db from "@/Drizzle/db";
import { BookingTable, TIBooking } from "@/Drizzle/schema";
import { sql } from "drizzle-orm";
import { cache } from "@/utils/cache";




export const createBookingService = async (booking:TIBooking) => {
    const newBooking = await db.insert(BookingTable).values(booking).returning();
    return newBooking;
    
}

export const getAllBookingService = async (userId?: number) => {
    const cacheKey = `bookings_${userId || 'all'}`;
    
    // Try to get from cache first
    const cachedBookings = cache.get(cacheKey);
    if (cachedBookings) {
        return cachedBookings;
    }
    
    const getAllBookings = await db.query.BookingTable.findMany({
        where: userId ? (table, { eq }) => eq(table.user_id, userId) : undefined,
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

    });
    
    // Cache for 10 seconds since booking data changes frequently
    cache.set(cacheKey, getAllBookings, 10000);
    
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

// Optimized service for checking room conflicts
export const checkRoomConflictService = async (
    roomId: number, 
    checkInDate: string, 
    checkOutDate: string
) => {
    const conflictingBookings = await db.query.BookingTable.findMany({
        where: (table, { eq, and, or, lt, gt }) => and(
            eq(table.room_id, roomId),
            or(
                eq(table.status, 'confirmed'),
                eq(table.status, 'pending')
            ),
            // Check for date overlap: new booking overlaps with existing booking
            lt(table.check_in_date, checkOutDate),
            gt(table.check_out_date, checkInDate)
        ),
        columns: {
            booking_id: true,
        },
        limit: 1 // We only need to know if ANY conflict exists
    });
    
    return conflictingBookings.length > 0;
};
