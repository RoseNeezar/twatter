import React, { FC, useState, useEffect } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../../../store/hooks/hooks";
import { searchPost } from "../../../store/module/post/post.slice";
import { searchUser } from "../../../store/module/user/user.slice";

interface ISearchTabs {
  backUrl: string;
}
const SearchTabs: FC<ISearchTabs> = ({ backUrl }) => {
  const postRoute = `/search/posts`;
  const usersRoute = `/search/users`;
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();

  const [search, setSearch] = useState("");

  const HandleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;
    setSearch(newValue);
    if (newValue.trim().length > 0) {
      if (pathname === postRoute) {
        dispatch(
          searchPost({
            content: newValue,
          })
        );
      } else if (pathname === usersRoute) {
        dispatch(
          searchUser({
            content: newValue,
          })
        );
      }
    }
  };
  useEffect(() => {
    setSearch("");
  }, [pathname]);

  return (
    <>
      <div className="relative flex flex-row mt-16">
        <div className="absolute text-2xl top-0.5 left-5 text-dark-txt cursor-pointer z-30">
          <i className="bx bx-search"></i>
        </div>
        <input
          type="text"
          placeholder="Search"
          className="w-full p-1 pl-10 mx-3 text-white bg-gray-500 outline-none rounded-2xl bg-opacity-20"
          value={search}
          onChange={HandleSearch}
        />
      </div>
      <div className="flex flex-row mt-5 font-bold border-b justify-evenly text-dark-txt border-dark-third">
        <Link
          to={`${backUrl}/posts`}
          className={`w-full py-5 text-center border-b-4 border-transparent cursor-pointer hover:bg-dark-txt hover:bg-opacity-10  ${
            pathname === postRoute && "border-blue-500 "
          }`}
        >
          <span> Post</span>
        </Link>

        <Link
          to={`${backUrl}/users`}
          className={`w-full py-5  text-center border-b-4 border-transparent cursor-pointer hover:bg-dark-txt hover:bg-opacity-10  ${
            pathname === usersRoute && "border-blue-500 "
          }`}
        >
          <span> Users</span>
        </Link>
      </div>
    </>
  );
};

export default SearchTabs;
