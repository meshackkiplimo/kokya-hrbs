
import { creatUserController, deleteUserController, getAllUsersController, getUserByIdController, loginUserController, updateUserController, verifyEmailController } from '../controllers/authController';
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
    app.route('/auth/verify-email').post(
        async (req, res, next) => {
            try {
                await verifyEmailController(req, res);
            } catch (error) {
                next(error);
            }
        }
    );
    app.route('/users').get(
        async (req, res, next) => {
            try {
                await getAllUsersController(req, res);
            } catch (error) {
                next(error);
            }
        })
        app.route('/users/:id').get(
        async (req, res, next) => {
            try {
                await getUserByIdController(req, res);
            } catch (error) {
                next(error);
            }
        })
        
    app.route('/users/:id').delete(
        async (req, res, next) => {
            try {
             
                await deleteUserController(req, res);
            } catch (error) {
                next(error);
            }
        })
        app.route('/users/:id').put(
        async (req, res, next) => {
            try {
                await updateUserController(req, res);
                
            } catch (error) {
                next(error);
            }
        })

}