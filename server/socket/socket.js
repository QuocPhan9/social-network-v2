import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PATCH", "DELETE"],
        credentials: true,
    },
});

// Map lưu userId => socketId
const userSocketMap = new Map();

// Lấy socketId từ userId
const getReceiverSocketId = (userId) => userSocketMap.get(userId);

// Khi client kết nối
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId && userId !== "undefined") {
        userSocketMap.set(userId, socket.id);
        console.log(`✅ User ${userId} connected: ${socket.id}`);
    }

    // Gửi danh sách online cho tất cả client
    io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));

    // Khi client ngắt kết nối
    socket.on("disconnect", () => {
        if (userId) {
            userSocketMap.delete(userId);
            console.log(`❌ User ${userId} disconnected`);
            io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
        }
    });
});

export { io, server, app, getReceiverSocketId };
