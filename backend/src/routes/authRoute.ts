
import { creatUserController, loginUserController, verifyEmailController } from '@/controllers/authController';
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
    app.route('/auth/login').post(
        async (req, res, next) => {
            try {
              await loginUserController(req, res);
            } catch (error) {
                next(error);
            }
        }
    );
    app.route('/auth/verify').post(
        async (req, res, next) => {
            try {
                await verifyEmailController(req, res);
            } catch (error) {
                next(error);
            }
        }
    );
}