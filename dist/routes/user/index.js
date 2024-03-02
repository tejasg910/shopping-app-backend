import express from "express";
export const userRoutes = express.Router();
import userApiRoutes from "./user.js";
userRoutes.use("/user", userApiRoutes);
