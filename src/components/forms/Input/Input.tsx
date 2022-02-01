import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function Input({ value, onChange, placeholder }: InputProps) {
  return (
    <input
      className="h-12 border rounded-xl border-gray-400 px-4 w-full"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}
