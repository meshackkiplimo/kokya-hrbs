import { createRoomService, deleteRoomService, getAllRoomsService, getAllRoomsWithoutPaginationService, getRoomByIdService, updateRoomService } from "@/services/roomService";
import { Request, Response } from "express";
import cloudinary from 'cloudinary';
import { TIRoom } from "@/Drizzle/schema";

const uploadImage = async (file: Express.Multer.File) => {
    const image = file
    const base64Image = Buffer.from(image.buffer).toString("base64")
    const dataURI = `data:${image.mimetype};base64,${base64Image}`
    const uploadResponse = await cloudinary.v2.uploader.upload(dataURI)
    return uploadResponse.url
}

const uploadMultipleImages = async (files: Express.Multer.File[]) => {
    const uploadPromises = files.map(file => uploadImage(file));
    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
}





export const createRoomController = async (req: Request, res: Response) => {
    try {
        const roomData: TIRoom = req.body;
        
        // Basic validation
        const requiredFields = ['hotel_id', 'room_type', 'room_number', 'price_per_night', 'amenities', 'capacity'];
        for (const field of requiredFields) {
            if (!roomData[field as keyof TIRoom]) {
                return res.status(400).json({ message: `Missing required field: ${field}` });
            }
        }

        // Handle multiple image uploads if provided
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            const files = req.files as Express.Multer.File[];
            
            // Validate number of images (2-3 images)
            if (files.length < 2 || files.length > 3) {
                return res.status(400).json({ message: 'Please upload 2-3 images' });
            }
            
            const imageUrls = await uploadMultipleImages(files);
            if (!imageUrls || imageUrls.length === 0) {
                return res.status(500).json({ message: 'Failed to upload images' });
            }
            
            // Store as comma-separated string
            roomData.img_url = imageUrls.join(',');
        } else {
            return res.status(400).json({ message: 'Please upload 2-3 images' });
        }

        const newRoom = await createRoomService(roomData);
        
        if (!newRoom) {
            return res.status(400).json({ message: "Room creation failed" });
        }

        // Return room data directly (as expected by tests)
        res.status(201).json(newRoom[0]);
        
    } catch (error) {
        console.error("Error in createRoomController:", error);
        res.status(400).json({ message: "Room creation failed" });
    }
}

// rooms with pagination
export const getAllRoomsWithoutPaginationController = async (req: Request, res: Response) => {
    try {
        const rooms = await getAllRoomsWithoutPaginationService();
        // Return the rooms array directly, not wrapped
        res.status(200).json(rooms);
    } catch (error) {
        console.error("Error in getAllRoomsWithoutPaginationController:", error);
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
