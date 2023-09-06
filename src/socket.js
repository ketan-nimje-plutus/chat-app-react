import { io } from "socket.io-client";
export const socket = io("https://chat-app-backend-2qte.onrender.com", { transports: ['websocket'], upgrade: false });
