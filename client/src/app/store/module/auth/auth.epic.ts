import { AnyAction } from "@reduxjs/toolkit";
import { combineEpics, Epic } from "redux-observable";
import {
  catchError,
  concatMap,
  filter,
  map,
  mergeMap,
  of,
  switchMap,
} from "rxjs";
import agent from "../../../api/agent";
import { RootState } from "../../store";
import { resetPost } from "../post/post.slice";
import { resetUserProfile } from "../user/user.slice";
import {
  errorCatcher,
  getUser,
  login,
  logout,
  register,
  resetUser,
  setAppLoaded,
  setUser,
} from "./auth.slice";

export type MyEpic = Epic<AnyAction, AnyAction, RootState>;

const loginEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(login.match),
    switchMap((action) =>
      agent.AuthService.login({
        email: action.payload.email,
        password: action.payload.password,
      }).pipe(
        map(({ response }) => setUser(response)),
        catchError((err) => of(errorCatcher(err.response)))
      )
    )
  );

const registerEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(register.match),
    concatMap((action) =>
      agent.AuthService.register({
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        username: action.payload.username,
        email: action.payload.email,
        password: action.payload.password,
      }).pipe(
        map(({ response }) => setUser(response)),
        catchError((err) => of(errorCatcher(err.response)))
      )
    )
  );

const logoutEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(logout.match),
    switchMap((action) =>
      agent.AuthService.logout().pipe(
        mergeMap(({ response }) => [
          resetUser(),
          resetPost(),
          resetUserProfile(),
        ]),
        catchError((err) => of(errorCatcher(err.response)))
      )
    )
  );

const getUserEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(getUser.match),
    switchMap((action) =>
      agent.AuthService.currentUser().pipe(
        mergeMap(({ response }) => [setUser(response), setAppLoaded()]),
        catchError((err) => {
          return of(errorCatcher(err.response));
        })
      )
    )
  );

export default combineEpics(loginEpic, registerEpic, getUserEpic, logoutEpic);
