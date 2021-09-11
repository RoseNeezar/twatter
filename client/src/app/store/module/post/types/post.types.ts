export interface PostedBy {
  profilePic: string;
  likes: string[];
  retweets: string[];
  following: any[];
  followers: any[];
  tokenVersion: number;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  id: string;
}

export interface ICreatePost {
  content: string;
  replyTo?: string;
  path?: string;
}

export interface IFetchPost {
  isReply: boolean;
  replyTo: any;
  search: string;
  content: any;
  followingOnly: boolean;
  postedBy: any;
  pinned?: boolean;
}

export interface RetweetData {
  likes: string[];
  retweetUsers: string[];
  content: string;
  postedBy: PostedBy;
  createdAt: Date;
  updatedAt: Date;
  id: string;
  retweetData: string;
  replyTo: IPost;
}

export interface IPost {
  likes: string[];
  retweetUsers: string[];
  postedBy: PostedBy;
  retweetData: RetweetData;
  createdAt: Date;
  updatedAt: Date;
  id: string;
  content: string;
  replyTo: IPost;
  pinned?: boolean;
}

export interface IGetReplyPost {
  postData: IPost;
  replies: IPost[];
  replyTo: IPost;
}
