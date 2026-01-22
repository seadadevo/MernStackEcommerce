import mongoose from "mongoose";
import { Product } from "../models/productModel.js";
import AppError from "../utils/appError.js";

export const processOrderLogic = async (orderItems) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        let subtotal = 0;
        const orderedProducts = [];

        for (const item of orderItems) {
            // Use session for transaction support
            const productData = await Product.findById(item.product).session(session);
            
            if (!productData) {
                throw new AppError(`Product not found: ${item.product}`, 404);
            }
            
            if (productData.stock < item.quantity) {
                throw new AppError(`Not enough stock for ${productData.productName}. Available: ${productData.stock}`, 400);
            }

            const itemPrice = Number(productData.productPrice);
            const itemQuantity = Number(item.quantity);
            subtotal += itemPrice * itemQuantity;

            orderedProducts.push({
                product: productData._id,
                productPrice: itemPrice,
                quantity: item.quantity,
            });

            productData.stock -= item.quantity;
            await productData.save({ session });
        }

        const shippingPrice = subtotal > 500 ? 0 : 50;
        const taxPrice = Math.round(subtotal * 0.14) || 0;
        const totalPrice = subtotal + shippingPrice + taxPrice;

        await session.commitTransaction();

        return { orderedProducts, subtotal, shippingPrice, taxPrice, totalPrice };
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};