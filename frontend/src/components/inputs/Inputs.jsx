import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = ({ value, onChange, label, placeholder, type }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-black">{label}</label>

      <div className="relative">
        <input
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF9324] text-neutral-900 bg-[#FFFFF8] placeholder:text-neutral-500"
          value={value}
          onChange={(e) => onChange(e)}
        />

        {type === "password" && (
          <div className="absolute inset-y-0 right-3 flex items-center cursor-pointer">
            {showPassword ? (
              <FaRegEye
                size={22}
                className="text-[#FF9324] cursor-pointer"
                onClick={toggleShowPassword}
              />
            ) : (
              <FaRegEyeSlash
                size={22}
                className="text-gray-500 cursor-pointer"
                onClick={toggleShowPassword}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;
