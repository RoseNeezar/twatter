import { Response } from "express";
import { BadRequestError } from "../errors/bad-request-error";
import { Notification, NotificationAttrs } from "../models/notification.models";
import { RequestTyped } from "../types/types";

export const getAllNotification = async (
  req: RequestTyped<{}, { unreadOnly: string }, {}>,
  res: Response
) => {
  const searchObj = {
    userTo: req.currentUser?.id,
  } as NotificationAttrs;

  if (req.query.unreadOnly) {
    searchObj.opened = false;
  }

  Notification.find(searchObj)
    .populate("userTo")
    .populate("userFrom")
    .sort({ createdAt: -1 })
    .then((results) => res.status(200).send(results))
    .catch((error) => {
      throw new BadRequestError("No notification");
    });
};
