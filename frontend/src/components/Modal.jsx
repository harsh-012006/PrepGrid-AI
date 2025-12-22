import React from "react";

const Modal = ({ children, isOpen, onClose, title, hideHeader }) => {
  if (!isOpen) return null; // Don't render modal if not open

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 bg-opacity-50">
      {/* Modal Content */}
      <div className="relative flex flex-col bg-[#FFFFF8] shadow-lg rounded-lg p-6 backdrop-blur-sm border border-amber-100">
        {/* Modal Header */}
        {!hideHeader && (
          <div className="flex justify-between items-center  pb-3 mb-4">
            <h3 className="text-lg font-semibold text-black">
              {title}
            </h3>
            <button
              type="button"
              className="p-2 rounded-xl hover:bg-amber-100 text-black hover:text-[#FF9324] cursor-pointer"
              onClick={onClose}
            >
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Close Button for hideHeader=true case */}
        {hideHeader && (
          <button
            type="button"
            className="absolute top-4 right-4 p-2 rounded-xl hover:bg-amber-100 text-black hover:text-[#FF9324] cursor-pointer"
            onClick={onClose}
          >
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {/* Modal Body (Scrollable if content is big) */}
        <div className="overflow-y-auto ">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
