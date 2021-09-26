import { AnyAction } from "@reduxjs/toolkit";
import { combineEpics, Epic } from "redux-observable";
import {
  catchError,
  concatMap,
  debounceTime,
  filter,
  forkJoin,
  map,
  mergeMap,
  of,
  switchMap,
  takeUntil,
  tap,
} from "rxjs";
import agent from "../../../api/agent";
import Navigate from "../../../utils/Navigate";
import { RootState } from "../../store";
import { errorCatcher } from "../auth/auth.slice";
import {
  createChat,
  getChatDetails,
  getChatDetailsSuccess,
  getChatMessagesSuccess,
  getPaginatedMessages,
  getPaginatedMessagesSuccess,
  getUserChat,
  getUserChatSuccess,
  markMessageRead,
  refreshMessageBadgeChat,
  refreshMessageBadgeChatSuccess,
  sendMessage,
  sendMessageSuccess,
} from "./chats.slice";

export type MyEpic = Epic<AnyAction, AnyAction, RootState>;

const createChatEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(createChat.match),
    switchMap((action) =>
      agent.ChatService.createChat(action.payload).pipe(
        tap(
          (data) =>
            state$.value.chats.socketConnected &&
            state$.value.chats.socket?.emit("new-channel", {
              userIds: data.response.users,
              currentUserId: state$.value.auth.user?.id,
            })
        ),
        tap((data) => Navigate?.push(`/messages/chat/${data.response.id}`)),
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
    concatMap((action) =>
      forkJoin({
        chatDetails: agent.ChatService.getChatDetailsByChatId(action.payload),
        chatMessages: agent.MessageService.getChatMessagesChatId({
          chatId: action.payload,
          limit: 20,
          page: 1,
        }),
      }).pipe(
        mergeMap(({ chatDetails, chatMessages }) => [
          getChatDetailsSuccess(chatDetails.response),
          getChatMessagesSuccess(chatMessages.response),
        ]),
        tap(
          () =>
            state$.value.chats.socketConnected &&
            state$.value.chats.socket?.emit("join-room", action.payload)
        ),
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
        tap(
          (data) =>
            state$.value.chats.socketConnected &&
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
    filter(getPaginatedMessages.match),
    debounceTime(1000),
    switchMap((action) =>
      agent.MessageService.getChatMessagesChatId({
        chatId: action.payload.chatId,
        limit: action.payload.limit,
        page: action.payload.page,
      }).pipe(
        map(({ response }) => getPaginatedMessagesSuccess(response)),
        catchError((err) => {
          return of(errorCatcher(err.response));
        })
      )
    )
  );

const refreshMessageBadgeEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(refreshMessageBadgeChat.match),
    switchMap((action) =>
      agent.ChatService.fetchUserChat(action.payload).pipe(
        map(({ response }) => refreshMessageBadgeChatSuccess(response)),
        catchError((err) => {
          return of(errorCatcher(err.response));
        })
      )
    )
  );

const markReadOnMessageEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(markMessageRead.match),
    switchMap((action) =>
      agent.MessageService.markReadChatMessagesChatId(action.payload).pipe(
        takeUntil(action$.pipe(filter(getChatDetailsSuccess.match))),
        map(() =>
          refreshMessageBadgeChat({
            unreadOnly: true,
          })
        ),
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
  getChatMessageEpic,
  refreshMessageBadgeEpic,
  markReadOnMessageEpic
);
