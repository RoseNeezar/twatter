export interface UserPayload {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  profilePic: string;
  coverPhoto: string;
  likes?: string[];
  retweets?: string[];
  following?: string[];
  followers?: string[];
}
