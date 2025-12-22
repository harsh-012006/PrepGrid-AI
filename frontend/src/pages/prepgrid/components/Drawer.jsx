import React from 'react';
import { LuX } from 'react-icons/lu';

const Drawer = ({ isOpen, onClose, title, children }) => {
  return (
    <div
      className={`fixed top-0 md:top-[95px] right-0 z-40 h-screen  md:h-[calc(100dvh-64px)] p-4 overflow-y-auto transition-transform duration-300 ease-in-out  w-screen md:w-[40vw]  shadow-2xl shadow-amber-800/10 scrollbar-hidden border-l-amber-200 rounded bg-[#FFFFF8]  ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      tabIndex="-1"
      aria-labelledby="drawer-right-label"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h5
          id="drawer-right-label"
          className="flex items-center text-base font-semibold text-black"
        >
          {title}
        </h5>
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="text-black cursor-pointer  bg-transparent hover:bg-amber-100 hover:text-[#FF9324] rounded-lg text-sm w-8 h-8 inline-flex items-center justify-center transition"
        >
          <LuX className="text-lg" />
        </button>
      </div>

      {/* Body Content */}
      <div className="text-sm px-2 mb-6 text-gray-700">{children}</div>
    </div>
  );
};

export default Drawer;