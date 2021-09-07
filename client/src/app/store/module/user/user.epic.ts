import { AnyAction } from "@reduxjs/toolkit";
import { combineEpics, Epic } from "redux-observable";
import {
  catchError,
  concatMap,
  filter,
  ignoreElements,
  map,
  of,
  switchMap,
} from "rxjs";
import agent from "../../../api/agent";
import { RootState } from "../../store";
import { errorCatcher, setUser } from "../auth/auth.slice";
import {
  deleteProfilePost,
  fetchProfilePost,
  followUser,
  followUserFullfilled,
  getfollowUserFullfilled,
  getUserProfile,
  getUserProfileFollowers,
  getUserProfileFollowing,
  replyToProfilePost,
  retweetProfilePost,
  retweetProfilePostFulfilled,
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
          return of(errorCatcher(err.response.data));
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
          return of(errorCatcher(err.response.data));
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
      }).pipe(catchError((err) => of(errorCatcher(err.response.data))));
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
          return of(errorCatcher(err.response.data));
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
          catchError((err) => of(errorCatcher(err.response.data)))
        ),
        agent.PostService.fetchPost({
          postedBy: state$.value.user.currentUserProfile?.id,
          isReply: !state$.value.user.path?.includes("with_replies")
            ? false
            : true,
        }).pipe(
          map(({ response }) => setProfilePost(response)),
          catchError((err) => {
            return of(errorCatcher(err.response.data));
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
        catchError((err) => of(errorCatcher(err.response.data)))
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
          catchError((err) => of(errorCatcher(err.response.data)))
        ),
        agent.PostService.fetchPost({
          postedBy: state$.value.user.currentUserProfile?.id,
          isReply: !state$.value.user.path?.includes("with_replies")
            ? false
            : true,
        }).pipe(
          map(({ response }) => setProfilePost(response)),
          catchError((err) => {
            return of(errorCatcher(err.response.data));
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
        catchError((err) => of(errorCatcher(err.response.data)))
      )
    )
  );

const getFollowerProfilePostEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(getUserProfileFollowers.match),
    switchMap((action) =>
      agent.UserService.getUsersFollower(action.payload).pipe(
        map(({ response }) => getfollowUserFullfilled(response)),
        catchError((err) => of(errorCatcher(err.response.data)))
      )
    )
  );

const getFollowingProfilePostEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(getUserProfileFollowing.match),
    switchMap((action) =>
      agent.UserService.getUsersFollowing(action.payload).pipe(
        map(({ response }) => getfollowUserFullfilled(response)),
        catchError((err) => of(errorCatcher(err.response.data)))
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
  getFollowingProfilePostEpic
);
