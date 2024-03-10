import mongoose from "mongoose";
import { nodeCache } from "../app.js";
export const connectDb = (uri) => {
    mongoose
        .connect(uri, {
        dbName: "shopping",
    })
        .then((c) => console.log("connected to database", c.connection.host))
        .catch((e) => console.log(e));
};
export const invalidateCache = ({ product, order, admin, }) => {
    if (product) {
        const productsKeys = [];
        const keys = nodeCache.keys();
        keys.forEach((key) => {
            if (key.startsWith("allProducts-")) {
                productsKeys.push(key);
            }
        });
        const productKeys = [
            ...productsKeys,
            "productCount",
            "categories",
            "latest-product",
        ];
        nodeCache.del(productKeys);
    }
    if (order) {
        const ordersKeys = [];
        const keys = nodeCache.keys();
        keys.forEach((key) => {
            if (key.startsWith("allOrders-")) {
                ordersKeys.push(key);
            }
        });
        const orderKeys = [...ordersKeys, "allOrdersCount"];
        nodeCache.del(orderKeys);
    }
    if (admin) {
    }
};
export const validateObjectIds = async (productID) => {
    try {
        return new mongoose.Types.ObjectId(productID);
    }
    catch (error) {
        return null;
    }
};
