import { Coupon } from "../../models/Coupon.js";
import ErrorHandler from "../../utils/utility-class.js";
export const createCouponCode = async (req, res, next) => {
    const { coupon, amount } = req.body;
    if (coupon || amount) {
        return next(new ErrorHandler("Please enter both coupon and amount", 400));
    }
    await Coupon.create({ code: coupon, amount });
    return res
        .status(201)
        .json({ success: true, message: "Coupon created successfully" });
};
export const applyDiscount = async (req, res, next) => {
    const { coupon } = req.query;
    if (coupon) {
        return next(new ErrorHandler("Please enter both coupon and amount", 400));
    }
    const discount = await Coupon.findOne({ code: coupon });
    if (!discount) {
        return next(new ErrorHandler("Invalid coupon code", 400));
    }
    return res.status(201).json({
        success: true,
        message: "Coupon fetched successfully",
        data: { discount: discount.amount },
    });
};
export const getAllCoupons = async (req, res, next) => {
    const coupons = await Coupon.find();
    return res.status(201).json({
        success: true,
        message: "Coupon fetched successfully",
        data: coupons,
    });
};
export const deleteCoupon = async (req, res, next) => {
    const id = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
        return next(new ErrorHandler("Invalid coupon ID", 400));
    }
    return res.status(200).json({
        success: true,
        message: "Coupon deleted successfully",
    });
};
