"use client"


import ConversationList from './ConversationList'


const MessageLayout = ({ children, userRoute }) => {

    return (
        <div className='flex h-screen'>
            <div className={`w-full md:w-[35%] lg:w-[25%] ${userRoute ? "max-md:hidden" : ""}`}>
                <ConversationList />
            </div>
            <main className={`flex-1 h-full ${userRoute ? "" : "max-md:hidden"}`}>
                {children}
            </main>
        </div>
    )
}

export default MessageLayout
