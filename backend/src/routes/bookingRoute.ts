import { createBookingController, getAllBookingController, getBookingByIdController, updateBookingController } from '@/controllers/bookingController';
import { Express } from 'express';



export const bookingRoute = (app:Express)=>{
    app.route('/bookings').get(
        async (req,res,next) => {
            try {
                await getAllBookingController(req, res);
                
            } catch (error) {
                next(error);
                
            }
            
        }


    )
    app.route('/bookings/:id').get(
        async (req, res, next) => {
            try {
                await getBookingByIdController(req, res);
                
            } catch (error) {
                next(error);
                
            }
            
        }
    )
    app.route('/bookings').post(
        async (req, res, next) => {
            try {
                await createBookingController(req, res);
                
            } catch (error) {
                next(error);
                
            }
            
        }
    )
    app.route('/bookings/:id').put(
        async (req, res, next) => {
            try {
                await updateBookingController(req, res);
                
            } catch (error) {
                next(error);
                
            }
            
        }
    )

}