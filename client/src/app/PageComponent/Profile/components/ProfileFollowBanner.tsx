import { FC } from "hoist-non-react-statics/node_modules/@types/react";
import React from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../../store/hooks/hooks";
import { RootState } from "../../../store/store";
interface IProfileFollowBanner {
  backUrl: string;
}
const ProfileFollowBanner: FC<IProfileFollowBanner> = ({ backUrl }) => {
  const currentUserProfile = useAppSelector(
    (state: RootState) => state.user.currentUserProfile
  );

  const followersRoute = `/profile/${currentUserProfile?.username}/followers`;
  const followingRoute = `/profile/${currentUserProfile?.username}/following`;
  const { pathname } = useLocation();

  return (
    <div className="flex flex-row font-bold border-b mt-14 justify-evenly text-dark-txt border-dark-third">
      <Link
        to={`${backUrl}/followers`}
        className={`px-10 py-5 text-center border-b-4 border-transparent cursor-pointer hover:bg-dark-txt hover:bg-opacity-10  ${
          pathname === followersRoute && "border-blue-500 "
        }`}
      >
        <span> Followers</span>
      </Link>

      <Link
        to={`${backUrl}/following`}
        className={`px-10 py-5  text-center border-b-4 border-transparent cursor-pointer hover:bg-dark-txt hover:bg-opacity-10  ${
          pathname === followingRoute && "border-blue-500 "
        }`}
      >
        <span> Following</span>
      </Link>
    </div>
  );
};

export default ProfileFollowBanner;
