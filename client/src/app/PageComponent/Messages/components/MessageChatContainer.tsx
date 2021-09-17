import React, { FC, useEffect } from "react";
import { useParams } from "react-router";
import { useAppDispatch } from "../../../store/hooks/hooks";
import { getChatDetails } from "../../../store/module/chats/chats.slice";
import MessageContent from "./MessageContent";
import MessageHeader from "./MessageHeader";
import MessageInput from "./MessageInput";
interface IMessageGroupChat {
  backUrl: string;
}
const MessageChatContainer: FC<IMessageGroupChat> = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getChatDetails(chatId));
  }, [chatId]);

  return (
    <div className="flex flex-col h-screen rounded-lg shadow text-dark-txt">
      <>
        <MessageHeader />
        <div className="h-full px-2 py-2 overflow-scroll ">
          <MessageContent />
        </div>
        <div className="mt-auto bg-dark-main">
          <MessageInput chadId={chatId} />
        </div>
      </>
    </div>
  );
};

export default MessageChatContainer;
