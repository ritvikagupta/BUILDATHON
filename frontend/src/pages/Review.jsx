import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchAnswer } from '../services/api.js'

export default function Review() {
  const navigate = useNavigate()

  const [profile, setProfile] = useState({})
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const savedProfile = localStorage.getItem('formzero-profile')
    const savedQuestions = localStorage.getItem('formzero-questions')

    let parsedProfile = {}

    if (savedProfile) {
      try {
        parsedProfile = JSON.parse(savedProfile)
        setProfile(parsedProfile)
      } catch (err) {
        console.error('Could not read saved profile:', err)
      }
    }

    if (!savedQuestions || !savedQuestions.trim()) {
      setLoading(false)
      return
    }

    // Turn the pasted text into individual questions
    const parsedQuestions = savedQuestions
      .split('\n')
      .map((line) =>
        line.replace(/^\s*(?:\d+[\.\)]|[-•])\s*/, '').trim()
      )
      .filter(Boolean)

    setQuestions(parsedQuestions)

    const getAnswers = async () => {
      try {
        const results = await Promise.all(
          parsedQuestions.map(async (question) => {
            try {
              const result = await fetchAnswer({
                question,
                type: 'text',
                options: [],
                userProfile: parsedProfile,
              })

              return {
                question,
                ...result,
              }
            } catch (err) {
              console.error(`Failed to answer: ${question}`, err)

              return {
                question,
                answer: null,
                confidence: 0,
                needs_user: true,
                status: 'needs_user',
                reason: 'Could not connect to the FormZero AI backend.',
                matched_fields: [],
              }
            }
          })
        )

        setAnswers(results)
      } catch (err) {
        console.error('Failed to generate answers:', err)
        setError('Something went wrong while generating answers.')
      } finally {
        setLoading(false)
      }
    }

    getAnswers()
  }, [])

  const getStatusText = (status) => {
    if (status === 'auto_fill') return '✓ Auto-filled'
    if (status === 'review') return '⚠ Review'
    if (status === 'needs_user') return 'Needs input'
    return 'AI Generated'
  }

  const getStatusClass = (status) => {
    if (status === 'auto_fill') {
      return 'bg-green-500/10 text-green-400'
    }

    if (status === 'review') {
      return 'bg-yellow-500/10 text-yellow-400'
    }

    if (status === 'needs_user') {
      return 'bg-red-500/10 text-red-400'
    }

    return 'bg-purple-500/10 text-purple-300'
  }

  const handleSubmit = () => {
    alert('Form submitted successfully! 🎉')
  }

  return (
    <div className="min-h-screen bg-[#0B0618] text-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6">
        <button
          onClick={() => navigate('/')}
          className="text-2xl font-bold tracking-tight"
        >
          Form<span className="text-purple-400">Zero</span>
        </button>

        <div className="text-sm text-gray-400">
          Review
        </div>
      </nav>

      {/* Progress */}
      <div className="mx-auto mt-4 h-1 max-w-3xl rounded-full bg-white/10">
        <div className="h-1 w-full rounded-full bg-purple-500" />
      </div>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-6 py-16">

        {/* Heading */}
        <div className="mb-10">
          <p className="mb-3 text-sm font-medium text-purple-400">
            REVIEW YOUR ANSWERS
          </p>

          <h1 className="text-4xl font-bold tracking-tight">
            FormZero has filled your form.
          </h1>

          <p className="mt-3 text-gray-400">
            Review the answers before submitting. You stay in control of
            everything FormZero generates.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-10 text-center">

            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-purple-500/10">
              <div className="h-7 w-7 animate-spin rounded-full border-4 border-purple-500/20 border-t-purple-500" />
            </div>

            <h2 className="text-lg font-semibold">
              Generating your answers...
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              FormZero AI is analyzing your questions and profile.
            </p>

          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-5 text-red-400">
            {error}
          </div>
        )}

        {/* Profile Summary */}
        {!loading && (
          <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">

            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-400">
                PROFILE USED
              </p>

              <span className="text-xs text-green-400">
                ✓ Profile
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              <div>
                <p className="text-xs text-gray-500">
                  Name
                </p>
                <p className="mt-1">
                  {profile.name || 'Not provided'}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Email
                </p>
                <p className="mt-1">
                  {profile.email || 'Not provided'}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Education
                </p>
                <p className="mt-1">
                  {profile.education || 'Not provided'}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Skills
                </p>
                <p className="mt-1">
                  {profile.skills || 'Not provided'}
                </p>
              </div>

            </div>
          </div>
        )}

        {/* AI Answers */}
        {!loading && answers.length > 0 && (
          <div className="space-y-5">

            {answers.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6"
              >

                {/* Question */}
                <div className="flex items-start justify-between gap-4">

                  <div className="flex-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Question {index + 1}
                    </p>

                    <p className="mt-2 text-base font-medium text-white">
                      {item.question}
                    </p>
                  </div>

                  <span
                    className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                      item.status
                    )}`}
                  >
                    {getStatusText(item.status)}
                  </span>

                </div>

                {/* Answer */}
                <div className="mt-5 rounded-xl border border-white/10 bg-black/10 p-4">

                  <p className="text-xs font-medium text-gray-500">
                    FORMZERO ANSWER
                  </p>

                  <p className="mt-3 leading-7 text-gray-300">
                    {item.answer || item.reason || 'No answer generated.'}
                  </p>

                </div>

                {/* Confidence */}
                <div className="mt-4 flex items-center justify-between text-xs">

                  <span className="text-gray-500">
                    Confidence
                  </span>

                  <span className="text-gray-400">
                    {Math.round((item.confidence || 0) * 100)}%
                  </span>

                </div>

                {/* Confidence bar */}
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-purple-500 transition-all"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(0, (item.confidence || 0) * 100)
                      )}%`,
                    }}
                  />
                </div>

                {/* Reason */}
                {item.reason && (
                  <p className="mt-3 text-xs text-gray-500">
                    {item.reason}
                  </p>
                )}

                {/* Matched fields */}
                {item.matched_fields?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">

                    {item.matched_fields.map((field, fieldIndex) => (
                      <span
                        key={fieldIndex}
                        className="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-400"
                      >
                        {field}
                      </span>
                    ))}

                  </div>
                )}

              </div>
            ))}

          </div>
        )}

        {/* No questions */}
        {!loading && questions.length === 0 && (
          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-6 text-center">

            <p className="text-yellow-400">
              No questions were found.
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Go back and paste your form questions first.
            </p>

          </div>
        )}

        {/* Buttons */}
        {!loading && (
          <div className="mt-10 flex items-center justify-between">

            <button
              onClick={() => navigate('/form')}
              className="rounded-xl border border-white/10 px-6 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/5"
            >
              ← Edit Form
            </button>

            <button
              onClick={handleSubmit}
              disabled={answers.length === 0}
              className="rounded-xl bg-purple-600 px-8 py-3 text-sm font-semibold transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Submit Form ✓
            </button>

          </div>
        )}

      </main>
    </div>
  )
}