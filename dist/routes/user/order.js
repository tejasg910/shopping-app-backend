import express from "express";
import { TryCatch } from "../../middlewares/errorHandler.js";
import { cancelOrder, getAllMyOrders, getOrderDetails, newOrder, } from "../../controllers/user/order.js";
const router = express.Router();
router.post("/new", TryCatch(newOrder));
router.get("/myOrders", TryCatch(getAllMyOrders));
router.get("/cancel/:id", TryCatch(cancelOrder));
router.get("/orderDetails/:id", TryCatch(getOrderDetails));
export default router;
