import React, { useState } from 'react'
import InputOtpBox from './InputOtpBox'
import manageStore from '@/lib/store/store'
import LoadSpinner from '../LoadSpinner'
import { Button } from '@/components/ui/button'


const AuthOtp = ({ type }) => {

    const { verifyOtpAction, savedUser, resendOtp, loading, goBack } = manageStore()
    const [otpValue, setOtpValue] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()

        verifyOtpAction(otpValue, savedUser, type)
    }

    const handleResend = () => {
        resendOtp(savedUser)
    }

    const handleGoBack = () => {
        goBack()
    }

    return (
        <div className=' px-12 py-5'>
            <h1 className='text-center pb-3'>Email Verification</h1>
            <form onSubmit={handleSubmit} className="space-y-2">
                <InputOtpBox otpValue={otpValue} setOtpValue={setOtpValue} />
                <div className='flex items-center pb-5 justify-between'>
                    <p onClick={handleGoBack} className='text-blueInstadark-0 font-semibold cursor-pointer text-sm ' title='on clicking you cannot signup with same email within 10 minutes'>Go back</p>
                    <p onClick={handleResend} className='text-blueInstadark-0 font-semibold cursor-pointer text-sm ' title='resend otp to signed up email'>Resend</p>
                </div>
                {/* Submit Button */}
                <div className="text-center">
                    <Button type="submit" className="bg-blueInstaLight-0 hover:bg-blueInstadark-0 duration-300" >{loading ? <LoadSpinner /> : "Submit OTP"}</Button>
                </div>
            </form>
        </div>
    )
}

export default AuthOtp
