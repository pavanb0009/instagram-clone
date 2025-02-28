const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("online", (userId) => {
      socket.userId = userId;
      console.log(`User ${userId} is online`);
      socket.join(userId);
      io.emit("userOnline", userId);
    });


    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
      io.emit("userOffline", socket.userId);
    });
  });
};

export default initializeSocket;
