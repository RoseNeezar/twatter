import React, { FC, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../../../store/hooks/hooks";
import {
  getChatDetails,
  markMessageRead,
} from "../../../store/module/chats/chats.slice";
import { RootState } from "../../../store/store";
import { useIsMount } from "../../../utils/isMounted";
import MessageContent from "./MessageContent";
import MessageHeader from "./MessageHeader";
import MessageInput from "./MessageInput";
interface IMessageGroupChat {
  backUrl: string;
}
const MessageChatContainer: FC<IMessageGroupChat> = ({ backUrl }) => {
  const { chatId } = useParams<{ chatId: string }>();
  const isMounted = useIsMount();
  const dispatch = useAppDispatch();
  const chatRef = useRef<HTMLDivElement>(null);
  const chatMessages = useAppSelector(
    (state: RootState) => state.chats.chatChannelMessages
  );
  const isTyping = useAppSelector((state: RootState) => state.chats.isTyping);

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
    if (isMounted) {
      scrollToMessage();
    } else {
      dispatch(markMessageRead(chatId));
      scrollToMessage();
    }

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
        <MessageHeader backUrl={backUrl} />
        <div
          className="px-2 pt-2 overflow-scroll"
          onScroll={HandleInfiniteScroll}
        >
          <MessageContent ref={chatRef} />
        </div>
        {isTyping && (
          <div
            className={`absolute bottom-20 left-0 py-5 px-7 text-sm ml-2 bg-dark-third rounded-3xl w-max`}
          >
            <div className="dot-elastic" />
          </div>
        )}
        <div className="mt-auto bg-dark-main">
          <MessageInput scrollToBottom={scrollToMessage} chadId={chatId} />
        </div>
      </>
    </div>
  );
};

export default MessageChatContainer;
