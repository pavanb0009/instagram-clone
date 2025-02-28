import React, { useEffect, useState, useRef } from 'react';
import manageStore from '@/lib/store/store';
import ChatUpperSection from './ChatUpperSection';
import ChatMessages from './ChatMessages';
import { Input } from '@/components/ui/input';

const ChatSection = ({ user }) => {
    const { getMessages, chatUser, messages, sendMessage, setCurrentChat, addMessage, viewMessage } = manageStore();
    const [inputMessage, setInputMessage] = useState("");

    // Scroll to bottom reference
    const messagesEndRef = useRef(null);

    useEffect(() => {
        getMessages(user);
        setCurrentChat(user);
        viewMessage(user)
        // Cleanup function to leave the chat room
        return () => {
            setCurrentChat(null);
        };
    }, [getMessages, user, setCurrentChat, viewMessage]);

    // Function to scroll to the latest message
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]); // Scroll to bottom whenever messages change

    const handleSendMessage = async () => {
        if (inputMessage.trim().length > 0) {
            const newMessage = await sendMessage(user, inputMessage);
            if (newMessage) {
                addMessage(newMessage);
            }
            setInputMessage(''); // Clear input after sending
        }
    };

    return (
        <div className="flex max-lg:pb-12  flex-col h-full">
            {/* Upper Section (Header) */}
            <div className="flex-shrink-0">
                <ChatUpperSection chatUser={chatUser} />
            </div>

            {/* Messages Section (Fills available space) */}
            <div className="flex-1 overflow-y-auto">
                <ChatMessages chatmessages={messages} chatUser={chatUser} />
                {/* Invisible div to scroll to bottom */}
                <div ref={messagesEndRef} />
            </div>


            {/* Input Box (Fixed at bottom) */}
            <div className="flex-shrink-0 p-3 md:mb-2  mx-3 border-gray-300 relative">
                <Input
                    type="text"
                    placeholder="Message..."
                    className="rounded-2xl"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleSendMessage();
                        }
                    }}
                />
                <i
                    className={`fi fi-br-paper-plane absolute top-5 right-8 cursor-pointer ${inputMessage.length > 0 ? "" : "text-greySelected-0"}`}
                    onClick={handleSendMessage}
                ></i>
            </div>
        </div>
    );
};

export default ChatSection;