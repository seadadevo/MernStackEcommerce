import nodemailer from 'nodemailer';

export const sendVerifyEmail = async (token, email) => {
  try {
    console.log("=== Sending Verification Email ===");
    console.log("To:", email);
    console.log("MAIL_HOST:", process.env.MAIL_HOST);
    console.log("MAIL_PORT:", process.env.MAIL_PORT);
    console.log("MAIL_USER:", process.env.MAIL_USER ? "SET" : "NOT SET");
    console.log("MAIL_PASS:", process.env.MAIL_PASS ? "SET" : "NOT SET");
    
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
            subject: "Email Verification ✔",
            text: `Hi! There,
            You have recently visited our website and entered your email.
            Please follow the given link to verify your email:
            http://localhost:5173/verify/${token}
            
            Thanks!`,
            html: `<b>Hi! There,</b><br>Please click the link below to verify your email:<br>
                   <a href="http://localhost:5173/verify/${token}">Verify My Account</a>`
        });
        console.log("Email captured in Ecommerce! ID:", info.messageId);
        return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}
