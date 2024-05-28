import { NextFunction, Request, Response } from "express";
import { Order } from "../../models/Order.js";
import ErrorHandler from "../../utils/utility-class.js";

export const getOrderDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  const order = await Order.findById({ _id: id, isDeleted: false })
    .populate({
      path: "products.product",
      select: ["image", "name", "quantity", "price", "stock"],
    })
    .populate({
      path: "user",
      select: ["name", "_id", "email", "mobile"],
    });
  if (!order) {
    return next(new ErrorHandler("No order found", 404));
  }
  return res.status(200).json({
    success: true,
    message: "Orders fetched successfully",
    data: order,
  });
};
