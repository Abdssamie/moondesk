"use client";

import { type MouseEventHandler, type ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export const Button = ({ children, className, onClick }: ButtonProps) => {
  return (
    <button type="button" className={className} onClick={onClick}>
      {children}
    </button>
  );
};
