'use client'

import { useState, useEffect, useCallback } from 'react'
import { Question } from '@/types'

export function useQuestions(topicId: number | null, subtopic?: string) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchQuestions = useCallback(async () => {
    if (!topicId) return
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      params.append('topicId', topicId.toString())
      if (subtopic) params.append('subtopic', subtopic)

      const res = await fetch(`/api/questions?${params}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to fetch questions')
        setQuestions([])
        return
      }

      setQuestions(data.questions || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch questions')
      setQuestions([])
    } finally {
      setLoading(false)
    }
  }, [topicId, subtopic])

  useEffect(() => {
    fetchQuestions()
  }, [fetchQuestions])

  const addMCQ = async (q: any) => {
    return addBulk([q])
  }

  const addCQ = async (q: any) => {
    return addBulk([q])
  }

  const addBulk = async (qs: Omit<Question, 'id' | 'createdAt'>[]) => {
    if (!topicId) return { error: 'No topic selected' }

    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId, questions: qs }),
      })

      const data = await res.json()
      if (!res.ok) {
        return { error: data.error || 'Failed to add questions' }
      }

      // Refetch questions after adding
      await fetchQuestions()
      return { error: null }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Failed to add questions' }
    }
  }

  const deleteQuestion = async (id: string) => {
    try {
      const res = await fetch(`/api/questions/${id}`, {
        method: 'DELETE',
      })

      const data = await res.json()
      if (!res.ok) {
        return { error: data.error || 'Failed to delete question' }
      }

      // Remove from local state
      setQuestions((prev) => prev.filter((q) => q.id !== id))
      return { error: null }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Failed to delete question' }
    }
  }

  return { questions, loading, error, addMCQ, addCQ, addBulk, deleteQuestion, refetch: fetchQuestions }
}
