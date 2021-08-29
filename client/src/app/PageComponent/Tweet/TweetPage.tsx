import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hooks";
import { fetchPost, getPosts } from "../../store/module/post/post.slice";
import CreatePost from "./components/CreatePost";
import PostContent from "./components/PostContent";

const TweetPage = () => {
  const dispatch = useAppDispatch();
  const Posts = useAppSelector(getPosts);
  useEffect(() => {
    dispatch(fetchPost({}));
  }, []);

  return (
    <div className="flex flex-col w-full border-l border-r border-dark-third">
      <div
        style={{ width: 598 }}
        className="fixed top-0 p-3 font-bold border-b bg-dark-main text-dark-txt border-dark-third"
      >
        <div className="text-xl ">Home</div>
      </div>
      <CreatePost />
      {Posts?.map((res) => {
        return <PostContent post={res} />;
      })}
    </div>
  );
};

export default TweetPage;
