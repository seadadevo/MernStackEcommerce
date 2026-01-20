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
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        if (order.user.toString() !== userId) {
            return res.status(403).json({ success: false, message: "You can only cancel your own orders" });
        }

        if (order.status !== "Pending") {
            return res.status(400).json({ success: false, message: "Cannot cancel order once it is shipped or delivered" });
        }
        
        for (const item of order.orderItems) {
            const product = await Product.findById(item.product);
            if(product) {
                product.stock += item.quantity;
                await product.save();
            }
        }

        order.status = "Cancelled";
        await order.save();
        return res.status(200).json({
          success: true,
          message: "Order cancelled successfully and stock updated"
        });
    } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        });
    }
}