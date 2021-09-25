import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hooks";
import { fetchNotification } from "../../store/module/notification/notification.slice";
import { RootState } from "../../store/store";
import NotificationContainer from "./components/NotificationContainer";

const NotificationPage = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(
    (state: RootState) => state.notification.allNotifications
  );
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
          <div className="text-xl ">Notifications</div>
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
