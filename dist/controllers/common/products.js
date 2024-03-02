import { Product } from "../../models/Product.js";
import ErrorHandler from "../../utils/utility-class.js";
import { nodeCache } from "../../app.js";
export const getProductById = async (req, res, next) => {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }
    res.status(201).json({
        success: true,
        message: `Fetched product successfully`,
        data: product,
    });
};
export const getLatestProducts = async (req, res, next) => {
    let products = [];
    if (nodeCache.has("latest-product")) {
        products = JSON.parse(nodeCache.get("latest-product"));
    }
    else {
        products = await Product.find({ isDeleted: false })
            .sort({ createdAt: -1 })
            .limit(5);
        nodeCache.set("latest-product", JSON.stringify(products));
    }
    res.status(201).json({
        success: true,
        message: `Fetched products successfully`,
        data: products,
    });
};
export const getAllCategories = async (req, res, next) => {
    let categories = [];
    if (nodeCache.has("categories")) {
        categories = JSON.parse(nodeCache.get("categories"));
    }
    else {
        categories = await Product.distinct("category");
        nodeCache.set("categories", JSON.stringify(categories));
    }
    res.status(201).json({
        success: true,
        message: `Fetched categories successfully`,
        data: categories,
    });
};
export const searchProducts = async (req, res, next) => {
    console.log("came here");
    const { search, sort, category, price } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 10;
    const skip = limit * (page - 1);
    const baseQuery = {
        isDeleted: false,
    };
    if (search)
        baseQuery.name = { $regex: search, $options: "i" };
    if (price)
        baseQuery.price = { $lte: Number(price) };
    if (category)
        baseQuery.category = category.toString();
    const productPromise = Product.find(baseQuery)
        .sort(sort && { price: sort === "asc" ? 1 : -1 })
        .limit(limit)
        .skip(skip);
    const [products, withoutFilterProducts] = await Promise.all([
        productPromise,
        Product.find(baseQuery),
    ]);
    const totalPages = Math.ceil(withoutFilterProducts.length / limit);
    res.status(201).json({
        success: true,
        message: `Fetched products successfully`,
        data: products,
        currPage: page,
        totalPages,
    });
};
