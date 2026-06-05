import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ParticleBackground from './components/ParticleBackground'
import Navbar from './components/Navbar'
import LiveTicker from './components/LiveTicker'
import SoundButton from './components/SoundButton'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'
import HomePage from './pages/HomePage'
import MatchesPage from './pages/MatchesPage'
import PredictPage from './pages/PredictPage'
import LeaderboardPage from './pages/LeaderboardPage'

export default function App() {
  const [profileModal, setProfileModal] = useState(false)
  return (
    <AuthProvider>
      <BrowserRouter>
        <ParticleBackground />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar onOpenProfile={() => setProfileModal(true)} />
          <LiveTicker />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/matches" element={<MatchesPage />} />
              <Route path="/predict" element={<PredictPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <SoundButton />
        {profileModal && <AuthModal onClose={() => setProfileModal(false)} />}
        <Toaster position="top-center" toastOptions={{
          style: { background: '#0F1520', color: '#F0F2F5', border: '1px solid rgba(255,255,255,0.08)', fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem' },
          success: { iconTheme: { primary: '#F5A623', secondary: '#080C12' } },
        }} />
      </BrowserRouter>
    </AuthProvider>
  )
}
