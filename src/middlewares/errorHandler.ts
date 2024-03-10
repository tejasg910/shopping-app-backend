import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/utility-class.js";
import { ControllerType } from "../types/types.js";

export const errorMiddleWare = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  if (err.name === "CastError") {
    err.message = "Invalid Id";
  }
  const message = err.message || "Internal Server error";
  console.log(err);
  return res.status(statusCode).json({ success: false, message });
};

export const TryCatch =
  (func: ControllerType) =>
  (req: Request<any>, res: Response, next: NextFunction) => {
    return Promise.resolve(func(req, res, next)).catch(next);
  };
