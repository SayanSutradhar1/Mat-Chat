import { io, ManagerOptions, Socket } from "socket.io-client";
import { SOCKET_EVENTS } from "./events.socket";
import { SocketOptions } from "dgram";

export type MessagePayload = {
  messageStatus : "processing" | "delivered" | "read" | null
  chatId: string;
  content: string;
  sender?:string
  receiver: string;
  timestamp?: string;
};

type UserStatusPayload = {
  userId: string;
  online: boolean;
};

export class ChatSocket {
  private socket: Socket;
  socketId : string | undefined

  constructor(
    serverUrl: string,
    options?: Partial<ManagerOptions & SocketOptions>
  ) {
    this.socket = io(serverUrl, options);
    this.socketId = this.socket.id
  }

  // Connect to socket server
  connect() {
    if (!this.socket.connected) {
      this.socket.connect();
      console.log("Socket Connected");
    } else {
      console.log("Already connected to the Socket");
    }
  }

  // Disconnect from socket server
  disconnect() {
    if (this.socket.connected) {
      this.socket.disconnect();
    }
  }

  //Invokes when socket is connected to the backend server
  onConnect(callback : ()=>void){
    this.socket.on("connect",callback)
  }

  // Send a chat message
  sendMessage(payload: MessagePayload) {
    this.socket.emit(SOCKET_EVENTS.CHAT_MESSAGE_SEND, payload);
  }

  // Listen for incoming messages
  onMessage(callback: (payload: MessagePayload) => void) {
    this.socket.on(SOCKET_EVENTS.CHAT_MESSAGE_RECEIVE, callback);
  }

  // Listen for user status updates
  onUserStatus(callback: (payload: UserStatusPayload) => void) {
    this.socket.on(SOCKET_EVENTS.USER_STATUS, callback);
  }

  // Emit user status
  sendUserStatus(payload: UserStatusPayload) {
    this.socket.emit(SOCKET_EVENTS.USER_STATUS, payload);
  }

  // Listen for typing indicator
  onTyping(callback: (payload: { chatId: string; userId: string }) => void) {
    this.socket.on(SOCKET_EVENTS.CHAT_TYPING, callback);
  }

  // Emit typing indicator
  sendTyping(chatId: string, userId: string) {
    this.socket.emit(SOCKET_EVENTS.CHAT_TYPING, { chatId, userId });
  }

  // Listen for delivered/read receipts
  onMessageStatus(
    callback: (payload: { messageId: string; status: string }) => void
  ) {
    this.socket.on(SOCKET_EVENTS.CHAT_MESSAGE_STATUS, callback);
  }

  // Emit delivered/read receipts
  sendMessageStatus(payload: { messageId: string; status: string }) {
    this.socket.emit(SOCKET_EVENTS.CHAT_MESSAGE_STATUS, payload);
  }
}
