import { Product } from "../../models/Product.js";
import ErrorHandler from "../../utils/utility-class.js";
import { rm } from "fs";
export const newProduct = async (req, res, next) => {
    const { name, stock, price, category } = req.body;
    const file = req.file;
    if (!file) {
        return next(new ErrorHandler("Please provide image", 400));
    }
    if (!name || !stock || !price || !category) {
        //delete uploaded file
        rm(file.path, () => {
            console.log("deleted file");
        });
        next(new ErrorHandler("Please provide all fields", 400));
    }
    const product = await Product.create({
        name,
        stock,
        image: file.path,
        price,
        category: category.toLowerCase(),
    });
    res.status(201).json({
        success: true,
        message: `${product.name} added successfully`,
    });
};
export const udpateProduct = async (req, res, next) => {
    const id = req.params.id;
    if (!id) {
        return next(new ErrorHandler("Please provide id ", 400));
    }
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
        return next(new ErrorHandler("Please give valid id", 400));
    }
    const { name, stock, price, category } = req.body;
    const file = req.file;
    if (file) {
        rm(existingProduct.image, () => {
            console.log("deleted file");
        });
        existingProduct.image = file.path;
    }
    if (name)
        existingProduct.name = name;
    if (stock)
        existingProduct.stock = parseInt(stock);
    if (price)
        existingProduct.price = parseInt(price);
    if (category)
        existingProduct.category = category;
    await existingProduct.save();
    res.status(200).json({
        success: true,
        message: `product updated successfully`,
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
export const deleteProductById = async (req, res, next) => {
    const id = req.params.id;
    if (!id) {
        return next(new ErrorHandler("Please provide valid id", 400));
    }
    const product = await Product.findById(id);
    if (!product) {
        return next(new ErrorHandler("Product not exists", 404));
    }
    product.isDeleted = true;
    await product.save();
    res.status(200).json({
        success: true,
        message: `Product deleted successfully`,
    });
};
