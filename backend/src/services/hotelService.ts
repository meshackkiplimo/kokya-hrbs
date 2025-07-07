import db from "@/Drizzle/db";
import { HotelTable, TIHotel } from "@/Drizzle/schema";
import { sql } from "drizzle-orm";
import express from "express";



export const createHotelService = async (hotel:TIHotel) => {
   const newHotel = await db.insert(HotelTable).values(hotel).returning();
   return newHotel;
    
}

export const getAllHotelService = async () => {
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
            created_at: true,
            updated_at: true,
        }
    });
    return hotel;
}

export const updateHotelService = async (hotelId: number, hotel: TIHotel) => {
    const updatedHotel = await db.update(HotelTable)
        .set(hotel)
       .where(sql`${HotelTable.hotel_id} = ${hotelId}`)
        .returning();
    return updatedHotel;
}