import React, { ReactNode } from "react";
import { useAppSelector } from "../../../store/hooks/hooks";
import { selectCurrentUser } from "../../../store/module/auth/auth.slice";
import { IMessageContent } from "../../../store/module/chats/types/chats.types";
import { RootState } from "../../../store/store";

const MessageContent = React.forwardRef<HTMLDivElement>((prop, ref) => {
  const chatMessages = useAppSelector(
    (state: RootState) => state.chats.chatChannelMessages
  );
  const currentUser = useAppSelector(selectCurrentUser);

  const createMessageBubble = (
    message: IMessageContent,
    nextMessage: IMessageContent,
    lastSenderId: string
  ) => {
    const sender = message.sender;
    const senderName = sender.username;

    const currentSenderId = sender.id;
    const nextSenderId = nextMessage !== null ? nextMessage.sender.id : "";

    const isFirst = lastSenderId !== currentSenderId;
    const isLast = nextSenderId !== currentSenderId;

    const isMine = message.sender.id === currentUser?.id;

    let liClassName = isMine
      ? "bg-blue-500  rounded-l-2xl"
      : "bg-dark-third rounded-r-2xl";

    let nameElement: ReactNode = "";

    if (isFirst) {
      if (isMine) {
        liClassName += "rounded-t-2xl rounded-t-2xl rounded-bl-2xl";
      }
      if (!isMine) {
        liClassName += "rounded-t-2xl rounded-t-2xl rounded-br-2xl";
        nameElement = <div className="mb-2 text-gray-500">{senderName}</div>;
      }
    }

    let profileImage: ReactNode = "";
    if (isLast) {
      if (isMine) {
        liClassName += "rounded-l-2xl rounded-b-2xl rounded-tl-2xl";
        profileImage = (
          <img className="w-6 h-6 rounded-full" src={`${sender.profilePic}`} />
        );
      }
      if (!isMine) {
        liClassName += "rounded-l-2xl rounded-b-2xl rounded-tr-2xl";
        profileImage = (
          <img className="w-6 h-6 rounded-full" src={`${sender.profilePic}`} />
        );
      }
    }
    let imageContainer: ReactNode = "";
    if (!isMine) {
      imageContainer = <div className="mb-0">{profileImage}</div>;
    }
    return (
      <div key={message.id} className={`mb-1 cursor-pointer`}>
        {nameElement}
        <div className="flex flex-row ">
          {isMine ? (
            <div className="flex flex-row items-center w-full ml-auto">
              <div className="flex w-2/3 ml-auto opacity-0 hover:opacity-100">
                <div className="ml-auto text-2xl text-dark-txt">
                  <i className="bx bx-dots-horizontal-rounded"></i>
                </div>
              </div>
              <div
                className={`bg-gray-400 max-w-xs p-2 mr-3 ml-3 break-all  w-max text-dark-txt ${liClassName}`}
              >
                {message.content}
              </div>
            </div>
          ) : (
            <>
              <div
                className={`max-w-xs p-2 mr-3 ml-3 break-all  w-max text-dark-txt ${liClassName}`}
              >
                {message.content}
              </div>
              <div className="flex items-center w-2/3 opacity-0 hover:opacity-100">
                <div className="text-2xl text-dark-txt">
                  <i className="bx bx-dots-horizontal-rounded"></i>
                </div>
              </div>
            </>
          )}
        </div>

        {imageContainer}
      </div>
    );
  };

  const HandleMessageStyle = () => {
    let messages: ReactNode[] = [];
    let lastSenderId = "";
    chatMessages?.messages.forEach((message, index) => {
      let content = createMessageBubble(
        message,
        chatMessages.messages[index + 1],
        lastSenderId
      );
      messages.push(content);
      lastSenderId = message.sender.id;
    });

    return messages;
  };

  return (
    <div className="relative flex flex-col w-full h-full justify-items-start">
      {chatMessages && HandleMessageStyle()}
      <div className="mt-0 opacity-0">""</div>
      <div ref={ref} />
    </div>
  );
});

export default MessageContent;
