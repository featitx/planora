import mongoose from "mongoose";

const flightBookingSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    flight: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flight",
      required: true,
    },
    passengers: [
      {
        title: { 
          type: String, 
          enum: ["Mr.", "Ms.", "Mrs.", "Dr."], 
          default: "Mr." 
        },
        firstName: { 
          type: String, 
          required: true 
        },
        lastName: { 
          type: String, 
          required: true 
        },
        email: { 
          type: String, 
          required: true 
        },
        phone: { 
          type: String, 
          required: true 
        },
        dateOfBirth: { 
          type: Date, 
          required: true 
        },
        nationality: { 
          type: String, 
          default: "Indian" 
        },
      },
    ],
    contactDetails: {
      email: { 
        type: String, 
        required: true 
      },
      phone: { 
        type: String, 
        required: true 
      },
      emergencyContact: { 
        type: String 
      },
      emergencyPhone: { 
        type: String 
      },
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paymentInfo: {
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String,
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("FlightBooking", flightBookingSchema);