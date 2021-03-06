import mongoose, { Schema } from "mongoose";
import { UserDoc } from "./user.models";

export interface PostAttrs {
  content?: string;
  postedBy?: string | UserDoc;
  pinned?: boolean;
  likes?: string[];
  retweetUsers?: string[];
  retweetData?: string;
  replyTo?: string | PostDoc;
}

export interface PostDoc extends mongoose.Document {
  content?: string;
  postedBy?: string | UserDoc;
  pinned?: boolean;
  likes?: string[];
  retweetUsers?: string[];
  retweetData?: string;
  replyTo?: string | PostDoc;
}

interface PostModel extends mongoose.Model<PostDoc> {
  build(attr: PostAttrs): PostDoc;
}

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      trim: true,
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    pinned: Boolean,
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    retweetUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    retweetData: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    replyTo: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
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

postSchema.statics.build = (attr: PostAttrs) => {
  return new Post(attr);
};

const Post = mongoose.model<PostDoc, PostModel>("Post", postSchema);

export { Post };
