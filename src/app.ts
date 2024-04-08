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
const stripeKey = process.env.STRIPE || "";
export const stripe = new Stripe(stripeKey);

const app = express();
const PORT = process.env.PORT || 8000;

//importing routes
const mongoURI = process.env.MONGO_URI || "";
connectDb(mongoURI);
export const nodeCache = new NodeCache();
app.use(cors());
app.use(express.json());
//using routes
app.use(morgan("dev"));
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/common", commonRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/pay", paymentRoutes);

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "/")));
app.get("/", (req, res, next) => {
  res.send("Welcome to shopping backend");
});

app.use(errorMiddleWare);
app.listen(PORT, () => console.log("Server started on 8000"));
