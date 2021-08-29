export interface PostedBy {
  profilePic: string;
  likes: any[];
  retweets: any[];
  following: any[];
  followers: any[];
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  id: string;
}

export interface IPost {
  likes: any[];
  retweetUsers: any[];
  content: string;
  postedBy: PostedBy;
  createdAt: Date;
  updatedAt: Date;
  id: string;
}

export interface ICreatePost {
  content: string;
}

export interface IFetchPost {
  isReply: boolean;
  replyTo: any;
  search: string;
  content: any;
  followingOnly: boolean;
  postedBy: any;
}
