import { AnyAction } from "@reduxjs/toolkit";
import { combineEpics, Epic } from "redux-observable";
import { catchError, filter, ignoreElements, map, of, switchMap } from "rxjs";
import agent from "../../../api/agent";
import { RootState } from "../../store";
import { errorCatcher } from "../auth/auth.slice";
import { createChat, getUserChat, getUserChatSuccess } from "./chats.slice";

export type MyEpic = Epic<AnyAction, AnyAction, RootState>;

const createChatEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(createChat.match),
    switchMap((action) =>
      agent.ChatService.createChat(action.payload).pipe(
        ignoreElements(),
        catchError((err) => {
          return of(errorCatcher(err.response));
        })
      )
    ),
    switchMap((action) =>
      agent.ChatService.fetchUserChat({ unreadOnly: false }).pipe(
        map(({ response }) => getUserChatSuccess(response)),
        catchError((err) => {
          return of(errorCatcher(err.response));
        })
      )
    )
  );

const getChatChannelsEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(getUserChat.match),
    switchMap((action) =>
      agent.ChatService.fetchUserChat(action.payload).pipe(
        map(({ response }) => getUserChatSuccess(response)),
        catchError((err) => {
          return of(errorCatcher(err.response));
        })
      )
    )
  );

export default combineEpics(createChatEpic, getChatChannelsEpic);
