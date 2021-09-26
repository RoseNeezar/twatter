import { AnyAction } from "@reduxjs/toolkit";
import { combineEpics, Epic } from "redux-observable";
import {
  catchError,
  concatMap,
  filter,
  forkJoin,
  map,
  mergeMap,
  of,
  switchMap,
} from "rxjs";
import agent from "../../../api/agent";
import { RootState } from "../../store";
import { errorCatcher } from "../auth/auth.slice";
import {
  fetchNotification,
  fetchNotificationSuccess,
  openAllNotification,
  openSingleNotification,
  refreshNotificationBadge,
  refreshNotificationBadgeSuccess,
} from "./notification.slice";

export type MyEpic = Epic<AnyAction, AnyAction, RootState>;

const fetchNotificationEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(fetchNotification.match),
    switchMap((action) =>
      agent.NotificationService.fetchAllNotification(action.payload).pipe(
        map(({ response }) => fetchNotificationSuccess(response)),
        catchError((err) => {
          return of(errorCatcher(err.response));
        })
      )
    )
  );

const refreshNotificationBadgeEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(refreshNotificationBadge.match),
    switchMap((action) =>
      agent.NotificationService.fetchAllNotification(action.payload).pipe(
        map(({ response }) => refreshNotificationBadgeSuccess(response)),
        catchError((err) => {
          return of(errorCatcher(err.response));
        })
      )
    )
  );

const openNotificationEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(openSingleNotification.match),
    concatMap((action) =>
      forkJoin({
        openNotif: agent.NotificationService.openSingleNotification(
          action.payload
        ),
        refreshNotif: agent.NotificationService.fetchAllNotification({
          unreadOnly: true,
        }),
      }).pipe(
        map(({ refreshNotif: { response } }) =>
          refreshNotificationBadgeSuccess(response)
        ),
        catchError((err) => of(errorCatcher(err.response)))
      )
    )
  );

const openAllNotificationEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(openAllNotification.match),
    concatMap((action) =>
      forkJoin({
        openNotif: agent.NotificationService.openAllNotification(),
        updateNotif: agent.NotificationService.fetchAllNotification({
          unreadOnly: false,
        }),
        refreshNotif: agent.NotificationService.fetchAllNotification({
          unreadOnly: true,
        }),
      }).pipe(
        mergeMap(
          ({
            refreshNotif: { response: refreshResponse },
            updateNotif: { response: updateResponse },
          }) => [
            refreshNotificationBadgeSuccess(refreshResponse),
            fetchNotificationSuccess(updateResponse),
          ]
        ),
        catchError((err) => of(errorCatcher(err.response)))
      )
    )
  );

export default combineEpics(
  fetchNotificationEpic,
  refreshNotificationBadgeEpic,
  openNotificationEpic,
  openAllNotificationEpic
);
