import { AnyAction } from "@reduxjs/toolkit";
import { combineEpics, Epic } from "redux-observable";
import { catchError, filter, map, of, switchMap } from "rxjs";
import agent from "../../../api/agent";
import { RootState } from "../../store";
import { errorCatcher } from "../auth/auth.slice";
import {
  fetchNotification,
  fetchNotificationSuccess,
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

export default combineEpics(
  fetchNotificationEpic,
  refreshNotificationBadgeEpic
);
