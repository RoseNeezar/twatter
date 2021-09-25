import mongoose, { Schema } from "mongoose";
import { UserDoc } from "./user.models";

export interface NotificationAttrs {
  userTo?: string | UserDoc;
  userFrom?: string | UserDoc;
  notificationType?: any;
  opened?: boolean;
  entityId?: string;
}

export interface NotificationDoc extends mongoose.Document {
  userTo?: string | UserDoc;
  userFrom?: string | UserDoc;
  notificationType?: any;
  opened?: boolean;
  entityId?: string;
}

interface NotificationModel extends mongoose.Model<NotificationDoc> {
  build(attr: NotificationAttrs): NotificationDoc;
  insertNotification(
    userTo: string | UserDoc,
    userFrom: string | UserDoc,
    notificationType: string,
    entityId: string
  ): Promise<NotificationDoc | null>;
}

const notificationSchema = new mongoose.Schema(
  {
    userTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    userFrom: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    notificationType: {
      type: String,
      required: true,
    },
    opened: {
      type: Boolean,
      default: false,
    },
    entityId: {
      type: Schema.Types.ObjectId,
      required: true,
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

notificationSchema.statics.build = (attr: NotificationAttrs) => {
  return new Notification(attr);
};

notificationSchema.statics.insertNotification = async (
  userTo: string | UserDoc,
  userFrom: string | UserDoc,
  notificationType: string,
  entityId: string
) => {
  const data = {
    userTo: userTo,
    userFrom: userFrom,
    notificationType: notificationType,
    entityId: entityId,
  };
  await Notification.deleteOne(data).catch((error) => console.log(error));
  return Notification.create(data).catch((error) => console.log(error));
};

const Notification = mongoose.model<NotificationDoc, NotificationModel>(
  "Notification",
  notificationSchema
);

export { Notification };
