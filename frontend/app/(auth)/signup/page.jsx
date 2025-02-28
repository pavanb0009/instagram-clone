import AuthPage from '@/components/custom/auth/AuthPage'
import React from 'react'

const page = () => {
    return (
        <section className='flex items-center h-screen justify-center'>
            <AuthPage type="signup"/>
        </section>
    )
}

export default page