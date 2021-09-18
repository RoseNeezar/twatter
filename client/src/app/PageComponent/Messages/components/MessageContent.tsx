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
        chatMessages?.map((re) => {
          return re.sender.id === currentUser?.id ? (
            <div key={re.id} className="mt-2 ">
              <div className="p-2 ml-auto mr-3 bg-blue-500 rounded-2xl w-max text-dark-txt">
                {re.content}
              </div>
            </div>
          ) : (
            <div key={re.id} className="mt-2 ">
              <div className="p-2 mr-3 bg-dark-third rounded-2xl w-max text-dark-txt">
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
