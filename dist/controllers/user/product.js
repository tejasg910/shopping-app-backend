import { Product } from "../../models/Product.js";
import ErrorHandler from "../../utils/utility-class.js";
export const newProduct = async (req, res, next) => {
    const { name, stock, price, category } = req.body;
    const file = req.file;
    if (!name || !stock || !price || !category) {
        next(new ErrorHandler("Please provide all fields", 400));
    }
    if (!file) {
        return next(new ErrorHandler("Please provide image", 400));
    }
    console.log(file);
    const product = await Product.create({
        name,
        stock,
        image: file.originalname,
        price,
        category: category.toLowerCase(),
    });
    res.status(201).json({
        success: true,
        message: `${product.name} added successfully`,
    });
};
export const getAllProducts = async (req, res, next) => {
    const products = await Product.find({ isDeleted: false });
    res.status(201).json({
        success: true,
        message: `Fetched products successfully`,
        data: products,
    });
};
// // Define a custom type for the request object
//anyone can access this route
export const getProductById = async (req, res, next) => {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) {
        return next(new ErrorHandler("User not found", 404));
    }
    res.status(201).json({
        success: true,
        message: `Fetched product successfully`,
        data: product,
    });
};
export const deleteUserById = async (req, res, next) => {
    const id = req.params.id;
    const productUpdate = await Product.findByIdAndUpdate({ _id: id }, { isDeleted: true });
    if (productUpdate) {
        res.status(200).json({
            success: true,
            message: `Product deleted successfully`,
        });
    }
    else {
        return next(new ErrorHandler("No product found", 400));
    }
};
