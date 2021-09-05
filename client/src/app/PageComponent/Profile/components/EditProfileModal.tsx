import { Dialog } from "@headlessui/react";
import React from "react";
import Navigate from "../../../utils/Navigate";
import ReactAvatarEditor from "react-avatar-editor";
import { useDropzone } from "react-dropzone";

const EditProfileModal = () => {
  const handleClose = () => {
    Navigate?.goBack();
  };

  return (
    <div className="flex flex-col w-full pt-3 m-auto rounded-md bg-dark-main">
      <div className="flex flex-col">
        <div className="flex flex-col p-1 border-b border-dark-third">
          <Dialog.Title>
            <div className="cursor-pointer" onClick={() => handleClose()}>
              <i className="pl-3 text-3xl text-dark-txt bx bx-x"></i>
            </div>
          </Dialog.Title>
          <input type="text" />
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
