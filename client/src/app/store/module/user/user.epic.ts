import { AnyAction } from "@reduxjs/toolkit";
import { combineEpics, Epic } from "redux-observable";
import {
  catchError,
  concatMap,
  debounceTime,
  filter,
  ignoreElements,
  map,
  of,
  switchMap,
  tap,
} from "rxjs";
import agent from "../../../api/agent";
import { RootState } from "../../store";
import { errorCatcher, setUser } from "../auth/auth.slice";
import {
  deleteProfilePost,
  fetchProfilePost,
  fetchRecommendUser,
  fetchRecommendUserSuccess,
  followUser,
  followUserFullfilled,
  getfollowUserFullfilled,
  getUserProfile,
  getUserProfileFollowers,
  getUserProfileFollowing,
  replyToProfilePost,
  retweetProfilePost,
  retweetProfilePostFulfilled,
  searchUser,
  searchUserSuccess,
  setProfilePost,
  setUserProfile,
} from "./user.slice";

export type MyEpic = Epic<AnyAction, AnyAction, RootState>;

const getUserEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(getUserProfile.match),
    switchMap((action) =>
      agent.UserService.getUserByUsername(action.payload).pipe(
        map(({ response }) => setUserProfile(response)),
        catchError((err) => {
          return of(errorCatcher(err.response));
        })
      )
    )
  );

const fetchProfilePostEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(fetchProfilePost.match),
    switchMap((action) =>
      agent.PostService.fetchPost(action.payload).pipe(
        map(({ response }) => setProfilePost(response)),
        catchError((err) => {
          return of(errorCatcher(err.response));
        })
      )
    )
  );

const replyToProfilePostEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(replyToProfilePost.match),
    switchMap((action) => {
      return agent.PostService.createPost({
        content: action.payload.content,
        replyTo: action.payload.replyTo,
      }).pipe(catchError((err) => of(errorCatcher(err.response))));
    }),
    concatMap((action) =>
      agent.PostService.fetchPost({
        postedBy: state$.value.user.currentUserProfile?.id,
        isReply: !state$.value.user.path?.includes("with_replies")
          ? false
          : true,
      }).pipe(
        map(({ response }) => setProfilePost(response)),
        catchError((err) => {
          return of(errorCatcher(err.response));
        })
      )
    )
  );

const deleteProfilePostEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(deleteProfilePost.match),
    concatMap((action) => {
      return (
        agent.PostService.deletePostById(action.payload.id).pipe(
          ignoreElements(),
          catchError((err) => of(errorCatcher(err.response)))
        ),
        agent.PostService.fetchPost({
          postedBy: state$.value.user.currentUserProfile?.id,
          isReply: !state$.value.user.path?.includes("with_replies")
            ? false
            : true,
        }).pipe(
          map(({ response }) => setProfilePost(response)),
          catchError((err) => {
            return of(errorCatcher(err.response));
          })
        )
      );
    })
  );

const retweetProfilePostEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(retweetProfilePost.match),
    switchMap((action) =>
      agent.PostService.retweetPost(action.payload.id).pipe(
        map(({ response }) => retweetProfilePostFulfilled()),
        catchError((err) => of(errorCatcher(err.response)))
      )
    )
  );

const getRetweetedPostEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(retweetProfilePostFulfilled.match),
    concatMap((action) => {
      return (
        agent.AuthService.currentUser().pipe(
          map(({ response }) => setUser(response)),
          catchError((err) => of(errorCatcher(err.response)))
        ),
        agent.PostService.fetchPost({
          postedBy: state$.value.user.currentUserProfile?.id,
          isReply: !state$.value.user.path?.includes("with_replies")
            ? false
            : true,
        }).pipe(
          map(({ response }) => setProfilePost(response)),
          catchError((err) => {
            return of(errorCatcher(err.response));
          })
        )
      );
    })
  );

const followUserEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(followUser.match),
    switchMap((action) =>
      agent.UserService.followUser(action.payload).pipe(
        map(({ response }) => followUserFullfilled(response)),
        tap(
          (data) =>
            state$.value.chats.socketConnected &&
            state$.value.chats.socket?.emit(
              "notification-received",
              action.payload
            )
        ),
        catchError((err) => of(errorCatcher(err.response)))
      )
    )
  );

const getFollowerProfilePostEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(getUserProfileFollowers.match),
    concatMap((action) => {
      return (
        agent.UserService.getUsersFollower(action.payload).pipe(
          map(({ response }) => getfollowUserFullfilled(response)),
          catchError((err) => of(errorCatcher(err.response)))
        ),
        agent.UserService.getRecommendedUser().pipe(
          map((res) => fetchRecommendUserSuccess(res.response)),
          catchError((err) => of(errorCatcher(err.response)))
        )
      );
    })
  );

const getFollowingProfilePostEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(getUserProfileFollowing.match),
    switchMap((action) =>
      agent.UserService.getUsersFollowing(action.payload).pipe(
        map(({ response }) => getfollowUserFullfilled(response)),
        catchError((err) => of(errorCatcher(err.response)))
      )
    )
  );

const searchUserEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(searchUser.match),
    debounceTime(1500),
    switchMap((action) =>
      agent.UserService.searchUser({
        search: action.payload.content,
      }).pipe(
        map((res) => searchUserSuccess(res.response)),
        catchError((err) => of(errorCatcher(err.response)))
      )
    )
  );

const recommendUserEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(fetchRecommendUser.match),
    debounceTime(1500),
    switchMap((action) =>
      agent.UserService.getRecommendedUser().pipe(
        map((res) => fetchRecommendUserSuccess(res.response)),
        catchError((err) => of(errorCatcher(err.response)))
      )
    )
  );
export default combineEpics(
  getUserEpic,
  fetchProfilePostEpic,
  replyToProfilePostEpic,
  deleteProfilePostEpic,
  retweetProfilePostEpic,
  getRetweetedPostEpic,
  followUserEpic,
  getFollowerProfilePostEpic,
  getFollowingProfilePostEpic,
  searchUserEpic,
  recommendUserEpic
);
