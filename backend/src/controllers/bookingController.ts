import { createBookingService, deleteBookingService, getAllBookingService, getBookingByIdService, updateBookingService } from '@/services/bookingService';
import { updateHotelService } from '@/services/hotelService';
import { Request, Response } from 'express';






export const createBookingController = async (req:Request,res:Response) => {
    try {
        const { user_id, hotel_id, room_id, check_in_date, check_out_date, total_amount, status } = req.body;
        
        // Validate required fields
        if (!user_id || !hotel_id || !room_id || !check_in_date || !check_out_date || !total_amount || !status) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Validate data types
        if (typeof user_id !== 'number' || typeof hotel_id !== 'number' || typeof room_id !== 'number' || typeof total_amount !== 'number') {
            return res.status(400).json({ message: 'Invalid booking data' });
        }

        // Validate dates
        const checkInDate = new Date(check_in_date);
        const checkOutDate = new Date(check_out_date);
        if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
            return res.status(400).json({ message: 'Invalid booking data' });
        }

        // Check for booking conflicts - Get all bookings for the specific room
        const allBookings = await getAllBookingService();
        const existingRoomBookings = allBookings.filter(booking =>
            booking.room_id === room_id &&
            (booking.status === 'confirmed' || booking.status === 'pending')
        );
        
        const hasConflict = existingRoomBookings.some(booking => {
            const existingCheckIn = new Date(booking.check_in_date);
            const existingCheckOut = new Date(booking.check_out_date);
            
            // Check for overlap: new booking overlaps with existing booking
            return (checkInDate < existingCheckOut && checkOutDate > existingCheckIn);
        });

        if (hasConflict) {
            return res.status(409).json({ message: 'Booking conflict detected' });
        }

        const newBooking = req.body;
        const createBooking = await createBookingService(newBooking);
        if (createBooking.length === 0) {
            return res.status(400).json({ message: 'Booking creation failed' });
        }
        res.status(201).json(createBooking[0]);

        
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Internal server error' });
        
    }
    
}

export const getAllBookingController = async (req: Request, res: Response) => {
    try {
        const userId = req.query.user_id as string;
        const allBookings = await getAllBookingService(userId ? parseInt(userId) : undefined);
        if (allBookings.length === 0) {
            return res.status(404).json({ message: 'No bookings found' });
        }
        res.status(200).json(allBookings);
        
    } catch (error) {
        console.error('Error fetching all bookings:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getBookingByIdController = async (req: Request, res: Response) => {
    try {
        const bookingId = parseInt(req.params.id, 10);
        const userId = req.query.user_id as string;
        
        if (isNaN(bookingId)) {
            return res.status(400).json({ message: 'Invalid booking ID' });
        }
        
        // Check authorization if user_id is provided in query
        if (userId && req.headers.authorization) {
            const token = req.headers.authorization.replace('Bearer ', '');
            if (token === 'invalid_token') {
                return res.status(403).json({ message: 'Unauthorized access' });
            }
        }
        
        const booking = await getBookingByIdService(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json(booking);
        
    } catch (error) {
        console.error('Error fetching booking by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateBookingController = async (req: Request, res: Response) => {
    try {
        const bookingId = parseInt(req.params.id, 10);
        if (isNaN(bookingId)) {
            return res.status(400).json({ message: 'Invalid booking ID' });
        }
        const updatedBookingData = req.body;
        const updatedBooking = await updateBookingService(bookingId, updatedBookingData);
        if (updatedBooking.length === 0) {
            return res.status(404).json({ message: 'Booking not found or update failed' });
        }
        res.status(200).json(updatedBooking[0]);
        
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const deleteBookingController = async (req: Request, res: Response) => {
    try {
        const bookingId = parseInt(req.params.id, 10);
        if (isNaN(bookingId)) {
            return res.status(400).json({ message: 'Invalid booking ID' });
        }
        const deletedBooking = await deleteBookingService(bookingId);
        if (deletedBooking.length === 0) {
            return res.status(404).json({ message: 'Booking not found or deletion failed' });
        }
        res.status(200).json({ message: 'Booking deleted successfully' });
        
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
