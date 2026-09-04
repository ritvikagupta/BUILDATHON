import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Form() {
  const navigate = useNavigate()
  const [fileName, setFileName] = useState('')
  const [questions, setQuestions] = useState('')

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]

    if (file) {
      setFileName(file.name)
    }
  }

  const handleAnalyze = () => {
    localStorage.setItem('formzero-questions', questions)
    localStorage.setItem('formzero-file', fileName)
    navigate('/processing')
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
          Step 2 of 3
        </div>
      </nav>

      {/* Progress */}
      <div className="mx-auto mt-4 h-1 max-w-3xl rounded-full bg-white/10">
        <div className="h-1 w-2/3 rounded-full bg-purple-500" />
      </div>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-6 py-16">

        <div className="mb-10">
          <p className="mb-3 text-sm font-medium text-purple-400">
            YOUR FORM
          </p>

          <h1 className="text-4xl font-bold tracking-tight">
            What do you need FormZero to fill?
          </h1>

          <p className="mt-3 text-gray-400">
            Upload a form or paste the questions below. FormZero will analyze
            them and generate answers using your profile.
          </p>
        </div>

        {/* Upload */}
        <div className="mb-8">
          <label className="mb-3 block text-sm font-medium text-gray-300">
            Upload your form
          </label>

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-purple-500/30 bg-purple-500/5 px-6 py-12 text-center transition hover:bg-purple-500/10">

            <div className="mb-4 text-4xl">
              ↑
            </div>

            <p className="font-medium">
              {fileName || 'Choose a file'}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              PDF, DOC, DOCX, TXT, PNG or JPG
            </p>

            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Divider */}
        <div className="my-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-sm text-gray-500">OR</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Paste questions */}
        <div>
          <label className="mb-3 block text-sm font-medium text-gray-300">
            Paste your questions
          </label>

          <textarea
            value={questions}
            onChange={(e) => setQuestions(e.target.value)}
            placeholder={`Paste questions here...

Example:
1. What is your full name?
2. What is your field of study?
3. Why are you interested in this event?`}
            rows={9}
            className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm leading-6 text-white outline-none transition placeholder:text-gray-600 focus:border-purple-500"
          />
        </div>

        {/* Buttons */}
        <div className="mt-10 flex items-center justify-between">

          <button
            onClick={() => navigate('/profile')}
            className="rounded-xl border border-white/10 px-6 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/5"
          >
            ← Back
          </button>

          <button
            onClick={handleAnalyze}
            disabled={!fileName && !questions.trim()}
            className="rounded-xl bg-purple-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Analyze Form →
          </button>

        </div>

      </main>
    </div>
  )
}