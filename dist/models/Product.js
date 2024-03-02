import mongoose from "mongoose";
const Schema = new mongoose.Schema({
    image: { type: String, required: [true, "Plase add image"] },
    name: { type: String, required: [true, "Plase enter name"] },
    stock: { type: Number, required: [true, "Plase enter stock"] },
    price: { type: Number, required: [true, "Plase enter price"] },
    category: {
        type: String,
        required: [true, "Plase enter category"],
        trim: true,
    },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
export const Product = mongoose.model("Product", Schema);
