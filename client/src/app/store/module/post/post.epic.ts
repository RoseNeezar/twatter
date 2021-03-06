import { AnyAction } from "@reduxjs/toolkit";
import { combineEpics, Epic } from "redux-observable";
import {
  catchError,
  concatMap,
  debounceTime,
  filter,
  forkJoin,
  map,
  of,
  switchMap,
  tap,
} from "rxjs";
import agent from "../../../api/agent";
import Navigate from "../../../utils/Navigate";
import { RootState } from "../../store";
import { errorCatcher, setUser } from "../auth/auth.slice";
import { setProfilePost } from "../user/user.slice";
import {
  createPost,
  deletePost,
  fetchPost,
  getReplyPost,
  getReplyPostFulfilled,
  likePost,
  likePostFulfilled,
  pinnedPost,
  replyToPost,
  replyToPostFullfilled,
  replyToSinglePost,
  replyToSinglePostFullfilled,
  retweetPost,
  retweetPostFulfilled,
  searchPost,
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

        catchError((err) => of(errorCatcher(err.response)))
      )
    )
  );

const fetchPostEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(fetchPost.match),
    switchMap((action) =>
      agent.PostService.fetchPost(action.payload).pipe(
        map((res) => setFetchPost(res.response)),
        // takeUntil(action$.pipe(filter(routeChange.match))),
        catchError((err) => of(errorCatcher(err.response)))
      )
    )
  );

const likePostEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(likePost.match),
    switchMap((action) =>
      agent.PostService.likePost(action.payload).pipe(
        map((res) => likePostFulfilled(res.response)),
        tap(
          (data) =>
            state$.value.chats.socketConnected &&
            state$.value.chats.socket?.emit(
              "notification-received",
              data.payload.postedBy.id,
              state$.value.auth.user?.id
            )
        ),
        catchError((err) => of(errorCatcher(err.response)))
      )
    )
  );

const getLikedUserEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(likePostFulfilled.match),
    switchMap((action) =>
      agent.AuthService.currentUser().pipe(
        map(({ response }) => setUser(response)),
        catchError((err) => of(errorCatcher(err.response)))
      )
    )
  );

const retweetPostEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(retweetPost.match),
    switchMap((action) =>
      agent.PostService.retweetPost(action.payload).pipe(
        map((res) => retweetPostFulfilled(res.response)),
        tap(
          (data) =>
            state$.value.chats.socketConnected &&
            state$.value.chats.socket?.emit(
              "notification-received",
              data.payload.postedBy.id,
              state$.value.auth.user?.id
            )
        ),
        catchError((err) => of(errorCatcher(err.response)))
      )
    )
  );

const getRetweetedPostEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(retweetPostFulfilled.match),
    switchMap((action) =>
      agent.AuthService.currentUser().pipe(
        map(({ response }) => setUser(response)),
        catchError((err) => of(errorCatcher(err.response)))
      )
    ),
    concatMap((action) =>
      agent.PostService.fetchPost({
        followingOnly: true,
      }).pipe(
        map(({ response }) => setFetchPost(response)),
        catchError((err) => of(errorCatcher(err.response)))
      )
    )
  );

const GetReplyPostEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(getReplyPost.match),
    switchMap((action) =>
      agent.PostService.getPostById(action.payload).pipe(
        map((res) => getReplyPostFulfilled(res.response)),
        catchError((err) =>
          of(errorCatcher(err.response)).pipe(
            tap(() => Navigate?.push("/home"))
          )
        )
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
        tap(
          (data) =>
            state$.value.chats.socketConnected &&
            state$.value.chats.socket?.emit(
              "notification-received",
              data.payload.replyTo.postedBy,
              state$.value.auth.user?.id
            )
        ),
        catchError((err) => of(errorCatcher(err.response)))
      )
    )
  );

const replyToPostFullfilledEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(replyToPostFullfilled.match),
    switchMap((action) =>
      agent.PostService.fetchPost({
        followingOnly: true,
      }).pipe(
        map(({ response }) => setFetchPost(response)),

        catchError((err) => of(errorCatcher(err.response)))
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
        tap(
          (data) =>
            state$.value.chats.socketConnected &&
            state$.value.chats.socket?.emit(
              "notification-received",
              data.payload.replyTo.postedBy,
              state$.value.auth.user?.id
            )
        ),
        catchError((err) => of(errorCatcher(err.response)))
      )
    )
  );

const replyToSinglePostFullfilledEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(replyToSinglePostFullfilled.match),
    switchMap((action) =>
      agent.PostService.getPostById(action.payload.replyTo.id).pipe(
        map((res) => getReplyPostFulfilled(res.response)),
        catchError((err) => of(errorCatcher(err.response)))
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
          catchError((err) => of(errorCatcher(err.response)))
        );
      } else {
        return agent.PostService.deletePostById(action.payload.id).pipe(
          map(() => fetchPost({ followingOnly: true })),
          catchError((err) => of(errorCatcher(err.response)))
        );
      }
    })
  );

const pinnedPostEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(pinnedPost.match),
    concatMap((action) =>
      forkJoin({
        pinnedPost: agent.PostService.pinnedPostById(action.payload.id, {
          pinned: action.payload.pinned,
        }),
        profilePost: agent.PostService.fetchPost({
          postedBy: state$.value.user.currentUserProfile?.id,
          isReply: false,
        }),
      }).pipe(
        map(({ profilePost: { response } }) => setProfilePost(response)),
        catchError((err) => of(errorCatcher(err.response)))
      )
    )
  );

const searchPostEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(searchPost.match),
    debounceTime(1500),
    switchMap((action) =>
      agent.PostService.fetchPost({
        search: action.payload.content,
      }).pipe(
        map((res) => setFetchPost(res.response)),
        catchError((err) => of(errorCatcher(err.response)))
      )
    )
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
  deletePostEpic,
  pinnedPostEpic,
  searchPostEpic
);
