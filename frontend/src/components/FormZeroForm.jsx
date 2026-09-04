import React, { useState } from 'react'
import QuestionCard from './QuestionCard.jsx'
import { fetchAnswer } from '../services/api.js'

export const DEMO_QUESTIONS = [
  { id: 'name', question: 'Full Name', type: 'text', options: [] },
  { id: 'email', question: 'Email', type: 'text', options: [] },
  { id: 'field', question: 'What is your current field of study?', type: 'text', options: [] },
  {
    id: 'field_mc',
    question: 'What is your field?',
    type: 'multiple_choice',
    options: ['Computer Science', 'Mechanical Engineering', 'Civil Engineering', 'Business'],
  },
  { id: 'skills', question: 'What skills do you have?', type: 'text', options: [] },
  { id: 'about', question: 'Tell us about yourself.', type: 'text', options: [] },
  { id: 'why', question: 'Why are you interested in this event?', type: 'text', options: [] },
  { id: 'passport', question: 'What is your passport number?', type: 'text', options: [] },
]

export default function FormZeroForm() {
  const [values, setValues] = useState({})
  const [results, setResults] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleFill = async () => {
    setLoading(true)
    setError(null)
    try {
      const entries = await Promise.all(
        DEMO_QUESTIONS.map(async (q) => {
          const result = await fetchAnswer({ question: q.question, type: q.type, options: q.options })
          return [q.id, result]
        })
      )
      const newResults = Object.fromEntries(entries)
      const newValues = {}
      for (const [id, result] of entries) {
        newValues[id] = result.answer || ''
      }
      setResults(newResults)
      setValues((prev) => ({ ...prev, ...newValues }))
    } catch (err) {
      console.error(err)
      setError('FormZero AI is temporarily unavailable. Please check the backend is running and try again.')
    } finally {
      setLoading(false)
    }
  }

  const autoFilledCount = Object.values(results).filter((r) => r.status === 'auto_fill').length
  const needsUserCount = Object.values(results).filter((r) => r.status === 'needs_user').length
  const hasResults = Object.keys(results).length > 0

  return (
    <div>
      <button
        onClick={handleFill}
        disabled={loading}
        style={{
          background: 'var(--accent)',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          padding: '13px 22px',
          fontSize: 15,
          fontWeight: 600,
          cursor: loading ? 'default' : 'pointer',
          opacity: loading ? 0.7 : 1,
          marginBottom: 18,
        }}
      >
        {loading ? 'Filling with FormZero…' : 'Fill with FormZero'}
      </button>

      {hasResults && !loading && (
        <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 16 }}>
          {autoFilledCount} of {DEMO_QUESTIONS.length} questions auto-filled
          {needsUserCount > 0 && ` — ${needsUserCount} need your input`}.
        </div>
      )}

      {error && (
        <div
          style={{
            background: 'var(--red-soft)',
            color: 'var(--red)',
            padding: '12px 14px',
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 13.5,
          }}
        >
          {error}
        </div>
      )}

      {DEMO_QUESTIONS.map((q) => (
        <QuestionCard
          key={q.id}
          question={q.question}
          options={q.options}
          result={results[q.id]}
          value={values[q.id]}
          onChange={(val) => setValues((prev) => ({ ...prev, [q.id]: val }))}
        />
      ))}

      {hasResults && (
        <button
          style={{
            background: 'var(--ink)',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            padding: '12px 20px',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            marginTop: 6,
          }}
          onClick={() => alert('This is a demo — in a real integration this would submit the form.')}
        >
          Submit
        </button>
      )}
    </div>
  )
}
