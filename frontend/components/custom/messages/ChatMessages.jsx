import { formatDate, formatDateHeader, groupMessagesByDate } from '@/lib/helpers';
import manageStore from '@/lib/store/store';

const ChatMessages = ({ chatmessages, chatUser }) => {
    const { user } = manageStore();
    const userId = user?.id;

    const messageGroups = groupMessagesByDate(chatmessages);

    return (
        <div className='px-3 py-1 flex flex-col gap-3'>
            {Object.entries(messageGroups).map(([date, messages]) => (
                <div key={date}>
                    <div className="text-center my-4">
                        <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm">
                            {formatDateHeader(date)}
                        </span>
                    </div>
                    {messages.map((chat, index) => {
                        const isCurrentUserSender = userId === chat.sender;
                        const isPreviousMessageFromSameSender = index > 0 && messages[index - 1].sender === chat.sender;
                        const showProfileImg = !isCurrentUserSender && !isPreviousMessageFromSameSender;

                        return (
                            <div key={chat.id || index} className="flex items-center">
                                <div className="w-12 h-12  flex-shrink-0">
                                    {showProfileImg && chatUser && (
                                        <img src={chatUser.profile_img} className="w-8 h-8 rounded-full" alt="" />
                                    )}
                                </div>
                                <div
                                    className={`${isCurrentUserSender
                                        ? "text-white px-4 py-2 ml-auto bg-blueInstaLight-0"
                                        : "bg-input px-4 py-1 mr-auto"} my-1 rounded-xl inline-block max-w-full break-words`}>
                                    <p>{chat.content}</p>
                                    <p className='text-[10px]'>{formatDate(chat.createdAt)}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}

export default ChatMessages;