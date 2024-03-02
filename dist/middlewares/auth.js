import ErrorHandler from "../utils/utility-class.js";
import { User } from "../models/User.js";
//middeleware to make sure only admin is allowed
export const adminOnly = async (req, res, next) => {
    const { id } = req.query;
    console.log(id, "id");
    if (!id) {
        return next(new ErrorHandler("bhutnike login kar pahle", 401));
    }
    const user = await User.findById(id);
    if (!user) {
        return next(new ErrorHandler("Kamine, fake id deta hai!!!", 401));
    }
    if (user.role !== "admin") {
        return next(new ErrorHandler("Nikal la*de pahli fursat me", 401));
    }
    next();
};
