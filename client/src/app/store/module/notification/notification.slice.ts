import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IGetNotification, INotification } from "./types/notification.model";
import { has, xorBy } from "lodash";
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
    fetchNotification: (state, action: PayloadAction<IGetNotification>) =>
      state,
    fetchNotificationSuccess: (
      state,
      action: PayloadAction<INotification[]>
    ) => {
      state.allNotifications = action.payload;
    },
    resetNotification: (state) => {
      state.allNotifications = null;
    },
    openSingleNotification: (state, action: PayloadAction<string>) => state,
    openAllNotification: (state) => state,
    openAllNotificationSuccess: (state) => state,
    fetchLatestNotification: (state) => {
      state;
    },
    fetchLatestNotificationSuccess: (state) => {},
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

      if (newNotification.length > 0 && state.allNotifications) {
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
  openSingleNotification,
  openAllNotification,
  fetchLatestNotification,
  resetNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;
