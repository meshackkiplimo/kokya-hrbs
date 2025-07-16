import { createRoomService, deleteRoomService, getAllRoomsService, getRoomByIdService, updateRoomService } from "@/services/roomService";
import { Request, Response } from "express";





export const createRoomController = async (req: Request, res: Response) => {
    try {
        const roomData = req.body;
        if (!roomData.hotel_id || !roomData.room_type || !roomData.room_number || !roomData.price_per_night || !roomData.amenities || !roomData.capacity) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const newRoom = await createRoomService(roomData);
        // Return the room object directly, not wrapped
        res.status(201).json(newRoom[0]);
        
    } catch (error) {
        console.error("Error in createRoomController:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getAllRoomsController = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        if (page<1) {
            return res.status(400).json({ message: "Page must be greater than 0" });
        }
        if (limit<1 || limit>100) {
            return res.status(400).json({ message: "Limit must be between 1 and 100" });
        }
        const result = await getAllRoomsService(page, limit);
        // Return paginated result
        res.status(200).json(result);
        
    } catch (error) {
        console.error("Error in getAllRoomsController:", error);
        res.status(500).json({ message: "Internal Server Error" });
        
    }
}
export const getRoomByIdController = async (req: Request, res: Response) => {
    try {
        const roomId = parseInt(req.params.id);
        if (isNaN(roomId)) {
            return res.status(400).json({ message: "Invalid room ID" });
        }
        const oneRoom = await getRoomByIdService(roomId);
        if (!oneRoom) {
            return res.status(404).json({ message: "Room not found" });
        }
        // Return the room object directly
        res.status(200).json(oneRoom);
        
    } catch (error) {
        console.error("Error in getRoomByIdController:", error);
        res.status(500).json({ message: "Internal Server Error" });
        
    }
}
export const updateRoomController = async (req: Request, res: Response) => {
    try {
        const roomId = parseInt(req.params.id);
        if (isNaN(roomId)) {
            return res.status(400).json({ message: "Invalid room ID" });
        }
        const roomData = req.body;
        
        // Check if the room exists first
        const existingRoom = await getRoomByIdService(roomId);
        if (!existingRoom) {
            return res.status(404).json({ message: "Room not found" });
        }
        
        // Allow partial updates - only validate if the request body is completely empty
        if (Object.keys(roomData).length === 0) {
            return res.status(400).json({ message: "No update data provided" });
        }
        
        const updatedRoom = await updateRoomService(roomId, roomData);
        if (!updatedRoom || updatedRoom.length === 0) {
            return res.status(404).json({ message: "Room not found or update failed" });
        }
        // Return the updated room object directly
        res.status(200).json(updatedRoom[0]);
        
    } catch (error) {
        console.error("Error in updateRoomController:", error);
        res.status(500).json({ message: "Internal Server Error" });
        
    }
}
export const deleteRoomController = async (req: Request, res: Response) => {
    try {
        const roomId = parseInt(req.params.id);
        if (isNaN(roomId)) {
            return res.status(400).json({ message: "Invalid room ID" });
        }
        const deletedRoom = await deleteRoomService(roomId);
        if (!deletedRoom || deletedRoom.length === 0) {
            return res.status(404).json({ message: "Room not found" });
        }
        res.status(200).json({
            message: "Room deleted successfully"
        });
        
    } catch (error) {
        console.error("Error in deleteRoomController:", error);
        res.status(500).json({ message: "Internal Server Error" });
        
    }
}
