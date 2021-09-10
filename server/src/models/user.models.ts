import mongoose, { Schema } from "mongoose";
import { Password } from "../services/password";

// to create a user
export interface UserAttrs {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  profilePic?: string;
  coverPhoto?: string;
  likes?: string[];
  retweets?: string[];
  following?: string[];
  followers?: string[];
  tokenVersion?: number;
}

// properties a single user has
export interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  profilePic?: string;
  coverPhoto?: string;
  likes?: string[];
  retweets?: string[];
  following?: string[];
  followers?: string[];
  tokenVersion?: number;
}

// entire collection looks like
export interface UserModel extends mongoose.Model<UserDoc> {
  build(attr: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    profilePic: {
      type: String,
      default: `${process.env.APP_URL}/images/img.jpeg`,
    },
    coverPhoto: {
      type: String,
      default: `${process.env.APP_URL}/images/img.jpeg`,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    retweets: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    tokenVersion: {
      type: Number,
      default: 0,
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

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
});

userSchema.statics.build = (attr: UserAttrs) => {
  return new User(attr);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
