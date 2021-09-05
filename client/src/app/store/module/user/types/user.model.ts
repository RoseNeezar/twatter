import { IUser } from "../../auth/types/auth.model";

export interface IUserProfile {
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  id: string;
  profilePic: string;
  coverPhoto: string;
  likes?: string[];
  retweets?: string[];
  following?: IUser[];
  followers?: IUser[];
  createdAt: Date;
}
