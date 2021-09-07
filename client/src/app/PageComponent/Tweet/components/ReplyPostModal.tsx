import { Dialog } from "@headlessui/react";
import dayjs from "dayjs";
import React, { FC, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import { useAppDispatch, useAppSelector } from "../../../store/hooks/hooks";
import {
  getReplyPost,
  replyToPost,
  replyToSinglePost,
} from "../../../store/module/post/post.slice";
import { replyToProfilePost } from "../../../store/module/user/user.slice";
import { RootState } from "../../../store/store";
import Navigate from "../../../utils/Navigate";

const maxPostCharacter = 255;

interface IReplyPostModal {
  isSinglePost?: boolean;
  isProfilePost?: boolean;
}

const ReplyPostModal: FC<IReplyPostModal> = ({
  isSinglePost,
  isProfilePost,
}) => {
  const { tweetId } = useParams<{ tweetId: string }>();
  const { pathname } = useLocation();

  const getUser = useAppSelector((state: RootState) => state.auth.user);
  const getPost = useAppSelector((state: RootState) => state.posts.replyPost);
  const dispatch = useAppDispatch();

  const [reply, setReply] = useState("");

  const handlePostContent = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReply(event.target.value);
  };

  const handleClose = () => {
    Navigate?.goBack();
  };

  const submitReply = () => {
    if (reply.length > 0 && reply.length < maxPostCharacter) {
      isSinglePost
        ? dispatch(
            replyToSinglePost({
              content: reply,
              replyTo: getPost?.postData.id,
            })
          )
        : isProfilePost
        ? dispatch(
            replyToProfilePost({
              content: reply,
              replyTo: getPost?.postData.id,
              path: pathname,
            })
          )
        : dispatch(
            replyToPost({
              content: reply,
              replyTo: getPost?.postData.id,
            })
          );
      setReply("");
      if (!isSinglePost && !isProfilePost) {
        Navigate?.push("/home");
      } else {
        Navigate?.goBack();
      }
    }
  };

  useEffect(() => {
    dispatch(getReplyPost(tweetId));
  }, []);
  return (
    <div className="flex flex-col w-full pt-3 m-auto rounded-md bg-dark-main">
      <div className="flex flex-col">
        <div className="flex flex-col p-1 border-b border-dark-third">
          <Dialog.Title>
            <div className="cursor-pointer" onClick={() => handleClose()}>
              <i className="pl-3 text-3xl text-dark-txt bx bx-x"></i>
            </div>
          </Dialog.Title>
        </div>
        <div className="flex flex-row mt-3">
          <div className="flex justify-center w-20 pt-2 ">
            <img
              className="w-10 h-10 rounded-full"
              src={getPost?.postData.postedBy?.profilePic}
            />
          </div>
          <div className="flex flex-col flex-1 text-dark-txt ">
            <div className="flex flex-row mt-2">
              <div className="mr-3 font-bold">
                {getPost?.postData.postedBy.username}
              </div>
              <div className="mr-3 text-gray-500">
                @{getPost?.postData.postedBy.email}
              </div>
              <div className="text-gray-500">
                {dayjs(getPost?.postData.createdAt).format("h:mm A	")}
              </div>
            </div>
            <div className=""></div>
            <div className="py-2 mr-3 break-all">
              {getPost?.postData.content}
            </div>
            <div className="py-3 text-sm text-gray-500">
              Replying to {getPost?.postData.postedBy.username}
            </div>
          </div>
        </div>
        <div className="flex flex-row mt-3">
          <div className="flex justify-center w-20 pt-2 ">
            <img className="w-10 h-10 rounded-full" src={getUser?.profilePic} />
          </div>
          <div className="flex flex-col flex-1 ">
            <TextareaAutosize
              placeholder="Twaat your reply"
              className="pt-3 overflow-auto text-xl font-semibold bg-transparent outline-none resize-none text-dark-txt"
              minRows={2}
              maxRows={6}
              value={reply}
              onChange={handlePostContent}
            />
            <div className="flex flex-row flex-1 p-3">
              {reply.length > maxPostCharacter && (
                <div className="my-auto font-bold text-red-500">
                  -{reply.length - maxPostCharacter + 1}
                </div>
              )}
              <button
                className={`font-bold w-20 p-3 ml-auto text-white bg-blue-400 rounded-3xl hover:bg-blue-500 ${
                  reply.length > maxPostCharacter &&
                  "bg-blue-700 hover:bg-blue-700"
                }`}
                onClick={() => submitReply()}
              >
                Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplyPostModal;
