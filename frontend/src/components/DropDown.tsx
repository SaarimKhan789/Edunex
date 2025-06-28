import React, { FC } from "react";

interface DropdownProps {
  options: string[];
  selectedOption: string;
  onOptionChange: (option: string) => void;
}

export const Dropdown: FC<DropdownProps> = ({
  options,
  selectedOption,
  onOptionChange,
}) => {
  return (
    <div className="relative inline-block w-48">
      <select
        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        value={selectedOption}
        onChange={(e) => onOptionChange(e.target.value)}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};
