import db from "@/Drizzle/db";
import { HotelTable, TIHotel } from "@/Drizzle/schema";
import { sql } from "drizzle-orm";
import express from "express";



export const createHotelService = async (hotel:TIHotel) => {
   const newHotel = await db.insert(HotelTable).values(hotel).returning();
   
   // Handle both real database (returns array) and mocked database (might return single object)
   if (!newHotel) return null;
   if (Array.isArray(newHotel)) {
       return newHotel[0];
   }
   return newHotel; // For unit tests that return single object
}

export const getAllHotelService = async (page: number = 1, limit: number = 10) => {
    const offset = (page - 1) * limit;
    
    // Get total count for pagination
    const totalCount = await db.query.HotelTable.findMany();
    const total = totalCount.length;
    
    // Get paginated results
    const getAllHotels = await db.query.HotelTable.findMany({
        columns:{
            hotel_id: true,
            name: true,
            address: true,
            location: true,
            contact_number: true,
            category: true,
            rating: true,
            created_at: true,
            updated_at: true,
        },
        limit: limit,
        offset: offset
    });
    
    return {
        hotels: getAllHotels,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            itemsPerPage: limit,
            hasNextPage: page < Math.ceil(total / limit),
            hasPrevPage: page > 1
        }
    };
}

export const getHotelByIdService = async (hotelId: number) => {
    const hotel = await db.query.HotelTable.findFirst({
        where: (table, { eq }) => eq(table.hotel_id, hotelId),
        columns: {
            hotel_id: true,
            name: true,
            address: true,
            location: true,
            contact_number: true,
            category: true,
            rating: true,
            img_url: true,
            description: true,
            created_at: true,
            updated_at: true,
        }
    });
    return hotel;
}

export const getAllHotelsWithoutPaginationService = async () => {
    const getAllHotels = await db.query.HotelTable.findMany({
        columns:{
            hotel_id: true,
            name: true,
            address: true,
            location: true,
            contact_number: true,
            category: true,
            rating: true,
            created_at: true,
            updated_at: true,
        }
    })
    return getAllHotels;
}

export const updateHotelService = async (hotelId: number, hotel: TIHotel) => {
    const updatedHotel = await db.update(HotelTable)
        .set(hotel)
       .where(sql`${HotelTable.hotel_id} = ${hotelId}`)
        .returning();
    
    // Handle both real database (returns array) and mocked database (might return single object or array)
    if (!updatedHotel) return null;
    if (Array.isArray(updatedHotel)) {
        return updatedHotel.length > 0 ? updatedHotel[0] : null;
    }
    return updatedHotel; // For unit tests that return single object
}
export const deleteHotelService = async (hotelId: number) => {
    const deletedHotel = await db.delete(HotelTable)
        .where(sql`${HotelTable.hotel_id} = ${hotelId}`)
        .returning();
    
    // Handle both real database (returns array) and mocked database (might return single object or null)
    if (!deletedHotel) return null;
    if (Array.isArray(deletedHotel)) {
        return deletedHotel.length > 0 ? deletedHotel[0] : null;
    }
    return deletedHotel; // For unit tests that return single object
}