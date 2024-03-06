import mongoose from "mongoose";
import { InvalidateCacheType } from "../types/types.js";
import { nodeCache } from "../app.js";
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
