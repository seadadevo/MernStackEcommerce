import { Product } from "../models/productModel.js";
import { Order } from "../models/orderModel.js";
import * as orderService from "../services/orderService.js";
import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

export const createOrder = catchAsync(async (req, res, next) => {
  const userId = req.id;
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return next(new AppError("No order items found", 400));
  }

  const orderDetails = await orderService.processOrderLogic(orderItems);

  const order = await Order.create({
    user: userId,
    orderItems: orderDetails.orderedProducts,
    billDetails: {
      subtotal: orderDetails.subtotal,
      taxPrice: orderDetails.taxPrice,
      shippingPrice: orderDetails.shippingPrice,
      totalPrice: orderDetails.totalPrice,
      currency: "EGP",
    },
    shippingAddress,
    paymentMethod: paymentMethod || "COD",
    status: "Pending",
  });

  return res.status(201).json({
    success: true,
    message: "Order created successfully",
    order,
  });
});

export const getMyOrders = catchAsync(async (req, res, next) => {
  const userId = req.id;
  const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
  
  return res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });
});

export const getOrderDetails = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId)
    .populate({ path: "user", select: "firstName email" })
    .populate({
      path: "orderItems.product",
      select: "productName productImag",
    });

  if (!order) {
    return next(new AppError("Order not found with this ID", 404));
  }

  return res.status(200).json({
    success: true,
    order,
  });
});

export const cancelOrder = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;
  const userId = req.id;

  const order = await Order.findById(orderId);

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  if (order.user.toString() !== userId.toString()) {
    return next(new AppError("You can only cancel your own orders", 403));
  }

  if (order.status !== "Pending") {
    return next(new AppError("Cannot cancel order once it is shipped or delivered", 400));
  }

  // Restore stock for cancelled items
  for (const item of order.orderItems) {
    const product = await Product.findById(item.product);
    if (product) {
      product.stock += item.quantity;
      await product.save();
    }
  }

  order.status = "Cancelled";
  await order.save();

  return res.status(200).json({
    success: true,
    message: "Order cancelled successfully and stock updated",
  });
});

export const getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find()
    .populate("user", "firstName lastName email")
    .sort("-createdAt");

  const totalAmount = orders.reduce(
    (acc, order) => acc + order.billDetails.totalPrice,
    0
  );

  return res.status(200).json({
    success: true,
    message: "All Orders returned Successfully",
    totalAmount,
    count: orders.length,
    orders,
  });
});

export const updateOrderStatus = catchAsync(async (req, res, next) => {
  const orderId = req.params.orderId;
  const { status } = req.body;
  const order = await Order.findById(orderId);

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  if (order.status === "Delivered" || order.status === "Cancelled") {
    return next(new AppError(`Cannot update status. Order is already ${order.status}`, 400));
  }

  order.status = status;
  if (status === "Delivered") {
    order.paymentStatus = "Paid";
    order.deliveredAt = Date.now();
  }
  await order.save();

  return res.status(200).json({
    success: true,
    message: `Order status updated to ${status}`,
    order,
  });
});

export const deleteOrder = catchAsync(async (req, res, next) => {
  const orderId = req.params.orderId;
  const order = await Order.findById(orderId);

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  // Restore stock if order was not cancelled or delivered
  if (order.status !== "Cancelled" && order.status !== "Delivered") {
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }
  }

  await order.deleteOne();

  return res.status(200).json({
    success: true,
    message: "Order Deleted Successfully and Stock Updated",
  });
});

export const getSalesStatus = catchAsync(async (req, res, next) => {
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const stats = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: thirtyDaysAgo },
        status: { $ne: "Cancelled" },
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalRevenue: { $sum: "$billDetails.totalPrice" },
      },
    },
  ]);

  return res.status(200).json({
    success: true,
    stats,
  });
});

export const getTopSellingProducts = catchAsync(async (req, res, next) => {
  const stats = await Order.aggregate([
    {
      $unwind: "$orderItems",
    },
    {
      $group: {
        _id: "$orderItems.product",
        totalSold: { $sum: "$orderItems.quantity" },
        totalRevenue: {
          $sum: { $multiply: ["$orderItems.quantity", "$orderItems.productPrice"] },
        },
      },
    },
    {
      $sort: { totalSold: -1 },
    },
    {
      $limit: 5,
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    {
      $unwind: "$productDetails",
    },
  ]);

  return res.status(200).json({
    success: true,
    message: "Top 5 selling products fetched",
    stats,
  });
});
