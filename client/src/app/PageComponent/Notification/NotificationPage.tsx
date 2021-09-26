import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hooks";
import {
  fetchNotification,
  openAllNotification,
  resetNotification,
} from "../../store/module/notification/notification.slice";
import { RootState } from "../../store/store";
import NotificationContainer from "./components/NotificationContainer";

const NotificationPage = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(
    (state: RootState) => state.notification.allNotifications
  );

  const HandleReadAllNotifications = () => {
    if (notifications && notifications?.length > 0) {
      dispatch(openAllNotification());
      dispatch(resetNotification());
    }
  };
  useEffect(() => {
    dispatch(
      fetchNotification({
        unreadOnly: false,
      })
    );
  }, []);
  return (
    <>
      <div className="flex flex-col w-full min-h-screen border-l border-r border-dark-third">
        <div
          style={{ width: 598 }}
          className="fixed top-0 z-50 p-3 font-bold border-b bg-dark-main text-dark-txt border-dark-third"
        >
          <div className="flex flex-row justify-between">
            <div className="text-xl ">Notifications</div>
            <div
              className="text-2xl cursor-pointer text-dark-txt has-tooltip"
              onClick={() => HandleReadAllNotifications()}
            >
              <span className="right-0 p-1 text-xs text-white bg-gray-500 rounded shadow-lg bg-opacity-80 top-10 tooltip w-max">
                mark all
              </span>
              <i className=" bx bx-notification"></i>
            </div>
          </div>
        </div>
        <div className="mt-12">
          {notifications &&
            notifications.map((re) => (
              <NotificationContainer key={re.id} {...re} />
            ))}
        </div>
      </div>
    </>
  );
};

export default NotificationPage;
