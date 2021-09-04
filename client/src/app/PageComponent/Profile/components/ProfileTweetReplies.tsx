import React, { FC, useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../../store/hooks/hooks";
import { selectCurrentUser } from "../../../store/module/auth/auth.slice";
import { fetchPost } from "../../../store/module/post/post.slice";
import { fetchProfilePost } from "../../../store/module/user/user.slice";
import { RootState } from "../../../store/store";
import PostContentContainer from "../../Tweet/components/PostContentContainer";
interface IProfileTweetReplies {
  backUrl: string;
}
const ProfileTweetReplies: FC<IProfileTweetReplies> = () => {
  const { url } = useRouteMatch();
  const currentUserProfile = useAppSelector(
    (state: RootState) => state.user.currentUserProfile
  );
  const currentUser = useAppSelector(selectCurrentUser);

  const getPost = useAppSelector((state: RootState) => state.user.profilePost);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      fetchProfilePost({ postedBy: currentUserProfile?.id, isReply: true })
    );
  }, [dispatch, fetchPost, currentUser, currentUserProfile]);
  return (
    <div className="flex flex-col w-full">
      {getPost?.map((res) => {
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

export default ProfileTweetReplies;
