interface SpinnerProps {
  size?: number;
  color?: string;
}

export function Spinner({ size = 18, color = 'currentColor' }: SpinnerProps) {
  return (
    <div
      className="animate-[spin_0.7s_linear_infinite] rounded-full"
      style={{
        width: size,
        height: size,
        border: `2px solid ${color}33`,
        borderTopColor: color,
      }} // size/color are runtime props, can't be expressed as static Tailwind classes
    />
  );
}
