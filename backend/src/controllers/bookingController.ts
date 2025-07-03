import { createBookingService, getAllBookingService, getBookingByIdService } from '@/services/bookingService';
import { Request, Response } from 'express';






export const createBookingController = async (req:Request,res:Response) => {
    try {
        const newBooking = req.body;
        const createBooking = await createBookingService(newBooking);
       if (createBooking.length === 0) {
            return res.status(400).json({ error: 'Booking creation failed' });
        }
        res.status(201).json(createBooking[0]);

        
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        
    }
    
}

export const getAllBookingController = async (req: Request, res: Response) => {
    try {
        const allBookings = await getAllBookingService();
        if (allBookings.length === 0) {
            return res.status(404).json({ message: 'No bookings found' });
        }
        res.status(200).json(allBookings);
        
    } catch (error) {
        console.error('Error fetching all bookings:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getBookingByIdController = async (req: Request, res: Response) => {
    try {
        const bookingId = parseInt(req.params.id, 10);
        if (isNaN(bookingId)) {
            return res.status(400).json({ error: 'Invalid booking ID' });
        }
        const booking = await getBookingByIdService(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json(booking);
        
    } catch (error) {
        console.error('Error fetching booking by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};