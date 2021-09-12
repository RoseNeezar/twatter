import { Transition, Dialog } from "@headlessui/react";
import React, { Fragment } from "react";
import { useRouteMatch, Route, Switch } from "react-router";
import Navigate from "../../utils/Navigate";
import MessageEmptyChat from "./components/MessageEmptyChat";
import MessageGroupChat from "./components/MessageGroupChat";
import MessagesAddUser from "./components/MessagesAddUser";
import MessageSingleChat from "./components/MessageSingleChat";

const MessagesPage = () => {
  let { path, url } = useRouteMatch();

  const HandleClosingModal = () => {
    Navigate?.goBack();
  };

  const HandleAddUserToChat = () => {
    Navigate?.push(`${url}/compose`);
  };

  return (
    <>
      <div className="flex flex-col w-full min-h-screen border-l border-r border-dark-third">
        <div
          style={{ width: 388 }}
          className="fixed top-0 z-50 flex flex-row justify-between p-3 font-bold border-b border-r bg-dark-main text-dark-txt border-dark-third"
        >
          <div className="text-xl ">Inbox</div>
          <div
            className="flex items-center justify-center p-1 text-xl rounded-full cursor-pointer hover:bg-gray-500 hover:bg-opacity-50 text-dark-txt"
            onClick={() => HandleAddUserToChat()}
          >
            <i className="bx bxs-message-add"></i>
          </div>
        </div>
        <div className="flex flex-row border-r border-dark-third">
          <div className="relative mt-12 border-r text-dark-txt w-channels border-dark-third">
            Messages
          </div>
          <div className="relative w-messages">
            <Switch>
              <Route path={`${path}/group`}>
                <MessageGroupChat backUrl={url} />
              </Route>
              <Route path={`${path}/chat/:userId`}>
                <MessageSingleChat backUrl={url} />
              </Route>
              <Route path="*">
                <MessageEmptyChat compose={HandleAddUserToChat} />
              </Route>
            </Switch>
          </div>
        </div>
      </div>
      <Route
        path={[`${url}/compose`]}
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
                      <MessagesAddUser />
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
