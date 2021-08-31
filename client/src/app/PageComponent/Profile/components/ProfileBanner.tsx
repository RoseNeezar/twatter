import dayjs from "dayjs";
import React, { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppSelector } from "../../../store/hooks/hooks";
import { selectCurrentUser } from "../../../store/module/auth/auth.slice";
interface IProfileBanner {
  url: string;
}
const ProfileBanner: FC<IProfileBanner> = ({ url }) => {
  const currentUser = useAppSelector(selectCurrentUser);
  const homeRoute = "/profile";
  const likesRoute = "/profile/likes";
  const mediaRoute = "/profile/media";
  const repliesRoute = "/profile/with_replies";
  const { pathname } = useLocation();

  return (
    <div className="border-b mt-14 border-dark-third">
      <div className="relative">
        <img
          className="w-tweet"
          style={{ height: 200 }}
          src="https://png.pngtree.com/thumb_back/fh260/background/20200714/pngtree-modern-double-color-futuristic-neon-background-image_351866.jpg"
          alt=""
        />
      </div>
      <div className="absolute left-10 top-44">
        <img
          className="object-cover w-32 h-32 border-2 rounded-full border-dark-main"
          src={currentUser?.profilePic}
          alt=""
        />
      </div>
      <div className="relative pl-4 mt-14 text-dark-txt">
        <div className="text-xl font-bold">
          {currentUser?.firstName} {currentUser?.lastName}
        </div>
        <div className="-mt-2 text-gray-500">@{currentUser?.username}</div>
        <div className="mt-3 text-gray-500 ">
          <i className="bx bx-building"></i> Joined{" "}
          {dayjs(currentUser?.createdAt).format("MMMM YYYY	")}
        </div>
        <button className="absolute p-1 px-2 border-2 hover:bg-gray-200 hover:bg-opacity-40 text-md rounded-3xl right-5 -top-10 text-dark-txt border-dark-txt">
          Edit Profile
        </button>
        <div className="flex flex-row mt-3 text-dark-txt">
          <div className="mr-5 font-bold">
            0 <span className="text-gray-500">Following</span>
          </div>
          <div className="font-bold">
            12 <span className="text-gray-500">Followers</span>
          </div>
        </div>
      </div>
      <div className="flex flex-row mt-4 font-bold justify-evenly text-dark-txt">
        <Link
          to={`${url}`}
          className={`px-10 py-5 text-center border-b-4 border-transparent cursor-pointer hover:bg-dark-txt hover:bg-opacity-10  ${
            pathname === homeRoute && "border-blue-500 "
          }`}
        >
          <span> Twaats</span>
        </Link>

        <Link
          to={`${url}/with_replies`}
          className={`px-10 py-5  text-center border-b-4 border-transparent cursor-pointer hover:bg-dark-txt hover:bg-opacity-10  ${
            pathname === repliesRoute && "border-blue-500 "
          }`}
        >
          <span> Twaats & replies</span>
        </Link>

        <Link
          to={`${url}/media`}
          className={`px-10 py-5 text-center border-b-4 border-transparent cursor-pointer hover:bg-dark-txt hover:bg-opacity-10    ${
            pathname === mediaRoute && "border-blue-500 "
          }`}
        >
          <span> Media</span>
        </Link>

        <Link
          to={`${url}/likes`}
          className={`px-10 py-5 text-center border-b-4 border-transparent cursor-pointer hover:bg-dark-txt hover:bg-opacity-10   ${
            pathname === likesRoute && "border-blue-500 "
          }`}
        >
          <span> Likes</span>
        </Link>
      </div>
    </div>
  );
};

export default ProfileBanner;
