import mongoose from "mongoose";
const Schema = new mongoose.Schema({
    shippingInfo: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        pin: { type: Number, required: true },
    },
    user: {
        type: String,
        ref: "User",
        required: true,
    },
    subTotal: {
        type: Number,
        required: true,
    },
    tax: {
        type: Number,
        required: true,
    },
    shippingCharges: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["processing", "shipped", "delivered"],
        default: "processing",
    },
    name: { type: String, required: [true, "Plase enter name"] },
    orderItems: [
        { type: mongoose.Types.ObjectId, ref: "User", required: true },
    ],
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
export const Order = mongoose.model("Order", Schema);
