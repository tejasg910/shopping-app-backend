import { Request, Response, NextFunction } from "express";
import { User } from "../../models/User.js";
import { NewUserRequestBody, getUserByIdParam } from "../../types/types.js";
import ErrorHandler from "../../utils/utility-class.js";
import { userIncludeItems } from "../../utils/constants.js";

export const newUser = async (
  req: Request<{ id: string }, {}>,
  res: Response,
  next: NextFunction
) => {
  let  { name, email, image, dob, gender, _id } = req.body;

  if(!name){
    if(email){
      name  = email.split("@")[0]
    }
  }
  let user = await User.findById(_id);
  if (user) {
    return res
      .status(200)
      .json({ success: true, message: `Welcome, ${user.name}` });
  }
console.log(_id)
  if (!_id) {
    next(new ErrorHandler("Please provide all fields", 400));
  }
  console.log("came here")
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
  res.status(200).json({
    success: true,
    message: `Fetched users successfully`,
    data: user,
  });
};


export const updateUserEmail = async ( req: Request<{ id: string }, {}, NewUserRequestBody>,
  res: Response,
  next: NextFunction) => {
  const { email } = req.body;
  const userId = req.params.id;
  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide email" });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "User does not exists" });
  }


  

  user.email = email;

  await User.findByIdAndUpdate(userId, {
    $set:{
      "email":email, 
    }
  })

  return res
    .status(200)
    .json({ success: true, message: "Email updated successfully" });
};
