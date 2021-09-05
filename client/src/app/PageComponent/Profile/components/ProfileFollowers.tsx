import { FC } from "hoist-non-react-statics/node_modules/@types/react";
import React, { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks/hooks";
import { selectCurrentUser } from "../../../store/module/auth/auth.slice";
import {
  followUser,
  getUserProfileFollowers,
} from "../../../store/module/user/user.slice";
import { RootState } from "../../../store/store";
import Navigate from "../../../utils/Navigate";
interface IProfileFollow {
  backUrl: string;
}
const ProfileFollowers: FC<IProfileFollow> = ({ backUrl }) => {
  const currentUserProfile = useAppSelector(
    (state: RootState) => state.user.currentUserProfile
  );

  const currentUserFollowerProfile = useAppSelector(
    (state: RootState) => state.user.userProfileFollows
  );
  const currentUser = useAppSelector(selectCurrentUser);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const dispatch = useAppDispatch();

  const checkIsFollowing = (userId: string) => {
    return currentUser?.following?.findIndex((re) => re === userId) !== -1
      ? true
      : false;
  };

  const HandleFollowUser = (userId: string) => {
    dispatch(followUser(userId));
  };

  const HandleToUserProfile = (username: string) => {
    Navigate?.push(`/profile/${username}`);
  };

  useEffect(() => {
    if (!currentUserProfile?.id) return;
    dispatch(getUserProfileFollowers(String(currentUserProfile?.id)));
  }, [dispatch, getUserProfileFollowers, currentUser, currentUserProfile]);

  return (
    <>
      {currentUserFollowerProfile?.followers?.map((re) => (
        <div
          key={re.id}
          className="px-3 py-4 hover:bg-gray-400 hover:bg-opacity-10 "
        >
          <div className="flex flex-row">
            <div className="mx-1">
              <img
                className="object-cover w-12 h-12 border-2 rounded-full cursor-pointer border-dark-main"
                src={re.profilePic}
                alt="profile-pic"
                onClick={() => HandleToUserProfile(re.username)}
              />
            </div>
            <div className="flex flex-col flex-1 ml-2">
              <div className="font-bold text-dark-txt">{re.username}</div>
              <div className="text-gray-500">@ {re.email}</div>
            </div>
            {currentUser?.id !== re.id && (
              <button
                ref={buttonRef}
                className={` p-2 text-sm  border-2 hover:bg-gray-200 hover:bg-opacity-40 text-md rounded-3xl  text-white hover:border-dark-txt ${
                  checkIsFollowing(re.id)
                    ? "bg-blue-500 font-bold border-blue-500 "
                    : ""
                }`}
                onMouseEnter={() => {
                  if (buttonRef.current?.textContent === "Following") {
                    buttonRef.current!.textContent = "Unfollow";
                  }
                }}
                onMouseLeave={() => {
                  if (buttonRef.current?.textContent === "Unfollow") {
                    buttonRef.current!.textContent = "Following";
                  }
                }}
                onClick={() => HandleFollowUser(re.id)}
              >
                {checkIsFollowing(re.id) ? "Following" : "Follow"}
              </button>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default ProfileFollowers;
