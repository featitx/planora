import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { checkAvailabilityAPI, createBooking, getHotelBookings, getUserBookings, razorpayPayment , verifyPayment } from '../controllers/bookingController.js';

const bookingRouter = express.Router();

bookingRouter.post('/check-availability', checkAvailabilityAPI);
bookingRouter.post('/book', protect, createBooking);
bookingRouter.get('/user', protect, getUserBookings);
bookingRouter.get('/hotel', protect, getHotelBookings);
bookingRouter.post('/razorpay-payment', protect, razorpayPayment);
bookingRouter.post("/verify-payment", protect, verifyPayment);

export default bookingRouter;