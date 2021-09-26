import React, { FC, useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks/hooks";
import { selectCurrentUser } from "../../../store/module/auth/auth.slice";
import { fetchPost } from "../../../store/module/post/post.slice";
import { IPost } from "../../../store/module/post/types/post.types";
import { fetchProfilePost } from "../../../store/module/user/user.slice";
import { RootState } from "../../../store/store";
import PostContentContainer from "../../Tweet/components/PostContentContainer";

interface IProfileTweet {
  backUrl: string;
}

const ProfileTweet: FC<IProfileTweet> = () => {
  const { url } = useRouteMatch();
  const currentUserProfile = useAppSelector(
    (state: RootState) => state.user.currentUserProfile
  );
  const currentUser = useAppSelector(selectCurrentUser);
  const getPost = useAppSelector((state: RootState) => state.user.profilePost);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      fetchProfilePost({ postedBy: currentUserProfile?.id, isReply: false })
    );
  }, [dispatch, fetchPost, currentUser, currentUserProfile]);
  return (
    <div className="flex flex-col w-full">
      {getPost && getPost?.findIndex((re) => re.pinned === true) !== -1 ? (
        <PostContentContainer
          key={getPost?.find((re) => re.pinned === true)?.id}
          post={getPost?.find((re) => re.pinned === true) as IPost}
          backUrl={url}
          isSinglePost={true}
          isProfilePost={true}
          isPinnedPost={true}
        />
      ) : null}
      {getPost
        ?.filter((re) => !re.pinned)
        .map((res) => {
          return (
            <PostContentContainer
              key={res.id}
              post={res}
              backUrl={url}
              isSinglePost={true}
              isProfilePost={true}
            />
          );
        })}
    </div>
  );
};

export default ProfileTweet;
