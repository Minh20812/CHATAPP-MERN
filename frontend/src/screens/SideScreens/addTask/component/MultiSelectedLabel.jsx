import React, { useState, useEffect, useRef } from "react";
import { Transition } from "@headlessui/react";

const MultiSelectLabelDropdown = ({
  labels,
  selectedLabels,
  onChange,
  onAddNewLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Thêm state cho thông báo lỗi
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleLabelChange = (labelId) => {
    const updatedLabels = selectedLabels.includes(labelId)
      ? selectedLabels.filter((id) => id !== labelId)
      : [...selectedLabels, labelId];
    onChange(updatedLabels);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddNewLabel = (newLabelName) => {
    // Kiểm tra xem tên label đã tồn tại chưa
    const labelExists = labels.some(
      (label) => label.labelname === newLabelName
    );

    if (labelExists) {
      setErrorMessage(`Label "${newLabelName}" already exists!`); // Đặt thông báo lỗi
      setTimeout(() => setErrorMessage(""), 3000); // Xóa thông báo sau 3 giây
    } else {
      onAddNewLabel(newLabelName);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
        onClick={toggleDropdown}
      >
        {selectedLabels.length > 0
          ? `${selectedLabels.length} label(s) selected`
          : "Select Labels"}
        <svg
          className="-mr-1 ml-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Thông báo lỗi nếu có */}
      {errorMessage && (
        <div className="mt-2 text-red-600 text-sm">{errorMessage}</div>
      )}

      <Transition
        show={isOpen}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
          <div className="max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            {labels.map((label, index) => (
              <label
                key={index}
                className="flex items-center px-4 py-2 hover:bg-gray-100"
              >
                <input
                  className="form-checkbox h-5 w-5 text-indigo-600"
                  type="checkbox"
                  checked={selectedLabels.includes(label.labelname)}
                  onChange={() => handleLabelChange(label.labelname)}
                />
                <span className="ml-3 block truncate">{label.labelname}</span>
              </label>
            ))}
            <button
              type="button"
              className="w-full text-left px-4 py-2 text-sm text-indigo-600 hover:bg-gray-100 focus:outline-none"
              onClick={() => handleAddNewLabel("NewLabelName")} // Sử dụng hàm mới cho việc thêm label
            >
              + Add New Label
            </button>
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default MultiSelectLabelDropdown;
