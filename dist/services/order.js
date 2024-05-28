import { Product } from "../models/Product.js";
export const placeOrder = async (orderBody) => {
    const { products } = orderBody;
    const orders = [];
    const orderStatus = [];
    let validateSubTotal = 0;
    for (let i = 0; i < products.length; i++) {
        const productId = products[i].product;
        const quantity = products[i].quantity;
        const product = await Product.findById(productId);
        if (!product) {
            // throw new Error("Product not found");
        }
        else {
            if (product.stock < quantity) {
                orderStatus.push({
                    product: product.name,
                    success: false,
                    message: "Quantity is greater than available stock",
                });
            }
            else {
                product.stock -= quantity;
                await product.save();
                console.log(products[i], "inside function of else");
                //create order here
                validateSubTotal += product?.price ? product.price * quantity : 0;
                console.log(product?.price, quantity, "this is product price ");
                console.log(validateSubTotal, "this is validate subtotal");
                orders.push({
                    product: product._id,
                    quantity,
                });
                orderStatus.push({
                    product: product.name,
                    success: true,
                    message: "Order placed successfully",
                });
            }
        }
    }
    return { orders, validateSubTotal, orderStatus };
};
