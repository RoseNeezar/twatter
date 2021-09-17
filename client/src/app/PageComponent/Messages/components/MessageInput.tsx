import React, { ChangeEvent, FC, KeyboardEvent, useState } from "react";

const MessageInput: FC = () => {
  const [message, setMessage] = useState("");

  const handleMessage = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setMessage(e.target.value);
  };
  const handleSendMessage = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && message.length > 0) {
      setMessage("");
    }
  };
  return (
    <div className="flex py-3 space-x-2 border-t border-dark-third">
      <div className="flex items-center justify-between flex-1 px-3 rounded-full dark:bg-dark-third">
        <input
          type="text"
          placeholder="Write a message..."
          className="flex-1 p-2 mr-1 bg-transparent border-2 outline-none border-dark-third rounded-3xl text-dark-txt focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={message}
          onChange={(e) => handleMessage(e)}
          onKeyDown={(e) => handleSendMessage(e)}
        />
        <div className="flex items-center justify-center ">
          <span className="grid w-10 h-10 text-2xl text-blue-500 rounded-full cursor-pointer place-items-center hover:bg-blue-300 hover:bg-opacity-25 hover:text-blue-400 ">
            <i className="bx bx-send"></i>
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
