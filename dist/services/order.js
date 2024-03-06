import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { validateObjectIds } from "../utils/features.js";
export const placeOrder = async (orderBody) => {
    const { shippingInfo, orderItems, user, subTotal, discount, shippingCharges, name, tax, total, } = orderBody;
    const orders = [];
    for (let i = 0; i < orderItems.length; i++) {
        const productId = orderItems[i].productId;
        const quantity = orderItems[i].quantity;
        const newProductId = await validateObjectIds(productId);
        const product = await Product.findById(newProductId);
        if (!product) {
            throw new Error("Product not found");
        }
        else {
            if (product.stock < quantity) {
                orders.push({
                    product: product.name,
                    success: false,
                    message: "Quantity is greater than available stock",
                });
            }
            else {
                product.stock -= quantity;
                await product.save();
                //create order here
                const orderSubTotal = product.price;
                const orderTotalPrice = shippingCharges + tax + orderSubTotal - discount;
                await Order.create({
                    shippingInfo,
                    user,
                    subTotal: orderSubTotal,
                    discount,
                    name,
                    shippingCharges,
                    tax,
                    quantity: quantity,
                    product: product._id,
                    total: orderTotalPrice,
                });
                orders.push({
                    product: product.name,
                    success: true,
                    message: "Order placed successfully",
                });
            }
        }
    }
    return orders;
};
