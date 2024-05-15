import React from "react";

const ToggleButton = ({ task, onFilingToggle, onCheckToggle }: any) => {
  const handleFilingToggle = () => {
    onFilingToggle(!task.filing);
  };

  const handleCheckToggle = () => {
    onCheckToggle(!task.check);
  };

  return (
    <>
      <button
        className={`flex toggle-btn ${task.filing ? "active" : ""}`}
        onClick={handleFilingToggle}
      >
        提出
      </button>
      <button
        className={`flex toggle-btn ${task.check ? "active" : ""}`}
        onClick={handleCheckToggle}
      >
        チェック
      </button>
    </>
  );
};
export default ToggleButton;
