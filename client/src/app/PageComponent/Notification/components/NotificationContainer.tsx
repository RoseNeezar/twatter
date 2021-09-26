import React, { FC } from "react";
import { useAppDispatch } from "../../../store/hooks/hooks";
import {
  openSingleNotification,
  resetNotification,
} from "../../../store/module/notification/notification.slice";
import { INotification } from "../../../store/module/notification/types/notification.model";
import Navigate from "../../../utils/Navigate";
interface INotificationContainer extends INotification {}

const NotificationContainer: FC<INotificationContainer> = ({
  id: notificationId,
  entityId,
  userFrom,
  userTo,
  opened,
  notificationType,
}) => {
  const dispatch = useAppDispatch();

  const HandleNavigation = () => {
    dispatch(openSingleNotification(notificationId));
    dispatch(resetNotification());
    switch (notificationType) {
      case "follow":
        Navigate?.push(`/profile/${userFrom?.username}`);
        break;
      case "likePost":
        Navigate?.push(`/${userTo?.username}/status/${entityId}`);
        break;
      case "replyPost":
        Navigate?.push(`/${userTo?.username}/status/${entityId}`);
        break;
      case "retweetPost":
        Navigate?.push(`/${userTo?.username}/status/${entityId}`);
        break;
      default:
        break;
    }
  };
  return (
    <div
      className={`flex flex-row items-center h-20 border-b cursor-pointer border-dark-third hover:bg-dark-second ${
        !opened && "bg-blue-500 bg-opacity-30"
      }`}
      onClick={() => HandleNavigation()}
    >
      <div className="p-2 mr-3">
        <img src={userFrom?.profilePic} className="w-10 h-10 rounded-full" />
      </div>
      {notificationType === "follow" && (
        <div className="text-lg text-dark-txt">
          {userFrom?.username} followed you !
        </div>
      )}
      {notificationType === "likePost" && (
        <div className="text-lg text-dark-txt">
          {userFrom?.username} liked your post !
        </div>
      )}
      {notificationType === "retweetPost" && (
        <div className="text-lg text-dark-txt">
          {userFrom?.username} retwaated your post !
        </div>
      )}
      {notificationType === "replyPost" && (
        <div className="text-lg text-dark-txt">
          {userFrom?.username} replied to your post !
        </div>
      )}
    </div>
  );
};

export default NotificationContainer;
