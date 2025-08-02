import { createContext } from "react";
import { Socket } from "socket.io-client";

interface SocketContextType {
    socket : Socket | null | undefined;
    isConnected: boolean;
}

export const SocketContext = createContext<SocketContextType | undefined>({
    socket: undefined as unknown as Socket,
    isConnected: false,
})