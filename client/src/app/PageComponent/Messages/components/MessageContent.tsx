import React, { FC } from "react";
import { useAppSelector } from "../../../store/hooks/hooks";
import { RootState } from "../../../store/store";

const MessageContent: FC = () => {
  const chatMessages = useAppSelector(
    (state: RootState) => state.chats.chatChannelMessages
  );
  console.log(chatMessages);
  return (
    <div className="relative flex w-full h-full overflow-hidden justify-items-start">
      {chatMessages &&
        chatMessages?.map((re) => {
          return <h1 className="mt-10 text-dark-txt">{re.content}</h1>;
        })}
    </div>
  );
};

export default MessageContent;
