import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { INotification } from "./types/notification.model";
import { xorBy } from "lodash";
export interface notificationState {
  allNotifications: INotification[] | null;
  unreadNotification: INotification[] | null;
}

const initialState: notificationState = {
  allNotifications: null,
  unreadNotification: null,
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
      if (state.allNotifications) {
        state.allNotifications = null;
      }
      state.allNotifications = action.payload;
    },
    refreshNotificationBadge: (
      state,
      action: PayloadAction<{ unreadOnly: boolean }>
    ) => state,
    refreshNotificationBadgeSuccess: (
      state,
      action: PayloadAction<INotification[]>
    ) => {
      const newNotification = xorBy(
        state.allNotifications,
        action.payload,
        "id"
      );
      if (newNotification && state.allNotifications) {
        state.allNotifications.unshift(...newNotification);
      }
      state.unreadNotification = action.payload;
    },
  },
});

export const {
  fetchNotification,
  fetchNotificationSuccess,
  refreshNotificationBadge,
  refreshNotificationBadgeSuccess,
} = notificationSlice.actions;

export default notificationSlice.reducer;
