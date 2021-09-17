import React, { FC } from "react";
import { useParams } from "react-router";
import MessageContent from "./MessageContent";
import MessageHeader from "./MessageHeader";
import MessageInput from "./MessageInput";
interface IMessageGroupChat {
  backUrl: string;
}
const MessageGroupChat: FC<IMessageGroupChat> = () => {
  return (
    <div className="flex flex-col h-screen rounded-lg shadow text-dark-txt">
      <>
        <MessageHeader />
        <div className="h-full px-2 py-2 overflow-scroll ">
          <MessageContent />
        </div>
        <div className="mt-auto bg-dark-main">
          <MessageInput />
        </div>
      </>
    </div>
  );
};

export default MessageGroupChat;
