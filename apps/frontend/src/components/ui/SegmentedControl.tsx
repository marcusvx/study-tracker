import { ReactNode } from 'react';

interface SegmentedControlOption<T extends string> {
  value: T;
  label: string;
  icon?: ReactNode;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: Readonly<SegmentedControlProps<T>>) {
  return (
    <div className="flex gap-1 rounded-md bg-input p-1" role="radiogroup">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          onClick={() => onChange(option.value)}
          className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded border-none px-2 py-2 text-[13px] font-semibold transition-colors duration-150 ${
            value === option.value
              ? 'bg-accent text-ink'
              : 'bg-transparent text-text-secondary'
          }`}
        >
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  );
}
