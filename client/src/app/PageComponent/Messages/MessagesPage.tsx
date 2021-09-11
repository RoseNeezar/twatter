import React from "react";

const MessagesPage = () => {
  return (
    <>
      <div className="flex flex-col w-full min-h-screen border-l border-r border-dark-third">
        <div
          style={{ width: 386 }}
          className="fixed top-0 z-50 p-3 font-bold border-b bg-dark-main text-dark-txt border-dark-third"
        >
          <div className="text-xl ">Inbox</div>
        </div>

        <div className="relative w-tweet">Messages</div>
      </div>
    </>
  );
};

export default MessagesPage;
