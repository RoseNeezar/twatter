import { AnyAction, combineReducers, configureStore } from "@reduxjs/toolkit";
import { combineEpics, createEpicMiddleware } from "redux-observable";
import { catchError } from "rxjs/operators";
import authEpic, { MyEpic } from "./epics/auth.epic";
import authSlice from "./slices/authSlice";

const reducer = combineReducers({
  auth: authSlice,
});

export type ReducerState = ReturnType<typeof reducer>;

const epicMiddleware = createEpicMiddleware<
  AnyAction,
  AnyAction,
  ReducerState
>();

export const store = configureStore({
  reducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
    }).concat(epicMiddleware),
});

const epics = combineEpics(authEpic);

const rootEpic: MyEpic = (action$, store$, dependencies) =>
  combineEpics(epics)(action$, store$, dependencies).pipe(
    catchError((error, source) => {
      console.error("rootEpic-", error);
      return source;
    })
  );

epicMiddleware.run(rootEpic);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
