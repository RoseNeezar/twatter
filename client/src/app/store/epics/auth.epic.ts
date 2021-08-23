import { AnyAction } from "@reduxjs/toolkit";
import { Epic } from "redux-observable";
import { delay, filter, map } from "rxjs";
import { login } from "../slices/authSlice";
import { RootState } from "../store";

export type MyEpic = Epic<AnyAction, AnyAction, RootState>;

const authEpic: MyEpic = (action$, state) =>
  action$.pipe(
    filter(login.match),
    delay(500),
    map((action) => (state.value.auth.user = action))
  );

export default authEpic;
