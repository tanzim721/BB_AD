'use client'

import { useState, useEffect } from 'react'
import { Topic } from '@/types'

export function useTopics() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/topics')
        const data = await res.json()

        if (!res.ok) {
          setError(data.error || 'Failed to fetch topics')
          return
        }

        // Transform database format to app format
        const formattedTopics = (data.topics || []).map((t: any) => ({
          id: t.id,
          name: t.name,
          icon: t.icon || '',
          subtopics: Array.isArray(t.subtopics) ? t.subtopics : [],
        }))

        setTopics(formattedTopics)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch topics')
      } finally {
        setLoading(false)
      }
    }

    fetchTopics()
  }, [])

  return { topics, loading, error }
}
