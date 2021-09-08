import { AnyAction } from "@reduxjs/toolkit";
import { combineEpics, Epic } from "redux-observable";
import {
  catchError,
  concatMap,
  filter,
  from,
  map,
  of,
  switchMap,
  tap,
} from "rxjs";
import agent from "../../../api/agent";
import { RootState } from "../../store";
import {
  errorCatcher,
  getUser,
  login,
  logout,
  register,
  resetUser,
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
      from(agent.AuthService.logout()).pipe(
        map(resetUser),
        catchError((err) => of(errorCatcher(err.response)))
      )
    )
  );

const getUserEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(getUser.match),
    switchMap((action) =>
      agent.AuthService.currentUser().pipe(
        map(({ response }) => setUser(response)),
        catchError((err) => {
          return of(errorCatcher(err.response));
        })
      )
    )
  );

export default combineEpics(loginEpic, registerEpic, getUserEpic, logoutEpic);
