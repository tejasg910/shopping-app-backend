import { NextFunction, Request, Response } from "express";
import { nodeCache } from "../../app.js";
import { Order } from "../../models/Order.js";
import ErrorHandler from "../../utils/utility-class.js";
import { invalidateCache } from "../../utils/features.js";

export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let orders = [];
  let ordersCount = 0;
  const page = Number(req.query.page) || 1;
  const key = `allOrders-${page}`;
  const limit = Number(process.env.PRODUCT_PER_PAGE) || 10;
  const skip = limit * (page - 1);
  if (nodeCache.has(key) && nodeCache.has("allOrdersCount")) {
    orders = JSON.parse(nodeCache.get(key) as string);
    ordersCount = Number(nodeCache.get("allOrdersCount") as string);
  } else {
    ordersCount = await Order.countDocuments();
    orders = await Order.find().limit(limit).skip(skip).populate("user");

    nodeCache.set(key, JSON.stringify(orders));
    nodeCache.set("allOrdersCount", JSON.stringify(ordersCount));
  }
  const totalPages = Math.ceil(ordersCount / limit);
  return res.status(200).json({
    success: true,
    message: "All orders fetched successfully",
    data: orders,
    currPage: page,
    totalPages,
  });
};
export const udpateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { status } = req.body;
  const id = req.params.id;
  const order = await Order.findById({ _id: id, isDeleted: false });
  if (!order) {
    return next(new ErrorHandler("No order found", 404));
  }
  order.status = status;
  await order.save();
  invalidateCache({ product: false, order: true, admin: true });

  return res.status(200).json({
    success: true,
    message: "Order updated successfully",
  });
};
export const deleteOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const order = await Order.findByIdAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true }
  );
  if (!order) {
    return next(new ErrorHandler("No order found", 404));
  }

  invalidateCache({ product: false, order: true, admin: true });

  return res.status(200).json({
    success: true,
    message: "Order deleted successfully",
  });
};
