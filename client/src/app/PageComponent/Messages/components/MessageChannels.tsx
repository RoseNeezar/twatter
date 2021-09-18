import dayjs from "dayjs";
import React, { FC } from "react";
import { useLocation } from "react-router";
import { useAppSelector } from "../../../store/hooks/hooks";
import { selectCurrentUser } from "../../../store/module/auth/auth.slice";
import { IUser } from "../../../store/module/auth/types/auth.model";
import { RootState } from "../../../store/store";
import Navigate from "../../../utils/Navigate";
interface IMessageChannels {
  backUrl: string;
}
const MessageChannels: FC<IMessageChannels> = ({ backUrl }) => {
  const { pathname } = useLocation();

  const chatChannels = useAppSelector(
    (state: RootState) => state.chats.chatChannels
  );
  const currentUser = useAppSelector(selectCurrentUser);
  const HandleOpenChat = (chatId: string) => {
    Navigate?.push(`${backUrl}/chat/${chatId}`);
  };

  return (
    <>
      {chatChannels &&
        chatChannels.map((re) => {
          return (
            <div className="border-b border-dark-third" key={re.id}>
              <div
                className={`relative flex flex-row items-center py-5 px-1 cursor-pointer hover:bg-dark-third overflow-ellipsis ${
                  pathname.includes(re.id) && "border-r-2 border-blue-500"
                }`}
                onClick={() => HandleOpenChat(re.id)}
              >
                {re.users.length === 2 ? (
                  <>
                    {re.users.map((r) => {
                      const c = r as IUser;
                      if (c.id !== currentUser?.id) {
                        return (
                          <img
                            key={c.id}
                            className="object-cover w-12 h-12 border-2 rounded-full cursor-pointer border-dark-main"
                            src={c.profilePic}
                            alt="profile-pic"
                          />
                        );
                      } else {
                        return null;
                      }
                    })}
                  </>
                ) : (
                  <>
                    <div className="relative w-24 h-12 overflow-hidden">
                      {re.users.map((r, index) => {
                        const c = r as IUser;
                        if (index > 2) {
                          return null;
                        }
                        return (
                          <div
                            key={c.id}
                            className={`absolute top-0 `}
                            style={{
                              zIndex: index !== 0 ? index + 10 : 0,
                              left: index !== 0 ? index * 8 : 0,
                            }}
                          >
                            <img
                              className="object-cover w-12 h-12 border-2 rounded-full cursor-pointer border-dark-main"
                              src={c.profilePic}
                              alt="profile-pic"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
                <div className="truncate w-80">
                  <div className="flex flex-row mx-1 ">
                    {re.users.length === 2
                      ? re.users.map((r, index) => {
                          const c = r as IUser;
                          if (c.id !== currentUser?.id) {
                            return (
                              <h1 key={c.id} className="ml-1">
                                {c.username}
                              </h1>
                            );
                          } else {
                            return null;
                          }
                        })
                      : re.users.map((r, index) => {
                          const c = r as IUser;
                          return (
                            <div key={c.id} className="flex ">
                              <span>{index > 0 && ","}</span>
                              <h1 className="ml-1">{c.username}</h1>
                            </div>
                          );
                        })}
                  </div>
                  {re.latestMessage && (
                    <div className="flex flex-row mx-2 text-gray-500 ">
                      <h1 className="mr-1">
                        {re.latestMessage.sender.id === currentUser?.id
                          ? "You"
                          : re.latestMessage.sender.username}
                        :
                      </h1>
                      <h1> {re.latestMessage.content}</h1>
                    </div>
                  )}
                </div>

                <div className="ml-auto text-sm text-gray-500 ">
                  {dayjs(re.updatedAt).format("	MMM D, YYYY")}
                </div>
              </div>
            </div>
          );
        })}
    </>
  );
};

export default MessageChannels;
