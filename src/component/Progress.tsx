import React, { useState } from "react";

const Progress = ({ rangeValue, onRangeChange }: any) => {
  const [value, setValue] = useState(rangeValue || 0);

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onRangeChange(newValue);
  };

  return (
    <>
      <input
        type="range"
        name="range"
        min="0"
        max="100"
        step="1"
        className="progress-range"
        value={value}
        onChange={handleRangeChange}
      />
      <span>{value}%</span>
    </>
  );
};

export default Progress;
