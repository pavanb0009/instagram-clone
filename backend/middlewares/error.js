import { ErrorHandler } from "../utils/ErrorHandler.js";

const ErrorMiddleware = (err, req, res, next) => {
    err.message = err.message || "internal server error"
    err.statusCode = err.statusCode || 500

    if (err.code === 11000) {
        const value = ((Object.keys(err.keyValue)[0]).split(".")[1])
        const message = `${value} already exists`
        err = new ErrorHandler(message, 400)
    }


    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })

}

export default ErrorMiddleware