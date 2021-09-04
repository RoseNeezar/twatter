import { AnyAction } from "@reduxjs/toolkit";
import { combineEpics, Epic } from "redux-observable";
import {
  catchError,
  concatMap,
  filter,
  from,
  ignoreElements,
  map,
  of,
  switchMap,
  tap,
} from "rxjs";
import agent from "../../../api/agent";
import Navigate from "../../../utils/Navigate";
import { RootState } from "../../store";
import { errorCatcher, setUser } from "../auth/auth.slice";
import {
  deleteProfilePost,
  fetchProfilePost,
  followUser,
  followUserFullfilled,
  getUserProfile,
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
      from(agent.UserService.getUserByUsername(action.payload)).pipe(
        map(setUserProfile),
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
      from(agent.PostService.fetchPost(action.payload)).pipe(
        map(setProfilePost),
        catchError((err) => {
          return of(errorCatcher(err.response.data));
        })
      )
    )
  );

const replyToProfilePostEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(replyToProfilePost.match),
    concatMap((action) => {
      return (
        from(
          agent.PostService.createPost({
            content: action.payload.content,
            replyTo: action.payload.replyTo,
          })
        ).pipe(
          ignoreElements(),
          catchError((err) => of(errorCatcher(err.response.data)))
        ),
        from(
          agent.PostService.fetchPost({
            postedBy: state$.value.user.currentUserProfile?.id,
            isReply: !state$.value.user.path?.includes("with_replies")
              ? false
              : true,
          })
        ).pipe(
          map(setProfilePost),
          catchError((err) => {
            return of(errorCatcher(err.response.data));
          })
        )
      );
    })
  );

const deleteProfilePostEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(deleteProfilePost.match),
    concatMap((action) => {
      return (
        from(agent.PostService.deletePostById(action.payload.id)).pipe(
          ignoreElements(),
          catchError((err) => of(errorCatcher(err.response.data)))
        ),
        from(
          agent.PostService.fetchPost({
            postedBy: state$.value.user.currentUserProfile?.id,
            isReply: !state$.value.user.path?.includes("with_replies")
              ? false
              : true,
          })
        ).pipe(
          map(setProfilePost),
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
      from(agent.PostService.retweetPost(action.payload.id)).pipe(
        map(retweetProfilePostFulfilled),
        catchError((err) => of(errorCatcher(err.response.data)))
      )
    )
  );

const getRetweetedPostEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(retweetProfilePostFulfilled.match),
    concatMap((action) => {
      return (
        from(agent.AuthService.currentUser()).pipe(
          map(setUser),
          catchError((err) => of(errorCatcher(err.response.data)))
        ),
        from(
          agent.PostService.fetchPost({
            postedBy: state$.value.user.currentUserProfile?.id,
            isReply: !state$.value.user.path?.includes("with_replies")
              ? false
              : true,
          })
        ).pipe(
          map(setProfilePost),
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
      from(agent.UserService.followUser(action.payload)).pipe(
        map(followUserFullfilled),
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
  followUserEpic
);
