import React, { useRef } from "react";
import { useAppSelector } from "../../../store/hooks/hooks";
import { selectCurrentUser } from "../../../store/module/auth/auth.slice";
import { RootState } from "../../../store/store";

const MessageContent = React.forwardRef<HTMLDivElement>((prop, ref) => {
  const chatMessages = useAppSelector(
    (state: RootState) => state.chats.chatChannelMessages
  );
  const currentUser = useAppSelector(selectCurrentUser);

  return (
    <div className="relative flex flex-col w-full h-full justify-items-start">
      {chatMessages &&
        chatMessages?.map((re, index) => {
          return re.sender.id === currentUser?.id ? (
            <div key={re.id} className="mt-2 ">
              <div
                className={`max-w-xs p-2 ml-auto mr-3 break-all bg-blue-500  w-max text-dark-txt ${
                  index === 0
                    ? "rounded-t-2xl rounded-bl-2xl"
                    : chatMessages.length - 1 !== index
                    ? "rounded-l-2xl"
                    : "rounded-l-2xl rounded-br-2xl"
                }`}
              >
                {re.content}
              </div>
            </div>
          ) : (
            <div key={re.id} className="mt-2 ">
              <div
                className={`max-w-xs p-2  mr-3 break-all bg-dark-third  w-max text-dark-txt ${
                  index === 0
                    ? "rounded-t-2xl rounded-tr-2xl"
                    : chatMessages.length - 1 !== index
                    ? "rounded-r-2xl"
                    : "rounded-r-2xl rounded-bl-2xl"
                }`}
              >
                {re.content}
              </div>
            </div>
          );
        })}
      <div className="mt-10 opacity-0">""</div>
      <div ref={ref} />
    </div>
  );
});

export default MessageContent;
