interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
}

export function ProgressBar({
  value,
  max,
  color = 'var(--accent)',
}: ProgressBarProps) {
  const w = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div
      style={{
        height: 6,
        borderRadius: 99,
        background: '#262B30',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${w}%`,
          background: color,
          borderRadius: 99,
          transition: 'width 0.4s ease',
        }}
      />
    </div>
  );
}
