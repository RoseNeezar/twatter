import React, { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks/hooks";
import { selectCurrentUser } from "../../../store/module/auth/auth.slice";
import {
  fetchRecommendUser,
  followUser,
} from "../../../store/module/user/user.slice";
import { RootState } from "../../../store/store";
import Navigate from "../../../utils/Navigate";

const TweetAction = () => {
  const dispatch = useAppDispatch();
  const recommendUsers = useAppSelector(
    (state: RootState) => state.user.recommendedUser
  );

  const currentUser = useAppSelector(selectCurrentUser);

  const buttonRef = useRef<HTMLButtonElement>(null);

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
    dispatch(fetchRecommendUser());
  }, [currentUser]);
  return (
    <div className="flex justify-start ">
      <div className="fixed top-0 h-full w-72">
        <div className="flex flex-col items-start h-full pt-10 pl-10 text-dark-txt">
          <div className="p-3 bg-dark-third rounded-3xl">
            <h1 className="text-lg font-bold">Who to follow</h1>
            <div className="flex flex-col ">
              {recommendUsers &&
                recommendUsers.map((re) => {
                  return (
                    <div className="flex flex-row mb-6 w-72">
                      <div className="flex w-12 pt-2 ">
                        <img
                          className="w-10 h-10 rounded-full cursor-pointer"
                          src={re?.profilePic}
                          onClick={() => HandleToUserProfile(re.username)}
                        />
                      </div>
                      <div className="flex flex-col flex-1 text-dark-txt ">
                        <div className="flex flex-row mt-2">
                          <div className="mr-3 font-bold">{re.username}</div>
                          <div className="mr-3 text-gray-500">@{re.email}</div>
                        </div>
                      </div>

                      <button
                        ref={buttonRef}
                        className={` py-2 px-4  text-sm  border-2 hover:bg-gray-200 hover:bg-opacity-40 text-md rounded-3xl  text-white hover:border-dark-txt ${
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
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetAction;
