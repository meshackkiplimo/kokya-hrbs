import { createRoomService, deleteRoomService, getAllRoomsService, getRoomByIdService, updateRoomService } from "@/services/roomService";
import { Request, Response } from "express";





export const createRoomController = async (req: Request, res: Response) => {
    try {
        const roomData = req.body;
        if (!roomData.hotel_id || !roomData.room_type || !roomData.room_number || !roomData.price_per_night || !roomData.amenities || !roomData.capacity) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const newRoom = await createRoomService(roomData);
        res.status(201).json({
            message: "Room created successfully",
            room: newRoom
        });
        
    } catch (error) {
        console.error("Error in createRoomController:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

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
export const updateRoomController = async (req: Request, res: Response) => {
    try {
        const roomId = parseInt(req.params.id);
        const roomData = req.body;
        if (!roomData.hotel_id || !roomData.room_type || !roomData.room_number || !roomData.price_per_night || !roomData.amenities || !roomData.capacity) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const updatedRoom = await updateRoomService(roomId, roomData);
        res.status(200).json({
            message: "Room updated successfully",
            room: updatedRoom
        });
        
    } catch (error) {
        console.error("Error in updateRoomController:", error);
        res.status(500).json({ error: "Internal Server Error" });
        
    }
}
export const deleteRoomController = async (req: Request, res: Response) => {
    try {
        const roomId = parseInt(req.params.id);
        if (isNaN(roomId)) {
            return res.status(400).json({ error: "Invalid room ID" });
        }
        const deletedRoom = await deleteRoomService(roomId);
        if (!deletedRoom) {
            return res.status(404).json({ error: "Room not found" });
        }
        res.status(200).json({
            message: "Room deleted successfully",
            room: deletedRoom
        });
        
    } catch (error) {
        console.error("Error in deleteRoomController:", error);
        res.status(500).json({ error: "Internal Server Error" });
        
    }
}
