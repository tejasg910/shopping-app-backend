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
    _id: { type: String, required: [true, "Plase enter id"] },
    image: { type: String},

    role: { type: String, enum: ["admin", "user"], default: "user" },
    name: { type: String, },

    isDeleted: { type: Boolean, default: false },
    email: {
      type: String,
      
      unique: [true, "Email already exists"],
      validator: validator.default.isEmail,
    },
  },
  { timestamps: true }
);

Schema.virtual("age").get(function () {
  const today = new Date();
  const dob = this.dob;

  let age: Number = today.getFullYear() - dob.getFullYear();

  if (
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() < dob?.getDate())
  )
    --age;
  return age;
});

export const User = mongoose.model<IUser>("User", Schema);
