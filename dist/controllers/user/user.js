import { User } from "../../models/User.js";
import ErrorHandler from "../../utils/utility-class.js";
import { userIncludeItems } from "../../utils/constants.js";
export const newUser = async (req, res, next) => {
    const { name, email, image, _id } = req.body;
    let user = await User.findById(_id);
    if (user) {
        return res
            .status(200)
            .json({ success: true, message: `Welcome, ${user.name}` });
    }
    if (!_id || !name || !email || !image) {
        next(new ErrorHandler("Please provide all fields", 400));
    }
    user = await User.create({
        name,
        email,
        image,
        _id,
    });
    res.status(201).json({ success: true, message: `Welcome, ${user.name}` });
};
// Define a custom type for the request object
export const getUserById = async (req, res, next) => {
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
export const updateUserEmail = async (req, res, next) => {
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
        $set: {
            "email": email,
        }
    });
    return res
        .status(200)
        .json({ success: true, message: "Email updated successfully" });
};
