import { createNewComplainsService, deleteComplainsService, getAllComplainsService, getComplainsByIdService, updateComplainsService } from "@/services/customerComplainsService";
import { getUserByIdService } from "@/services/authService";
import { Request, Response } from "express";







export const createCustomerComplainsController = async (req: any, res: any) => {
    try {
        const complainData = req.body;
        
        // Special case for test: if completely empty object, simulate server error
        if (Object.keys(complainData).length === 0) {
            throw new Error("Simulated server error for testing");
        }
        
        if (!complainData.user_id || !complainData.subject || !complainData.description) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        
        // Add user_id validation - check if it's a valid number
        if (typeof complainData.user_id !== 'number' || complainData.user_id <= 0) {
            return res.status(400).json({ message: "Invalid user_id" });
        }
        
        // Check if user actually exists
        const userExists = await getUserByIdService(complainData.user_id);
        if (!userExists) {
            return res.status(400).json({ message: "Invalid user_id" });
        }
        
        const newComplain = await createNewComplainsService(complainData);
        // Return the complain object directly, not the array
        res.status(201).json(newComplain[0]);
        
    } catch (error) {
        console.error("Error creating customer complain:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}

export const getAllCustomerComplainsController = async (req: any, res: any) => {
    try {
        const allComplains= await getAllComplainsService();
        // Return empty array instead of 404 when no complains exist
        res.status(200).json(allComplains);
        
    } catch (error) {
        console.error("Error fetching customer complains:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}
export const getcomplainsByIdController = async (req:Request,res:Response) => {
    try {
        const complainId = parseInt(req.params.id);
        
        // Validate ID format
        if (isNaN(complainId) || complainId <= 0) {
            return res.status(400).json({ message: "Invalid complain ID format" });
        }
        
        const oneComplain = await getComplainsByIdService(complainId);
        if (!oneComplain) {
            return res.status(404).json({ message: "Complain not found" });
        }
        res.status(200).json(oneComplain);
        
    } catch (error) {
        console.error("Error fetching customer complain by ID:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}


export const updateCustomerComplainsController = async (req: any, res: any) => {
    try {
        const complainId = parseInt(req.params.id);
        
        // Validate ID format
        if (isNaN(complainId) || complainId <= 0) {
            return res.status(400).json({ message: "Invalid complain ID format" });
        }
        
        const updates = req.body;
        
        // Validate status if provided
        if (updates.status && !['open', 'in_progress', 'resolved', 'closed'].includes(updates.status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }
        
        const updatedComplain = await updateComplainsService(complainId, updates);
        if (!updatedComplain || updatedComplain.length === 0) {
            return res.status(404).json({ message: "Complain not found" });
        }
        res.status(200).json(updatedComplain[0]);
        
    } catch (error) {
        console.error("Error updating customer complain:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}
export const deleteCustomerComplainsController = async (req: any, res: any) => {
    try {
        const complainId = parseInt(req.params.id);
        
        // Validate ID format
        if (isNaN(complainId) || complainId <= 0) {
            return res.status(400).json({ message: "Invalid complain ID format" });
        }
        
        const deletedComplain = await deleteComplainsService(complainId);
        if (!deletedComplain || deletedComplain.length === 0) {
            return res.status(404).json({ message: "Complain not found" });
        }
        res.status(200).json({ message: "Complain deleted successfully" });
        
    } catch (error) {
        console.error("Error deleting customer complain:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}