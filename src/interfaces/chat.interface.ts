export interface TypeChats {
  chatId: string;
  type: "direct" | "group";
  groupName?: string;
  participants: string[];
  sender?: {
    userId: string;
    name: string;
    avatar?: string;
  };
  messages: {
    sender: string;
    content: string;
    messageStatus: "sent" | "delivered" | "read";
    time?: Date;
  }[];
}