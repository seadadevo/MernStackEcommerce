import nodemailer from 'nodemailer';
import 'dotenv/config';

export const sendOtpMail = async (otp, email) => {
  try {
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: parseInt(process.env.MAIL_PORT), 
        secure: false, 
        auth: {
            user: process.env.MAIL_USER, 
            pass: process.env.MAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false
        }
    })

    const info = await transporter.sendMail({
            from: `"ُEcommerce Shop" <${process.env.MAIL_USER}>`,
            to: email,
            subject: "Reset Your Password - OTP",
            text: `Hi There! Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`,
            html: `<div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px;">
                    <h2 style="color: #333;">Password Reset Request</h2>
                    <p>Use the following OTP to reset your password:</p>
                    <h1 style="color: #007bff; letter-spacing: 5px;">${otp}</h1>
                    <p>This code is valid for <b>10 minutes</b> only.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                </div>`
        });
        console.log("Email captured in Ecommerce! ID:", info.messageId);
        return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}
