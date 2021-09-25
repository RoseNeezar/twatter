import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { INotification } from "./types/notification.model";

export interface notificationState {
  allNotifications: INotification[] | null;
}

const initialState: notificationState = {
  allNotifications: null,
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    fetchNotification: (
      state,
      action: PayloadAction<{ unreadOnly: boolean }>
    ) => state,
    fetchNotificationSuccess: (
      state,
      action: PayloadAction<INotification[]>
    ) => {
      state.allNotifications = action.payload;
    },
  },
});

export const { fetchNotification, fetchNotificationSuccess } =
  notificationSlice.actions;

export default notificationSlice.reducer;
