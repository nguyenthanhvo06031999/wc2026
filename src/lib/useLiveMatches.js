import { useEffect, useMemo, useState } from 'react'
import { fetchMatchUpdates, getCurrentMatches, mergeMatchUpdates } from '../data/matches'

const REFRESH_MS = 60_000

export function useLiveMatches() {
  const [matches, setMatches] = useState(() => getCurrentMatches())
  const [syncState, setSyncState] = useState({
    configured: Boolean(import.meta.env.VITE_MATCHES_FEED_URL),
    loading: false,
    error: '',
    updated_at: '',
  })

  useEffect(() => {
    let cancelled = false

    const refresh = async () => {
      if (!import.meta.env.VITE_MATCHES_FEED_URL) {
        setMatches(getCurrentMatches())
        return
      }

      setSyncState(current => ({ ...current, loading: true, error: '' }))
      try {
        const result = await fetchMatchUpdates()
        if (cancelled) return
        setMatches(mergeMatchUpdates(undefined, result.updates))
        setSyncState({
          configured: result.configured,
          loading: false,
          error: '',
          updated_at: result.updated_at || new Date().toISOString(),
        })
      } catch (error) {
        if (cancelled) return
        setMatches(getCurrentMatches())
        setSyncState(current => ({
          ...current,
          loading: false,
          error: error instanceof Error ? error.message : 'Could not refresh scores',
        }))
      }
    }

    refresh()
    const interval = window.setInterval(refresh, REFRESH_MS)
    const onLocalUpdate = () => setMatches(getCurrentMatches())
    window.addEventListener('wc2026:match-updates', onLocalUpdate)

    return () => {
      cancelled = true
      window.clearInterval(interval)
      window.removeEventListener('wc2026:match-updates', onLocalUpdate)
    }
  }, [])

  return useMemo(() => ({ matches, syncState }), [matches, syncState])
}
