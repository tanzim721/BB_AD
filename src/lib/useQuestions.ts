'use client'

import { useState, useEffect, useCallback } from 'react'
import { Question } from '@/types'

export interface PaginationInfo {
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export function useQuestions(topicId: number | null, subtopic?: string) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)

  const fetchQuestions = useCallback(async (pageNum: number = 1) => {
    if (!topicId) return
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      params.append('topicId', topicId.toString())
      params.append('page', pageNum.toString())
      params.append('pageSize', pageSize.toString())
      if (subtopic) params.append('subtopic', subtopic)

      const res = await fetch(`/api/questions?${params}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to fetch questions')
        setQuestions([])
        return
      }

      setQuestions(data.questions || [])
      setPagination(data.pagination || null)
      setPage(pageNum)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch questions')
      setQuestions([])
    } finally {
      setLoading(false)
    }
  }, [topicId, subtopic, pageSize])

  useEffect(() => {
    fetchQuestions(1)
  }, [fetchQuestions])

  const goToPage = async (pageNum: number) => {
    if (!pagination) return
    if (pageNum < 1 || pageNum > pagination.totalPages) return
    await fetchQuestions(pageNum)
  }

  const nextPage = async () => {
    if (!pagination || !pagination.hasNextPage) return
    await goToPage(page + 1)
  }

  const prevPage = async () => {
    if (!pagination || !pagination.hasPrevPage) return
    await goToPage(page - 1)
  }

  const setPageSizeAndRefetch = async (newPageSize: number) => {
    setPageSize(newPageSize)
    await fetchQuestions(1)
  }

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

      // Refetch questions on first page after adding
      await fetchQuestions(1)
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

      // Refetch current page after deletion
      await fetchQuestions(page)
      return { error: null }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Failed to delete question' }
    }
  }

  return {
    questions,
    loading,
    error,
    addMCQ,
    addCQ,
    addBulk,
    deleteQuestion,
    refetch: fetchQuestions,
    pagination,
    page,
    pageSize,
    goToPage,
    nextPage,
    prevPage,
    setPageSizeAndRefetch,
  }
}
