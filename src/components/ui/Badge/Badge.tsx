import React, { ReactNode } from "react";
import { BadgeWrapper } from "./Badge.styled";

interface BadgeProps {
  children: ReactNode;
}

export default function Badge({ children }: BadgeProps) {
  return <BadgeWrapper>{children}</BadgeWrapper>;
}
