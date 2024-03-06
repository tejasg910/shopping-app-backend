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
        const productKeys = [
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
export const validateObjectIds = async (productID) => {
    try {
        return new mongoose.Types.ObjectId(productID);
    }
    catch (error) {
        return null;
    }
};
