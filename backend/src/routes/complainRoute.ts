import { createCustomerComplainsController, deleteCustomerComplainsController, getAllCustomerComplainsController, getcomplainsByIdController, updateCustomerComplainsController } from '@/controllers/customerComplainsController';
import { createNewComplainsService } from '@/services/customerComplainsService';
import { Express } from 'express';





export const complainRoute = (app:Express)=>{
    app.route('/complains').get(
        async (req,res,next) => {
            try {
                await getAllCustomerComplainsController(req, res);
                
            } catch (error) {
                next(error);
                
            }
            
        }
    )
    app.route('/complains/:id').get(
        async (req,res,next) => {
            try {
                await getcomplainsByIdController(req, res);
                
            } catch (error) {
                next(error);
                
            }
            
        }
    )
    app.route('/complains').post(
        async (req,res,next) => {
            try {
                await createCustomerComplainsController(req, res);
                
            } catch (error) {
                next(error);
                
            }
            
        }
    )
    app.route('/complains/:id').put(
        async (req, res, next) => {
            try {
                await updateCustomerComplainsController(req, res);
                res.status(200).json({ message: 'Complaint updated successfully' });
                
            } catch (error) {
                next(error);
                
            }
            
        }
    )
    app.route('/complains/:id').delete(
        async (req, res, next) => {
            try {
             await deleteCustomerComplainsController(req, res);
                
            } catch (error) {
                next(error);
                
            }
            
        }
    )
}