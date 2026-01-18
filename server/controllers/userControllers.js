import { sendVerifyEmail } from "../utils/verifyEmail.js";
import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { Session } from "../models/sessionModel.js";
import bcrypt from "bcryptjs";
import { sendOtpMail } from "../utils/sendOtpMail.js";
import cloudinary from "../config/cloundinary.js";
import { uploadStream } from "../utils/cloudinaryHelper.js";
import { Cart } from "../models/cartModel.js";

export const register = async (req, res) => {
    try {
        const {firstName, lastName, email, password} = req.body;
        if(!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: `All fields are required`
            })
        }

        const user = await User.findOne({email});
        if(user) {
            return res.status(400).json({
                success: false,
                message: `User already exist`
            })
        }

     

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password
        });


        const token = jwt.sign(
            {id: newUser._id},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN}
        )
        
        const emailSent = await sendVerifyEmail(token, email);
        if (!emailSent) {
            console.log("Warning: Verification email failed to send");
        }

        return res.status(201).json({
            success: true,
            message: 'User registered Successfully',
            token,
            user: newUser
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message  
        })
    }
}

export const verify = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(400).json({
                success: false,
                message: "Authorization token is missing or invalid "
            })            
        }

        const token = authHeader.split(" ")[1];
        let decode; 
        try {
            decode = jwt.verify(token , process.env.JWT_SECRET);
        }
        catch (error) {
            if(error.name === "TokenExpiredError") {
                return res.status(400).json({
                    success: false,
                    message: "The reigstration token has expired"
                })
            }
            return res.status(400).json({
                success: false,
                message: "Token verification faild"
            })
        }
        const user = await User.findById(decode.id);
        if(!user) {
            return res.status(400).json({
                success: false,
                message: "User nor found"
            })
        }
        user.isVerified = true
        await user.save()
        return res.status(200).json({
            success: true,
            message: "Email Verified Succssfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export const reVerfiy = async (req, res) => {
    try {
        const {email} = req.body;
    const user =await User.findOne({email});
    if(!user){
        return res.status(400).json({
            success: false,
            message: "User not found"
        })
    }

    if(user.isVerified) {
        return res.status(400).json({
            success: false,
            message: "This account is already verified"
        })
    }

    const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN}
        )
    await sendVerifyEmail(token, email);
        return res.status(200).json({
            success: true,
            message: "Verification email send Succssfully",
            token
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
    
        const userAgent = req.headers['user-agent'] || 'Unknown Device';
        const ipAddress = req.ip || req.connection.remoteAddress || 'Unknown IP';

        if(!email || !password) {
            return res.status(400).json({
            success: false,
            message: "All fields are required!"
        })
    }
    
    const existingUser = await User.findOne({email}).select("+password");
    if(!existingUser) {
        return res.status(400).json({
        success: false,
        message: "User not exist"
    })
    }
    const cart = await Cart.findOne({userId: existingUser._id}).populate("items.productId")
    const isPasswordValid = await bcrypt.compare(password, existingUser.password) 
    if(!isPasswordValid) {
        return res.status(400).json({
            success: false,
            message: "Invalid Credentials"
        })
    }
    
    if(existingUser.isVerified === false){
        return res.status(400).json({
            success: false,
            message: "Verify Your account then Login"
        })
    }

    const accessToken = jwt.sign(
            {id: existingUser._id},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN || '15m'}
        );
        
    const refreshToken = jwt.sign(
            {id: existingUser._id},
            process.env.JWT_SECRET,
            {expiresIn: '30d'}
        );

    existingUser.isLoggedIn = true;
    await existingUser.save();
    
    const existingSession = await Session.findOne({userId: existingUser._id})
    if(existingSession) {
        await Session.deleteOne({userId: existingUser._id}) 
    }    

    
    await Session.create(
        {
            userId: existingUser._id,
            userAgent,
            ipAddress
        },
    )    

    const userReponse = existingUser.toObject();
    delete userReponse.password; 

    return res.status(200).json({
        success: true,
        message: `Welcome back ${existingUser.firstName}`,
        user: userReponse,
        cart,
        accessToken,
        refreshToken
    })
    
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const logout = async (req, res) => {
    try {   
        const userId = req.id;
        await Session.deleteMany({userId: userId});
        await User.findByIdAndUpdate(userId, {isLoggedIn: false} );
        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export const forgetPassword = async (req, res) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({email});
        if(!user) {
            return res.status(200).json({
                success: false,
                message: "User not found"
            })
        } 
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now()+10*60*1000); 

        user.otp = otp
        user.otpExpiry = otpExpiry

        await user.save();
        await sendOtpMail(otp, email);

        return res.status(200).json({
            success: true,
            message: "Otp sent to email successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
} 

export const verifyOTP = async (req, res) => {
    try {
        const { otp, email } = req.body;
        if (!otp || !email) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required"
            });
        }

        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        
        if(!user.otp || !user.otpExpiry || user.otpExpiry < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired or wasn't requested"
            })
        }
        
        if(otp !== user.otp) {
            return res.status(400).json({
                success: false,
                message: "Otp is invalid"
            })
        }
        user.isOtpVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;

        await user.save();
        return res.status(200).json({
            success: true,
            message: "Otp veified successfully. Now You can Reset Your Password!"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
} 

export const changePassword = async(req, res) => {
    try {
        const {newPassword, confirmPassword, email} = req.body;

        if (!newPassword || !confirmPassword || !email) {
            return res.status(400).json({
                success: false,
                message: "All Feilds are required"
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords don't match" 
            });
        }

        const user = await User.findOne({email, isOtpVerified: true});

        if(!user) {
            return res.status(400).json({
                success: false,
                message: "Unauthorized: Please verify your OTP first"
            })
        }

        user.password = newPassword;
        user.isOtpVerified = undefined;
        await user.save();


        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const allUsers = async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).json({
            success: true,
            users
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getUserById = async (req, res) => {
    try {
        const {userId} = req.params;
        const user = await User.findOne({userId}.select("-password"));
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const updateUser = async (req, res) => {
    try {
        const userIdToUpdate = req.params.userId;
        const loggedInUser = req.user;
        const { firstName, lastName, role, address, city, zipCode, phoneNumber } = req.body;

        if (loggedInUser._id.toString() !== userIdToUpdate && loggedInUser.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'You are not allowed to update this profile'
            });
        }

        let user = await User.findById(userIdToUpdate);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User Not found' });
        }

        let profilePicUrl = user.profilePic;
        let profilePicPublicId = user.profilePicPublicId;

        if (req.file) {
          if (profilePicPublicId) {
            await cloudinary.uploader.destroy(profilePicPublicId);
         }

         const uploadResult = await uploadStream(req.file.buffer, 'profiles');
         
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
            message: "Profile Updated Successfully",
            user: updatedUser
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}