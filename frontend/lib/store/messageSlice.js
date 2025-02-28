import axios from "axios";
import io from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_SERVER_URL_RAW);

const handleError = (error, get) => {
    get().setErrorMessage(error.response ? error.response.data.message : error.message);
    get().setIsloading(false);
};

export const messageSlice = (set, get) => ({
    conversations: [],
    messages: [],
    currentChat: null,
    chatUser: null,
    onlineUsers: [],


    
    setCurrentChat: (userId) => {
        set({ currentChat: userId });
        if (userId) {
            socket.emit('join', userId);
        } else {
            socket.emit('leave');
        }
    },

    getConversations: async () => {
        get().setIsloading(true);
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/m1/conversations`, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });

            const formattedConversations = data.conversations.map(conv => ({
                ...conv,
                user: {
                    personal_info: conv.otherUser
                }
            }));

            set({ conversations: formattedConversations });
            get().setIsloading(false);
        } catch (error) {
            handleError(error, get);
        }
    },

    getMessages: async (userId) => {
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/m1/messages/${userId}`, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });

            set({ messages: data.messagesChat, chatUser: data.user });
        } catch (error) {
            handleError(error, get);
        }
    },

    sendMessage: async (recipientId, content) => {
        try {
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/m1/message`, { recipientId, content }, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            return data;
        } catch (error) {
            handleError(error, get);
            return null;
        }
    },

    viewMessage: async (conversationId) => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/m1/viewmessage`, {conversationId}, {
                withCredentials: true
            })
        } catch (error) {
            handleError(error, get)
        }
    },

    addMessage: (message) => {
        set((state) => {
            // Check if the message already exists
            if (!state.messages.some(m => m._id === message._id)) {
                return { messages: [...state.messages, message] };
            }
            return state; // Return the current state if the message already exists
        });
    },

    updateConversations: (newConversations) => {
        const formattedConversations = newConversations.map(conv => ({
            ...conv,
            user: {
                personal_info: conv.otherUser
            }
        }));
        set({ conversations: formattedConversations });
    },


     initializeSocket: (userId) => {
        socket.emit('online', userId);

        socket.on('newMessage', (message) => {
            get().addMessage(message);
            get().getConversations();
        });

        socket.on('updateConversations', (updatedConversations) => {
            get().updateConversations(updatedConversations);
        });

        socket.on('messageSeen', (updatedMessage) => {
            set((state) => ({
                messages: state.messages.map(msg =>
                    msg._id === updatedMessage._id ? updatedMessage : msg
                )
            }));
            get().getConversations();
        });

        socket.on('userOnline', (onlineUserId) => {
            set((state) => ({
                onlineUsers: [...state.onlineUsers, onlineUserId]
            }));
        });

        socket.on('userOffline', (offlineUserId) => {
            set((state) => ({
                onlineUsers: state.onlineUsers.filter(id => id !== offlineUserId)
            }));
        });

   
    }
});