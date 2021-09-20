import { useRouter } from "next/dist/client/router";
import React from "react";
import { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hooks";
import { logout, selectCurrentUser } from "../../store/module/auth/auth.slice";
import { RootState } from "../../store/store";
import NotificationBadge from "./components/NotificationBadge";

interface ISidebar {
  url: string;
}

const Sidebar: FC<ISidebar> = ({ url }) => {
  const router = useRouter();
  const currentUser = useAppSelector(selectCurrentUser);
  const badgeCount = useAppSelector(
    (state: RootState) => state.chats.unreadChat
  );
  const homeRoute = "/home";
  const notificationRoute = "/notification";
  const searchRoute = "/search";
  const messagesRoute = "/messages";
  const profileRoute = `/profile/${currentUser?.username}`;
  const { pathname } = useLocation();

  const getUser = useAppSelector(
    (state: RootState) => state.auth.user?.firstName
  );
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    try {
      dispatch(logout());
      router.push("/");
    } catch (error) {}
  };

  return (
    <div className="flex justify-start xl:justify-end">
      <div className="fixed top-0 h-full ">
        <ul className="flex flex-col items-end h-full pt-10 pl-10">
          <li
            className={`mb-10 xl:mr-auto rounded-full p-4 mr-3  xl:rounded-3xl xl:py-2 xl:pr-5 xl:pl-2 hover:bg-dark-third ${
              pathname === homeRoute && "bg-dark-third "
            }`}
          >
            <Link
              to={`${url}home`}
              className={` text-center text-xl  text-dark-txt flex justify-center xl:justify-start items-center`}
            >
              <i className="text-2xl xl:pr-5 bx bx-notepad"></i>
              <span className="hidden xl:inline-block"> Home</span>
            </Link>
          </li>
          <li
            className={`mb-10 xl:mr-auto rounded-full p-4 mr-3  xl:rounded-3xl xl:py-2 xl:pr-5 xl:pl-2 hover:bg-dark-third ${
              pathname.includes(searchRoute) && "bg-dark-third "
            }`}
          >
            <Link
              to={`${url}search/posts`}
              className={` text-center text-xl  text-dark-txt flex justify-center xl:justify-start items-center`}
            >
              <i className="text-2xl xl:pr-5 bx bx-search-alt"></i>
              <span className="hidden xl:inline-block"> Search</span>
            </Link>
          </li>
          <li
            className={`relative mb-10 xl:mr-auto rounded-full p-4 mr-3  xl:rounded-3xl xl:py-2 xl:pr-5 xl:pl-2 hover:bg-dark-third ${
              pathname.includes(messagesRoute) && "bg-dark-third "
            }`}
          >
            {badgeCount && badgeCount?.length > 0 && (
              <NotificationBadge badgeCount={badgeCount.length} />
            )}
            <Link
              to={`${url}messages`}
              className={` text-center text-xl  text-dark-txt flex justify-center xl:justify-start items-center`}
            >
              <i className="text-2xl xl:pr-5 bx bx-mail-send"></i>
              <span className="hidden xl:inline-block"> Messages</span>
            </Link>
          </li>
          <li
            className={`mb-10 xl:mr-auto rounded-full p-4 mr-3  xl:rounded-3xl xl:py-2 xl:pr-5 xl:pl-2 hover:bg-dark-third ${
              pathname === notificationRoute && "bg-dark-third "
            }`}
          >
            <Link
              to={`${url}notification`}
              className={`text-center text-xl  text-dark-txt flex justify-center xl:justify-start items-center`}
            >
              <i className="text-2xl xl:pr-5 bx bx-calendar"></i>
              <span className="hidden xl:inline-block"> Notification</span>
            </Link>
          </li>
          <li
            className={`mb-10 xl:mr-auto rounded-full p-4 mr-3  xl:rounded-3xl xl:py-2 xl:pr-5 xl:pl-2 hover:bg-dark-third ${
              pathname.includes(profileRoute) && "bg-dark-third "
            }`}
          >
            <Link
              to={`${url}profile/${currentUser?.username}`}
              className={`text-center text-xl  text-dark-txt flex justify-center xl:justify-start items-center`}
            >
              <i className="text-2xl xl:pr-5 bx bx-user"></i>
              <span className="hidden xl:inline-block"> Profile</span>
            </Link>
          </li>
          <li className="mt-6 border-b border-gray-200 "></li>
          <li
            className="flex flex-row justify-between p-4 mx-auto mt-auto mb-10 mr-4 font-bold text-center cursor-pointer xl:w-52 xl:-ml-10 hover:bg-dark-third text-dark-txt rounded-3xl"
            onClick={() => handleLogout()}
          >
            <div className="hidden xl:inline-block">{getUser}</div>
            <div className="">Logout</div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
