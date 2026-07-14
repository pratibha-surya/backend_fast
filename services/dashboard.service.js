import User from "../models/User.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Order from "../models/Order.js";

export const getDashboard = async () => {

  const [
    totalUsers,
    totalProducts,
    totalCategories,
    totalOrders,
    pendingOrders,
    deliveredOrders,
    cancelledOrders,
  ] = await Promise.all([

    User.countDocuments(),

    Product.countDocuments({
      isDeleted: false,
    }),

    Category.countDocuments({
      isDeleted: false,
    }),

    Order.countDocuments(),

    Order.countDocuments({
      orderStatus: "pending",
    }),

    Order.countDocuments({
      orderStatus: "delivered",
    }),

    Order.countDocuments({
      orderStatus: "cancelled",
    }),

  ]);

  const revenue = await Order.aggregate([
    {
      $match: {
        paymentStatus: "paid",
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: "$grandTotal",
        },
      },
    },
  ]);

  return {

    totalUsers,

    totalProducts,

    totalCategories,

    totalOrders,

    pendingOrders,

    deliveredOrders,

    cancelledOrders,

    totalRevenue:
      revenue[0]?.totalRevenue || 0,

  };

};