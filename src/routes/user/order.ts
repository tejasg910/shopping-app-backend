import express from "express";

import { TryCatch } from "../../middlewares/errorHandler.js";
import { adminOnly } from "../../middlewares/auth.js";
import {
  cancelOrder,
  getAllMyOrders,
  newOrder,
} from "../../controllers/user/order.js";

const router = express.Router();

router.post("/new", TryCatch(newOrder));
router.get("/myOrders", TryCatch(getAllMyOrders));
router.get("/cancel/:id", TryCatch(cancelOrder));

export default router;
