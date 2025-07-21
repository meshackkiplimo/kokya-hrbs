import { createHotelService, deleteHotelService, getAllHotelService, getAllHotelsWithoutPaginationService, getHotelByIdService, updateHotelService } from "@/services/hotelService";
import { Request, Response } from "express";
import cloudinary from 'cloudinary';
import { TIHotel } from "@/Drizzle/schema";




const uploadImage =  async (file:Express.Multer.File) =>{
    const image= file
    const base64Image = Buffer.from(image.buffer).toString("base64")
    const dataURI = `data:${image.mimetype};base64,${base64Image}`
    const uploadResponse =  await cloudinary.v2.uploader.upload(dataURI)
    return uploadResponse.url

}

export const createHotelController = async (req: Request, res: Response) => {
    try {
        const hotelData:TIHotel = req.body;

        // Basic validation
      const requiredFields = ['name', 'location', 'address', 'contact_number', 'category', 'rating'];
      for (const field of requiredFields) {
          if (!hotelData[field as keyof TIHotel]) {
              return res.status(400).json({ message: `Missing required field: ${field}` });
          }
      }
         const imageUrl = await uploadImage(req.file as Express.Multer.File);

    if (!imageUrl) {
      return res.status(500).json({ message: 'Failed to upload image' });
    }

    // Attach image URL
    hotelData.img_url = imageUrl;

        const newHotel = await createHotelService(hotelData);
        
        if (!newHotel) {
            return res.status(400).json({ message: "Hotel creation failed" });
        }

        // Return hotel data directly (as expected by tests)
        res.status(201).json(newHotel);
        
    } catch (error) {
        console.error("Error in createHotelController:", error);
        res.status(400).json({ message: "Hotel creation failed" });
    }
};

export const getAllHotelController = async (req: Request, res: Response) => {
    try {
        // Extract pagination parameters from query string
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        
        // Validate pagination parameters
        if (page < 1) {
            return res.status(400).json({ message: "Page must be greater than 0" });
        }
        if (limit < 1 || limit > 100) {
            return res.status(400).json({ message: "Limit must be between 1 and 100" });
        }
        
        const result = await getAllHotelService(page, limit);
        
        // Return paginated result
        res.status(200).json(result);
        
    } catch (error) {
        console.error("Error in getAllHotelController:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getAllHotelsWithoutPaginationController = async (req: Request, res: Response) => {
    try {
        const hotels = await getAllHotelsWithoutPaginationService();
        
        // Return array directly (for analytics and other components that need all hotels)
        res.status(200).json(hotels || []);
        
    } catch (error) {
        console.error("Error in getAllHotelsWithoutPaginationController:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getHotelByIdController = async (req: Request, res: Response) => {
    try {
        const hotelId = parseInt(req.params.id);
        if (isNaN(hotelId)) {
            return res.status(400).json({ message: "Invalid hotel ID" });
        }

        const oneHotel = await getHotelByIdService(hotelId);
        if (!oneHotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        // Return hotel data directly (as expected by tests)
        res.status(200).json(oneHotel);
        
    } catch (error) {
        console.error("Error in getHotelByIdController:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateHotelController = async (req: Request, res: Response) => {
    try {
        const hotelId = parseInt(req.params.id);
        if (isNaN(hotelId)) {
            return res.status(400).json({ message: "Invalid hotel ID" });
        }

        const hotelData = req.body;
        
        const updatedHotel = await updateHotelService(hotelId, hotelData);
        
        if (!updatedHotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        
        // Return hotel data directly (as expected by tests)
        res.status(200).json(updatedHotel);
        
    } catch (error) {
        console.error("Error in updateHotelController:", error);
        res.status(400).json({ message: "Hotel update failed" });
    }
};

export const deleteHotelController = async (req: Request, res: Response) => {
    try {
        const hotelId = parseInt(req.params.id);
        if (isNaN(hotelId)) {
            return res.status(400).json({ message: "Invalid hotel ID" });
        }
        
        const deletedHotel = await deleteHotelService(hotelId);
        
        if (!deletedHotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        
        res.status(200).json({ message: "Hotel deleted successfully" });
        
    } catch (error) {
        console.error("Error in deleteHotelController:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};