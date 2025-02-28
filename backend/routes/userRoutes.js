import express from "express"
import { googleSignup, loginUser, resendOtp, resetPassword, signUp, verifyUser } from "../controllers/userController.js"

const router = express.Router()

router.post("/signup", signUp)
router.post("/verify-otp", verifyUser)
router.post("/resend-otp", resendOtp)
router.post("/login", loginUser)
router.post("/reset-password", resetPassword)
router.post("/google-signup", googleSignup)



export default router