import express from "express";
import productRoutes from "./product.js";
import orderRoutes from "./order.js";
export const commonRoutes = express.Router();
commonRoutes.use("/product", productRoutes);
commonRoutes.use("/order", orderRoutes);
