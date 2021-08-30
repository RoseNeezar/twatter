import { AnyAction } from "@reduxjs/toolkit";
import { combineEpics, Epic } from "redux-observable";
import { catchError, filter, from, map, of, switchMap } from "rxjs";
import agent from "../../../api/agent";
import { RootState } from "../../store";
import { errorCatcher, setUser } from "../auth/auth.slice";
import {
  createPost,
  fetchPost,
  getReplyPost,
  getReplyPostFulfilled,
  likePost,
  likePostFulfilled,
  replyToPost,
  replyToPostFullfilled,
  retweetPost,
  retweetPostFulfilled,
  setFetchPost,
  setPost,
} from "./post.slice";

export type MyEpic = Epic<AnyAction, AnyAction, RootState>;

const createPostEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(createPost.match),
    switchMap((action) =>
      from(
        agent.PostService.createPost({
          content: action.payload.content,
        })
      ).pipe(
        map(setPost),
        catchError((err) => of(errorCatcher(err.response.data)))
      )
    )
  );

const fetchPostEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(fetchPost.match),
    switchMap((action) =>
      from(agent.PostService.fetchPost()).pipe(
        map(setFetchPost),
        catchError((err) => of(errorCatcher(err.response.data)))
      )
    )
  );

const likePostEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(likePost.match),
    switchMap((action) =>
      from(agent.PostService.likePost(action.payload)).pipe(
        map(likePostFulfilled),
        catchError((err) => of(errorCatcher(err.response.data)))
      )
    )
  );

const getLikedUserEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(likePostFulfilled.match),
    switchMap((action) =>
      from(agent.AuthService.currentUser()).pipe(
        map(setUser),
        catchError((err) => of(errorCatcher(err.response.data)))
      )
    )
  );

const retweetPostEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(retweetPost.match),
    switchMap((action) =>
      from(agent.PostService.retweetPost(action.payload)).pipe(
        map(retweetPostFulfilled),
        catchError((err) => of(errorCatcher(err.response.data)))
      )
    )
  );

const getRetweetedPostEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(retweetPostFulfilled.match),
    switchMap((action) =>
      from(agent.PostService.fetchPost()).pipe(
        map(setFetchPost),
        catchError((err) => of(errorCatcher(err.response.data)))
      )
    )
  );

const getRetweetedUserEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(retweetPostFulfilled.match),
    switchMap((action) =>
      from(agent.AuthService.currentUser()).pipe(
        map(setUser),
        catchError((err) => of(errorCatcher(err.response.data)))
      )
    )
  );

const GetReplyPostEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(getReplyPost.match),
    switchMap((action) =>
      from(agent.PostService.getPostById(action.payload)).pipe(
        map(getReplyPostFulfilled),
        catchError((err) => of(errorCatcher(err.response.data)))
      )
    )
  );

const replyToPostEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(replyToPost.match),
    switchMap((action) =>
      from(
        agent.PostService.createPost({
          content: action.payload.content,
          replyTo: action.payload.replyTo,
        })
      ).pipe(
        map(replyToPostFullfilled),
        catchError((err) => of(errorCatcher(err.response.data)))
      )
    )
  );

const replyToPostFullfilledEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(replyToPostFullfilled.match),
    switchMap((action) =>
      from(agent.PostService.fetchPost()).pipe(
        map(setFetchPost),
        catchError((err) => of(errorCatcher(err.response.data)))
      )
    )
  );

export default combineEpics(
  createPostEpic,
  fetchPostEpic,
  likePostEpic,
  getLikedUserEpic,
  retweetPostEpic,
  getRetweetedUserEpic,
  getRetweetedPostEpic,
  GetReplyPostEpic,
  replyToPostEpic,
  replyToPostFullfilledEpic
);
