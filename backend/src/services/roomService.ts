import db from "@/Drizzle/db"
import { RoomTable, TIRoom } from "@/Drizzle/schema";
import { sql } from "drizzle-orm";



export const createRoomService = async (room: TIRoom) => {
    const newRoom = await db.insert(RoomTable).values(room).returning();
    return newRoom;
}

// Get all rooms without pagination with joins
export const getAllRoomsWithoutPaginationService = async () => {
    const rooms = await db.query.RoomTable.findMany({
        columns: {
            room_id: true,
            hotel_id: true,
            room_number: true,
            room_type: true,
            price_per_night: true,
            amenities: true,
            capacity: true,
            availability: true,
            img_url: true,
            description: true,
            created_at: true,
            updated_at: true,
        },
        with: {
            hotel: {
                columns: {
                    hotel_id: true,
                    name: true,
                    location: true,
                    address: true,
                    contact_number: true,
                    category: true,
                    rating: true,
                    img_url: true,
                    description: true,
                }
            }
        }
    });
    return rooms;
}



export const getAllRoomsService = async (page:number=1,limit:number=10) => {
    const offset =(page - 1) * limit;
    const totalCount = await db.query.RoomTable.findMany();
    const total = totalCount.length;
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
            img_url: true,
            description: true,
            created_at: true,
            updated_at: true,
        },
        with: {
            hotel: {
                columns: {
                    hotel_id: true,
                    name: true,
                    location: true,
                    address: true,
                    contact_number: true,
                    category: true,
                    rating: true,
                    img_url: true,
                    description: true,
                }
            }
        },
        limit: limit,
        offset: offset
    })
    return {
        rooms: rooms,
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
            img_url: true,
            description: true,
            created_at: true,
            updated_at: true,
        },
        with: {
            hotel: {
                columns: {
                    hotel_id: true,
                    name: true,
                    location: true,
                    address: true,
                    contact_number: true,
                    category: true,
                    rating: true,
                    img_url: true,
                    description: true,
                }
            }
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