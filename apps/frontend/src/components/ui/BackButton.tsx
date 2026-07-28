import { IconArrowLeft } from '../icons/IconArrowLeft';

interface BackButtonProps {
  onClick: () => void;
  label: string;
}

export function BackButton({ onClick, label }: Readonly<BackButtonProps>) {
  return (
    <button
      onClick={onClick}
      className="flex cursor-pointer items-center gap-1.5 border-none bg-transparent pb-4 text-sm text-text-secondary"
    >
      <IconArrowLeft size={18} /> {label}
    </button>
  );
}
