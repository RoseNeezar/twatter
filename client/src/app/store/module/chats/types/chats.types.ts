import { IUser } from "../../auth/types/auth.model";

export interface IChat {
  isGroupChat: boolean;
  users: string[] | IUser[];
  createdAt: Date;
  updatedAt: Date;
  id: string;
}
