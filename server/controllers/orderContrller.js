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
        return res
          .status(404)
          .json({
            success: false,
            message: `Product not found: ${item.product}`,
          });
      }
      if (productData.stock < item.quantity) {
        return res
          .status(400)
          .json({
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
