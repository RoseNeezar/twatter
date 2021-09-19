import React, { FC } from "react";

interface INotificationBadge {
  badgeCount: number;
}

const NotificationBadge: FC<INotificationBadge> = ({ badgeCount }) => {
  return (
    <div className="absolute right-0 flex items-center justify-center p-1 text-white bg-red-500 rounded-full w-7 h-7 -top-3">
      <div className="text-sm">{badgeCount}</div>
    </div>
  );
};

export default NotificationBadge;
