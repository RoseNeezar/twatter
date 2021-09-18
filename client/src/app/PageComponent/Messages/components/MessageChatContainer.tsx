import React, { FC, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../../../store/hooks/hooks";
import { getChatDetails } from "../../../store/module/chats/chats.slice";
import { RootState } from "../../../store/store";
import MessageContent from "./MessageContent";
import MessageHeader from "./MessageHeader";
import MessageInput from "./MessageInput";
interface IMessageGroupChat {
  backUrl: string;
}
const MessageChatContainer: FC<IMessageGroupChat> = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const dispatch = useAppDispatch();
  const chatRef = useRef<HTMLDivElement>(null);
  const chatMessages = useAppSelector(
    (state: RootState) => state.chats.chatChannelMessages
  );
  const HandleInfiniteScroll = (e: React.UIEvent<HTMLDivElement | UIEvent>) => {
    const event = e.target as HTMLDivElement;
    if (event.scrollTop === 0 && event.scrollHeight > window.innerHeight) {
      console.log("at top");
    }
  };

  const scrollToMessage = () => {
    if (!chatRef.current) {
      return;
    }

    chatRef.current.scrollIntoView({ behavior: "auto" });
  };

  useEffect(() => {
    scrollToMessage();
    return () => {
      scrollToMessage();
    };
  }, [chatMessages]);

  useEffect(() => {
    dispatch(getChatDetails(chatId));
  }, [chatId]);

  return (
    <div className="flex flex-col h-screen rounded-lg shadow text-dark-txt">
      <>
        <MessageHeader />
        <div className="px-2 overflow-scroll " onScroll={HandleInfiniteScroll}>
          <MessageContent ref={chatRef} />
        </div>
        <div className="mt-auto bg-dark-main">
          <MessageInput scrollToBottom={scrollToMessage} chadId={chatId} />
        </div>
      </>
    </div>
  );
};

export default MessageChatContainer;
