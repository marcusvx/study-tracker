interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
}

export function ProgressBar({
  value,
  max,
  color = 'var(--accent)',
}: Readonly<ProgressBarProps>) {
  const w = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-[#262B30]">
      <div
        className="h-full rounded-full [transition:width_0.4s_ease]"
        style={{ width: `${w}%`, background: color }} // width/color are computed from props at runtime
      />
    </div>
  );
}
