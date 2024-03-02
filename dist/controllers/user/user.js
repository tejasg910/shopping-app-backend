import { User } from "../../models/User.js";
import ErrorHandler from "../../utils/utility-class.js";
import { includeItems } from "../../utils/constants.js";
export const newUser = async (req, res, next) => {
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
export const getAllUsers = async (req, res, next) => {
    const users = await User.find({ isDeleted: false }).select(includeItems);
    res.status(201).json({
        success: true,
        message: `Fetched users successfully`,
        data: users,
    });
};
// Define a custom type for the request object
export const getUserById = async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id).select(includeItems);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    res.status(201).json({
        success: true,
        message: `Fetched users successfully`,
        data: user,
    });
};
export const deleteUserById = async (req, res, next) => {
    const id = req.params.id;
    const userUpdate = await User.findByIdAndUpdate({ _id: id }, { isDeleted: true });
    if (userUpdate) {
        res.status(200).json({
            success: true,
            message: `User deleted successfully`,
        });
    }
    else {
        return next(new ErrorHandler("No user found", 400));
    }
};
