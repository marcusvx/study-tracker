import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: Readonly<CardProps>) {
  return (
    <div
      className={`rounded-lg border border-border bg-surface p-[18px] ${className}`}
    >
      {children}
    </div>
  );
}
