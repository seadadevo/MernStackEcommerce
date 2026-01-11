import { sendVerifyEmail } from "../utils/verifyEmail.js";
import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";

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
        let decode 
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
        const user = await User.findById(decoded.id);
        if(!user) {
            return res.status(400).json({
                success: false,
                message: "User nor found"
            })
        }
        user.token = null
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