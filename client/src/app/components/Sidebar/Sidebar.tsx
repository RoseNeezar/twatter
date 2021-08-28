import { useRouter } from "next/dist/client/router";
import React from "react";
import { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hooks";
import { logout } from "../../store/module/auth/auth.slice";
import { RootState } from "../../store/store";

interface ISidebar {
  url: string;
}

const Sidebar: FC<ISidebar> = ({ url }) => {
  const router = useRouter();
  const homeRoute = "/home";
  const notificationRoute = "/notification";
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
    <div className="flex justify-end pr-4 ">
      <div className="fixed top-0 h-3/4">
        <ul className="flex flex-col items-center mr-3 justify-evenly h-1/2">
          <li
            className={`mr-auto ml-5  w-3/4  rounded-3xl py-2 pl-3 hover:bg-dark-third ${
              pathname === homeRoute && "bg-dark-third "
            }`}
          >
            <Link
              to={`${url}home`}
              className={`text-center text-xl  text-dark-txt flex justify-center xl:justify-start items-center`}
            >
              <i className="pr-5 bx bx-notepad"></i>
              <span className="hidden lg:inline-block"> Home</span>
            </Link>
          </li>

          <li
            className={`mr-auto ml-5  w-full  rounded-3xl py-2 pl-3 hover:bg-dark-third ${
              pathname === notificationRoute && "bg-dark-third "
            }`}
          >
            <Link
              to={`${url}notification`}
              className={`text-center text-xl  text-dark-txt flex justify-center xl:justify-start items-center`}
            >
              <i className="pr-5 bx bx-calendar"></i>
              <span className="hidden lg:inline-block"> Notification</span>
            </Link>
          </li>
          <li className="mt-6 border-b border-gray-200 "></li>
        </ul>
      </div>
      <div
        className="flex flex-row justify-between w-56 p-4 mx-auto mb-10 font-bold text-center cursor-pointer hover:bg-dark-third text-dark-txt rounded-3xl"
        onClick={() => handleLogout()}
      >
        <div className="">{getUser}</div>
        <div className="">Logout</div>
      </div>
    </div>
  );
};

export default Sidebar;
