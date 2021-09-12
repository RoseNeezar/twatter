import React, { FC } from "react";
interface IMessageEmptyChat {
  compose: () => void;
}
const MessageEmptyChat: FC<IMessageEmptyChat> = ({ compose }) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="">
        <div className="mb-2 text-3xl font-bold w-80 text-dark-txt">
          You don’t have a message selected
        </div>
        <div className="mb-4 text-gray-500 w-96">
          Choose one from your existing messages, or start a new one.
        </div>
        <button
          className="px-5 py-3 font-semibold text-white bg-blue-500 rounded-3xl"
          onClick={() => compose()}
        >
          New Message
        </button>
      </div>
    </div>
  );
};

export default MessageEmptyChat;
