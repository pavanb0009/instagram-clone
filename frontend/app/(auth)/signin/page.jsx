import AuthPage from '@/components/custom/auth/AuthPage'
import React from 'react'

const page = () => {
    return (
        <section className='flex items-center justify-center h-screen'>
            <AuthPage type="signin" />
        </section>
    )
}

export default page