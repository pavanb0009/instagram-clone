import jwt from "jsonwebtoken"
import User from "../models/userModel.js"
import { ErrorHandler } from "../utils/ErrorHandler.js"
import { catchAsyncErrors } from "./catchAsyncErrors.js"

export const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies.tokenid

    if (!token) {
        return next(new ErrorHandler("Please refresh the page and login", 403))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.userId)

    if (!req.user) {
        return next(new ErrorHandler("User not found", 404))
    }

    next()

})