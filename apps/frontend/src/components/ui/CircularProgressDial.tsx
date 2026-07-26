import React from 'react'

interface CircularProgressDialProps {
  percentage: number
  onTrack?: boolean
  size?: number
  strokeWidth?: number
  showLabel?: boolean
  label?: string
}

export function CircularProgressDial({
  percentage,
  onTrack = true,
  size = 64,
  strokeWidth = 6,
  showLabel = false,
  label,
}: CircularProgressDialProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clampedPct = Math.min(100, Math.max(0, percentage))
  const strokeDashoffset = circumference - (clampedPct / 100) * circumference

  // Dial colors based on Compasso Design Guide
  const accentColor = onTrack ? 'var(--accent, #E8A33D)' : 'var(--alert, #C9694F)'
  const trackColor = 'rgba(255, 255, 255, 0.08)'

  // Angle for needle pointer (from -90deg top clockwise)
  const angle = (clampedPct / 100) * 360

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
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
          style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease' }}
        />
      </svg>
      {/* Needle indicator / Center value */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', 'DM Mono', monospace",
            fontSize: size > 90 ? 24 : 14,
            fontWeight: 700,
            color: 'var(--text-primary, #EDEEEC)',
            lineHeight: 1,
          }}
        >
          {clampedPct}%
        </span>
        {showLabel && label && (
          <span style={{ fontSize: 10, color: 'var(--text-muted, #8B929A)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {label}
          </span>
        )}
      </div>
    </div>
  )
}
