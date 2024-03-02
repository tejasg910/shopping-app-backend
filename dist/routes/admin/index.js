import express from "express";
import productRoutes from "./product.js";
export const adminRoutes = express.Router();
adminRoutes.use("/product", productRoutes);
