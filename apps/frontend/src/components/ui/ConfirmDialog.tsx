import { cva } from 'class-variance-authority';
import { BottomSheet } from './BottomSheet';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const actionButton = cva(
  'flex-1 cursor-pointer rounded-md px-4 py-[13px] text-sm font-semibold transition-opacity duration-150',
  {
    variants: {
      intent: {
        primary: 'border-none bg-accent text-ink',
        secondary:
          'border border-border bg-transparent text-[var(--text-secondary)]',
      },
    },
  },
);

export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: Readonly<ConfirmDialogProps>) {
  return (
    <BottomSheet onClose={onCancel}>
      <div className="px-6 pt-3 pb-1">
        <div className="mb-1.5 text-lg font-bold text-text-primary">
          {title}
        </div>
        <div className="mb-5 text-[13px] text-text-secondary">{message}</div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className={actionButton({ intent: 'secondary' })}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={actionButton({ intent: 'primary' })}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
