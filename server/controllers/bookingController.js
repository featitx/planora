// controllers/bookingController.js
import transporter from "../configs/nodemailer.js";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});


const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
  const bookings = await Booking.find({
    room,
    checkInDate: { $lte: checkOutDate },
    checkOutDate: { $gte: checkInDate },
  });
  return bookings.length === 0;
};

export const checkAvailabilityAPI = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;
    const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });
    res.json({ success: true, isAvailable });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, guests } = req.body;
    const user = req.user._id;

    const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });
    if (!isAvailable) return res.json({ success: false, message: "Room is not available" });

    const roomData = await Room.findById(room).populate("hotel");
    let totalPrice = roomData.pricePerNight;
    const nights = Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 3600 * 24));
    totalPrice *= nights;

    const booking = await Booking.create({
      user,
      room,
      hotel: roomData.hotel._id,
      guests: +guests,
      checkInDate,
      checkOutDate,
      totalPrice,
    });

    const options = {
      amount: totalPrice * 100,
      currency: "INR",
      receipt: `receipt_order_${booking._id}`,
      notes: { bookingId: booking._id.toString() },
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed to create booking" });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const user = req.user._id;
    const bookings = await Booking.find({ user }).populate("room hotel").sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.json({ success: false, message: "Failed to fetch bookings" });
  }
};

export const getHotelBookings = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ owner: req.auth.userId });
    if (!hotel) return res.json({ success: false, message: "No Hotel found" });

    const bookings = await Booking.find({ hotel: hotel._id }).populate("room hotel user").sort({ createdAt: -1 });
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((acc, b) => acc + b.totalPrice, 0);

    res.json({ success: true, dashboardData: { totalBookings, totalRevenue, bookings } });
  } catch (error) {
    res.json({ success: false, message: "Failed to fetch bookings" });
  }
};

export const razorpayPayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId).populate("room hotel");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    const options = {
      amount: booking.totalPrice * 100, 
      currency: "INR",
      receipt: `receipt_order_${booking._id}`,
      notes: {
        bookingId: booking._id.toString()
      },
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      hotelName: booking.hotel.name,
    });

  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ success: false, message: "Payment creation failed" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { bookingId, paymentId, orderId, signature } = req.body;

    // Create expected signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(orderId + "|" + paymentId)
      .digest("hex");

    if (generated_signature !== signature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    // Mark booking as paid
    await Booking.findByIdAndUpdate(bookingId, { isPaid: true });

    res.json({ success: true, message: "Payment verified and booking updated" });

  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};
