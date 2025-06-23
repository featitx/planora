// controllers/razorpayWebhook.js
import crypto from "crypto";
import Booking from "../models/Booking.js";

export const razorpayWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers["x-razorpay-signature"];

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (digest !== signature) {
    return res.status(400).json({ success: false, message: "Invalid signature" });
  }

  const event = req.body;

  if (event.event === "payment.captured") {
    const bookingId = event.payload.payment.entity.notes.bookingId;
    try {
      await Booking.findByIdAndUpdate(bookingId, {
        isPaid: true,
        paymentMethod: "Razorpay",
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: "Failed to update booking" });
    }
  }

  res.status(200).json({ success: true });
};
