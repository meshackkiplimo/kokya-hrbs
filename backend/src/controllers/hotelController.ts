
import { createHotelService, getAllHotelService, getHotelByIdService, updateHotelService } from "@/services/hotelService";
import { Request, Response } from "express";
import { parse } from "path";




export const createHotelController = async (req:Request,res:Response) => {
    try {
        const hotel= req.body;

        const newHotel = await createHotelService(hotel)
        
        if (!newHotel) {
            return res.status(400).json({ error: "Hotel creation failed" });
        }
        res.status(201).json(newHotel);

        
    } catch (error) {
        console.error("Error in createHotelController:", error);
        res.status(500).json({ error: "Internal Server Error" });
        
    }
    
}

export const getAllHotelController = async (req:Request,res:Response) => {
    try {
        const hotels = await getAllHotelService()
        
        if (!hotels || hotels.length === 0) {
            return res.status(404).json({ error: "No hotels found" });
        }
        res.status(200).json(hotels);
        
    } catch (error) {
        console.error("Error in getAllHotelController:", error);
        res.status(500).json({ error: "Internal Server Error" });
        
    }
    
}

export const getHotelByIdController = async (req:Request,res:Response) => {
    try {
        const hotelId = parseInt(req.params.id);
        const oneHotel = await getHotelByIdService(hotelId)
        if (!oneHotel) {
            return res.status(404).json({ error: "Hotel not found" });
        }
        res.status(200).json({
            message:"Hotel found successfully",
            hotel: oneHotel
        });
        
    } catch (error) {
        console.error("Error in getHotelByIdController:", error);
        res.status(500).json({ error: "Internal Server Error" });
        
    }
}
export const updateHotelController = async (req:Request,res:Response) => {
    try {
        const hotelId = parseInt(req.params.id);
        const hotelData = req.body;
        
        const updatedHotel = await updateHotelService(hotelId, hotelData);
        
        if (!updatedHotel || updatedHotel.length === 0) {
            return res.status(404).json({ error: "Hotel not found or update failed" });
        }
        
        res.status(200).json({
            message: "Hotel updated successfully",
            hotel: updatedHotel[0]
        });
        
    } catch (error) {
        console.error("Error in updateHotelController:", error);
        res.status(500).json({ error: "Internal Server Error" });
        
    }
}