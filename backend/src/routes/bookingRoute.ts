import { createBookingController, deleteBookingController, getAllBookingController, getAllBookingsWithoutPaginationController, getBookingByIdController, updateBookingController } from '@/controllers/bookingController';
import { optionalAuth } from '@/middleware/authMiddleware';
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
        optionalAuth,
        async (req, res, next) => {
            try {
                await getBookingByIdController(req, res);
                
            } catch (error) {
                next(error);
                
            }
            
        }
    )
    app.route('/bookings/without-pagination').get(
        async (req, res, next) => {
            try {
                await getAllBookingsWithoutPaginationController(req, res);
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
    app.route('/bookings/:id').delete(
        async (req, res, next) => {
            try {
                // await deleteBookingController(req, res);
               await deleteBookingController(req, res);
                
            } catch (error) {
                next(error);
                
            }
            
        }
    )

}