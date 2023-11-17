import { io } from "socket.io-client";

export const socket = io(
  process.env.REACT_APP_SERVERURL || "http://localhost:3000",
  {
    autoConnect: false,
  }
);
