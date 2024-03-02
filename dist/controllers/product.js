import { Product } from "../models/Product.js";
import ErrorHandler from "../utils/utility-class.js";
export const newProduct = async (req, res, next) => {
    const { name, stock, price, category } = req.body;
    const file = req.file;
    if (!name || !stock || !price || !category) {
        next(new ErrorHandler("Please provide all fields", 400));
    }
    if (!file) {
        return next(new ErrorHandler("Please provide image", 400));
    }
    const product = await Product.create({
        name,
        stock,
        image: file.path,
        price,
        category: category.toLowerCase(),
    });
    res.status(201).json({
        success: true,
        message: `${product.name} added successfully`,
    });
};
// export const getAllUsers = async (
//   req: Request<{}, {}, NewUserRequestBody>,
//   res: Response,
//   next: NextFunction
// ) => {
//   const users = await User.find({ isDeleted: false }).select(includeItems);
//   res.status(201).json({
//     success: true,
//     message: `Fetched users successfully`,
//     data: users,
//   });
// };
// interface Params {
//   id: string;
// }
// // Define a custom type for the request object
// export const getUserById = async (
//   req: Request<{ id: string }, {}, NewUserRequestBody>,
//   res: Response,
//   next: NextFunction
// ) => {
//   const id = req.params.id;
//   const user = await User.findById(id).select(includeItems);
//   if (!user) {
//     return next(new ErrorHandler("User not found", 404));
//   }
//   res.status(201).json({
//     success: true,
//     message: `Fetched users successfully`,
//     data: user,
//   });
// };
// export const deleteUserById = async (
//   req: Request<{ id: string }, {}, NewUserRequestBody>,
//   res: Response,
//   next: NextFunction
// ) => {
//   const id = req.params.id;
//   const userUpdate = await User.findByIdAndUpdate(
//     { _id: id },
//     { isDeleted: true }
//   );
//   if (userUpdate) {
//     res.status(200).json({
//       success: true,
//       message: `User deleted successfully`,
//     });
//   } else {
//     return next(new ErrorHandler("No user found", 400));
//   }
// };
