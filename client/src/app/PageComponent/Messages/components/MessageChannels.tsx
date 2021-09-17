import dayjs from "dayjs";
import React, { FC } from "react";
import { useLocation, useParams } from "react-router";
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
  console.log(pathname);
  return (
    <>
      {chatChannels &&
        chatChannels.map((re) => {
          return (
            <div className="border-b border-dark-third">
              <div
                className={`relative flex flex-row items-center p-3 cursor-pointer hover:bg-dark-third overflow-ellipsis ${
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
                    <div className="relative w-16 h-12 overflow-hidden">
                      {re.users.map((r, index) => {
                        const c = r as IUser;
                        return (
                          <div
                            className={`absolute top-0 `}
                            style={{
                              zIndex: index !== 0 ? index + 10 : 0,
                              left: index !== 0 ? index + 10 : 0,
                            }}
                          >
                            <img
                              key={c.id}
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
                <div className="flex flex-row max-w-xs overflow-ellipsis">
                  {re.users.length === 2
                    ? re.users.map((r, index) => {
                        const c = r as IUser;
                        if (c.id !== currentUser?.id) {
                          return (
                            <>
                              <span>{index > 0 && ","}</span>
                              <h1 className="ml-1">{c.username}</h1>
                            </>
                          );
                        } else {
                          return null;
                        }
                      })
                    : re.users.map((r, index) => {
                        const c = r as IUser;
                        return (
                          <>
                            <span>{index > 0 && ","}</span>
                            <h1 className="ml-1">{c.username}</h1>
                          </>
                        );
                      })}
                </div>
                <div className="ml-auto text-sm text-gray-500">
                  {dayjs(re.updatedAt).format("	MMMM D, YYYY")}
                </div>
              </div>
            </div>
          );
        })}
    </>
  );
};

export default MessageChannels;
