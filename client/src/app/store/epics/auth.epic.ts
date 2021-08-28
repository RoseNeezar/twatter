import { AnyAction } from "@reduxjs/toolkit";
import { combineEpics, Epic } from "redux-observable";
import {
  catchError,
  concatMap,
  delay,
  filter,
  from,
  ignoreElements,
  map,
  of,
  switchMap,
  tap,
} from "rxjs";
import agent from "../../api/agent";
import Navigate from "../../utils/Navigate";
import {
  errorCatcher,
  getUser,
  login,
  logout,
  register,
  resetUser,
  setUser,
} from "../slices/authSlice";
import { RootState } from "../store";

export type MyEpic = Epic<AnyAction, AnyAction, RootState>;

const loginEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(login.match),
    switchMap((action) =>
      from(
        agent.AuthService.login({
          email: action.payload.email,
          password: action.payload.password,
        })
      ).pipe(
        map(setUser),
        catchError((err) => of(errorCatcher(err.response.data)))
      )
    )
  );

const registerEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(register.match),
    delay(500),
    concatMap((action) =>
      from(
        agent.AuthService.register({
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          username: action.payload.username,
          email: action.payload.email,
          password: action.payload.password,
        })
      ).pipe(
        map(setUser),
        catchError((err) => of(errorCatcher(err.response.data)))
      )
    )
  );

const logoutEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(logout.match),
    switchMap((action) =>
      from(agent.AuthService.logout()).pipe(
        map(resetUser),
        catchError((err) => of(errorCatcher(err.response.data)))
      )
    )
  );

const getUserEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(getUser.match),
    switchMap((action) =>
      from(agent.AuthService.currentUser()).pipe(
        map(setUser),
        catchError((err) => of(errorCatcher(err.response.data)))
      )
    )
  );

export default combineEpics(loginEpic, registerEpic, getUserEpic, logoutEpic);
