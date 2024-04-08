import express from "express";
import {
  getAllUsers,
  getUserById,
  newUser,
} from "../../controllers/user/user.js";
import { TryCatch } from "../../middlewares/errorHandler.js";
import { adminOnly } from "../../middlewares/auth.js";
import {
  applyDiscount,
  createCouponCode,
  deleteCoupon,
  getAllCoupons,
  newPayment,
} from "../../controllers/payments/payments.js";

const router = express.Router();

router.get("/coupon/new", adminOnly, TryCatch(createCouponCode));
router.get("/coupon/discount", TryCatch(applyDiscount));
router.get("/coupon/all", adminOnly, TryCatch(getAllCoupons));
router.delete("/coupon/delete/:id", adminOnly, TryCatch(deleteCoupon));
router.post("/new", TryCatch(newPayment));

export default router;
