import { Product } from "../models/productModel";
import { Order } from "../models/orderModel.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.id;
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No order items found" });
    }

    let subtotal = 0;
    const orderedProducts = [];

    for (const item of orderItems) {
      const productData = await Product.findById(item.product);
      if (!productData) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`,
        });
      }
      if (productData.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${productData.name}`,
        });
      }

      const itemPrice = productData.price;
      subtotal += itemPrice * item.quantity;

      orderedProducts.push({
        product: productData._id,
        productPrice: itemPrice,
        quantity: item.quantity,
      });

      productData.stock -= item.quantity;
      await productData.save();
    }

    const shippingPrice = subtotal > 500 ? 0 : 50;
    const taxPrice = Math.round(subtotal * 0.14);
    const totalPrice = subtotal + shippingPrice + taxPrice;

    const order = await Order.create({
      user: userId,
      orderedProducts: orderedProducts,
      billDetails: {
        subtotal,
        taxPrice,
        shippingPrice,
        totalPrice,
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.id;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId)
      .popualte({ path: "user", select: "firstName email" })
      .populate({
        path: "orderItems.product",
        select: "productName productImag",
      });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found with this ID",
      });
    }
    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Order ID" });
    }
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (order.user.toString() !== userId) {
      return res
        .status(403)
        .json({
          success: false,
          message: "You can only cancel your own orders",
        });
    }

    if (order.status !== "Pending") {
      return res
        .status(400)
        .json({
          success: false,
          message: "Cannot cancel order once it is shipped or delivered",
        });
    }

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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "firstName lastName email")
      .sort("-createdAt");

    const totalAmount = orders.reduce(
      (acc, order) => acc + order.billDetails.totalPrice,
      0,
    );
    return res.status(200).json({
      success: true,
      message: "All Orders returned Successfully ",
      totalAmount,
      count: orders.length,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    if (order.status === "Delivered" || order.status === "Cancelled") {
    return res.status(400).json({ 
        success: false, 
        message: `Cannot update status. Order is already ${order.status}` 
    });
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
} catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
}
};

export const deleteOrder = async(req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findById(orderId);
        if (!order) {
         return res
        .status(404)
        .json({ success: false, message: "Order not found" });
        }

        if(order.status !== "Cancelled" && order.status !== "Delivered" ) {
            for (const item of order.orderItems)     {
                const product = await Product.findById(item.product);
                if(product) {
                    product.stock += item.quantity;
                    await product.save();
                }
            }
        }
        await order.deleteOne()
        return res.status(200).json({
          success: true,
          message: `Order Deleted Successfully and Stock Updated`,
        });
    } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        });
    }
}

export const getSalesStatus = async (req, res) => {
    try {
        const today = new Date();
        const thrityDayAgo = new Date();
        thrityDayAgo.setDate(today.getDate() - 30);
        const stats = await Order.aggregate([
            {    
                $match: {
                    createdAt: {$gte: thrityDayAgo},
                    status: { $ne : "Cancelled"} 
                }
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                    totalRevenue: { $sum: "$billDetails.totalPrice" }
                }
            }
        ])
        return res.status(200).json({
          success: true,
          stats
        });

    } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        });
    }
}

const getTopSellingProducts = async (req, res) => {
    try {
        const stats = await Order.aggregate([
            {
                $unwind: "$orderItems" 
            },
            {
                $group: {
                    _id: "$orderItems.product",
                    totalSold: {$sum: "$orderItems.quantity"},
                    totalRevenue: {$sum: {$multiply: ["$orderItems.quantity" , "$orderItems.price"]}}
                }
            },
            {
                $sort: {totalSold: -1}
            },
            {
                $limit: 5
            },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            {
                $unwind: "$productDetails"
            }
        ]) 
        return res.status(200).json({
          success: true,
          message: "Top 5 selling products fetched",
          stats
        });
        
    } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        });
    } 
} 


