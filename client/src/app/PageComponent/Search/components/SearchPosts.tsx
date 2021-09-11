import { FC } from "hoist-non-react-statics/node_modules/@types/react";
import React from "react";
import { useRouteMatch } from "react-router-dom";
import { useAppSelector } from "../../../store/hooks/hooks";
import { RootState } from "../../../store/store";
import PostContentContainer from "../../Tweet/components/PostContentContainer";

interface ISearchPosts {
  backUrl: string;
}
const SearchPosts: FC<ISearchPosts> = ({ backUrl }) => {
  const { url } = useRouteMatch();
  const getSearchedPost = useAppSelector(
    (state: RootState) => state.posts.post
  );

  return (
    <div className="flex flex-col w-full">
      {getSearchedPost?.map((res) => {
        return (
          <PostContentContainer
            key={res.id}
            post={res}
            backUrl={url}
            isSearchPost={true}
          />
        );
      })}
    </div>
  );
};

export default SearchPosts;
