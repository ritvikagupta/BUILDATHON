import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const navigate = useNavigate()

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    education: '',
    skills: '',
    experience: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleContinue = () => {
    localStorage.setItem('formzero-profile', JSON.stringify(profile))
    navigate('/form')
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
          Step 1 of 3
        </div>
      </nav>

      {/* Progress */}
      <div className="mx-auto mt-4 h-1 max-w-3xl rounded-full bg-white/10">
        <div className="h-1 w-1/3 rounded-full bg-purple-500" />
      </div>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="mb-10">
          <p className="mb-3 text-sm font-medium text-purple-400">
            YOUR PROFILE
          </p>

          <h1 className="text-4xl font-bold tracking-tight">
            Tell us a little about yourself.
          </h1>

          <p className="mt-3 text-gray-400">
            FormZero will use this information to intelligently answer
            repetitive questions for you.
          </p>
        </div>

        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-purple-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-purple-500"
            />
          </div>

          {/* Education */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Education
            </label>

            <input
              type="text"
              name="education"
              value={profile.education}
              onChange={handleChange}
              placeholder="e.g. B.Tech Computer Science"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-purple-500"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Skills
            </label>

            <input
              type="text"
              name="skills"
              value={profile.skills}
              onChange={handleChange}
              placeholder="e.g. Python, React, Machine Learning"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-purple-500"
            />
          </div>

          {/* Experience */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Experience
            </label>

            <textarea
              name="experience"
              value={profile.experience}
              onChange={handleChange}
              placeholder="Tell us about your projects, internships, or experience..."
              rows={4}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-purple-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-10 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="rounded-xl border border-white/10 px-6 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/5"
          >
            ← Back
          </button>

          <button
            onClick={handleContinue}
            className="rounded-xl bg-purple-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-purple-500"
          >
            Save & Continue →
          </button>
        </div>
      </main>
    </div>
  )
}