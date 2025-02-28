"use client"

import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import React, { useState } from 'react'


const InputOtpBox = ({ otpValue, setOtpValue }) => {

    return (
        <div className="space-y-2">
            <InputOTP
                maxLength={6}
                value={otpValue}
                onChange={(value) => setOtpValue(value)}
            >
                <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                </InputOTPGroup>
            </InputOTP>

        </div>
    )
}

export default InputOtpBox

