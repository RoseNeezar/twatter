import React, { FC, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../../../store/hooks/hooks";
import { selectCurrentUser } from "../../../store/module/auth/auth.slice";
import {
  getChatDetails,
  getPaginatedMessages,
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatMessages = useAppSelector(
    (state: RootState) => state.chats.chatChannelMessages
  );
  const chatDetails = useAppSelector(
    (state: RootState) => state.chats.chatChannelDetail
  );
  const currentUser = useAppSelector(selectCurrentUser);
  const [isLoading, setIsLoading] = useState(false);

  const isTyping = useAppSelector((state: RootState) => state.chats.isTyping);

  const [isTop, setIsTop] = useState(false);
  const [scrollUp, setScrollUp] = useState(0);

  const FetchMoreMessage = () => {
    const pagination = chatMessages?.pagination;
    const page = typeof pagination === "undefined" ? 1 : pagination.page;
    const currentPage = page + 1;
    if (currentPage > pagination!.totalPages) {
      return;
    }
    setIsLoading(true);
    dispatch(
      getPaginatedMessages({
        chatId: chatDetails?.id as string,
        page: page + 1,
        limit: 20,
      })
    );
  };

  const HandleInfiniteScroll = (e: React.UIEvent<HTMLDivElement | UIEvent>) => {
    const event = e.target as HTMLDivElement;
    if (event.scrollTop === 0 && event.scrollHeight > window.innerHeight) {
      setIsTop(true);
      FetchMoreMessage();
    } else {
      setIsTop(false);
    }
  };

  const scrollToMessage = () => {
    if (!scrollRef.current) {
      return;
    }

    scrollRef.current.scrollIntoView({ behavior: "auto" });
  };

  useEffect(() => {
    if (isMounted) {
      scrollToMessage();
    } else {
      dispatch(markMessageRead(chatId));

      if (!isTop) {
        scrollToMessage();
      } else {
        if (
          chatMessages?.messages[chatMessages.messages.length - 1].sender.id ===
          currentUser?.id
        ) {
          setScrollUp(scrollUp + 1);
        }
      }

      setIsLoading(false);
    }
  }, [chatMessages]);

  useEffect(() => {
    if (!chatRef.current) return;
    chatRef.current.scrollTop = Math.ceil(chatRef.current.scrollHeight * 0.05);
  }, [scrollUp]);

  useEffect(() => {
    dispatch(getChatDetails(chatId));
  }, [chatId]);

  return (
    <div className="flex flex-col h-screen rounded-lg shadow text-dark-txt">
      <>
        <MessageHeader backUrl={backUrl} />
        {isLoading && (
          <div className="absolute z-50 left-72 top-12">
            <div className="loading-spinner" />
          </div>
        )}
        <div
          className="px-2 pt-2 overflow-scroll"
          onScroll={HandleInfiniteScroll}
          ref={chatRef}
        >
          <MessageContent ref={scrollRef} />
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
