import React from "react";

const DeleteAlertContent = ({ content, onDelete, onCancel }) => {
  return (
    <div className="p-5">
      <p className="text-[14px] text-gray-700 mb-6">{content}</p>
      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-black bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-white bg-linear-to-r from-red-600 to-red-500 hover:bg-red-700 rounded-lg transition-colors duration-200"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteAlertContent;
