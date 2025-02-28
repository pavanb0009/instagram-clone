"use client"

import AuthOtp from '@/components/custom/auth/AuthOtp'
import LoadSpinner from '@/components/custom/LoadSpinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import manageStore from '@/lib/store/store'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const ForgotPassword = () => {

    const { loading, resendOtp, savedUser, verifiedUser, goBack, resetPasswordAction } = manageStore()
    const [user, setUser] = useState("")
    const [otpState, setOtpState] = useState(false)
    const [passwordState, setPasswordState] = useState(false)
    const [passwordValue, setPasswordValue] = useState(false)
    const [confirmPasswordValue, setConfirmPasswordValue] = useState(false)
    const [passwordShow, setPasswordShow] = useState(false)

    const handleSubmit = () => {
        resendOtp(user)
    }

    useEffect(() => {
        if (savedUser) {
            setOtpState(true)
        } else {
            setOtpState(false)
        }

        if (verifiedUser) {
            setPasswordState(true)
        } else {
            setPasswordState(false)
        }

    }, [savedUser, verifiedUser])

    const handlePasswordSubmit = () => {
        resetPasswordAction(savedUser, passwordValue, confirmPasswordValue)
    }


    const handleGoBack = () => {
        goBack()
    }

    return (
        <section className='flex items-center justify-center h-screen'>
            {
                !passwordState ?
                    (!otpState ?
                        (
                            <div className='flex px-5 pb-10 flex-col items-center rounded-3xl w-full max-w-[350px] border border-input'>
                                <h1 className="text-xl py-5 font-medium">Forgot password</h1>
                                <div className='w-full'>
                                    <Input className="mb-1 py-5" placeholder="email or username" type="text" onChange={(e) => setUser(e.target.value)} />
                                    <Link className='text-blueInstadark-0 text-[15px] text-left font-semibold' href="signin">Signin</Link>
                                    <Button onClick={handleSubmit} className={`w-full mb-5 mt-3 duration-300 font-bold ${loading ? "bg-blueInstaLight-0 hover:bg-blueInstaLight-0" : "bg-blueInstaLight-0 hover:bg-blueInstadark-0"}`} >
                                        {loading ? <LoadSpinner /> : "next"}
                                    </Button>
                                </div>
                            </div>
                        ) :
                        <AuthOtp type="forgot" />) :
                    (
                        <div className='flex px-5 pb-6 flex-col items-center rounded-3xl w-full max-w-[350px] border border-input'>
                            <h1 className="text-xl py-5 font-medium">Reset password</h1>
                            <div className='w-full'>
                                <div className='relative'>
                                    <Input className=" mb-5 py-5" placeholder="password" onChange={(e) => setPasswordValue(e.target.value)} type={passwordShow ? "text" : "password"} />
                                    <i className={`fi ${!passwordShow ? "fi-sr-eye" : "fi-sr-eye-crossed"} absolute right-4 cursor-pointer top-0 translate-y-1/2`} onClick={() => setPasswordShow(!passwordShow)}></i>
                                </div>
                                <div className='relative'>
                                    <Input className=" mb-5 py-5" placeholder="confirm password" onChange={(e) => setConfirmPasswordValue(e.target.value)} type={passwordShow ? "text" : "password"} />
                                    <i className={`fi ${!passwordShow ? "fi-sr-eye" : "fi-sr-eye-crossed"} absolute right-4 cursor-pointer top-0 translate-y-1/2`} onClick={() => setPasswordShow(!passwordShow)}></i>
                                </div>
                                <p onClick={handleGoBack} className='text-blueInstadark-0 font-semibold cursor-pointer text-sm ' title='on clicking you should verify again'>Go back</p>
                                <Button onClick={handlePasswordSubmit} className={`w-full mb-5 mt-3 duration-300 font-bold ${loading ? "bg-blueInstaLight-0 hover:bg-blueInstaLight-0" : "bg-blueInstaLight-0 hover:bg-blueInstadark-0"}`} >
                                    {loading ? <LoadSpinner /> : "next"}
                                </Button>
                            </div>
                        </div>
                    )
            }
        </section>
    )

}

export default ForgotPassword
