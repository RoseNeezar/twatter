import React, { ChangeEvent, FC, KeyboardEvent, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useAppDispatch } from "../../../store/hooks/hooks";
import { sendMessage } from "../../../store/module/chats/chats.slice";
interface IMessageInput {
  chadId: string;
  scrollToBottom: () => void;
}
const MessageInput: FC<IMessageInput> = ({ chadId, scrollToBottom }) => {
  const [message, setMessage] = useState("");
  const dispatch = useAppDispatch();

  const handleMessage = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setMessage(e.target.value);
  };
  const handleSendMessage = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && message.trim().length > 0) {
      e.preventDefault();
      dispatch(
        sendMessage({
          content: message,
          chatId: chadId,
        })
      );
      setMessage("");
      scrollToBottom();
    }
  };

  const HandleSendButton = () => {
    if (message.trim().length > 0) {
      dispatch(
        sendMessage({
          content: message,
          chatId: chadId,
        })
      );
    }
    setMessage("");
    scrollToBottom();
  };

  return (
    <div className="flex py-3 space-x-2 border-t border-dark-third">
      <div className="flex items-center justify-between flex-1 px-3 rounded-full dark:bg-dark-third">
        <TextareaAutosize
          placeholder="Write a message..."
          className="flex-1 p-2 mr-1 bg-transparent border-2 outline-none resize-none border-dark-third rounded-3xl text-dark-txt focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          minRows={1}
          maxRows={6}
          value={message}
          onChange={(e) => handleMessage(e)}
          onKeyDown={(e) => handleSendMessage(e)}
        />
        <div className="flex items-center justify-center ">
          <span
            className="grid w-10 h-10 text-2xl text-blue-500 rounded-full cursor-pointer place-items-center hover:bg-blue-300 hover:bg-opacity-25 hover:text-blue-400 "
            onClick={() => HandleSendButton()}
          >
            <i className="bx bx-send"></i>
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
