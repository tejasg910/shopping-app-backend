import express from "express";
import { TryCatch } from "../../middlewares/errorHandler.js";
import { newOrder } from "../../controllers/user/order.js";
const router = express.Router();
router.post("/new", TryCatch(newOrder));
export default router;
