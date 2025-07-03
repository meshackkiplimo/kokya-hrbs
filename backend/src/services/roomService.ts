import db from "@/Drizzle/db"






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