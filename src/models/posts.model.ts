import mongoose, { Document } from "mongoose";

export interface IPosts extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  file?: string;
  caption: string;
  likes: mongoose.Schema.Types.ObjectId[];
  comments: {
    userId: mongoose.Schema.Types.ObjectId;
    content: string;
    createdAt: Date;
  }[];
}

const postSchema = new mongoose.Schema<IPosts>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserDetails",
      required: true,
    },
    file: { type: String, default: "" },
    caption: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserHandle" }],
    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "UserDetails",
          required: true,
        },
        content: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Post =
  (mongoose.models.Post as mongoose.Model<IPosts>) ||
  mongoose.model<IPosts>("Post", postSchema);

export { Post };
