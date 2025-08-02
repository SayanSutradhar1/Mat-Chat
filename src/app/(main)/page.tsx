import { auth } from "@/auth";
import { redirect } from "next/navigation";


const page = async() => {
  // useEffect(() => {

  //   console.log(process.env.NEXT_PUBLIC_CHAT_APP_SERVER_URL);
    
  //   const socket = new ChatSocket(process.env.NEXT_PUBLIC_CHAT_APP_SERVER_URL!,{
  //     query : {
  //       userId: "123456",
  //     }
  //   });

  //   // Connect to the socket server
  //   socket.connect();

  //   socket.sendMessage({
  //     chatId: "test-chat",
  //     content: "Hello from frontend!",
  //     senderId: "frontend-user",
  //   });

  //   // Example: Listen for incoming messages
  //   socket.onMessage((payload) => {
  //     console.log("Received message:", payload);
  //   });

  //   // Example: Listen for user status updates
  //   socket.onUserStatus((status) => {
  //     console.log("User status update:", status);
  //   });

  //   // Example: Listen for typing indicator
  //   socket.onTyping((data) => {
  //     console.log("User typing:", data);
  //   });

  //   // Example: Listen for message status (delivered/read)
  //   socket.onMessageStatus((status) => {
  //     console.log("Message status:", status);
  //   });

  //   // Example: Send a test message after connecting
    

  //   // Example: Send typing indicator
  //   socket.sendTyping("test-chat", "frontend-user");

  //   // Example: Send user status
  //   socket.sendUserStatus({ userId: "frontend-user", online: true });

  //   // Example: Send message status
  //   socket.sendMessageStatus({ messageId: "msg-1", status: "delivered" });

  //   // Cleanup on unmount
  //   return () => {
  //     socket.disconnect(); // Remove all listeners
  //   };
  // }, []);

  const session = await auth()

  if(session?.user) redirect("/feed")
  


  return <>Test</>;
};

export default page;
