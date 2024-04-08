import { Request, Response, NextFunction } from "express";
import { User } from "../../models/User.js";
import { NewUserRequestBody, getUserByIdParam } from "../../types/types.js";
import ErrorHandler from "../../utils/utility-class.js";
import { userIncludeItems } from "../../utils/constants.js";

export const newUser = async (
  req: Request<{}, {}, NewUserRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { name, email, image, dob, gender, _id } = req.body;
  let user = await User.findById(_id);
  if (user) {
    return res
      .status(200)
      .json({ success: true, message: `Welcome, ${user.name}` });
  }

  if (!_id || !name || !email || !image || !dob || !gender) {
    next(new ErrorHandler("Please provide all fields", 400));
  }
  user = await User.create({
    name,
    email,
    image,
    dob: new Date(dob),
    gender,
    _id,
  });
  res.status(201).json({ success: true, message: `Welcome, ${user.name}` });
};

export const getAllUsers = async (
  req: Request<{}, {}, NewUserRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const users = await User.find({ isDeleted: false }).select(userIncludeItems);

  res.status(201).json({
    success: true,
    message: `Fetched users successfully`,
    data: users,
  });
};
interface Params {
  id: string;
}

// Define a custom type for the request object

export const getUserById = async (
  req: Request<{ id: string }, {}, NewUserRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  const user = await User.findById(id).select(userIncludeItems);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  res.status(201).json({
    success: true,
    message: `Fetched users successfully`,
    data: user,
  });
};
