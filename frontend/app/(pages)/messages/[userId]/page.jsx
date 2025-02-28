"use client"

import { useParams } from 'next/navigation'
import MessageLayout from '@/components/custom/messages/MessageLayout'
import ChatSection from '@/components/custom/messages/ChatSection'

const userid = () => {

    const params = useParams()
    const { userId } = params

    return (
        <div>
            <MessageLayout userRoute={userId}>
                <ChatSection user={userId} />
            </MessageLayout>
        </div>
    )
}

export default userid