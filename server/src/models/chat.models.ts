import mongoose, { Schema } from "mongoose";
import { MessageDoc } from "./message.models";

export interface ChatAttrs {
  chatName?: string;
  isGroupChat?: boolean;
  users?: string[];
  latestMessage?: string | MessageDoc;
}

interface ChatDoc extends mongoose.Document {
  chatName?: string;
  isGroupChat?: boolean;
  users?: string[];
  latestMessage?: string | MessageDoc;
}

interface ChatModel extends mongoose.Model<ChatDoc> {
  build(attr: ChatAttrs): ChatDoc;
}

const chatSchema = new mongoose.Schema(
  {
    chatName: {
      type: String,
      trim: true,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    latestMessage: { type: Schema.Types.ObjectId, ref: "Message" },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

chatSchema.statics.build = (attr: ChatAttrs) => {
  return new Chat(attr);
};

const Chat = mongoose.model<ChatDoc, ChatModel>("Chat", chatSchema);

export { Chat };
