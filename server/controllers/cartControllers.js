import { Cart } from "../models/cartModel.js";
import { Product } from "../models/productModel.js";
import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getCart = catchAsync(async (req, res, next) => {
  const userId = req.id;
  const cart = await Cart.findOne({ userId }).populate("items.productId");

  if (!cart) {
    return res.status(200).json({
      success: true,
      cart: { items: [], totalPrice: 0 },
    });
  }

  return res.status(200).json({
    success: true,
    cart,
  });
});

export const addToCart = catchAsync(async (req, res, next) => {
  const userId = req.id;
  const { productId } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({
      userId,
      items: [{ productId, quantity: 1, price: product.productPrice }],
      totalPrice: product.productPrice,
    });
  } else {
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      // Check stock before increasing quantity
      if (cart.items[itemIndex].quantity >= product.stock) {
        return next(new AppError(`Not enough stock. Available: ${product.stock}`, 400));
      }
      cart.items[itemIndex].quantity += 1;
    } else {
      cart.items.push({
        productId,
        quantity: 1,
        price: product.productPrice,
      });
    }

    cart.totalPrice = cart.items.reduce((total, item) => {
      return total + item.quantity * item.price;
    }, 0);
  }

  await cart.save();

  const populateCart = await Cart.findById(cart._id).populate("items.productId");

  return res.status(200).json({
    success: true,
    message: "Item added to cart",
    cart: populateCart,
  });
});

export const updateQuantity = catchAsync(async (req, res, next) => {
  const userId = req.id;
  const { productId, type } = req.body;

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  const item = cart.items[itemIndex];
  if (!item) {
    return next(new AppError("Item not found in cart", 404));
  }

  // Check stock when increasing
  if (type === "increase") {
    const product = await Product.findById(productId);
    if (item.quantity >= product.stock) {
      return next(new AppError(`Not enough stock. Available: ${product.stock}`, 400));
    }
    item.quantity += 1;
  }

  if (type === "decrease") {
    item.quantity -= 1;
  }

  if (item.quantity <= 0) {
    cart.items.splice(itemIndex, 1);
  }

  cart.totalPrice = cart.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  await cart.save();
  cart = await cart.populate("items.productId");

  return res.status(200).json({
    success: true,
    cart,
  });
});

export const deleteFromCart = catchAsync(async (req, res, next) => {
  const userId = req.id;
  const { productId } = req.body;

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }

  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId
  );

  cart.totalPrice = cart.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  await cart.save();
  await cart.populate("items.productId");

  return res.status(200).json({
    success: true,
    cart,
  });
});
