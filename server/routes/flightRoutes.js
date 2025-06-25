import express from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node'; 
import {
  listFlights,
  getFlightById,
  checkFlightAvailability,
  createFlightBooking,
  getUserFlightBookings,
  razorpayFlightPayment,
  verifyFlightPayment,
  createFlight,
  createFlights
} from '../controllers/flightController.js';

import { protect } from '../middleware/authMiddleware.js';

const flightBookingRouter = express.Router();

// Public 
flightBookingRouter.get('/', listFlights);
flightBookingRouter.get('/flights/:id', getFlightById);
flightBookingRouter.post('/check-availability', checkFlightAvailability);

// Admin-only routes 
flightBookingRouter.post('/create-flight', ClerkExpressRequireAuth(), createFlight);
flightBookingRouter.post('/create-flights', ClerkExpressRequireAuth(), createFlights);

//user
flightBookingRouter.post('/book', ClerkExpressRequireAuth(), createFlightBooking);
flightBookingRouter.get('/user', ClerkExpressRequireAuth(), getUserFlightBookings);
flightBookingRouter.post('/razorpay-payment', ClerkExpressRequireAuth(), razorpayFlightPayment);
flightBookingRouter.post('/verify-payment', ClerkExpressRequireAuth(), verifyFlightPayment);

export default flightBookingRouter;