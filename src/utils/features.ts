import mongoose, { ObjectId } from "mongoose";
import {
  InvalidateCacheType,
  NewOrderRequestBody,
  OrderItemsType,
} from "../types/types.js";
import { nodeCache } from "../app.js";
import { Product } from "../models/Product.js";
import { count } from "console";
import { Order } from "../models/Order.js";
export const connectDb = (uri: string) => {
  mongoose
    .connect(uri, {
      dbName: "shopping",
    })
    .then((c) => console.log("connected to database", c.connection.host))
    .catch((e) => console.log(e));
};

export const invalidateCache = ({
  product,
  order,
  admin,
}: InvalidateCacheType) => {
  if (product) {
    const productsKeys: string[] = [];
    const keys = nodeCache.keys();
    keys.forEach((key) => {
      if (key.startsWith("allProducts-")) {
        productsKeys.push(key);
      }
    });

    const productKeys: string[] = [
      ...productsKeys,

      "productCount",
      "categories",
      "latest-product",
    ];
    nodeCache.del(productKeys);
  }
  if (order) {
    const ordersKeys: string[] = [];
    const keys = nodeCache.keys();
    keys.forEach((key) => {
      if (key.startsWith("allOrders-")) {
        ordersKeys.push(key);
      }
    });

    const orderKeys: string[] = [...ordersKeys, "allOrdersCount"];
    nodeCache.del(orderKeys);
  }
  if (admin) {
  }
};

export const validateObjectIds = async (productID: string) => {
  try {
    return new mongoose.Types.ObjectId(productID);
  } catch (error) {
    return null;
  }
};
