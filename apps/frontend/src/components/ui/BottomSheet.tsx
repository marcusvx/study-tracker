import { ReactNode } from 'react';

interface BottomSheetProps {
  onClose: () => void;
  children: ReactNode;
}

/**
 * Generic overlay + slide-up sheet shell: dims the background, closes on
 * outside click, and renders a drag handle above the sheet content.
 */
export function BottomSheet({ onClose, children }: Readonly<BottomSheetProps>) {
  return (
    <div className="fixed inset-0 z-[100] flex items-end">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 z-0 bg-black/65 backdrop-blur-sm"
      />

      <div className="relative z-[1] mx-auto w-full max-w-[480px] animate-[slideUp_0.2s_cubic-bezier(0.16,1,0.3,1)] rounded-t-2xl border-t border-border bg-surface pb-8">
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-9 rounded-full bg-[#3A4048]" />
        </div>
        {children}
      </div>
    </div>
  );
}
