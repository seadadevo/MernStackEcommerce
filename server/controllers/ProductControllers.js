import { Product } from "../models/productModel.js";
import APIFeatures from "../utils/apiFeatures.js";
import { uploadStream } from "../utils/cloudinaryHelper.js";
import cloudinary from "../config/cloundinary.js";
import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

export const addProduct = catchAsync(async (req, res, next) => {
  const { productName, productDesc, productPrice, category, brand, stock } = req.body;
  const userId = req.id;
  const files = req.files;

  const uploadPromises = files.map(file => uploadStream(file.buffer, "mern_products"));
  const uploadResults = await Promise.all(uploadPromises);

  const productImgData = uploadResults.map(result => ({
    url: result.secure_url,
    public_id: result.public_id
  }));

  const existingProduct = await Product.findOne({ productName });
  if (existingProduct) {
    return next(new AppError(`Product with name "${productName}" already exists`, 400));
  }

  const newProduct = await Product.create({
    userId,
    productName,
    productDesc,
    productPrice,
    category,
    brand,
    stock: stock || 0,
    productImag: productImgData
  });

  return res.status(201).json({
    success: true,
    message: "Product added successfully",
    product: newProduct
  });
});

export const getAllProducts = catchAsync(async (req, res, next) => {
  const apiFeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter()
    .execute()
    .sort()
    .limitFields();

  const totalProductsCount = await Product.countDocuments(apiFeatures.filters);

  apiFeatures.paginate();
  const products = await apiFeatures.query;

  return res.status(200).json({
    success: true,
    totalProductsCount,
    results: products.length,
    products
  });
});

export const deleteProduct = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  // Delete images from cloudinary
  if (product.productImag && product.productImag.length > 0) {
    const deletePromises = product.productImag.map((img) =>
      cloudinary.uploader.destroy(img.public_id)
    );
    await Promise.all(deletePromises);
  }

  await Product.findByIdAndDelete(productId);

  return res.status(200).json({
    success: true,
    message: "Product and its images deleted successfully"
  });
});

export const updateProduct = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const { productName, productDesc, productPrice, category, brand } = req.body;
  const files = req.files;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  // If new images are uploaded, delete old ones and upload new
  if (files && files.length > 0) {
    const deletePromises = product.productImag.map((img) =>
      cloudinary.uploader.destroy(img.public_id)
    );
    await Promise.all(deletePromises);

    const uploadPromises = files.map(file => uploadStream(file.buffer, "mern_products"));
    const uploadResults = await Promise.all(uploadPromises);

    const productImgData = uploadResults.map(result => ({
      url: result.secure_url,
      public_id: result.public_id
    }));
    product.productImag = productImgData;
  }

  if (productName) product.productName = productName;
  if (productDesc) product.productDesc = productDesc;
  if (productPrice) product.productPrice = productPrice;
  if (category) product.category = category;
  if (brand) product.brand = brand;
  if (req.body.stock !== undefined) product.stock = req.body.stock;

  await product.save();

  return res.status(200).json({
    success: true,
    message: "Product has been updated successfully",
    product
  });
});

export const getProductById = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const product = await Product.findById(productId).populate("userId", "firstName lastName");

  if (!product) {
    return next(new AppError("Product does not exist", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Product has returned successfully",
    product
  });
});
