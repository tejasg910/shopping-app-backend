import express from "express";
import { TryCatch } from "../../middlewares/errorHandler.js";
import { getOrderDetails } from "../../controllers/common/orders.js";
const router = express.Router();
router.get("/orderDetails/:id", TryCatch(getOrderDetails));
export default router;
