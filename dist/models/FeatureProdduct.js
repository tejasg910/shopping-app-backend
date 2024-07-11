import mongoose from "mongoose";
const Schema = new mongoose.Schema({
    product: { type: mongoose.Types.ObjectId, ref: "Product" },
    discount: { type: Number, required: [true, "Plase enter name"] },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
}, { timestamps: true });
export const FeatureProduct = mongoose.model("FeatureProduct", Schema);
