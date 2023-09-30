import { io } from "socket.io-client";
import { API_URL } from '@env';

export const socket = io(API_URL, {
  transports: ["websocket"],
  reconnectionAttempts: 15
});