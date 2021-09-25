import { IUser } from "../../auth/types/auth.model";

export interface INotification {
  userTo?: IUser;
  userFrom?: IUser;
  createdAt: Date;
  entityId: string;
  id: string;
  notificationType: "replyPost" | "likePost" | "retweetPost" | "follow";
  opened: boolean;
  updatedAt: string;
}
