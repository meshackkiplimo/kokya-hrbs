import { getAllCustomerComplainsController, getcomplainsByIdController } from '@/controllers/customerComplainsController';
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
}