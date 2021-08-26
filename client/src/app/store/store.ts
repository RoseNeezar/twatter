import { AnyAction, combineReducers, configureStore } from "@reduxjs/toolkit";
import { combineEpics, createEpicMiddleware } from "redux-observable";
import authEpic from "./epics/auth.epic";
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

const epics = combineEpics(...authEpic);

epicMiddleware.run(epics);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
