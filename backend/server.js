import express from "express"
import "dotenv/config"
import cors from "cors"
import mongoose from "mongoose"
import { createServer } from "http"
import { Server } from "socket.io"
import errorMiddleware from "./middlewares/error.js"
import userRoutes from "./routes/userRoutes.js"
import mediaRoutes from "./routes/mediaRoutes.js"
import cookieParser from "cookie-parser"
import messageRoutes from "./routes/messageRoutes.js"
import initializeSocket from "./utils/socketHandler.js"



const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }
})

//DB connection
mongoose.connect(process.env.MONGO_URL).then((data) => {
    console.log(data.connection.host)
})

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

app.use((req, res, next) => {
    req.io = io;
    next();
});

//routes
app.use("/api/v1", userRoutes)
app.use("/api/m1", messageRoutes)
app.use("/api/v1", mediaRoutes)

initializeSocket(io)

//error middleware
app.use(errorMiddleware)

server.listen(process.env.PORT, () => {
    console.log(`server started at ${process.env.PORT}`)
})