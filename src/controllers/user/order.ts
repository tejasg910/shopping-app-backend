import { NextFunction, Request, Response } from "express";
import { NewOrderRequestBody } from "../../types/types.js";
import { invalidateCache } from "../../utils/features.js";
import { placeOrder } from "../../services/order.js";

export const newOrder = async (
  req: Request<{}, {}, NewOrderRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const {
    shippingInfo,
    orderItems,
    user,
    subTotal,
    discount,
    shippingCharges,

    name,
    tax,
    total,
  } = req.body;

  if (
    !shippingInfo ||
    !user ||
    !subTotal ||
    !discount ||
    !shippingCharges ||
    !name ||
    !tax ||
    !total
  ) {
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
