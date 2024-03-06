import { invalidateCache } from "../../utils/features.js";
import { placeOrder } from "../../services/order.js";
export const newOrder = async (req, res, next) => {
    const { shippingInfo, orderItems, user, subTotal, discount, shippingCharges, name, tax, total, } = req.body;
    if (!shippingInfo ||
        !user ||
        !subTotal ||
        !discount ||
        !shippingCharges ||
        !name ||
        !tax ||
        !total) {
        return res
            .status(400)
            .json({ success: false, message: "All fields are required" });
    }
    if (!orderItems) {
        return res
            .status(400)
            .json({ success: false, message: "Provide order items" });
    }
    const orders = await placeOrder({
        shippingInfo,
        orderItems,
        user,
        subTotal,
        discount,
        shippingCharges,
        name,
        tax,
        total,
    });
    await invalidateCache({ product: true, order: true, admin: true });
    return res.status(201).json({
        success: true,
        message: "All orders processed successfully",
        data: orders,
    });
};
