import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Processing() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/review')
    }, 3500)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="min-h-screen bg-[#0B0618] text-white">
      <nav className="flex items-center justify-between px-8 py-6">
        <button
          onClick={() => navigate('/')}
          className="text-2xl font-bold tracking-tight"
        >
          Form<span className="text-purple-400">Zero</span>
        </button>

        <div className="text-sm text-gray-400">
          Step 3 of 3
        </div>
      </nav>

      <main className="flex min-h-[75vh] flex-col items-center justify-center px-6 text-center">

        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-purple-500/10">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500/20 border-t-purple-500" />
        </div>

        <p className="mb-3 text-sm font-medium text-purple-400">
          FORMZERO AI
        </p>

        <h1 className="text-4xl font-bold">
          Analyzing your form...
        </h1>

        <p className="mt-4 max-w-md text-gray-400">
          FormZero is understanding your questions and matching them
          with the information in your profile.
        </p>

        <div className="mt-8 flex items-center gap-2 text-sm text-gray-500">
          <span className="h-2 w-2 animate-pulse rounded-full bg-purple-500" />
          Generating intelligent answers
        </div>

      </main>
    </div>
  )
}