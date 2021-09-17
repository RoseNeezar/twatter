import mongoose, { Schema } from "mongoose";
import { ChatDoc } from "./chat.models";
import { UserDoc } from "./user.models";

export interface MessageAttrs {
  sender?: string;
  content?: string;
  chat?: string | ChatDoc;
  readBy?: string[] | UserDoc;
}

export interface MessageDoc extends mongoose.Document {
  sender?: string;
  content?: string;
  chat?: string | ChatDoc;
  readBy?: string[];
}

interface MessageModel extends mongoose.Model<MessageDoc> {
  build(attr: MessageAttrs): MessageDoc;
}

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      trim: true,
    },
    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
    },
    readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
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

messageSchema.statics.build = (attr: MessageAttrs) => {
  return new Message(attr);
};

const Message = mongoose.model<MessageDoc, MessageModel>(
  "Message",
  messageSchema
);

export { Message };
