import React from 'react'
import ConfidenceBadge from './ConfidenceBadge.jsx'

export default function QuestionCard({ question, options, result, value, onChange }) {
  const status = result?.status
  const reason = result?.reason

  return (
    <div
      style={{
        border: '1px solid var(--line)',
        borderRadius: 10,
        padding: '16px 18px',
        background: 'var(--panel)',
        marginBottom: 14,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 12,
          marginBottom: 10,
        }}
      >
        <label style={{ fontWeight: 600, fontSize: 14.5 }}>{question}</label>
        {status && <ConfidenceBadge status={status} confidence={result.confidence} />}
      </div>

      {options && options.length > 0 ? (
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: 6,
            border: `1px solid ${status === 'needs_user' ? 'var(--red)' : 'var(--line)'}`,
            fontSize: 14,
            background: status === 'needs_user' ? 'var(--red-soft)' : 'var(--panel)',
          }}
        >
          <option value="" disabled>
            Select an option
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          rows={question.length > 40 ? 3 : 1}
          placeholder={status === 'needs_user' ? 'FormZero could not answer this — please fill it in.' : ''}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: 6,
            border: `1px solid ${status === 'needs_user' ? 'var(--red)' : 'var(--line)'}`,
            fontSize: 14,
            fontFamily: 'inherit',
            background: status === 'needs_user' ? 'var(--red-soft)' : 'var(--panel)',
            resize: 'vertical',
          }}
        />
      )}

      {reason && (
        <div style={{ fontSize: 11.5, color: 'var(--ink-soft)', marginTop: 6 }}>{reason}</div>
      )}
    </div>
  )
}
