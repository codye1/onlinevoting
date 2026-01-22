import React from 'react';

interface ToggleCheckbox {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  name?: string;
  disabled?: boolean;
  className?: string;
}

const ToggleCheckbox = ({
  checked,
  onChange,
  label,
  name,
  disabled = false,
  className,
}: ToggleCheckbox) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <label
      className={`toggle-checkbox flex items-center cursor-pointer ${className}`}
    >
      {label && <span className="mr-2">{label}</span>}
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        name={name}
        disabled={disabled}
        className="hidden"
      />
      <div
        className={`shadow-m toggle-switch w-12 h-6 rounded-full relative transition-colors duration-300 ${
          checked ? 'bg-focus' : ' bg-light'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div
          className={`toggle-knob w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform duration-300 ${
            checked ? 'translate-x-6' : ''
          }`}
        />
      </div>
    </label>
  );
};

export default ToggleCheckbox;
