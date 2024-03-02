import { Request, Response, NextFunction } from "express";
import { Product } from "../../models/Product.js";
import {
  NewProductRequestBody,
  NewUserRequestBody,
  getUserByIdParam,
} from "../../types/types.js";
import ErrorHandler from "../../utils/utility-class.js";
import { includeItems } from "../../utils/constants.js";

export const newProduct = async (
  req: Request<{}, {}, NewProductRequestBody>,
  res: Response,
  next: NextFunction
) => {
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

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const products = await Product.find({ isDeleted: false });

  res.status(201).json({
    success: true,
    message: `Fetched products successfully`,
    data: products,
  });
};

// // Define a custom type for the request object
//anyone can access this route
export const getProductById = async (
  req: Request<{ id: string }, {}, NewUserRequestBody>,
  res: Response,
  next: NextFunction
) => {
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

export const deleteUserById = async (
  req: Request<{ id: string }, {}>,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const productUpdate = await Product.findByIdAndUpdate(
    { _id: id },
    { isDeleted: true }
  );
  if (productUpdate) {
    res.status(200).json({
      success: true,
      message: `Product deleted successfully`,
    });
  } else {
    return next(new ErrorHandler("No product found", 400));
  }
};
