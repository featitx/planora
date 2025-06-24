import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import connectCloudinary from "./configs/cloudinary.js";
import { clerkMiddleware } from "@clerk/express";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import flightRouter from "./routes/flightRoutes.js";
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import { razorpayWebhook } from "./controllers/razorpayWebhooks.js";

connectDB();
connectCloudinary();

const app = express();

app.use(cors());


app.post("/api/razorpay", express.raw({ type: "application/json" }), razorpayWebhook);


app.use(express.json());


app.use(clerkMiddleware());


app.use("/api/clerk", clerkWebhooks);


app.get("/", (req, res) => res.send("API is working"));
app.use("/api/user", userRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/flights", flightRouter);  


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
