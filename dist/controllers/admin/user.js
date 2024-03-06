import { User } from "../../models/User.js";
import ErrorHandler from "../../utils/utility-class.js";
import { rm } from "fs";
export const createUser = async (req, res, next) => {
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
export const updateUser = async (req, res, next) => {
    const id = req.params.id;
    if (!id) {
        return next(new ErrorHandler("Please provide id ", 400));
    }
    const existingUser = await User.findById(id);
    if (!existingUser) {
        return next(new ErrorHandler("Please give valid id", 400));
    }
    const { name, gender, dob } = req.body;
    const file = req.file;
    if (file) {
        rm(existingUser.image, () => {
            console.log("deleted file");
        });
        existingUser.image = file.path;
    }
    if (name)
        existingUser.name = name;
    if (gender)
        existingUser.gender = gender;
    if (dob)
        existingUser.dob = dob;
    await existingUser.save();
    res.status(200).json({
        success: true,
        message: `user updated successfully`,
    });
};
export const deleteUser = async (req, res, next) => {
    const id = req.params.id;
    if (!id) {
        return next(new ErrorHandler("Please provide valid id", 400));
    }
    const user = await User.findById(id);
    if (!user) {
        return next(new ErrorHandler("Plase provide valid id", 404));
    }
    user.isDeleted = true;
    await user.save();
    res.status(200).json({
        success: true,
        message: `User deleted successfully`,
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
