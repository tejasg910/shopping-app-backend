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
    const productKeys: string[] = [
      "allProducts",
      "productCount",
      "categories",
      "latest-product",
    ];
    nodeCache.del(productKeys);
  }
  if (order) {
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
