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
import { IError } from "../auth/types/auth.model";
import { getUserProfile, setUserProfile } from "./user.slice";

export type MyEpic = Epic<AnyAction, AnyAction, RootState>;

const getUserEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(getUserProfile.match),
    switchMap((action) =>
      from(agent.UserService.getUserByUsername(action.payload)).pipe(
        map(setUserProfile),
        catchError((err) => {
          const errObj: IError = {
            ...err.response.data,
            router: action.payload,
          };
          return of(errorCatcher(errObj));
        })
      )
    )
  );

export default combineEpics(getUserEpic);
