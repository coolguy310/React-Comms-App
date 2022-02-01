import React, { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
}

export default function Badge({ children }: BadgeProps) {
  return (
    <div className="w-6 h-6 flex items-center justify-center rounded-md bg-primary text-white">
      {children}
    </div>
  );
}
