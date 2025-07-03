import { getAllBookingController, getBookingByIdController } from '@/controllers/bookingController';
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
}