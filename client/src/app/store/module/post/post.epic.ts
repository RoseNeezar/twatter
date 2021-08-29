import { AnyAction } from "@reduxjs/toolkit";
import { combineEpics, Epic } from "redux-observable";
import {
  catchError,
  concatMap,
  delay,
  filter,
  from,
  map,
  of,
  switchMap,
} from "rxjs";
import agent from "../../../api/agent";
import { RootState } from "../../store";
import { errorCatcher } from "../auth/auth.slice";
import { createPost, fetchPost, setFetchPost, setPost } from "./post.slice";

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

export default combineEpics(createPostEpic, fetchPostEpic);
