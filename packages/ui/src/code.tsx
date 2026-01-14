import { type JSX, type ReactNode } from "react";

interface CodeProps {
  children: ReactNode;
  className?: string;
}

export function Code({ children, className }: CodeProps): JSX.Element {
  return (
    <pre>
      <code className={className}>{children}</code>
    </pre>
  );
}
