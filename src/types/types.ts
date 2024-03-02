import { NextFunction, Request, Response } from "express";

export interface NewUserRequestBody {
  name: string;
  email: string;
  image: string;
  gender: string;
  role: string;
  _id: string;
  dob: Date;
}
export interface NewProductRequestBody {
  name: string;
  stock: string;

  price: string;
  category: string;
}
export type ControllerType = (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

export type getUserByIdParam = {
  id: string;
};
