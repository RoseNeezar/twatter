import React, { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useAppDispatch, useAppSelector } from "../../../store/hooks/hooks";
import { createPost } from "../../../store/module/post/post.slice";
import { RootState } from "../../../store/store";

const maxPostCharacter = 255;

const CreatePost = () => {
  const getUser = useAppSelector((state: RootState) => state.auth.user);
  const dispatch = useAppDispatch();
  const [post, setPost] = useState("");

  const handlePostContent = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPost(event.target.value);
  };

  const submitPost = () => {
    if (post.length > 0 && post.length < maxPostCharacter) {
      dispatch(
        createPost({
          content: post,
        })
      );
      setPost("");
    }
  };

  return (
    <div className="flex flex-row pt-3 mt-12 border-b border-dark-third bg-dark-main">
      <div className="flex justify-center w-20 pt-2 ">
        <img className="w-10 h-10 rounded-full" src={getUser?.profilePic} />
      </div>
      <div className="flex flex-col flex-1 ">
        <TextareaAutosize
          placeholder="What's on your mind ?"
          className="pt-3 overflow-auto text-xl font-semibold bg-transparent outline-none resize-none text-dark-txt"
          minRows={2}
          maxRows={6}
          value={post}
          onChange={handlePostContent}
        />
        <div className="flex flex-row flex-1 p-3">
          {post.length > maxPostCharacter && (
            <div className="my-auto font-bold text-red-500">
              -{post.length - maxPostCharacter + 1}
            </div>
          )}
          <button
            className={`font-bold w-20 p-3 ml-auto text-white bg-blue-400 rounded-3xl hover:bg-blue-500 ${
              post.length > maxPostCharacter && "bg-blue-700 hover:bg-blue-700"
            }`}
            onClick={() => submitPost()}
          >
            Twaat
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
