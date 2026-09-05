import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

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

        <button
          onClick={() => navigate('/profile')}
          className="rounded-lg border border-white/10 px-5 py-2 text-sm text-gray-300 transition hover:bg-white/5"
        >
          Get Started
        </button>
      </nav>

      {/* Hero */}
      <main className="mx-auto max-w-6xl px-6">

        <section className="flex min-h-[75vh] flex-col items-center justify-center text-center">

          <div className="mb-6 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-sm text-purple-300">
            ✦ AI-powered form automation
          </div>

          <h1 className="max-w-4xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">
            Stop filling forms.
            <br />
            <span className="text-purple-400">Start submitting.</span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-400">
            FormZero understands your profile and intelligently answers
            repetitive form questions — without guessing.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button
              onClick={() => navigate('/profile')}
              className="rounded-xl bg-purple-600 px-8 py-4 font-semibold transition hover:bg-purple-500"
            >
              Get Started →
            </button>

            <button
              onClick={() => navigate('/profile')}
              className="rounded-xl border border-white/10 bg-white/5 px-8 py-4 font-semibold text-gray-200 transition hover:bg-white/10"
            >
              Try FormZero
            </button>
          </div>

        </section>

        {/* Product Preview */}
        <section className="pb-24">

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 shadow-2xl">

            <div className="rounded-2xl border border-white/10 bg-[#120B22] p-8">

              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-400">FORMZERO</p>
                  <h2 className="mt-2 text-2xl font-semibold">
                    Your forms, handled.
                  </h2>
                </div>

                <div className="rounded-lg bg-purple-500/10 px-3 py-2 text-sm text-purple-300">
                  AI Ready
                </div>
              </div>

              <div className="space-y-4">

                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-sm text-gray-400">
                    Full Name
                  </p>
                  <p className="mt-2 font-medium">
                    Ritvika Gupta
                  </p>
                  <span className="mt-3 inline-block text-xs text-green-400">
                    ✓ Auto-filled
                  </span>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-sm text-gray-400">
                    Education
                  </p>
                  <p className="mt-2 font-medium">
                    B.Tech Computer Science
                  </p>
                  <span className="mt-3 inline-block text-xs text-green-400">
                    ✓ Auto-filled
                  </span>
                </div>

                <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400">
                      Why are you interested in this event?
                    </p>

                    <span className="text-xs text-purple-400">
                      AI Generated
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-gray-300">
                    I'm interested in this event because it provides an
                    opportunity to learn, collaborate, and apply my skills
                    to real-world problems.
                  </p>
                </div>

              </div>

            </div>
          </div>

        </section>

        {/* How it works */}
        <section className="pb-28">

          <div className="mb-12 text-center">
            <p className="text-sm font-medium text-purple-400">
              HOW IT WORKS
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Three steps. Zero repetitive typing.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
              <div className="mb-5 text-3xl">01</div>
              <h3 className="text-xl font-semibold">
                Build your profile
              </h3>
              <p className="mt-3 text-sm leading-6 text-gray-400">
                Tell FormZero about yourself once.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
              <div className="mb-5 text-3xl">02</div>
              <h3 className="text-xl font-semibold">
                Upload your form
              </h3>
              <p className="mt-3 text-sm leading-6 text-gray-400">
                Give FormZero the questions you need answered.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
              <div className="mb-5 text-3xl">03</div>
              <h3 className="text-xl font-semibold">
                Review & submit
              </h3>
              <p className="mt-3 text-sm leading-6 text-gray-400">
                Review AI-generated answers and submit with confidence.
              </p>
            </div>

          </div>

        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 px-8 py-8 text-center text-sm text-gray-500">
        FormZero — Stop filling forms. Start submitting.
      </footer>

    </div>
  )
}