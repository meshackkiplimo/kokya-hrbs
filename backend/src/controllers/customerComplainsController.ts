import { createNewComplainsService, deleteComplainsService, getAllComplainsService, getComplainsByIdService, updateComplainsService } from "@/services/customerComplainsService";
import { Request, Response } from "express";







export const createCustomerComplainsController = async (req: any, res: any) => {
    try {
        const complainData = req.body;
        if (!complainData.user_id || !complainData.subject || !complainData.description) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const newComplain = await createNewComplainsService(complainData);
        res.status(201).json(newComplain);
        
    } catch (error) {
        console.error("Error creating customer complain:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}

export const getAllCustomerComplainsController = async (req: any, res: any) => {
    try {
        const allComplains= await getAllComplainsService();
       if (allComplains.length === 0) {
            return res.status(404).json({ message: "No customer complains found" });
        }
        res.status(200).json(allComplains);
        
    } catch (error) {
        console.error("Error fetching customer complains:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}

export const getcomplainsByIdController = async (req:Request,res:Response) => {
    try {
        const complainId = parseInt(req.params.id)
        const oneComplain = await getComplainsByIdService(complainId);
        if (!oneComplain) {
            return res.status(404).json({ message: "Customer complain not found" });
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
        const updates = req.body;
        const updatedComplain = await updateComplainsService(complainId, updates);
        if (!updatedComplain) {
            return res.status(404).json({ message: "Customer complain not found" });
        }
        res.status(200).json(updatedComplain);
        
    } catch (error) {
        console.error("Error updating customer complain:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}
export const deleteCustomerComplainsController = async (req: any, res: any) => {
    try {
        const complainId = parseInt(req.params.id);
        const deletedComplain = await deleteComplainsService(complainId);
        if (!deletedComplain) {
            return res.status(404).json({ message: "Customer complain not found" });
        }
        res.status(200).json({ message: "Customer complain deleted successfully" });
        
    } catch (error) {
        console.error("Error deleting customer complain:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}