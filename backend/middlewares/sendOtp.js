import nodemailer from "nodemailer"
import crypto from "crypto"



export const sendOtp = async (email) => {
    const otp = crypto.randomInt(100000, 999999).toString()
    const expiresIn = Date.now() + 10 * 60 * 1000

    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    })

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Instagram OTP email verification',
        text: otp

    }

    await transporter.sendMail(mailOptions)

    return { otp, expiresIn }

}