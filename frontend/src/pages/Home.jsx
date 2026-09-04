import React from 'react'
import FormZeroForm from '../components/FormZeroForm.jsx'

export default function Home() {
  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '56px 24px 80px' }}>
      <div style={{ marginBottom: 36 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--accent)',
            letterSpacing: '0.04em',
            marginBottom: 8,
          }}
        >
          FORMZERO
        </div>
        <h1 style={{ fontSize: 34, lineHeight: 1.15, margin: '0 0 10px' }}>
          Stop filling forms. Start submitting.
        </h1>
        <p style={{ fontSize: 16, color: 'var(--ink-soft)', margin: 0 }}>
          AI that understands forms and fills repetitive questions for you — using
          only what's actually in your profile, never a guess.
        </p>
      </div>

      <FormZeroForm />
    </div>
  )
}
