import { sendVerifyEmail } from "../utils/verifyEmail.js";
import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { Session } from "../models/sessionModel.js";
import bcrypt from "bcryptjs";
import { sendOtpMail } from "../utils/sendOtpMail.js";
import cloudinary from "../config/cloundinary.js";
import { uploadStream } from "../utils/cloudinaryHelper.js";
import { Cart } from "../models/cartModel.js";
import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

export const register = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return next(new AppError("All fields are required", 400));
  }

  const user = await User.findOne({ email });
  if (user) {
    return next(new AppError("User already exists", 400));
  }

  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password,
  });

  const token = jwt.sign(
    { id: newUser._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  const emailSent = await sendVerifyEmail(token, email);
  if (!emailSent) {
    console.log("Warning: Verification email failed to send");
  }

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    token,
    user: newUser,
  });
});

export const verify = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Authorization token is missing or invalid", 400));
  }

  const token = authHeader.split(" ")[1];
  let decode;

  try {
    decode = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new AppError("The registration token has expired", 400));
    }
    return next(new AppError("Token verification failed", 400));
  }

  const user = await User.findById(decode.id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  user.isVerified = true;
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Email verified successfully",
  });
});

export const reVerfiy = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (user.isVerified) {
    return next(new AppError("This account is already verified", 400));
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  await sendVerifyEmail(token, email);

  return res.status(200).json({
    success: true,
    message: "Verification email sent successfully",
    token,
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const userAgent = req.headers["user-agent"] || "Unknown Device";
  const ipAddress = req.ip || req.connection.remoteAddress || "Unknown IP";

  if (!email || !password) {
    return next(new AppError("All fields are required", 400));
  }

  const existingUser = await User.findOne({ email }).select("+password");
  if (!existingUser) {
    return next(new AppError("User does not exist", 400));
  }

  const cart = await Cart.findOne({ userId: existingUser._id }).populate("items.productId");

  const isPasswordValid = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordValid) {
    return next(new AppError("Invalid credentials", 400));
  }

  if (existingUser.isVerified === false) {
    return next(new AppError("Verify your account then login", 400));
  }

  const accessToken = jwt.sign(
    { id: existingUser._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
  );

  const refreshToken = jwt.sign(
    { id: existingUser._id },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );

  existingUser.isLoggedIn = true;
  await existingUser.save();

  const existingSession = await Session.findOne({ userId: existingUser._id });
  if (existingSession) {
    await Session.deleteOne({ userId: existingUser._id });
  }

  await Session.create({
    userId: existingUser._id,
    userAgent,
    ipAddress,
  });

  const userResponse = existingUser.toObject();
  delete userResponse.password;

  return res.status(200).json({
    success: true,
    message: `Welcome back ${existingUser.firstName}`,
    user: userResponse,
    cart,
    accessToken,
    refreshToken,
  });
});

export const logout = catchAsync(async (req, res, next) => {
  const userId = req.id;

  await Session.deleteMany({ userId });
  await User.findByIdAndUpdate(userId, { isLoggedIn: false });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

export const forgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  user.otp = otp;
  user.otpExpiry = otpExpiry;

  await user.save();
  await sendOtpMail(otp, email);

  return res.status(200).json({
    success: true,
    message: "OTP sent to email successfully",
  });
});

export const verifyOTP = catchAsync(async (req, res, next) => {
  const { otp, email } = req.body;

  if (!otp || !email) {
    return next(new AppError("Email and OTP are required", 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (!user.otp || !user.otpExpiry || user.otpExpiry < new Date()) {
    return next(new AppError("OTP has expired or wasn't requested", 400));
  }

  if (otp !== user.otp) {
    return next(new AppError("OTP is invalid", 400));
  }

  user.isOtpVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "OTP verified successfully. Now you can reset your password!",
  });
});

export const changePassword = catchAsync(async (req, res, next) => {
  const { newPassword, confirmPassword, email } = req.body;

  if (!newPassword || !confirmPassword || !email) {
    return next(new AppError("All fields are required", 400));
  }

  if (newPassword !== confirmPassword) {
    return next(new AppError("Passwords don't match", 400));
  }

  const user = await User.findOne({ email, isOtpVerified: true });

  if (!user) {
    return next(new AppError("Unauthorized: Please verify your OTP first", 400));
  }

  user.password = newPassword;
  user.isOtpVerified = undefined;
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

export const allUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  return res.status(200).json({
    success: true,
    users,
  });
});

export const getUserById = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const user = await User.findById(userId).select("-password");

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  return res.status(200).json({
    success: true,
    user,
  });
});

export const updateUser = catchAsync(async (req, res, next) => {
  const userIdToUpdate = req.params.userId;
  const loggedInUser = req.user;
  const { firstName, lastName, role, address, city, zipCode, phoneNumber } = req.body;

  if (loggedInUser._id.toString() !== userIdToUpdate && loggedInUser.role !== "admin") {
    return next(new AppError("You are not allowed to update this profile", 403));
  }

  let user = await User.findById(userIdToUpdate);
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  let profilePicUrl = user.profilePic;
  let profilePicPublicId = user.profilePicPublicId;

  if (req.file) {
    if (profilePicPublicId) {
      await cloudinary.uploader.destroy(profilePicPublicId);
    }

    const uploadResult = await uploadStream(req.file.buffer, "profiles");

    profilePicUrl = uploadResult.secure_url;
    profilePicPublicId = uploadResult.public_id;
  }

  if (firstName !== undefined) user.firstName = firstName;
  if (lastName !== undefined) user.lastName = lastName;
  if (address !== undefined) user.address = address;
  if (city !== undefined) user.city = city;
  if (zipCode !== undefined) user.zipCode = zipCode;
  if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;

  user.profilePic = profilePicUrl;
  user.profilePicPublicId = profilePicPublicId;

  const updatedUser = await user.save();

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: updatedUser,
  });
});