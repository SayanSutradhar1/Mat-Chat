import { hash } from "bcryptjs";
import mongoose, { Document } from "mongoose";

export interface IUserCredentials extends Document {
  username?: string;
  userId: mongoose.Schema.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  otp?: string;
  isVerified: boolean;
}

export interface IUserDetails extends Document {
  name: string;
  bio?: string;
  avatar?: string;
  dateOfBirth?: Date;
  location?: string;
}

export interface IUserHandle extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  posts: mongoose.Schema.Types.ObjectId[];
  followers: mongoose.Schema.Types.ObjectId[];
  following: mongoose.Schema.Types.ObjectId[];
  chats?: mongoose.Schema.Types.ObjectId[];
}

const userCredentialsSchema = new mongoose.Schema<IUserCredentials>(
  {
    username: { type: String, unique: true, },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserDetails",
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true, select: false },
  },
  {
    timestamps: true,
  }
);

const userDetailsSchema = new mongoose.Schema<IUserDetails>({
  name: {
    type: String,
    required : true
  },
  bio: { type: String, default: "" },
  avatar: { type: String, default: "" },
  dateOfBirth: { type: Date, default: null },
  location: { type: String, default: "" },
});

const userHandleSchema = new mongoose.Schema<IUserHandle>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserDetails",
    required: true,
  },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserDetails" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserDetails" }],
  chats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
});

userCredentialsSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();

    this.password = await hash(this.password, 10);
    next();
  } catch (error) {
    next(error as Error);
  }
});

const UserCredentials =
  (mongoose.models.UserCredentials as mongoose.Model<IUserCredentials>) ||
  mongoose.model<IUserCredentials>("UserCredentials", userCredentialsSchema);
const UserDetails =
  (mongoose.models.UserDetails as mongoose.Model<IUserDetails>) ||
  mongoose.model<IUserDetails>("UserDetails", userDetailsSchema);
const UserHandle =
  (mongoose.models.UserHandle as mongoose.Model<IUserHandle>) ||
  mongoose.model<IUserHandle>("UserHandle", userHandleSchema);
export { UserCredentials, UserDetails, UserHandle };
