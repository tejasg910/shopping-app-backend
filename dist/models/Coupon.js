import mongoose from "mongoose";
const Schema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, "Please enter coupon code"],
        unique: true,
    },
    amount: {
        type: Number,
        required: [true, "Please enter amount"],
    },
});
export const Coupon = mongoose.model("coupon", Schema);
