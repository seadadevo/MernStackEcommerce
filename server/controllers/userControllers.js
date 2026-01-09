import { sendVerifyEmail } from "../emailVerify/verifyEmail.js";
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