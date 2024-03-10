import { NextFunction, Request, Response } from "express";
import { NewOrderRequestBody } from "../../types/types.js";
import { invalidateCache } from "../../utils/features.js";
import { placeOrder } from "../../services/order.js";
import { Order } from "../../models/Order.js";
import ErrorHandler from "../../utils/utility-class.js";
import { Product } from "../../models/Product.js";

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

export const getAllMyOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.query.id;
  const orders = await Order.find({ user: id, isDeleted: false });

  return res.status(200).json({
    success: true,
    message: "Orders fetched successfully",
    data: orders,
  });
};
export const getOrderDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  const order = await Order.findById({ _id: id, isDeleted: false });
  if (!order) {
    return next(new ErrorHandler("No order found", 404));
  }
  return res.status(200).json({
    success: true,
    message: "Orders fetched successfully",
    data: order,
  });
};
export const cancelOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.query.id;
  const orderId = req.params.id;

  const order = await Order.findOne({
    user: id,
    _id: orderId,
    isDeleted: false,
  });
  if (!order) {
    return next(new ErrorHandler("No order found", 404));
  }

  await Order.findByIdAndUpdate({ _id: orderId }, { status: "cancelled" });
  const product = await Product.findById(order.product);

  const updatedStock = Number((product?.stock || 0) + order.quantity);

  await Product.findByIdAndUpdate(order.product, { stock: updatedStock });
  invalidateCache({ product: true, order: true, admin: true });

  return res.status(200).json({
    success: true,
    message: "Orders cancelled successfully",
  });
};
