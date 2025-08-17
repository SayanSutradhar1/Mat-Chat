import mongoose, { Document, Schema } from "mongoose";

export interface INotification extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  header: string;
  content?: string;
  timeStamp: Date;
}

const notificatioSchema = new Schema<INotification>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserDetails",
      required: true,
    },
    header: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    timeStamp: {
      type: Date,
      required: true,
      default: new Date(),
    },
  },
  {
    timestamps: true,
  }
);

const Notification =
  (mongoose.models.Notification as mongoose.Model<INotification>) ||
  mongoose.model<INotification>("Notification", notificatioSchema);

  export {Notification}
