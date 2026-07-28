interface CircularProgressDialProps {
  percentage: number;
  onTrack?: boolean;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  label?: string;
}

export function CircularProgressDial({
  percentage,
  onTrack = true,
  size = 64,
  strokeWidth = 6,
  showLabel = false,
  label,
}: Readonly<CircularProgressDialProps>) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPct = Math.min(100, Math.max(0, percentage));
  const strokeDashoffset = circumference - (clampedPct / 100) * circumference;

  // Dial colors based on Study Tracker Design Guide
  const accentColor = onTrack
    ? 'var(--accent, #E8A33D)'
    : 'var(--alert, #C9694F)';
  const trackColor = 'rgba(255, 255, 255, 0.08)';

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }} // size is a runtime prop
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={accentColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="[transition:stroke-dashoffset_0.5s_ease,stroke_0.3s_ease]"
        />
      </svg>
      {/* Needle indicator / Center value */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={`font-mono font-bold leading-none text-text-primary ${size > 90 ? 'text-2xl' : 'text-sm'}`}
        >
          {clampedPct}%
        </span>
        {showLabel && label && (
          <span className="mt-0.5 text-[10px] uppercase tracking-wider text-text-secondary">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
