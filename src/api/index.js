import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  withCredentials: true, // send session cookies
})

// Auth
export const register = (data) => api.post('/auth/register', data)
export const login = (data) => api.post('/auth/login', data)
export const logout = () => api.post('/auth/logout')
export const getMe = () => api.get('/auth/me')

// Matches
export const getMatches = () => api.get('/matches')
export const getMatchesByStage = (stage) => api.get(`/matches/stage/${stage}`)

// Predictions
export const submitPrediction = (data) => api.post('/predictions', data)
export const getMyPredictions = () => api.get('/predictions/me')
export const submitTournamentPrediction = (data) => api.post('/predictions/tournament', data)
export const getMyTournamentPrediction = () => api.get('/predictions/tournament/me')

// Leaderboard
export const getLeaderboard = () => api.get('/leaderboard')
export const getTop10 = () => api.get('/leaderboard/top10')

export default api
