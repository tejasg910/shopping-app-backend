import express from "express";
import productRoutes from "./product.js";
export const commonRoutes = express.Router();
commonRoutes.use("/product", productRoutes);
