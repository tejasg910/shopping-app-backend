import express from "express";
import { TryCatch } from "../../middlewares/errorHandler.js";
import { adminOnly } from "../../middlewares/auth.js";
import { deleteOrder, getAllOrders, udpateOrder, } from "../../controllers/admin/order.js";
const router = express.Router();
router.get("/allOrders", adminOnly, TryCatch(getAllOrders));
router.put("/updateOrder/:id", adminOnly, TryCatch(udpateOrder));
router.delete("/delete/:id", adminOnly, TryCatch(deleteOrder));
export default router;
