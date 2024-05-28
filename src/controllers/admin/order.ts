import { NextFunction, Request, Response } from "express";
import { nodeCache } from "../../app.js";
import { Order } from "../../models/Order.js";
import ErrorHandler from "../../utils/utility-class.js";
import { invalidateCache } from "../../utils/features.js";
import { Product as ProductInfo, shippingInfoType } from "../../types/types.js";
import { Product } from "../../models/Product.js";
import { off } from "process";
import mongoose from "mongoose";
import { subtle } from "crypto";

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
export const udpateOrderStatus = async (
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
export const udpateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { type, orderId } = req.body;
  if (!type || !orderId) {
    return next(new ErrorHandler("Type and orderId is required", 400));
  }

  const order = await Order.findById(orderId).populate("products.product");

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  switch (type) {
    case "customerInfo": {
      const { paymentMode, paymentStatus } = req.body;
      console.log(req.body);
      if (!paymentMode || !paymentStatus) {
        return next(
          new ErrorHandler("paymentMethod and paymentStatus is required", 400)
        );
      } else {
        order.paymentMode = paymentMode;
        order.paymentStatus = paymentStatus;
        await order.save();

        return res.status(200).json({
          success: true,
          message: "Order updated successfully",
        });
      }
    }

    case "shippingAddress": {
      const { billingAddress } = req.body;
      if (!billingAddress) {
        return next(new ErrorHandler("shippingAddress is required", 400));
      } else {
        const updatedOrder = await Order.findByIdAndUpdate(
          orderId,
          {
            $set: {
              "shippingInfo.address": billingAddress,
            },
          },
          { new: true, runValidators: true }
        );
        return res.status(200).json({
          success: true,
          message: "Order updated successfully",
        });
      }
    }

    case "billingAddress": {
      const { shippingInfo }: { shippingInfo: shippingInfoType } = req.body;

      if (
        !shippingInfo.address ||
        !shippingInfo.city ||
        !shippingInfo.country ||
        !shippingInfo.pinCode ||
        !shippingInfo.state
      ) {
        return next(new ErrorHandler("all fields are required", 400));
      } else {
        order.shippingInfo = shippingInfo;
        await order.save();
        return res.status(200).json({
          success: true,
          message: "Order updated successfully",
        });
      }
    }

    case "updateProduct": {
      const { productId, quantity, price } = req.body;
      let subTotal = 0;

      const productIdObj = new mongoose.Types.ObjectId(req.body.productId);
      if (!productId || !quantity || !price) {
        return next(new ErrorHandler("all fields are required", 400));
      } else {
        const product = await Product.findById(productId);

        const productInOrder = order.products.find((product) => {
          const newProduct = product.product as ProductInfo;
          console.log(newProduct._id.toString(), productId);
          if (newProduct._id.toString() === productId) {
            return product;
          }
        });

        if (!product || !productInOrder) {
          next(new ErrorHandler("product not found", 400));
        } else {
          product.price = price;
          await product.save();

          console.log(price, "this is price");
          const newProducts = await order.products.map((product) => {
            const newProduct = product.product as ProductInfo;
            if (newProduct._id.toString() === productId) {
              product.quantity = quantity;
              subTotal += price * quantity;
              return product;
            } else {
              subTotal += newProduct.price * product.quantity;
              return product;
            }
          });
          console.log(newProducts, "this is new products");

          const total =
            subTotal + order.tax + order.shippingCharges - order.discount;

          const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            {
              $set: {
                products: newProducts,
                subTotal: subTotal,
                total: total,
              },
            },
            { new: true, runValidators: true }
          );

          return res.status(200).json({
            success: true,
            message: "Order updated successfully",
          });
        }
      }
    }
    case "subTotal": {
      const { shippingCharges, tax, discount } = req.body;
      if (!shippingCharges || !tax) {
        return next(new ErrorHandler("all fields are required", 400));
      } else {
        order.shippingCharges = Number(shippingCharges);
        order.tax = Number(tax);
        if (discount) {
          order.discount = Number(discount);
        }
        await order.save();
        return res.status(200).json({
          success: true,
          message: "Order updated successfully",
        });
      }
    }

    default:
      break;
  }

  return res.status(200).json({
    success: true,
    message: "Order updated successfully",
  });
};

export const deleteProductFromOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { orderId, productId } = req.body;

  const order = await Order.findById(orderId).populate("products.product");
  if (!order) {
    return next(new ErrorHandler("No order found", 404));
  }
  let subTotal = 0;
  const products = order.products;
  if (products.length === 0) {
    return next(new ErrorHandler("No product found", 404));
  }

  const updateProducts = products.filter((product) => {
    const newProduct = product.product as ProductInfo;
    if (String(newProduct._id) !== productId) {
      subTotal = newProduct.price * product.quantity;
      return product;
    }
  });

  order.subTotal = subTotal;
  order.total = subTotal + order.tax + order.shippingCharges - order.discount;
  await order.save();

  console.log(updateProducts);

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    {
      $set: {
        products: updateProducts,
      },
    },
    { new: true, runValidators: true }
  );

  if (updatedOrder) {
    return res.status(200).json({
      success: true,
      message: "Prduct deleted successfully",
    });
  } else {
    return next(new ErrorHandler("No product found", 404));
  }
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
