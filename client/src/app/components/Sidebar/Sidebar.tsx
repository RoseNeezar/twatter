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
  const chatBadgeCount = useAppSelector(
    (state: RootState) => state.chats.unreadChat
  );
  const notificationBadgeCount = useAppSelector(
    (state: RootState) => state.notification.unreadNotification
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
    <div className="flex justify-end">
      <div className="fixed h-full mr-auto top-3">
        <ul className="flex flex-col items-end h-full ">
          <li
            className={`mb-5 xl:mr-auto rounded-full py-3  px-4   hover:bg-dark-third `}
          >
            <Link
              to={`${url}home`}
              className={` text-center text-xl  text-dark-txt flex justify-center xl:justify-start items-center`}
            >
              <i className={`text-2xl  bx bxs-meteor`}></i>
            </Link>
          </li>

          <li
            className={`mb-10 xl:mr-auto rounded-full py-3  px-4 mr-3  xl:rounded-3xl xl:py-2 xl:pr-5 xl:pl-2 hover:bg-dark-third ${
              pathname === homeRoute && "bg-dark-third "
            }`}
          >
            <Link
              to={`${url}home`}
              className={` text-center text-xl  text-dark-txt flex justify-center xl:justify-start items-center`}
            >
              <i
                className={`text-2xl xl:pr-5 bx ${
                  pathname === homeRoute ? "bxs-home-circle" : "bx-home-circle"
                } `}
              ></i>

              <span className="hidden xl:inline-block"> Home</span>
            </Link>
          </li>
          <li
            className={`mb-10 xl:mr-auto rounded-full py-3  px-4 mr-3  xl:rounded-3xl xl:py-2 xl:pr-5 xl:pl-2 hover:bg-dark-third ${
              pathname.includes(searchRoute) && "bg-dark-third "
            }`}
          >
            <Link
              to={`${url}search/posts`}
              className={` text-center text-xl  text-dark-txt flex justify-center xl:justify-start items-center`}
            >
              <i
                className={`text-2xl xl:pr-5 bx ${
                  pathname.includes(searchRoute)
                    ? "bxs-search"
                    : "bx-search-alt"
                }`}
              ></i>
              <span className="hidden xl:inline-block"> Search</span>
            </Link>
          </li>
          <li
            className={`mb-10 relative xl:mr-auto rounded-full py-3  px-4 mr-3  xl:rounded-3xl xl:py-2 xl:pr-5 xl:pl-2 hover:bg-dark-third ${
              pathname === notificationRoute && "bg-dark-third "
            }`}
          >
            {notificationBadgeCount && notificationBadgeCount?.length > 0 && (
              <NotificationBadge badgeCount={notificationBadgeCount.length} />
            )}
            <Link
              to={`${url}notification`}
              className={`text-center text-xl  text-dark-txt flex justify-center xl:justify-start items-center`}
            >
              <i
                className={`text-2xl xl:pr-5 bx ${
                  pathname === notificationRoute ? "bxs-bell" : "bx-bell"
                } `}
              ></i>
              <span className="hidden xl:inline-block"> Notification</span>
            </Link>
          </li>
          <li
            className={`relative mb-10 xl:mr-auto py-3  px-4 rounded-full mr-3  xl:rounded-3xl xl:py-2 xl:pr-5 xl:pl-2 hover:bg-dark-third ${
              pathname.includes(messagesRoute) && "bg-dark-third "
            }`}
          >
            {chatBadgeCount && chatBadgeCount?.length > 0 && (
              <NotificationBadge badgeCount={chatBadgeCount.length} />
            )}
            <Link
              to={`${url}messages`}
              className={`${
                pathname.includes(messagesRoute) && "pointer-events-none "
              }text-center text-xl  text-dark-txt flex justify-center xl:justify-start items-center`}
            >
              <i
                className={`text-2xl xl:pr-5 bx ${
                  pathname.includes(messagesRoute)
                    ? " bx-envelope-open"
                    : "bx-envelope "
                }`}
              ></i>
              <span className="hidden xl:inline-block"> Messages</span>
            </Link>
          </li>

          <li
            className={`mb-10 xl:mr-auto rounded-full py-3  px-4 mr-3  xl:rounded-3xl xl:py-2 xl:pr-5 xl:pl-2 hover:bg-dark-third ${
              pathname.includes(profileRoute) && "bg-dark-third "
            }`}
          >
            <Link
              to={`${url}profile/${currentUser?.username}`}
              className={`text-center text-xl  text-dark-txt flex justify-center xl:justify-start items-center`}
            >
              <i
                className={`text-2xl xl:pr-5 bx ${
                  pathname.includes(profileRoute) ? "bxs-user" : "bx-user"
                } `}
              ></i>
              <span className="hidden xl:inline-block"> Profile</span>
            </Link>
          </li>
          <li className="mt-6 border-b border-gray-200 "></li>
          <li
            className="flex flex-row justify-between px-4 py-3 mx-auto mt-auto mb-10 mr-4 font-bold text-center rounded-full cursor-pointer xl:w-52 xl:-ml-10 hover:bg-dark-third text-dark-txt xl:rounded-3xl"
            onClick={() => handleLogout()}
          >
            <div className="hidden w-full xl:inline-block">
              <div className="flex justify-between w-full">
                <span>{getUser}</span>
                <span>Logout</span>
              </div>
            </div>
            <div className="inline-block text-2xl xl:hidden">
              <i className="bx bx-log-out"></i>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
