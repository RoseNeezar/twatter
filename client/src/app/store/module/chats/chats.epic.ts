import { AnyAction } from "@reduxjs/toolkit";
import { combineEpics, Epic } from "redux-observable";
import {
  catchError,
  filter,
  forkJoin,
  map,
  mergeMap,
  of,
  switchMap,
  tap,
} from "rxjs";
import agent from "../../../api/agent";
import { RootState } from "../../store";
import { errorCatcher } from "../auth/auth.slice";
import {
  createChat,
  getChatDetails,
  getChatDetailsSuccess,
  getChatMessages,
  getChatMessagesSuccess,
  getUserChat,
  getUserChatSuccess,
  sendMessage,
  sendMessageSuccess,
} from "./chats.slice";

export type MyEpic = Epic<AnyAction, AnyAction, RootState>;

const createChatEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(createChat.match),
    switchMap((action) =>
      agent.ChatService.createChat(action.payload).pipe(
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

const getChatDetailsEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(getChatDetails.match),
    switchMap((action) =>
      forkJoin({
        chatDetails: agent.ChatService.getChatDetailsByChatId(action.payload),
        chatMessages: agent.MessageService.getChatMessagesChatId(
          action.payload
        ),
      }).pipe(
        mergeMap(({ chatDetails, chatMessages }) => [
          getChatDetailsSuccess(chatDetails.response),
          getChatMessagesSuccess(chatMessages.response),
        ]),
        tap(() => state$.value.chats.socket?.emit("join-room", action.payload)),
        catchError((err) => {
          return of(errorCatcher(err.response));
        })
      )
    )
  );

const sendMessageEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(sendMessage.match),
    switchMap((action) =>
      agent.MessageService.sendMessage(action.payload).pipe(
        map(({ response }) => sendMessageSuccess(response)),
        tap((data) =>
          state$.value.chats.socket?.emit("new-message", data.payload)
        ),
        catchError((err) => {
          return of(errorCatcher(err.response));
        })
      )
    )
  );

const getChatMessageEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(getChatMessages.match),
    switchMap((action) =>
      agent.MessageService.getChatMessagesChatId(action.payload).pipe(
        map(({ response }) => getChatMessagesSuccess(response)),
        catchError((err) => {
          return of(errorCatcher(err.response));
        })
      )
    )
  );

export default combineEpics(
  createChatEpic,
  getChatChannelsEpic,
  getChatDetailsEpic,
  sendMessageEpic,
  getChatMessageEpic
);
