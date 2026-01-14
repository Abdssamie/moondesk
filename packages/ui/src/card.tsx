import { type JSX, type ReactNode } from "react";

interface CardProps {
  className?: string;
  title: string;
  children: ReactNode;
  href: string;
}

export function Card({
  className,
  title,
  children,
  href,
}: CardProps): JSX.Element {
  return (
    <div className={className}>
      <h2>
        <a href={href} rel="noopener noreferrer" target="_blank">
          {title} <span>-&gt;</span>
        </a>
      </h2>
      <p>{children}</p>
    </div>
  );
}
