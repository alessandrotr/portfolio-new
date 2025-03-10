import React, { useState, useEffect } from 'react';
import { Input } from '@nextui-org/react';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

interface TextInputComponentProps {
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  type?: string;
  id?: string;
  defaultValue?: string;
  label?: string;
  disabled?: boolean;
  endContent?: React.ReactNode;
  startContent?: React.ReactNode;
  isPasswordInput?: boolean;
}

const TextInputComponent: React.FC<TextInputComponentProps> = ({
  onChange,
  type,
  id,
  defaultValue = '', // Fallback to an empty string
  label,
  disabled,
  endContent,
  startContent,
  isPasswordInput,
}) => {
  const [inputValue, setInputValue] = useState<string>(defaultValue); // Use state to control value
  const [isVisible, setIsVisible] = useState(false);

  // When the defaultValue prop changes, update the inputValue
  useEffect(() => {
    setInputValue(defaultValue);
  }, [defaultValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value); // Update local state when input changes
    if (onChange) {
      onChange(e); // Call the passed onChange handler (if any)
    }
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Input
      fullWidth
      label={label}
      disabled={disabled}
      onChange={handleChange}
      type={isPasswordInput ? (isVisible ? 'text' : 'password') : type}
      id={id}
      value={inputValue} // Controlled input using state
      labelPlacement="inside"
      variant="flat"
      placeholder={`Your ${label?.toLowerCase()}`}
      startContent={
        startContent && <span className="text-gray-500">{startContent}</span>
      }
      endContent={
        endContent && !isPasswordInput ? (
          <span className="text-gray-500">{endContent}</span>
        ) : (
          !endContent &&
          isPasswordInput && (
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
              aria-label="toggle password visibility"
            >
              {isVisible ? (
                <HiOutlineEyeOff className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <HiOutlineEye className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          )
        )
      }
    />
  );
};

export default TextInputComponent;
