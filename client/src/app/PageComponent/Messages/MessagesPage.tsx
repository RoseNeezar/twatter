import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useEffect } from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hooks";
import {
  getUserChat,
  resetChannel,
  sendMessage,
} from "../../store/module/chats/chats.slice";
import { RootState } from "../../store/store";
import Navigate from "../../utils/Navigate";
import MessageChannels from "./components/MessageChannels";
import MessageChatContainer from "./components/MessageChatContainer";
import MessageEmptyChat from "./components/MessageEmptyChat";
import MessagesAddUser from "./components/MessagesAddUser";

const MessagesPage = () => {
  let { path, url } = useRouteMatch();

  const dispatch = useAppDispatch();
  const currentChat = useAppSelector(
    (state: RootState) => state.chats.chatChannelDetail
  );
  const HandleClosingModal = () => {
    Navigate?.goBack();
  };
  const HandleAddUserToChat = () => {
    Navigate?.push(`${url}/compose`);
  };

  useEffect(() => {
    dispatch(
      getUserChat({
        unreadOnly: false,
      })
    );
  }, [sendMessage]);

  useEffect(() => {
    dispatch(resetChannel());
  }, []);

  return (
    <>
      <div className="relative flex flex-col w-full min-h-screen border-l border-dark-third">
        <div
          style={{ width: 388 }}
          className={` absolute left-0 top-0 z-50 flex flex-row justify-between p-2.5  font-bold border-b border-r bg-dark-main text-dark-txt border-dark-third  ${
            currentChat ? "hidden lg:flex" : "flex"
          }`}
        >
          <div className="text-xl ">Messages</div>
          <div
            className="flex items-center justify-center p-1 text-xl rounded-full cursor-pointer hover:bg-gray-500 hover:bg-opacity-50 text-dark-txt"
            onClick={() => HandleAddUserToChat()}
          >
            <i className="bx bxs-message-add"></i>
          </div>
        </div>
        <div className="flex flex-row border-r border-dark-third">
          <div
            className={` relative pt-12 border-r h-screen  text-dark-txt w-channels border-dark-third ${
              currentChat && "hidden lg:inline-block "
            } `}
          >
            <MessageChannels backUrl={url} />
          </div>
          <div
            className={`relative w-messages ${
              currentChat
                ? "border-r border-dark-third lg:border-0"
                : "hidden lg:inline-block"
            }`}
          >
            <Switch>
              <Route path={`${path}/chat/:chatId`}>
                <MessageChatContainer backUrl={url} />
              </Route>
              <Route path="*">
                <MessageEmptyChat compose={HandleAddUserToChat} />
              </Route>
            </Switch>
          </div>
        </div>
      </div>
      <Route
        path={[`${url}/compose`, `${url}/chat/:chatId`]}
        children={({ match }) => {
          return (
            <Transition appear show={Boolean(match)} as={Fragment}>
              <Dialog
                as="div"
                className="fixed inset-0 z-50 overflow-y-auto"
                onClose={() => HandleClosingModal()}
              >
                <div className="min-h-screen px-4 text-center">
                  <Dialog.Overlay className="fixed inset-0 bg-gray-600 opacity-25" />
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <div className="inline-block max-w-6xl my-16 overflow-hidden text-left align-middle transition-all transform bg-red-300 shadow-xl w-tweet rounded-2xl">
                      <MessagesAddUser backUrl={url} />
                    </div>
                  </Transition.Child>
                </div>
              </Dialog>
            </Transition>
          );
        }}
      />
    </>
  );
};

export default MessagesPage;
