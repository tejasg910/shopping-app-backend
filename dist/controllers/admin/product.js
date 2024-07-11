import { Product } from "../../models/Product.js";
import ErrorHandler from "../../utils/utility-class.js";
import { rm } from "fs";
import { faker } from "@faker-js/faker";
import { nodeCache } from "../../app.js";
import { invalidateCache } from "../../utils/features.js";
import { FeatureProduct } from "../../models/FeatureProdduct.js";
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
    invalidateCache({ product: true });
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
    console.log(req.file?.originalname, "This is file");
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
    invalidateCache({ product: true });
    res.status(200).json({
        success: true,
        message: `product updated successfully`,
    });
};
export const getAllProducts = async (req, res, next) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 10;
    const skip = limit * (page - 1);
    const key = `allProducts-${page}`;
    const count = Product.countDocuments({ isDeleted: false });
    let allProducts = [];
    let productCounts = 0;
    if (nodeCache.has(key) && nodeCache.has("productCount")) {
        allProducts = JSON.parse(nodeCache.get(key));
        productCounts = Number(nodeCache.get("productCount"));
    }
    else {
        const productsList = Product.find({ isDeleted: false })
            .limit(limit)
            .skip(skip);
        const [products, productCount] = await Promise.all([productsList, count]);
        allProducts = products;
        productCounts = productCount;
        nodeCache.set(key, JSON.stringify(products));
        nodeCache.set("productCount", JSON.stringify(productCount));
    }
    res.status(200).json({
        success: true,
        message: `Fetched products successfully`,
        data: allProducts,
        totalPages: Math.ceil(productCounts / limit),
        currPage: page,
    });
};
export const getFeatureProduct = async (req, res, next) => {
    const featureProduct = await FeatureProduct.findOne({ isDeleted: false }).populate("product");
    res.status(200).json({
        success: true,
        message: `Fetched featured product successfully`,
        data: featureProduct,
    });
};
export const changeFeatureProduct = async (req, res, next) => {
    const { product, discount } = req.body;
    const featureProduct = await FeatureProduct.findOne({});
    if (featureProduct) {
        await FeatureProduct.findOneAndUpdate({}, {
            $set: {
                discount,
                product,
            }
        });
        res.status(200).json({
            success: true,
            message: `Feature product udpated successfully`,
        });
    }
    else {
        await FeatureProduct.create({ discount, product, isActive: true });
        res.status(200).json({
            success: true,
            message: `Feature product added successfully`,
        });
    }
};
export const changeFeatureProductStatus = async (req, res, next) => {
    const featureProduct = await FeatureProduct.findOne();
    console.log(featureProduct, 'this isfeature product');
    if (featureProduct) {
        await FeatureProduct.findOneAndUpdate({}, {
            $set: {
                isActive: !featureProduct.isActive
            }
        });
        res.status(200).json({
            success: true,
            message: `Product status udpated successfully`,
        });
    }
    else {
        res.status(400).json({
            success: false,
            message: `No product found`,
        });
    }
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
    invalidateCache({ product: true });
    res.status(200).json({
        success: true,
        message: `Product deleted successfully`,
    });
};
export const generateFakeProducts = async (req, res, next) => {
    try {
        const { count = 10 } = req.body;
        const fakeProducts = [];
        for (let i = 0; i < count; i++) {
            const user = createRandomUser();
            const fakeProduct = {
                image: "uploads/8cf3cae1-8e68-4ebc-abd1-d20a2075b3ea.jpg",
                name: faker.commerce.productName(),
                stock: faker.datatype.number({ min: 1, max: 100 }), // You can adjust the range as needed
                price: faker.datatype.number({ min: 1, max: 1000 }), // You can adjust the range as needed
                category: faker.commerce.department(),
                user,
                isDeleted: false,
            };
            fakeProducts.push(fakeProduct);
        }
        const savedProducts = await Product.insertMany(fakeProducts);
        invalidateCache({ product: true });
        console.log(`${count} fake products added successfully!`);
        res.status(200).json({
            success: true,
            message: `Product added successfully`,
        });
    }
    catch (error) {
        console.error("Error generating fake products:", error);
        throw error;
    }
};
function createRandomUser() {
    return {
        _id: faker.string.uuid(),
        avatar: faker.image.avatar(),
        birthday: faker.date.birthdate(),
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
    };
}
