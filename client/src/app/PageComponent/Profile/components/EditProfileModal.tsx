import { Dialog } from "@headlessui/react";
import React, { ChangeEvent, useRef, useState } from "react";
import Navigate from "../../../utils/Navigate";
import ReactAvatarEditor from "react-avatar-editor";
import { useAppDispatch, useAppSelector } from "../../../store/hooks/hooks";
import { RootState } from "../../../store/store";
import TextareaAutosize from "react-textarea-autosize";
import dataURLtoFile from "../../../utils/dataURLToFile";
import axios from "axios";
import { getUser } from "../../../store/module/auth/auth.slice";

const EditProfileModal = () => {
  const width = 500;
  const height = 500;
  const dispatch = useAppDispatch();
  const [image, setImage] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [saveImage, setSaveImage] = useState<{
    data: string;
    filename: string;
  } | null>();
  const [saveBannerImage, setSaveBannerImage] = useState<{
    data: string;
    filename: string;
  } | null>();
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });
  const [scale, setScale] = useState(1);
  const [fileName, setFileName] = useState("");
  const currentUserProfile = useAppSelector(
    (state: RootState) => state.user.currentUserProfile
  );
  const imageRef = useRef<ReactAvatarEditor>(null);

  const [formState, setFormState] = useState({
    username: currentUserProfile?.username || "",
    bio: "",
  });
  const { username, bio } = formState;

  const onChangeText =
    (name: string) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormState({ ...formState, [name]: e.target.value });
    };

  const handleNewImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    setImage("");
    setBannerImage("");
    setSaveImage(null);

    const files = e.target.files!;

    setFileName(files[0].name);
    const reader = new FileReader();
    reader.onload = (ev: ProgressEvent<FileReader>) => {
      setImage(String(ev.target?.result));
    };

    reader.readAsDataURL(files[0]);
  };

  const handleNewBannerImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    setImage("");
    setBannerImage("");
    setSaveBannerImage(null);
    const files = e.target.files!;

    setFileName(files[0].name);

    const reader = new FileReader();
    reader.onload = (ev: ProgressEvent<FileReader>) => {
      setBannerImage(String(ev.target?.result));
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

    if (image) {
      setSaveImage({ data: canvas, filename: fileName });
    }
    if (bannerImage) {
      setSaveBannerImage({ data: canvas, filename: fileName });
    }
  };

  const HandleUpdateImage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    let toFileBanner;
    let toFileProfile;

    let formDataBanner = new FormData();
    let formDataProfile = new FormData();

    if (saveBannerImage?.data && saveBannerImage?.data.length > 0) {
      toFileBanner = dataURLtoFile(
        saveBannerImage?.data,
        String(saveBannerImage?.filename)
      );
      formDataBanner.append("croppedImage", toFileBanner);
      await axios.post("users/coverPhoto", formDataBanner, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    if (saveImage?.data && saveImage.data.length > 0) {
      toFileProfile = dataURLtoFile(
        saveImage?.data,
        String(saveImage?.filename)
      );
      formDataProfile.append("croppedImage", toFileProfile);
      await axios.post("users/profilePicture", formDataProfile, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    Navigate?.goBack();
    dispatch(getUser());
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
                {(image && !saveImage) || (bannerImage && !saveBannerImage) ? (
                  <h1 className="font-bold">Edit Media</h1>
                ) : (
                  <h1 className="font-bold">Edit Profile</h1>
                )}
              </div>
            </Dialog.Title>
            {(image && !saveImage) || (bannerImage && !saveBannerImage) ? (
              <button
                className="px-5 py-3 mr-3 text-white bg-blue-500 rounded-3xl"
                onClick={(e) => HandleSaveImage(e)}
              >
                Apply
              </button>
            ) : (
              <button
                className="px-5 py-1 mr-3 text-dark-main bg-dark-txt rounded-3xl hover:bg-gray-400"
                onClick={(e) => HandleUpdateImage(e)}
              >
                Save
              </button>
            )}
          </div>

          {(image && !saveImage) || (bannerImage && !saveBannerImage) ? (
            <div className="flex flex-col items-center w-full">
              <div>
                <ReactAvatarEditor
                  ref={imageRef}
                  scale={scale}
                  width={height}
                  height={bannerImage ? width / 2 : width}
                  position={position}
                  onPositionChange={handlePositionChange}
                  rotate={0}
                  image={image || bannerImage}
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
                    max="10"
                    step="0.02"
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
                    className="object-cover w-full "
                    style={{ height: 200 }}
                    src={
                      saveBannerImage?.data || currentUserProfile?.coverPhoto
                    }
                    alt=""
                  />
                  <div className="absolute px-2 py-1 text-2xl rounded-full top-20 left-72">
                    <i className="bx bx-camera"></i>
                  </div>
                  <input
                    className="absolute z-30 w-24 opacity-0 top-20 left-64"
                    name="bannerImg"
                    type="file"
                    onChange={handleNewBannerImage}
                  />
                  <img
                    className="absolute left-0 object-cover w-24 h-24 border-2 rounded-full -bottom-12 border-dark-main"
                    src={saveImage?.data || currentUserProfile?.profilePic}
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
                  disabled
                  onChange={onChangeText("username")}
                />
                <TextareaAutosize
                  placeholder="Bio"
                  className="w-full p-3 pt-3 mb-3 overflow-auto text-xl font-semibold transition duration-200 bg-transparent border border-gray-600 rounded outline-none resize-none text-dark-txt"
                  minRows={2}
                  maxRows={6}
                  value={bio}
                  disabled
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
