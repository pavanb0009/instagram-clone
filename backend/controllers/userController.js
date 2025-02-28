import User from "../models/userModel.js"
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js"
import { ErrorHandler } from "../utils/ErrorHandler.js";
import { sendOtp } from "../middlewares/sendOtp.js";
import bcrypt from "bcryptjs"
import { generateToken } from "../middlewares/generateToken.js";
import admin from "../firebase-admin.js";
import { generateUsername } from "../utils/helper.js";


let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password
let spaceRegex = /^\S+$/


//SIGNUP
export const signUp = catchAsyncErrors(async (req, res, next) => {

    const { fullname, username, email, password } = req.body


    if (!fullname || !username || !email || !password) {
        return next(new ErrorHandler("Fill all the fields", 403))
    }

    if (!emailRegex.test(email)) {
        return next(new ErrorHandler("Invalid email address", 403))
    }

    if (!passwordRegex.test(password)) {
        return next(new ErrorHandler("Password should contain atleast one lowercase,uppercase and a numerical", 403))
    }

    if (!spaceRegex.test(username)) {
        return next(new ErrorHandler("username should not contain spaces", 403))
    }

    const { otp, expiresAt } = await sendOtp(email)

    const user = new User({
        personal_info: {
            fullname, email, password, username
        },
        otp: {
            code: otp, expiresAt
        }
    })

    await user.save()

    res.status(200).json({
        username: user.personal_info.username,
        message: "OTP sent to email"
    })

})



//VERIFY USER
export const verifyUser = catchAsyncErrors(async (req, res, next) => {
    const { otp, user, type } = req.body;

    if (!otp || otp.length !== 6) {
        return next(new ErrorHandler("Enter a valid 6-digit OTP", 403));
    }

    const userFound = await User.findOne({
        $or: [
            { "personal_info.username": user },
            { "personal_info.email": user }
        ]
    });

    if (!userFound) {
        return next(new ErrorHandler("User not found", 404));
    }

    const isOtpValid = await bcrypt.compare(otp, userFound.otp.code);

    if (!isOtpValid) {
        return next(new ErrorHandler("Incorrect OTP", 403));
    }

    const currentTime = new Date();
    if (currentTime > userFound.otp.expiresAt) {
        return next(new ErrorHandler("OTP has expired, click resend to send again", 403));
    }

    userFound.isVerified = true;
    await userFound.save();

    if (type === "signup") {

        generateToken(res, userFound._id);

        res.status(200).json({
            success: true,
            id: userFound._id,
            profile_img: userFound.personal_info.profile_img,
            username: userFound.personal_info.username,
            message: "User verified successfully"
        });
    } else if (type === "forgot") {
        res.status(200).json({
            success: true,
            message: "User verified successfully",
            user: userFound.personal_info.username
        });
    }
});


//RESEND OTP
export const resendOtp = catchAsyncErrors(async (req, res, next) => {
    const { user } = req.body

    const userFound = await User.findOne({
        $or: [
            { "personal_info.username": user },
            { "personal_info.email": user }
        ]
    });

    if (!userFound) {
        return next(new ErrorHandler("User not found, try again", 404));
    }

    const { otp, expiresAt } = await sendOtp(userFound.personal_info.email)

    userFound.otp = {
        code: otp,
        expiresAt
    }

    await userFound.save()

    res.status(200).json({
        success: true,
        message: "OTP sent successfully to email",
        user: userFound.personal_info.username
    })

})



//LOGIN
export const loginUser = catchAsyncErrors(async (req, res, next) => {
    const { user, password } = req.body

    const userFound = await User.findOne({
        $or: [
            { "personal_info.username": user },
            { "personal_info.email": user }
        ]
    });

    if (!userFound) {
        return next(new ErrorHandler("User not found, please signup", 404))
    }

    if (!userFound.isVerified) {
        return next(new ErrorHandler("You are not verified signup again or verify", 403))
    }

    const passwordVerified = await bcrypt.compare(password, userFound.personal_info.password)

    if (!passwordVerified) {
        return next(new ErrorHandler("Incorrect password", 403))
    }

    generateToken(res, userFound._id)

    res.status(200).json({
        success: true,
        message: "Logged in successfully",
        id: userFound._id,
        profile_img: userFound.personal_info.profile_img,
        username: userFound.personal_info.username
    })

})


//RESET PASSWORD

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
    const { user, password, confirmPassword } = req.body

    const userFound = await User.findOne({
        $or: [
            { "personal_info.username": user },
            { "personal_info.email": user }
        ]
    });

    if (!userFound) {
        return next(new ErrorHandler('user exdpired re verify again', 404))
    }

    if (password !== confirmPassword) {
        return next(new ErrorHandler("passwords do not match", 403))
    }

    userFound.personal_info.password = password
    await userFound.save()

    res.status(200).json({
        message: "password changed successfully",
        success: true
    })

})

//google signup

export const googleSignup = catchAsyncErrors(async (req, res, next) => {
    const { idToken } = req.body

    const decodedUser = await admin.auth().verifyIdToken(idToken)
    const { email, name, picture } = decodedUser

    let userFound = await User.findOne({ "personal_info.email": email })

    const newUsername = await generateUsername(User, name)

    if (!userFound) {
        userFound = await User.create({
            personal_info: {
                fullname: name,
                email,
                profile_img: picture,
                username: newUsername
            },
            google_auth: true,
            isVerified: true
        })
    } else if (!userFound.google_auth) {
        return next(new ErrorHandler("Cannot login check email", 403))
    }

    generateToken(res, userFound._id)

    res.status(200).json({
        message: "Logged in successfully",
        success: true,
        id: userFound._id,
        profile_img: userFound.personal_info.profile_img,
        username: userFound.personal_info.username
    })

})