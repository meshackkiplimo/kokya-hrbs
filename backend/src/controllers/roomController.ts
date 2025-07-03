import { getAllRoomsService, getRoomByIdService } from "@/services/roomService";
import { Request, Response } from "express";





export const getAllRoomsController = async (req: Request, res: Response) => {
    try {

        const rooms = req.body;
        const allRooms = await getAllRoomsService();
        if (!allRooms || allRooms.length === 0) {
            return res.status(404).json({ error: "No rooms found" });
        }
        res.status(200).json({
            message: "Rooms retrieved successfully",
            rooms: allRooms
        });
        
    } catch (error) {
        console.error("Error in getAllHotelsController:", error);
        res.status(500).json({ error: "Internal Server Error" });
        
    }
}
export const getRoomByIdController = async (req: Request, res: Response) => {
    try {
        const roomId = parseInt(req.params.id);
        const oneRoom = await getRoomByIdService(roomId);
        if (!oneRoom) {
            return res.status(404).json({ error: "Room not found" });
        }
        res.status(200).json({
            message: "Room found successfully",
            room: oneRoom
        });
        
    } catch (error) {
        console.error("Error in getRoomByIdController:", error);
        res.status(500).json({ error: "Internal Server Error" });
        
    }
}