import express from "express";

import productRoutes from "./product.js";
import orderRoutes from "./order.js";
import statsRoutes from "./stats.js";

import userRoutes from "./user.js";

export const adminRoutes = express.Router();

adminRoutes.use("/product", productRoutes);
adminRoutes.use("/user", userRoutes);
adminRoutes.use("/order", orderRoutes);
adminRoutes.use("/stats", statsRoutes);
