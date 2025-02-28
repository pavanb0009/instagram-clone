import Link from 'next/link'

const ChatUpperSection = ({ chatUser }) => {
  return (
    <div className='pt-8 px-4 border-b border-input pb-4'>
      <div>
        {chatUser ? (
          <>
            <Link href="/user" className='flex items-center cursor-pointer'>
              <Link className="mr-3" href="/messages"><i className="fi fi-rr-arrow-left"></i></Link>
              <img src={chatUser.profile_img} className='w-12 rounded-full' alt="" />
              <div className='pl-3'>
                <h1 className='font-bold '>{chatUser.fullname}</h1>
                <p className='text-[12px]'>@{chatUser.username}</p>
              </div>
            </Link>
          </>
        ) : (
          <p>Loading user information...</p>
        )}
      </div>
    </div>
  )
}

export default ChatUpperSection