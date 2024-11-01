import React, { useState, useRef } from "react";

const TypingPractice = () => {
  const [customText, setCustomText] = useState(""); // Văn bản người dùng nhập
  const [savedText, setSavedText] = useState(""); // Văn bản sau khi save
  const [userInput, setUserInput] = useState(""); // Văn bản người dùng gõ
  const [isSaved, setIsSaved] = useState(false); // Trạng thái đã lưu

  // Xử lý khi nhập văn bản custom
  const handleCustomTextChange = (e) => {
    setCustomText(e.target.value);
  };

  // Xử lý khi nhấn nút Save
  const handleSaveText = () => {
    setSavedText(customText); // Lưu văn bản vào state
    setUserInput(""); // Xóa nội dung đang gõ
    setIsSaved(true); // Ẩn textarea đầu tiên
  };

  // Xử lý khi gõ vào ô textarea thứ hai
  const handleUserInputChange = (e) => {
    setUserInput(e.target.value);
  };

  return (
    <div className="p-6 h-screen overflow-hidden">
      {/* Chỉ hiển thị textarea đầu tiên nếu chưa nhấn Save */}
      {!isSaved && (
        <textarea
          className="border p-2 w-full h-32 resize-none"
          placeholder="Nhập văn bản để luyện tập"
          value={customText}
          onChange={handleCustomTextChange}
        />
      )}
      {/* Nút Save */}
      {!isSaved && (
        <button
          className="bg-blue-500 text-white p-2 mb-4"
          onClick={handleSaveText}
        >
          Save
        </button>
      )}

      {/* Textarea để luyện tập gõ phím với placeholder là văn bản đã lưu */}
      {isSaved && (
        <TypingArea
          savedText={savedText}
          userInput={userInput}
          handleUserInputChange={handleUserInputChange}
        />
      )}
    </div>
  );
};

const TypingArea = ({ savedText, userInput, handleUserInputChange }) => {
  const userInputRef = useRef(null);
  const overlayRef = useRef(null);

  // Đồng bộ cuộn giữa textarea và overlay
  const syncScroll = () => {
    if (userInputRef.current && overlayRef.current) {
      overlayRef.current.scrollTop = userInputRef.current.scrollTop;
    }
  };

  return (
    <div className="relative h-full">
      {" "}
      {/* Độ cao 100% màn hình */}
      {/* Textarea cho người dùng gõ với placeholder là savedText */}
      <textarea
        ref={userInputRef}
        className="border w-[1920px] h-full bg-black text-transparent resize-none overflow-auto tracking-wide leading-6"
        value={userInput}
        onChange={handleUserInputChange}
        placeholder="" // Đặt placeholder là savedText
        onScroll={syncScroll} // Đồng bộ cuộn khi người dùng cuộn
        style={{ caretColor: "white" }} // Chỉnh caret về màu trắng
      />
      {/* Hiển thị từng ký tự đúng hoặc sai bên dưới */}
      <div
        ref={overlayRef}
        className="absolute inset-0 p-2 pointer-events-none h-full overflow-auto text-white tracking-wide leading-6"
        style={{
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
          maxHeight: "100%",
        }} // Đảm bảo không vượt quá chiều cao
      >
        {savedText.split("").map((char, index) => {
          const typedChar = userInput[index] || ""; // Ký tự đã gõ
          const isCorrect = typedChar === char; // So sánh ký tự

          return (
            <span
              key={index}
              className={`whitespace-pre-wrap ${
                typedChar
                  ? isCorrect
                    ? "text-white"
                    : "text-red-500"
                  : "text-gray-400"
              }`}
            >
              {char} {/* Hiển thị dấu cách */}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default TypingPractice;
