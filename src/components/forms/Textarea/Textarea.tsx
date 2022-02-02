import React from "react";
import { StyledTextarea } from "./Textarea.styled";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export default function Textarea({
  value,
  onChange,
  placeholder,
  ...rest
}: TextareaProps) {
  return (
    <StyledTextarea
      value={value}
      rows={4}
      onChange={onChange}
      placeholder={placeholder}
      {...rest}
    />
  );
}
