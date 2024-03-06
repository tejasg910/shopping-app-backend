import express from "express";
import {
  getAllUsers,
  getUserById,
  newUser,
} from "../../controllers/user/user.js";
import { TryCatch } from "../../middlewares/errorHandler.js";
import { adminOnly } from "../../middlewares/auth.js";
import { newOrder } from "../../controllers/user/order.js";

const router = express.Router();

router.get("/new", TryCatch(newOrder));
export default router;
