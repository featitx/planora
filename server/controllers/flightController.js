import Flight from "../models/Flight.js";
import FlightBooking from "../models/FlightBooking.js";
// import { sendBookingConfirmationEmail } from "../utils/mailer.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

export const listFlights = async (req, res) => {
  try {
    const flights = await Flight.find();
    res.json({ success: true, flights });
  } catch (error) {
    res.json({ success: false, message: "Failed to fetch flights" });
  }
};

export const getFlightById = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) return res.status(404).json({ success: false, message: "Flight not found" });
    res.json({ success: true, flight });
  } catch (error) {
    res.json({ success: false, message: "Error fetching flight" });
  }
};

export const checkFlightAvailability = async (req, res) => {
  try {
    const { flightId, requestedSeats } = req.body;
    const flight = await Flight.findById(flightId);
    if (!flight) return res.status(404).json({ success: false, message: "Flight not found" });

    const available = flight.availableSeats >= requestedSeats;
    res.json({ success: true, available });
  } catch (error) {
    res.json({ success: false, message: "Availability check failed" });
  }
};

export const createFlightBooking = async (req, res) => {
  console.log('Received booking request:', req.body); //debug ka code hai 
  console.log('Clerk auth data:', req.auth);  //auth data checking

  try {
    const { flightId, passengers, contactDetails } = req.body;
    
   
    const userId = req.auth.userId; 
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

   
    if (!flightId || !passengers?.length || !contactDetails?.email || !contactDetails?.phone) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

   
    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({
        success: false,
        message: "Flight not found"
      });
    }

   
    if (flight.availableSeats < passengers.length) {
      return res.status(400).json({
        success: false,
        message: `Only ${flight.availableSeats} seat(s) available`
      });
    }

   
    const totalPrice = flight.price * passengers.length;

    
    const booking = await FlightBooking.create({
      user: userId, 
      flight: flight._id,
      passengers,
      contactDetails,
      totalPrice,
    });

    
    const options = {
      amount: totalPrice * 100, 
      currency: "INR",
      receipt: `booking_${booking._id}`,
      notes: {
        bookingId: booking._id.toString(),
        flightId: flight._id.toString()
      }
    };

    const order = await razorpay.orders.create(options);

    
    res.json({
      success: true,
      order,
      bookingId: booking._id
    });

  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({
      success: false,
      message: "Booking failed",
      error: error.message
    });
  }
};

export const getUserFlightBookings = async (req, res) => {
  try {
   
    const bookings = await FlightBooking.find({ user: req.user.id })
      .populate("flight")
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.json({ success: false, message: "Failed to fetch flight bookings" });
  }
};

export const razorpayFlightPayment = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await FlightBooking.findById(bookingId).populate("flight");

    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    const options = {
      amount: booking.totalPrice * 100,
      currency: "INR",
      receipt: `receipt_flight_${booking._id}`,
      notes: { bookingId: booking._id.toString() },
    };

    const order = await razorpay.orders.create(options);

    res.json({ 
      success: true, 
      order_id: order.id, 
      amount: order.amount, 
      flightNumber: booking.flight.flightNumber 
    });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ success: false, message: "Payment creation failed" });
  }
};

export const verifyFlightPayment = async (req, res) => {
  try {
    const { bookingId, paymentId, orderId, signature } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(orderId + "|" + paymentId)
      .digest("hex");

    if (generatedSignature !== signature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    // Update booking and reduce available seats
    const booking = await FlightBooking.findByIdAndUpdate(
      bookingId, 
      { 
        isPaid: true,
        paymentInfo: {
          razorpayOrderId: orderId,
          razorpayPaymentId: paymentId,
          razorpaySignature: signature
        }
      },
      { new: true }
    ).populate("flight");

    if (booking && booking.flight) {
      await Flight.findByIdAndUpdate(
        booking.flight._id,
        { $inc: { availableSeats: -booking.passengers.length } }
      );
    }

    res.json({ success: true, message: "Payment verified and booking updated" });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};


//create flight -- single function hai isliye new file nahi banaunga abhi 
export const createFlight = async (req, res) => {
  try {
    const flight = await Flight.create(req.body);
    res.status(201).json({ success: true, flight });
  } catch (error) {
    console.error("Create flight error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createFlights = async (req, res) => {
  try {
    const flights = await Flight.insertMany(req.body);
    res.status(201).json({ success: true, flights });
  } catch (error) {
    console.error("Bulk insert error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


