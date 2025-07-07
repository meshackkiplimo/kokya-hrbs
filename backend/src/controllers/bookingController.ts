import { createBookingService, deleteBookingService, getAllBookingService, getBookingByIdService, updateBookingService } from '@/services/bookingService';
import { updateHotelService } from '@/services/hotelService';
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

export const updateBookingController = async (req: Request, res: Response) => {
    try {
        const bookingId = parseInt(req.params.id, 10);
        if (isNaN(bookingId)) {
            return res.status(400).json({ error: 'Invalid booking ID' });
        }
        const updatedBookingData = req.body;
        const updatedBooking = await updateBookingService(bookingId, updatedBookingData);
        if (updatedBooking.length === 0) {
            return res.status(404).json({ message: 'Booking not found or update failed' });
        }
        res.status(200).json(updatedBooking[0]);
        
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
export const deleteBookingController = async (req: Request, res: Response) => {
    try {
        const bookingId = parseInt(req.params.id, 10);
        if (isNaN(bookingId)) {
            return res.status(400).json({ error: 'Invalid booking ID' });
        }
        const deletedBooking = await deleteBookingService(bookingId);
        if (deletedBooking.length === 0) {
            return res.status(404).json({ message: 'Booking not found or deletion failed' });
        }
        res.status(200).json({ message: 'Booking deleted successfully', booking: deletedBooking[0] });
        
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
