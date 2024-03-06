import { NextFunction, Request, Response } from "express";

import mongoose from "mongoose";
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

export type searchRequestQuery = {
  search?: string;
  price?: string;
  category?: string;
  sort?: string;
  page?: string;
};

export interface baseQueryType {
  name?: {
    $regex: string;
    $options: string;
  };
  price?: {
    $lte: number;
  };
  category?: string | undefined;
  isDeleted: Boolean;
}

export type InvalidateCacheType = {
  product?: boolean;
  order?: boolean;
  admin?: boolean;
};

export type shippingInfoType = {
  address: string;
  state: string;
  country: string;
  pinCode: number;
  city: string;
};
export type OrderItemsType = {
  productId: string;
  quantity: number;
};
export interface NewOrderRequestBody {
  shippingInfo: shippingInfoType;
  user: string;
  subTotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  orderItems: OrderItemsType[];

  name: string;
}
