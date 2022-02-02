import React from "react";
import { StyledInput } from "./Input.styled";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function Input({
  value,
  onChange,
  placeholder,
  ...rest
}: InputProps) {
  return (
    <StyledInput
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...rest}
    />
  );
}
