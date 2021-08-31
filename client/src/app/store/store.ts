import { AnyAction, combineReducers, configureStore } from "@reduxjs/toolkit";
import { combineEpics, createEpicMiddleware } from "redux-observable";
import { catchError } from "rxjs/operators";
import authEpic, { MyEpic } from "./module/auth/auth.epic";
import authSlice from "./module/auth/auth.slice";
import postEpic from "./module/post/post.epic";
import postSlice from "./module/post/post.slice";
import userEpic from "./module/user/user.epic";
import userSlice from "./module/user/user.slice";

const reducer = combineReducers({
  auth: authSlice,
  posts: postSlice,
  user: userSlice,
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
      serializableCheck: false,
    }).concat(epicMiddleware),
});

const epics = combineEpics(authEpic, postEpic, userEpic);

const rootEpic: MyEpic = (action$, store$, dependencies) =>
  combineEpics(epics)(action$, store$, dependencies).pipe(
    catchError((error, source) => {
      return source;
    })
  );

epicMiddleware.run(rootEpic);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
