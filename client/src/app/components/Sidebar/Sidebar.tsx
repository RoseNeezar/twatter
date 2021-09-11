import { useRouter } from "next/dist/client/router";
import React from "react";
import { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hooks";
import { logout, selectCurrentUser } from "../../store/module/auth/auth.slice";
import { RootState } from "../../store/store";

interface ISidebar {
  url: string;
}

const Sidebar: FC<ISidebar> = ({ url }) => {
  const router = useRouter();
  const currentUser = useAppSelector(selectCurrentUser);
  const homeRoute = "/home";
  const notificationRoute = "/notification";
  const searchRoute = "/search";
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
    <div className="flex justify-end ">
      <div className="fixed top-0 h-full ">
        <ul className="flex flex-col items-end h-full pt-10 pl-10">
          <li
            className={`mb-10 lg:mr-auto rounded-full p-4 mr-3  lg:rounded-3xl lg:py-2 lg:pr-5 lg:pl-2 hover:bg-dark-third ${
              pathname === homeRoute && "bg-dark-third "
            }`}
          >
            <Link
              to={`${url}home`}
              className={` text-center text-xl  text-dark-txt flex justify-center lg:justify-start items-center`}
            >
              <i className="text-2xl lg:pr-5 bx bx-notepad"></i>
              <span className="hidden lg:inline-block"> Home</span>
            </Link>
          </li>
          <li
            className={`mb-10 lg:mr-auto rounded-full p-4 mr-3  lg:rounded-3xl lg:py-2 lg:pr-5 lg:pl-2 hover:bg-dark-third ${
              pathname.includes(searchRoute) && "bg-dark-third "
            }`}
          >
            <Link
              to={`${url}search/posts`}
              className={` text-center text-xl  text-dark-txt flex justify-center lg:justify-start items-center`}
            >
              <i className="text-2xl lg:pr-5 bx bx-search-alt"></i>
              <span className="hidden lg:inline-block"> Search</span>
            </Link>
          </li>
          <li
            className={`mb-10 lg:mr-auto rounded-full p-4 mr-3  lg:rounded-3xl lg:py-2 lg:pr-5 lg:pl-2 hover:bg-dark-third ${
              pathname === notificationRoute && "bg-dark-third "
            }`}
          >
            <Link
              to={`${url}notification`}
              className={`text-center text-xl  text-dark-txt flex justify-center lg:justify-start items-center`}
            >
              <i className="text-2xl lg:pr-5 bx bx-calendar"></i>
              <span className="hidden lg:inline-block"> Notification</span>
            </Link>
          </li>
          <li
            className={`mb-10 lg:mr-auto rounded-full p-4 mr-3  lg:rounded-3xl lg:py-2 lg:pr-5 lg:pl-2 hover:bg-dark-third ${
              pathname.includes(profileRoute) && "bg-dark-third "
            }`}
          >
            <Link
              to={`${url}profile/${currentUser?.username}`}
              className={`text-center text-xl  text-dark-txt flex justify-center lg:justify-start items-center`}
            >
              <i className="text-2xl lg:pr-5 bx bx-user"></i>
              <span className="hidden lg:inline-block"> Profile</span>
            </Link>
          </li>
          <li className="mt-6 border-b border-gray-200 "></li>
          <li
            className="flex flex-row justify-between p-4 mx-auto mt-auto mb-10 mr-4 font-bold text-center cursor-pointer lg:w-52 lg:-ml-10 hover:bg-dark-third text-dark-txt rounded-3xl"
            onClick={() => handleLogout()}
          >
            <div className="hidden lg:inline-block">{getUser}</div>
            <div className="">Logout</div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
