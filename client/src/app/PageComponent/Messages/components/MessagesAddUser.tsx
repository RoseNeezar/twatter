import { Dialog } from "@headlessui/react";
import React, { useState, FC } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks/hooks";
import { IUser } from "../../../store/module/auth/types/auth.model";
import { createChat } from "../../../store/module/chats/chats.slice";
import {
  resetSearchUser,
  searchUser,
} from "../../../store/module/user/user.slice";
import { RootState } from "../../../store/store";
import Navigate from "../../../utils/Navigate";

interface IMessagesAddUser {
  backUrl: string;
}

const MessagesAddUser: FC<IMessagesAddUser> = ({ backUrl }) => {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<IUser[]>([]);
  const dispatch = useAppDispatch();
  const userSearched = useAppSelector(
    (state: RootState) => state.user.userSearched
  );

  const handleClose = () => {
    Navigate?.push(`${backUrl}`);
  };
  if (search.length === 0) {
    dispatch(resetSearchUser());
  }
  const HandleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;
    setSearch(newValue);
    if (newValue.trim().length > 0) {
      dispatch(
        searchUser({
          content: newValue,
        })
      );
    }
  };

  const HandleAddSearched = (user: IUser) => {
    setSelectedUser((prevVal) => [...prevVal, user]);
    dispatch(resetSearchUser());
    setSearch("");
  };

  const HandleRemoveSearched = (id: string) => {
    setSelectedUser(selectedUser.filter((re) => re.id !== id));
    dispatch(resetSearchUser());
    setSearch("");
  };

  const HandleCreateChat = () => {
    if (selectedUser.length > 0) {
      dispatch(createChat(selectedUser));
      Navigate?.push(`${backUrl}`);
    }
  };

  const CheckSearchedUser = (id: string) => {
    return selectedUser.findIndex((re) => re.id === id) !== -1 ? true : false;
  };

  return (
    <div className="flex flex-col pt-2 m-auto rounded-md bg-dark-main h-addUser">
      <div className="flex flex-col overflow-x-hidden overflow-y-auto ">
        <div className="flex justify-between p-1 ">
          <Dialog.Title>
            <div className="flex flex-row items-center text-dark-txt">
              <div className="cursor-pointer" onClick={() => handleClose()}>
                <i className="pl-3 text-3xl bx bx-x"></i>
              </div>
              <div className="pb-1 ml-10 text-xl font-bold">New Messages</div>
            </div>
          </Dialog.Title>
          <button
            className="px-4 mr-4 font-semibold bg-gray-500 rounded-2xl"
            onClick={() => HandleCreateChat()}
          >
            Next
          </button>
        </div>
        <div className="-mr-3 border-b border-dark-third">
          <div className="relative flex flex-row my-3 ">
            <div className="absolute text-2xl top-0.5 left-5 text-blue-500 cursor-pointer z-30">
              <i className="bx bx-search"></i>
            </div>
            <input
              type="text"
              placeholder="Search people"
              className="w-full p-1 pl-10 mx-3 text-white bg-transparent outline-none rounded-2xl bg-opacity-20"
              value={search}
              onChange={HandleSearch}
            />
          </div>
          <div className="flex flex-row flex-wrap w-full pb-3 ml-2">
            {selectedUser &&
              selectedUser.map((re) => {
                return (
                  <div
                    key={re.id}
                    className="flex flex-row items-center mx-1 border-2 cursor-pointer h-7 max-w-max border-dark-third rounded-xl"
                    onClick={() => HandleRemoveSearched(re.id)}
                  >
                    <div className="">
                      <img
                        className="object-cover w-6 h-6 rounded-full cursor-pointer border-dark-main"
                        src={re.profilePic}
                        alt="profile-pic"
                      />
                    </div>
                    <div className="flex flex-col ml-2">
                      <div className="font-bold text-dark-txt">
                        {re.username}
                      </div>
                    </div>
                    <div className="text-blue-500">
                      <i className="pl-3 text-2xl bx bx-x"></i>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {userSearched &&
          userSearched?.map((re) => (
            <div
              key={re.id}
              className="px-3 py-4 -mr-3 cursor-pointer hover:bg-gray-400 hover:bg-opacity-10"
              onClick={() =>
                CheckSearchedUser(re.id)
                  ? HandleRemoveSearched(re.id)
                  : HandleAddSearched(re)
              }
            >
              <div className="flex flex-row items-center">
                <div className="mx-1">
                  <img
                    className="object-cover w-12 h-12 border-2 rounded-full cursor-pointer border-dark-main"
                    src={re.profilePic}
                    alt="profile-pic"
                  />
                </div>
                <div className="flex flex-col flex-1 ml-2">
                  <div className="font-bold text-dark-txt">{re.username}</div>
                  <div className="text-gray-500">@ {re.email}</div>
                </div>
                {CheckSearchedUser(re.id) && (
                  <div className="text-3xl text-blue-500">
                    <i className="bx bx-check"></i>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MessagesAddUser;
