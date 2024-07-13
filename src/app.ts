import express, { NextFunction, Request, Response } from "express";
import * as path from "path";
import morgan from "morgan";
const __dirname = path.resolve();
import NodeCache from "node-cache";
import { userRoutes } from "./routes/user/index.js";
import { adminRoutes } from "./routes/admin/index.js";
import { commonRoutes } from "./routes/common/index.js";
import paymentRoutes from "./routes/payment/payment.js";
import cors from "cors";
import { connectDb } from "./utils/features.js";
import { errorMiddleWare } from "./middlewares/errorHandler.js";
import { config } from "dotenv";
import Stripe from "stripe";
config({ path: "./.env" });

import fs from "fs";
import { v2 as cloudinary , UploadApiResponse} from 'cloudinary';
console.log(process.env.CLOUDINARY_CLOUD_NAME)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_KEY!,
  api_secret: process.env.CLOUDINARY_SECRET!,
});



export {cloudinary, UploadApiResponse};

// Create 'uploads' directory if it doesn't exist
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
const stripeKey = process.env.STRIPE_SECRET || "";
export const stripe = new Stripe(stripeKey);

const app = express();
const PORT = process.env.PORT || 8000;

//importing routes
const mongoURI = process.env.MONGO_URI || "";
connectDb(mongoURI);
export const nodeCache = new NodeCache();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
//using routes
app.use(morgan("dev"));
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/common", commonRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/pay", paymentRoutes);

// Serve static files from the uploads directory

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/", (req, res, next) => {
  res.send("Welcome to shopping backend");
});

app.use(errorMiddleWare);
app.listen(PORT, () => console.log("Server started on 8000"));
