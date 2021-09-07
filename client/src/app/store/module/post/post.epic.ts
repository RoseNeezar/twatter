import { AnyAction } from "@reduxjs/toolkit";
import { combineEpics, Epic } from "redux-observable";
import {
  catchError,
  concatMap,
  debounceTime,
  filter,
  forkJoin,
  from,
  ignoreElements,
  map,
  of,
  switchMap,
  takeUntil,
  tap,
  zip,
} from "rxjs";
import { ajax } from "rxjs/ajax";
import agent from "../../../api/agent";
import { RootState } from "../../store";
import { errorCatcher, routeChange, setUser } from "../auth/auth.slice";
import {
  createPost,
  deletePost,
  fetchPost,
  getReplyPost,
  getReplyPostFulfilled,
  likePost,
  likePostFulfilled,
  replyToPost,
  replyToPostFullfilled,
  replyToSinglePost,
  replyToSinglePostFullfilled,
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
      agent.PostService.createPost({
        content: action.payload.content,
      }).pipe(
        map((res) => setPost(res.response)),

        catchError((err) => of(errorCatcher(err.response.data)))
      )
    )
  );

const fetchPostEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(fetchPost.match),
    switchMap((action) =>
      agent.PostService.fetchPost(action.payload).pipe(
        map((res) => setFetchPost(res.response)),
        takeUntil(action$.pipe(filter(routeChange.match))),
        catchError((err) => of(errorCatcher(err.response.data)))
      )
    )
  );

const likePostEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(likePost.match),
    switchMap((action) =>
      agent.PostService.likePost(action.payload).pipe(
        map((res) => likePostFulfilled(res.response)),

        catchError((err) => of(errorCatcher(err.response.data)))
      )
    )
  );

const getLikedUserEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(likePostFulfilled.match),
    switchMap((action) =>
      agent.AuthService.currentUser().pipe(
        map(({ response }) => setUser(response)),
        catchError((err) => of(errorCatcher(err.response.data)))
      )
    )
  );

const retweetPostEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(retweetPost.match),
    switchMap((action) =>
      agent.PostService.retweetPost(action.payload).pipe(
        map((res) => retweetPostFulfilled(res.response)),

        catchError((err) => of(errorCatcher(err.response.data)))
      )
    )
  );

const getRetweetedPostEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(retweetPostFulfilled.match),
    switchMap((action) =>
      agent.AuthService.currentUser().pipe(
        map(({ response }) => setUser(response)),
        catchError((err) => of(errorCatcher(err.response.data)))
      )
    ),
    concatMap((action) =>
      agent.PostService.fetchPost().pipe(
        map(({ response }) => setFetchPost(response)),

        catchError((err) => of(errorCatcher(err.response.data)))
      )
    )
  );

const GetReplyPostEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(getReplyPost.match),
    switchMap((action) =>
      agent.PostService.getPostById(action.payload).pipe(
        map((res) => getReplyPostFulfilled(res.response)),

        catchError((err) => of(errorCatcher(err.response.data)))
      )
    )
  );

const replyToPostEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(replyToPost.match),
    switchMap((action) =>
      agent.PostService.createPost({
        content: action.payload.content,
        replyTo: action.payload.replyTo,
      }).pipe(
        map((res) => replyToPostFullfilled(res.response)),

        catchError((err) => of(errorCatcher(err.response.data)))
      )
    )
  );

const replyToPostFullfilledEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(replyToPostFullfilled.match),
    switchMap((action) =>
      agent.PostService.fetchPost().pipe(
        map(({ response }) => setFetchPost(response)),

        catchError((err) => of(errorCatcher(err.response.data)))
      )
    )
  );

const replyToSinglePostEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(replyToSinglePost.match),
    switchMap((action) =>
      agent.PostService.createPost({
        content: action.payload.content,
        replyTo: action.payload.replyTo,
      }).pipe(
        map((res) => replyToSinglePostFullfilled(res.response)),

        catchError((err) => of(errorCatcher(err.response.data)))
      )
    )
  );

const replyToSinglePostFullfilledEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(replyToSinglePostFullfilled.match),
    switchMap((action) =>
      agent.PostService.getPostById(action.payload.replyTo.id).pipe(
        map((res) => getReplyPostFulfilled(res.response)),

        catchError((err) => of(errorCatcher(err.response.data)))
      )
    )
  );

const deletePostEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(deletePost.match),
    concatMap((action) => {
      if (!!action.payload.replyTo) {
        return forkJoin({
          deleted: agent.PostService.deletePostById(action.payload.id),
          post: agent.PostService.getPostById(action.payload.replyTo),
        }).pipe(
          map(({ post }) => getReplyPostFulfilled(post.response)),
          catchError((err) => of(errorCatcher(err.response.data)))
        );
      } else {
        return agent.PostService.deletePostById(action.payload.id).pipe(
          map(() => fetchPost({ followingOnly: true })),
          catchError((err) => of(errorCatcher(err.response.data)))
        );
      }
    })
  );

export default combineEpics(
  createPostEpic,
  fetchPostEpic,
  likePostEpic,
  getLikedUserEpic,
  retweetPostEpic,
  getRetweetedPostEpic,
  GetReplyPostEpic,
  replyToPostEpic,
  replyToPostFullfilledEpic,
  replyToSinglePostEpic,
  replyToSinglePostFullfilledEpic,
  deletePostEpic
);
