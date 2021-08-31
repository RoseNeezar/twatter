import { Transition, Dialog } from "@headlessui/react";
import dayjs from "dayjs";
import React, { Fragment } from "react";
import { Route, useRouteMatch } from "react-router-dom";
import { useAppSelector } from "../../store/hooks/hooks";
import { selectCurrentUser } from "../../store/module/auth/auth.slice";
import Navigate from "../../utils/Navigate";
import ReplyPostModal from "../Tweet/components/ReplyPostModal";

const ProfilePage = () => {
  let { url } = useRouteMatch();

  const currentUser = useAppSelector(selectCurrentUser);

  const HandleGoHome = () => {
    Navigate?.push("/home");
  };

  const HandleClosingModal = () => {
    Navigate?.push(`/profile`);
  };

  return (
    <>
      <div className="flex flex-col w-full min-h-screen border-l border-r border-dark-third">
        <div
          style={{ width: 598 }}
          className="fixed top-0 flex flex-row items-center p-2 font-bold border-b bg-dark-main text-dark-txt border-dark-third"
        >
          <div
            className="flex justify-center p-2 mr-5 text-2xl font-bold rounded-full cursor-pointer text-dark-txt hover:bg-dark-third"
            onClick={() => HandleGoHome()}
          >
            <i className="bx bx-left-arrow-alt"></i>
          </div>

          <div className="text-xl ">{currentUser?.username}</div>
        </div>
        <div className="mt-14">
          <div className="relative">
            <img
              className="w-tweet"
              style={{ height: 200 }}
              src="https://png.pngtree.com/thumb_back/fh260/background/20200714/pngtree-modern-double-color-futuristic-neon-background-image_351866.jpg"
              alt=""
            />
          </div>
          <div className="absolute left-10 top-44">
            <img
              className="object-cover w-32 h-32 border-2 rounded-full border-dark-main"
              src={currentUser?.profilePic}
              alt=""
            />
          </div>
          <div className="relative pl-4 mt-14 text-dark-txt">
            <div className="text-xl font-bold">
              {currentUser?.firstName} {currentUser?.lastName}
            </div>
            <div className="-mt-2 text-gray-500">@{currentUser?.username}</div>
            <div className="mt-3 text-gray-500 ">
              <i className="bx bx-building"></i> Joined{" "}
              {dayjs(currentUser?.createdAt).format("MMMM YYYY	")}
            </div>
            <button className="absolute p-1 px-2 border-2 hover:bg-gray-200 hover:bg-opacity-40 text-md rounded-3xl right-5 -top-10 text-dark-txt border-dark-txt">
              Edit Profile
            </button>
            <div className="flex flex-row mt-3 text-dark-txt">
              <div className="mr-5 font-bold">
                0 <span className="text-gray-500">Following</span>
              </div>
              <div className="font-bold">
                12 <span className="text-gray-500">Followers</span>
              </div>
            </div>
          </div>
          <div className="flex flex-row mt-3 font-bold justify-evenly text-dark-txt">
            <div className="px-10 py-5 text-center border-b-4 border-transparent cursor-pointer hover:bg-dark-txt hover:bg-opacity-10 hover:border-blue-500">
              Twaats
            </div>
            <div className="flex-1 p-5 my-auto text-center border-b-4 border-transparent cursor-pointer hover:bg-dark-txt hover:bg-opacity-10 hover:border-blue-500">
              Twaats && replies
            </div>
            <div className="px-10 py-5 text-center border-b-4 border-transparent cursor-pointer hover:bg-dark-txt hover:bg-opacity-10 hover:border-blue-500">
              Media
            </div>
            <div className="px-10 py-5 text-center border-b-4 border-transparent cursor-pointer hover:bg-dark-txt hover:bg-opacity-10 hover:border-blue-500">
              Likes
            </div>
          </div>
        </div>
        {/* {Posts?.map((res) => {
      return (
        <PostContentContainer key={res.id} post={res} backUrl={backUrl} />
      );
    })} */}
      </div>
      <Route
        path={`${url}/tweet/:tweetId`}
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
                      <ReplyPostModal />
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

export default ProfilePage;
