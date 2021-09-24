import React, { FC } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks/hooks";
import { selectCurrentUser } from "../../../store/module/auth/auth.slice";
import { IUser } from "../../../store/module/auth/types/auth.model";
import { resetChannel } from "../../../store/module/chats/chats.slice";
import { RootState } from "../../../store/store";
import Navigate from "../../../utils/Navigate";
interface IMessageHeader {
  backUrl: string;
}
const MessageHeader: FC<IMessageHeader> = ({ backUrl }) => {
  const currentUser = useAppSelector(selectCurrentUser);
  const channelDetails = useAppSelector(
    (state: RootState) => state.chats.chatChannelDetail
  );
  const dispatch = useAppDispatch();

  const HandleCloseChat = () => {
    dispatch(resetChannel());
    Navigate?.push(`${backUrl}`);
  };

  return (
    <div className="relative flex flex-row border-b border-dark-third">
      <div className="flex flex-row items-center max-w-md ml-3 truncate">
        {channelDetails?.users.map((r, index, total) => {
          const c = r as IUser;
          if (index > 5) {
            return (
              <div
                key={index}
                className="flex items-center text-center bg-gray-500 bg-opacity-50 rounded-full w-7 h-7"
              >
                <h1 className="pl-1 text-sm">+ {total.length - 6}</h1>
              </div>
            );
          }
          return currentUser?.id === c.id ? (
            <div key={c.id} className="flex">
              <span className="py-3 ">{index > 0 && ","}</span>
              <h1 className="py-3 mr-1">You</h1>
            </div>
          ) : (
            <div key={c.id} className="flex">
              <span className="py-3 ">{index > 0 && ","}</span>
              <h1 className="py-3 mr-1">{c.username}</h1>
            </div>
          );
        })}
      </div>
      <div className="absolute right-0 z-50 w-full text-right top-2">
        <div className="relative inline-block text-left">
          <div
            className="flex items-center justify-center p-2 mx-1 text-xl rounded-full cursor-pointer bg-dark-main text-dark-txt hover:bg-dark-third"
            id="dark-mode-toggle"
            onClick={() => HandleCloseChat()}
          >
            <i className="bx bxs-exit"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageHeader;
