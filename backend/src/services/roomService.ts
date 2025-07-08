import db from "@/Drizzle/db"
import { RoomTable, TIRoom } from "@/Drizzle/schema";
import { sql } from "drizzle-orm";



export const createRoomService = async (room: TIRoom) => {
    const newRoom = await db.insert(RoomTable).values(room).returning();
    return newRoom;
}



export const getAllRoomsService = async () => {
    const rooms = await db.query.RoomTable.findMany({
        columns:{
            room_id: true,
            hotel_id: true,
            room_number: true,
            room_type: true,
          price_per_night: true,
            amenities: true,
            capacity: true,
            availability: true,
            created_at: true,
            updated_at: true,

        }
    })
    return rooms;
    
}

export const getRoomByIdService = async (roomId: number) => {
    const room = await db.query.RoomTable.findFirst({
        where: (table, { eq }) => eq(table.room_id, roomId),
        columns: {
            room_id: true,
            hotel_id: true,
            room_number: true,
            room_type: true,
            price_per_night: true,
            amenities: true,
            capacity: true,
            availability: true,
            created_at: true,
            updated_at: true,
        }
    });
    return room;

}
export const updateRoomService = async (roomId: number, room: TIRoom) => {
    const updatedRoom = await db.update(RoomTable)
        .set(room)
        .where(sql`${RoomTable.room_id} = ${roomId}`)
        .returning();
    return updatedRoom;
}
export const deleteRoomService = async (roomId: number) => {
    const deletedRoom = await db.delete(RoomTable)
        .where(sql`${RoomTable.room_id} = ${roomId}`)
        .returning();
    return deletedRoom;
}