"use client"

import manageStore from '@/lib/store/store'
import React, { useEffect } from 'react'
import RelativeTime from '../FormatedDate'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const ConversationList = () => {
  const { conversations, getConversations, user, initializeSocket, onlineUsers } = manageStore()
  const params = useParams()
  const { userId } = params
  const loggedUserId = user?.id

  useEffect(() => { 
    if (loggedUserId) {
      getConversations()
      initializeSocket(loggedUserId)
    }
  }, [getConversations, initializeSocket, loggedUserId])

  if (!user) {
    return <div>No user logged in</div>
  }

  return (
    <div className="pt-10 border-r min-h-full border-input">
      <h1 className="px-2 pb-10 font-bold">Messages</h1>
      {conversations.length > 0 ? (
        conversations.map((conversation) => (
          (
            <Link
              href={`/messages/${conversation.otherUser._id}`}
              key={conversation._id}
              className={`flex py-3 cursor-pointer px-2 pr-5 items-center hover:bg-input duration-300 gap-2 ${userId === conversation.otherUser._id ? "bg-input" : ""
                }`}
            >
              <div className="relative">
                <img
                  className='w-14 rounded-full'
                  src={conversation.otherUser.profile_img}
                  alt={conversation.otherUser.fullname}
                />
                {onlineUsers.includes(conversation.otherUser._id) && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className='w-[100%]'>
                <h4>{conversation.otherUser.fullname}</h4>
                <p className={`${conversation.unreadCount > 0 && conversation.lastMessage.sender !== loggedUserId
                    ? " font-bold"
                    : "text-greySelected-0"
                  } text-sm line-clamp-1`}>
                  {conversation.lastMessage.content}
                </p>
              </div>
              <div className='ml-5'>
                <RelativeTime
                  date={conversation.lastMessage.createdAt}
                  color={
                    conversation.unreadCount > 0 && conversation.lastMessage.sender !== loggedUserId
                      ? "text-green-600"
                      : "text-greySelected-0"
                  }
                />
                {conversation.unreadCount > 0 && conversation.lastMessage.sender !== loggedUserId && (
                  <p className='bg-green-500 text-[12px] text-center rounded-full'>
                    {conversation.unreadCount}
                  </p>
                )}
              </div>
            </Link>
          )
        ))
      ) : (
        <div>No conversations found</div>
      )}
    </div>
  )
}

export default ConversationList