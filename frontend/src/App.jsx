import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home.jsx'
import Profile from './pages/Profile.jsx'
import Form from './pages/Form.jsx'
import Processing from './pages/Processing.jsx'
import Review from './pages/Review.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/form" element={<Form />} />
        <Route path="/processing" element={<Processing />} />
        <Route path="/review" element={<Review />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App