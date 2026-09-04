import React from 'react'

const STATUS_STYLES = {
  auto_fill: { label: 'Auto-filled', color: 'var(--accent)', bg: 'var(--accent-soft)' },
  review: { label: 'Please review', color: 'var(--amber)', bg: 'var(--amber-soft)' },
  needs_user: { label: 'Needs your input', color: 'var(--red)', bg: 'var(--red-soft)' },
}

export default function ConfidenceBadge({ status, confidence }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.needs_user
  const pct = Math.round((confidence ?? 0) * 100)

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 12,
        fontWeight: 600,
        color: style.color,
        background: style.bg,
        borderRadius: 999,
        padding: '4px 10px',
      }}
    >
      {style.label}
      {status !== 'needs_user' && <span style={{ opacity: 0.75 }}>{pct}%</span>}
    </span>
  )
}
