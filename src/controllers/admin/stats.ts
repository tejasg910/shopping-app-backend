import { NextFunction, Request, Response } from "express";
import { nodeCache } from "../../app.js";
import { Product } from "../../models/Product.js";
import { User } from "../../models/User.js";
import { Order } from "../../models/Order.js";
import { calculatePercentage } from "../../utils/features.js";
import { latestTransactionsDashboard } from "../../utils/constants.js";
import { getOrderDetails } from "../user/order.js";

export const getDashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let stats: any = {};

  if (nodeCache.has("admin-stats")) {
    stats = JSON.parse(nodeCache.get("admin-stats") as string);

    return res.status(200).json({
      success: true,
      message: "Data fetched successfully",
      data: stats,
    });
  } else {
    const today = new Date();
    const sixMonthAgo = new Date();
    sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);

    const thisMonth = {
      start: new Date(today.getFullYear(), today.getMonth(), 1),
      end: today,
    };
    const lastMonth = {
      start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
      end: new Date(today.getFullYear(), today.getMonth(), 0),
    };

    const thisMonthProductsPromise = Product.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });
    const lastMonthProductsPromise = Product.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    const thisMonthUsersPromise = User.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });
    const lastMonthUsersPromise = User.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    const thisMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });
    const lastMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    const lastSixMonthOrderPromise = Order.find({
      createdAt: {
        $gte: sixMonthAgo,
        $lte: today,
      },
    });
    const latestTransactionsPromise = Order.find({ isDeleted: false })
      .select(latestTransactionsDashboard)
      .sort({ createdAt: -1 })
      .limit(Number(process.env.DASHBOARD_ORDERS_LIMIT));
    const [
      thisMonthProducts,
      thisMonthUsers,
      thisMonthOrders,
      lastMonthProducts,
      lastMonthUsers,
      lastMonthOrders,
      productsCounts,
      usersCounts,
      allOrders,
      lastSixMonthOrders,
      categories,
      femaleUserCounts,
      latestTransactions,
    ] = await Promise.all([
      thisMonthProductsPromise,
      thisMonthUsersPromise,
      thisMonthOrdersPromise,
      lastMonthProductsPromise,
      lastMonthUsersPromise,
      lastMonthOrdersPromise,
      Product.countDocuments(),
      User.countDocuments(),
      Order.find({}).select("total"),
      lastSixMonthOrderPromise,
      Product.distinct("category"),
      User.countDocuments({ gender: "female" }),
      latestTransactionsPromise,
    ]);

    const thisMonthRevenue: number = thisMonthOrders.reduce(
      (total, order) => total + order.total || 0,
      0
    );
    const lastMonthRevenue: number = lastMonthOrders.reduce(
      (total, order) => total + order.total || 0,
      0
    );

    const percent = {
      revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
      product: calculatePercentage(
        thisMonthProducts.length,
        lastMonthProducts.length
      ),
      user: calculatePercentage(thisMonthUsers.length, lastMonthUsers.length),
      order: calculatePercentage(
        thisMonthOrders.length,
        lastMonthOrders.length
      ),
    };

    const revenue: number = allOrders.reduce(
      (total, order) => total + order.total || 0,
      0
    );

    const count = {
      user: usersCounts,
      product: productsCounts,
      order: allOrders.length,
    };
    const orderMonthCounts = new Array(6).fill(0);
    const orderMonthlyRevenue = new Array(6).fill(0);

    lastSixMonthOrders.forEach((order) => {
      const creationDate = order.createdAt;
      const monthDifference =
        (today.getMonth() - creationDate.getMonth() + 12) % 12;

      if (monthDifference < 6) {
        orderMonthCounts[6 - monthDifference - 1] += 1;
        orderMonthlyRevenue[6 - monthDifference - 1] += order.total;
      }
    });

    const categoriesCountPromise = categories.map((category) =>
      Product.countDocuments({ category })
    );
    const categoriesCount = await Promise.all(categoriesCountPromise);
    const allCategories: Record<string, number>[] = [];
    categories.forEach((category, index) => {
      allCategories.push({
        [category as string]: Math.round(
          (categoriesCount[index] / productsCounts) * 100
        ),
      });
    });

    const femaleUserPercentage = Number(
      (femaleUserCounts * 100) / usersCounts
    ).toFixed(2);
    const maleUserPercentage = Number(
      ((usersCounts - femaleUserCounts) * 100) / usersCounts
    ).toFixed(2);

    stats = {
      allCategories,
      revenue,
      percent,
      count,
      chart: { order: orderMonthCounts, revenue: orderMonthlyRevenue },
      genderRatio: {
        male: maleUserPercentage,
        female: femaleUserPercentage,
      },
      transactions: latestTransactions,
    };

    nodeCache.set("admin-stats", JSON.stringify(stats));

    return res.status(200).json({
      success: true,
      message: "Data fetched successfully",
      data: stats,
    });
  }
};
export const getPieChartsStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let charts;
  if (nodeCache.has("admin-pie-charts")) {
    charts = JSON.parse(nodeCache.get("admin-pie-charts") as string);
  } else {
    const [processingOrder, shippedOrder, deliveredOrder] = await Promise.all([
      Order.countDocuments({ status: "processing" }),
      Order.countDocuments({ status: "shipped" }),
      Order.countDocuments({ status: "delivered" }),
    ]);

    const orderFulFilment = {
      processing: processingOrder,
      shipped: shippedOrder,
      delivered: deliveredOrder,
    };
    charts = orderFulFilment;
    nodeCache.set("admin-pie-charts", JSON.stringify(charts));
  }
  return res.status(200).json({
    success: true,
    data: charts,
    message: "Fetched pie charts successfully",
  });
};
export const getBarChartsStats = async () => {
  let charts;
  const key = "admin-bar-charts";
  if (nodeCache.has(key)) charts = JSON.parse(nodeCache.get(key) as string);
  else {
    const sixMonthAgo = new Date();
    sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);
    const twelveMonthAgo = new Date();
    sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 12);
    const lastSixMonthProductPromise = Product.find({
      createdAt: {
        $gte: sixMonthAgo,
        $lte: twelveMonthAgo,
      },
    });
    const lastSixMonthUserPromise = User.find({
      createdAt: {
        $gte: sixMonthAgo,
        $lte: twelveMonthAgo,
      },
    });
    const tweleMonthOrderPromise = Order.find({
      createdAt: {
        $gte: sixMonthAgo,
        $lte: twelveMonthAgo,
      },
    });
    const [ products, users, orders ] = Promise.all([
      lastSixMonthProductPromise,
      lastSixMonthUserPromise,
      tweleMonthOrderPromise,
    ]);

    
    charts = {};

    nodeCache.set(key, JSON.stringify(charts));
  }
};
export const getLineChartsStats = async () => {};
