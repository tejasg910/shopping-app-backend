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
export const calculatePercentage = (thisMonth, lastMonth) => {
    if (lastMonth === 0)
        return thisMonth * 100;
    const percent = (thisMonth / lastMonth) * 100;
    return Number(percent.toFixed(0));
};
export const getLastMonthOrders = async (length, lastSixMonthOrders) => {
    const data = new Array(6).fill(0);
    const today = new Date();
    lastSixMonthOrders.forEach((order) => {
        const creationDate = order.createdAt;
        const monthDifference = (today.getMonth() - creationDate.getMonth() + 12) % 12;
        if (monthDifference < 6) {
            data[length - monthDifference - 1] += 1;
        }
    });
};
