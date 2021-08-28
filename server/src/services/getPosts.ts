import { Post } from "../models/post.models";
import { User } from "../models/user.models";

export class GetPosts {
  static async getPosts(filter: any) {
    let results: any = await Post.find(filter)
      .populate("postedBy")
      .populate("retweetData")
      .populate("replyTo")
      .sort({ createdAt: -1 })
      .catch((error) => console.log(error));

    results = await User.populate(results, { path: "replyTo.postedBy" });
    return await User.populate(results, { path: "retweetData.postedBy" });
  }
}
