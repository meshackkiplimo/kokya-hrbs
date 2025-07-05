
import { creatUserController } from '@/controllers/authController';
import { Express } from 'express';



export const authRoute = (app:Express)=>{
    app.route('/auth/register').post(
        async (req,res,next) => {
            try {
                await creatUserController(req, res);
                
            } catch (error) {
                next(error);
                
            }
            
        }
    )
}