import { Dialog } from "@headlessui/react";
import React, { ChangeEvent, useRef, useState } from "react";
import Navigate from "../../../utils/Navigate";
import ReactAvatarEditor from "react-avatar-editor";
import { useAppSelector } from "../../../store/hooks/hooks";
import { RootState } from "../../../store/store";
import TextareaAutosize from "react-textarea-autosize";

const EditProfileModal = () => {
  const width = 500;
  const height = 500;

  const [image, setImage] = useState("");
  const [saveImage, setSaveImage] = useState("");
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });
  const [scale, setScale] = useState(1);

  const [formState, setFormState] = useState({
    username: "",
    bio: "",
  });
  const { username, bio } = formState;

  const onChangeText =
    (name: string) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormState({ ...formState, [name]: e.target.value });
    };

  const currentUserProfile = useAppSelector(
    (state: RootState) => state.user.currentUserProfile
  );
  const imageRef = useRef<ReactAvatarEditor>(null);

  const handleNewImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    const files = e.target.files!;
    const reader = new FileReader();
    reader.onload = (ev: ProgressEvent<FileReader>) => {
      setImage(String(ev.target?.result));
    };

    reader.readAsDataURL(files[0]);
  };

  const handleScale = (e: ChangeEvent<HTMLInputElement>) => {
    const scale = parseFloat(e.target.value);
    setScale(scale);
  };

  const handlePositionChange = (position: { x: number; y: number }) => {
    setPosition(position);
  };

  const handleClose = () => {
    Navigate?.goBack();
  };
  const HandleSaveImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    const canvas = imageRef.current?.getImage().toDataURL();
    if (!canvas) {
      return;
    }
    setSaveImage(canvas);
  };
  return (
    <div className="flex flex-col w-full pt-3 m-auto rounded-md bg-dark-main text-dark-txt">
      <div className="flex flex-col">
        <div className="flex flex-col p-1 border-b border-dark-third">
          <div className="flex flex-row justify-between mb-3">
            <Dialog.Title>
              <div className="flex flex-row items-center justify-center">
                <div
                  className="mr-4 cursor-pointer"
                  onClick={() => handleClose()}
                >
                  <i className="pl-3 text-3xl text-dark-txt bx bx-x"></i>
                </div>
                {image && !saveImage ? (
                  <h1 className="font-bold">Edit Media</h1>
                ) : (
                  <h1 className="font-bold">Edit Profile</h1>
                )}
              </div>
            </Dialog.Title>
            {image && !saveImage ? (
              <button
                className="px-5 py-3 mr-3 text-white bg-blue-500 rounded-3xl"
                onClick={(e) => HandleSaveImage(e)}
              >
                Apply
              </button>
            ) : (
              <button className="px-5 py-1 mr-3 text-dark-main bg-dark-txt rounded-3xl hover:bg-gray-400">
                Save
              </button>
            )}
          </div>

          {image && !saveImage ? (
            <div className="flex flex-col items-center w-full">
              <div>
                <ReactAvatarEditor
                  ref={imageRef}
                  scale={scale}
                  width={width}
                  height={height}
                  position={position}
                  onPositionChange={handlePositionChange}
                  rotate={0}
                  image={image}
                />
              </div>
              <div className="flex flex-row justify-center w-full">
                <div className="flex items-center justify-center w-10 h-10 text-2xl text-gray-500">
                  <i className="bx bx-zoom-out"></i>
                </div>
                <div className="flex items-center justify-center w-1/2">
                  <input
                    className="w-full h-1.5 bg-blue-200 rounded outline-none appearance-none cursor-pointer slider-thumb"
                    name="scale"
                    type="range"
                    onChange={handleScale}
                    min={1}
                    max="2"
                    step="0.01"
                    defaultValue="1"
                  />
                </div>
                <div className="flex items-center justify-center w-10 h-10 text-2xl text-gray-500">
                  <i className="bx bx-zoom-in"></i>
                </div>
              </div>
            </div>
          ) : (
            <div className="">
              <div className="">
                <div className="relative">
                  <img
                    className="w-tweet"
                    style={{ height: 200 }}
                    src="https://png.pngtree.com/thumb_back/fh260/background/20200714/pngtree-modern-double-color-futuristic-neon-background-image_351866.jpg"
                    alt=""
                  />
                  <div className="absolute px-2 py-1 text-2xl rounded-full top-20 left-72">
                    <i className="bx bx-camera"></i>
                  </div>
                  <input
                    className="absolute z-30 w-24 opacity-0 top-20 left-64"
                    name="bannerImg"
                    type="file"
                  />
                  <img
                    className="absolute left-0 object-cover w-24 h-24 border-2 rounded-full -bottom-12 border-dark-main"
                    src={image || currentUserProfile?.profilePic}
                    alt="profile-image"
                  />
                  <div className="absolute px-2 py-1 text-2xl rounded-full left-7 -bottom-5">
                    <i className="bx bx-camera"></i>
                  </div>
                  <input
                    className="absolute left-0 z-30 w-24 opacity-0 -bottom-4"
                    name="profileImage"
                    type="file"
                    onChange={handleNewImage}
                  />
                </div>
              </div>

              <div className="flex flex-col p-2 mt-16">
                <input
                  type="username"
                  className={` w-full p-3 transition duration-200 border border-gray-600 rounded mb-3 outline-none bg-transparent
          `}
                  placeholder="Name"
                  value={username}
                  onChange={onChangeText("username")}
                />
                <TextareaAutosize
                  placeholder="Bio"
                  className="w-full p-3 pt-3 mb-3 overflow-auto text-xl font-semibold transition duration-200 bg-transparent border border-gray-600 rounded outline-none resize-none text-dark-txt"
                  minRows={2}
                  maxRows={6}
                  value={bio}
                  onChange={onChangeText("bio")}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
