import mongoose, { Document } from "mongoose";

export interface IChat extends Document {
  type: "direct" | "group";
  groupName?: string;
  participants: mongoose.Schema.Types.ObjectId[];
  messages: {
    sender: mongoose.Schema.Types.ObjectId;
    receiver?: mongoose.Schema.Types.ObjectId;
    content: string;
    messageStatus: "sent" | "delivered" | "read";
    time?: Date;
  }[];
}

const chatSchema = new mongoose.Schema<IChat>({
  type: { type: String, enum: ["direct", "group"], required: true },
  groupName: { type: String },
  participants: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "UserDetails",
    required: true,
  },
  messages: [
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserDetails",
        required: true,
      },
      receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserDetails",
      },
      content: { type: String, required: true },
      messageStatus: {
        type: String,
        enum: ["sent", "processing", "read"],
        default: "read",
      },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

const Chat =
  (mongoose.models.Chat as mongoose.Model<IChat>) ||
  mongoose.model<IChat>("Chat", chatSchema);
export { Chat };
