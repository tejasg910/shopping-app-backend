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
    products,
    user,
    subTotal,
    discount,
    shippingCharges,

    name,
    tax,
    total,
  } = req.body;
  console.log(req.body);
  if (
    !shippingInfo ||
    !user ||
    !subTotal ||
    !shippingCharges ||
    !name ||
    !tax ||
    !total
  ) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  if (!products) {
    return res
      .status(400)
      .json({ success: false, message: "Provide order items" });
  }

  const orders = await placeOrder({
    shippingInfo,
    products,
    user,
    subTotal,
    discount,
    shippingCharges,

    name,
    tax,
    total,
  });

  console.log(orders.validateSubTotal, subTotal);

  if (orders.validateSubTotal === subTotal) {
    const total = subTotal + tax + shippingCharges - discount;
    await Order.create({
      discount,

      user,
      products: orders.orders,
      tax,
      shippingCharges,
      shippingInfo,
      subTotal,
      total,
    });

    await invalidateCache({ product: true, order: true, admin: true });

    return res.status(201).json({
      success: true,
      message: "All orders processed successfully",
      data: orders.orderStatus,
    });
  } else {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const getAllMyOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.query.id;
  const orders = await Order.find({ user: id, isDeleted: false }).populate({
    path: "user",
    select: ["name", "_id"],
  });

  return res.status(200).json({
    success: true,
    message: "Orders fetched successfully",
    data: orders,
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

  const products = order.products;
  products.forEach(async (product) => {
    const originalProduct = await Product.findById(product.product);

    if (originalProduct) {
      await Product.findOneAndUpdate(
        { _id: product._id },

        { stock: Number(originalProduct.stock || 0 + product.quantity) }
      );
    }
  });

  invalidateCache({ product: true, order: true, admin: true });

  return res.status(200).json({
    success: true,
    message: "Orders cancelled successfully",
  });
};
