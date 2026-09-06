'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'
import { Question, MCQuestion, CQuestion } from '@/types'

export function useQuestions(topicId: number | null) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(false)

  const fetchQuestions = useCallback(async () => {
    if (!topicId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('topic_id', topicId)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setQuestions(data.map(dbToQuestion))
    }
    setLoading(false)
  }, [topicId])

  useEffect(() => {
    fetchQuestions()
  }, [fetchQuestions])

  const addMCQ = async (q: Omit<MCQuestion, 'id' | 'createdAt'>) => {
    const { data, error } = await supabase
      .from('questions')
      .insert({
        topic_id: q.topicId,
        type: 'mcq',
        question: q.question,
        option_a: q.optionA,
        option_b: q.optionB,
        option_c: q.optionC,
        option_d: q.optionD,
        correct_answer: q.correct,
        subtopic: q.subtopic,
        explanation: q.explanation,
      })
      .select()
      .single()

    if (!error && data) {
      setQuestions((prev) => [dbToQuestion(data), ...prev])
    }
    return { error }
  }

  const addCQ = async (q: Omit<CQuestion, 'id' | 'createdAt'>) => {
    const { data, error } = await supabase
      .from('questions')
      .insert({
        topic_id: q.topicId,
        type: 'cq',
        stem: q.stem,
        parts: q.parts,
        subtopic: q.subtopic,
      })
      .select()
      .single()

    if (!error && data) {
      setQuestions((prev) => [dbToQuestion(data), ...prev])
    }
    return { error }
  }

  const addBulk = async (qs: Omit<Question, 'id' | 'createdAt'>[]) => {
    const rows = qs.map((q) => {
      if (q.type === 'mcq') {
        const m = q as Omit<MCQuestion, 'id' | 'createdAt'>
        return {
          topic_id: m.topicId,
          type: 'mcq',
          question: m.question,
          option_a: m.optionA,
          option_b: m.optionB,
          option_c: m.optionC,
          option_d: m.optionD,
          correct_answer: m.correct,
          subtopic: m.subtopic,
          explanation: m.explanation,
        }
      } else {
        const c = q as Omit<CQuestion, 'id' | 'createdAt'>
        return {
          topic_id: c.topicId,
          type: 'cq',
          stem: c.stem,
          parts: c.parts,
          subtopic: c.subtopic,
        }
      }
    })

    const { data, error } = await supabase.from('questions').insert(rows).select()
    if (!error && data) {
      setQuestions((prev) => [...data.map(dbToQuestion), ...prev])
    }
    return { error }
  }

  const deleteQuestion = async (id: string) => {
    const { error } = await supabase.from('questions').delete().eq('id', id)
    if (!error) {
      setQuestions((prev) => prev.filter((q) => q.id !== id))
    }
    return { error }
  }

  return { questions, loading, addMCQ, addCQ, addBulk, deleteQuestion, refetch: fetchQuestions }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbToQuestion(row: any): Question {
  if (row.type === 'mcq') {
    return {
      id: row.id,
      topicId: row.topic_id,
      type: 'mcq',
      question: row.question,
      optionA: row.option_a,
      optionB: row.option_b,
      optionC: row.option_c,
      optionD: row.option_d,
      correct: row.correct_answer,
      subtopic: row.subtopic || '',
      explanation: row.explanation || '',
      createdAt: row.created_at,
    } as MCQuestion
  } else {
    return {
      id: row.id,
      topicId: row.topic_id,
      type: 'cq',
      stem: row.stem,
      parts: row.parts || [],
      subtopic: row.subtopic || '',
      createdAt: row.created_at,
    } as CQuestion
  }
}
