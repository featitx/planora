import mongoose from "mongoose";

const FlightSchema = new mongoose.Schema({
  airline: {
    type: String,
    required: true
  },
  flightNumber: {
    type: String,
    required: true,
    unique: true
  },
  departure: {
    code: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    }
  },
  arrival: {
    code: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    }
  },
  duration: {
    type: Number, 
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  date: {
    type: String, 
    required: true
  },
  stops: {
    type: Number,
    default: 0
  },
  availableSeats: {
    type: Number,
    default: 0
  },
  class: {
    type: String,
    enum: ['Economy', 'Business', 'Premium Economy', 'First Class'],
    required: true
  }
}, { timestamps: true });


export default mongoose.model('Flight', FlightSchema);

