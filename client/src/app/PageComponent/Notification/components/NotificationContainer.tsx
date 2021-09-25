import React, { FC } from "react";
import { INotification } from "../../../store/module/notification/types/notification.model";
import Navigate from "../../../utils/Navigate";
interface INotificationContainer extends INotification {}

const NotificationContainer: FC<INotificationContainer> = ({
  entityId,
  userFrom,
  userTo,
  opened,
  notificationType,
}) => {
  const HandleNavigation = () => {
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
      className="flex flex-row items-center h-20 border-b cursor-pointer border-dark-third hover:bg-dark-second"
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
