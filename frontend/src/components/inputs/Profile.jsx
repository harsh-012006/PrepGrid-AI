import React, { useRef, useState, useEffect } from "react";
import { LuUpload, LuUser, LuTrash } from "react-icons/lu";

const ProfileImageUpload = ({ image, setImage }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (image) {
      setPreviewUrl(URL.createObjectURL(image));
    } else {
      setPreviewUrl(null);
    }
  }, [image]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // update parent state
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    inputRef.current.value = null;
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!image ? (
        <div className="flex flex-col items-center gap-4">
          {/* Profile Icon Container */}
          <div
            className="w-24 h-24  border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group"
            onClick={onChooseFile}
          >
            <LuUser
              className="text-gray-400 group-hover:text-gray-500 transition-colors"
              size={32}
            />
          </div>

          {/* Upload Button */}
          <button
            type="button"
            onClick={onChooseFile}
            className="flex items-center cursor-pointer gap-2 text-sm bg-neutral-900 text-neutral-300 px-6 py-2 rounded-lg hover:bg-neutral-800 transition-colors font-medium"
          >
            <LuUpload size={16} />
            Upload Photo
          </button>

          {/* Helper Text */}
          <p className="text-xs text-gray-500 text-center">
            Click to upload your profile picture
          </p>
        </div>
      ) : (
        <div className="relative group">
          {/* Profile Image */}
          <img
            src={previewUrl}
            alt="profile photo"
            className="w-24 h-24 object-cover rounded-full border-2 border-gray-200 shadow-sm"
          />

          {/* Overlay on hover */}
          <div className="absolute  inset-0 w-24 h-24 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={onChooseFile}
              className="text-white text-xs font-medium hover:underline cursor-pointer"
            >
              Change
            </button>
          </div>

          {/* Remove Button */}
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute -top-1 -right-1 bg-red-500 text-white p-1.5  cursor-pointer rounded-full hover:bg-red-600 transition-colors shadow-sm"
          >
            <LuTrash size={12} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileImageUpload;

