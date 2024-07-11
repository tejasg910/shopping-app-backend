import mongoose from "mongoose";
import validator from "validator";
const Schema = new mongoose.Schema({
    _id: { type: String, required: [true, "Plase enter id"] },
    image: { type: String, required: [true, "Plase add image"] },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    name: { type: String, required: [true, "Plase enter name"] },
    isDeleted: { type: Boolean, default: false },
    email: {
        type: String,
        unique: [true, "Email already exists"],
        validator: validator.default.isEmail,
    },
}, { timestamps: true });
Schema.virtual("age").get(function () {
    const today = new Date();
    const dob = this.dob;
    let age = today.getFullYear() - dob.getFullYear();
    if (today.getMonth() < dob.getMonth() ||
        (today.getMonth() === dob.getMonth() && today.getDate() < dob?.getDate()))
        --age;
    return age;
});
export const User = mongoose.model("User", Schema);
