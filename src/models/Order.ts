import { timeStamp } from "console";
import mongoose from "mongoose";
import validator from "validator";
interface IUser extends Document {
  _id: string;
  name: string;
  image: string;
  email: string;
  role: "admin" | "user";
  gender: "male" | "female";
  dob: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;

  //virtual attribute
  age: number;
}
const Schema = new mongoose.Schema(
  {
    shippingInfo: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      pinCode: { type: Number, required: true },
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
      enum: ["processing", "shipped", "delivered", "cancelled"],
      default: "processing",
    },
    // name: { type: String, required: [true, "Plase enter name"] },
    products: [
      {
        product: { type: mongoose.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
      },
    ],

    paymentMode: {
      type: String,
      enum: ["UPI", "", "Net-Banking", "Cash on Delivery"],
      default: "Cash on Delivery",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "", "Paid"],
      default: "Pending",
    },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", Schema);
