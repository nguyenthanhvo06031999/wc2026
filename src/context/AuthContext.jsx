import { useState } from 'react'
import { AuthContext } from './auth-context'
import { clearParticipant, getParticipant, saveParticipant } from '../lib/predictionStore'

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(() => getParticipant())
  const loading = false

  const setUser = (profile) => {
    if (!profile) {
      clearParticipant()
      setUserState(null)
      return null
    }
    const participant = saveParticipant(profile)
    setUserState(participant)
    return participant
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
