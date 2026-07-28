import { useState } from 'react';

export interface SvgBarChartProps {
  data: { date: string; progresso: number }[];
}

export function SvgBarChart({ data }: SvgBarChartProps) {
  const W = 340;
  const H = 120;
  const pad = { top: 12, bottom: 24, left: 4, right: 4 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;
  const max = Math.max(...data.map((d) => d.progresso), 1);
  const barW = Math.min(24, (chartW / (data.length || 1)) * 0.5);
  const gap = chartW / (data.length || 1);
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height={H}
      className="overflow-visible"
    >
      {data.map((d, i) => {
        const bh = Math.max(4, (d.progresso / max) * chartH);
        const x = pad.left + gap * i + gap / 2;
        const y = pad.top + chartH - bh;
        const isHov = hovered === i;
        return (
          <g
            key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className="cursor-default"
          >
            <rect
              x={x - barW / 2}
              y={y}
              width={barW}
              height={bh}
              rx={3}
              fill={isHov ? '#F3B458' : 'var(--accent, #E8A33D)'}
              className="[transition:fill_0.15s]"
            />
            {isHov && (
              <g>
                <rect
                  x={x - 22}
                  y={y - 28}
                  width={44}
                  height={20}
                  rx={4}
                  fill="#1E2226"
                  stroke="#2D3339"
                  strokeWidth={1}
                />
                <text
                  x={x}
                  y={y - 14}
                  textAnchor="middle"
                  fill="#EDEEEC"
                  fontSize={11}
                  fontFamily="'JetBrains Mono', monospace"
                >
                  {d.progresso}
                </text>
              </g>
            )}
            <text
              x={x}
              y={H - 4}
              textAnchor="middle"
              fill="#8B929A"
              fontSize={10}
              fontFamily="'JetBrains Mono', monospace"
            >
              {d.date}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
