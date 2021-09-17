import { Menu } from "@headlessui/react";
import React, { FC } from "react";

const MessageHeader: FC = () => {
  return (
    <div className="relative flex flex-row border-b pt-7 border-dark-third">
      hello
      {/* {channel.chatUser.map((usr) => {
        return (
          <div key={usr.id} className="px-4 py-2 bg-dark-main rounded-2xl">
            <p>{usr.user.username}</p>
          </div>
        );
      })} */}
      <div className="absolute right-0 z-50 w-full text-right top-2">
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button
              className="flex items-center justify-center p-2 mx-1 text-xl rounded-full cursor-pointer bg-dark-main text-dark-txt hover:bg-gray-300"
              id="dark-mode-toggle"
            >
              <i className="bx bxs-exit"></i>
            </Menu.Button>
          </div>
        </Menu>
      </div>
    </div>
  );
};

export default MessageHeader;
