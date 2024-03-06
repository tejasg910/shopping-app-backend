import express from "express";
export const userRoutes = express.Router();
import userApiRoutes from "./user.js";
import orderApiRoutes from "./order.js";
userRoutes.use("/user", userApiRoutes);
userRoutes.use("/order", orderApiRoutes);
