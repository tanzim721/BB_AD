import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const topicId = req.nextUrl.searchParams.get('topicId')
  const subtopic = req.nextUrl.searchParams.get('subtopic')

  if (!topicId) {
    return NextResponse.json(
      { error: 'topicId is required' },
      { status: 400 }
    )
  }

  try {
    // Fetch MCQ questions
    let mcqQuery = supabase
      .from('mcq_questions')
      .select('*')
      .eq('topic_id', parseInt(topicId))

    if (subtopic) {
      mcqQuery = mcqQuery.eq('subtopic', subtopic)
    }

    const { data: mcqs, error: mcqError } = await mcqQuery.order('created_at', {
      ascending: false,
    })

    // Fetch CQ questions
    let cqQuery = supabase
      .from('cq_questions')
      .select('*')
      .eq('topic_id', parseInt(topicId))

    if (subtopic) {
      cqQuery = cqQuery.eq('subtopic', subtopic)
    }

    const { data: cqs, error: cqError } = await cqQuery.order('created_at', {
      ascending: false,
    })

    if (mcqError || cqError) {
      return NextResponse.json(
        { error: mcqError?.message || cqError?.message },
        { status: 500 }
      )
    }

    // Transform database format to app format
    const mcqQuestions = (mcqs || []).map((q) => ({
      id: q.id,
      topicId: q.topic_id,
      type: 'mcq' as const,
      question: q.question,
      optionA: q.option_a,
      optionB: q.option_b,
      optionC: q.option_c,
      optionD: q.option_d,
      correct: q.correct as 'a' | 'b' | 'c' | 'd',
      subtopic: q.subtopic || '',
      explanation: q.explanation || '',
      createdAt: q.created_at,
    }))

    const cqQuestions = (cqs || []).map((q) => ({
      id: q.id,
      topicId: q.topic_id,
      type: 'cq' as const,
      stem: q.stem,
      parts: q.parts || [],
      subtopic: q.subtopic || '',
      createdAt: q.created_at,
    }))

    const allQuestions = [...mcqQuestions, ...cqQuestions].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return NextResponse.json({ questions: allQuestions })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { topicId, questions } = body

    if (!topicId || !questions || questions.length === 0) {
      return NextResponse.json(
        { error: 'topicId and questions array are required' },
        { status: 400 }
      )
    }

    const mcqRows: any[] = []
    const cqRows: any[] = []

    for (const q of questions) {
      if (q.type === 'mcq') {
        mcqRows.push({
          topic_id: topicId,
          type: 'mcq',
          question: q.question,
          option_a: q.optionA,
          option_b: q.optionB,
          option_c: q.optionC,
          option_d: q.optionD,
          correct: q.correct,
          subtopic: q.subtopic || '',
          explanation: q.explanation || '',
        })
      } else if (q.type === 'cq') {
        cqRows.push({
          topic_id: topicId,
          type: 'cq',
          stem: q.stem,
          parts: q.parts || [],
          subtopic: q.subtopic || '',
        })
      }
    }

    let insertedCount = 0
    let error: any = null

    if (mcqRows.length > 0) {
      const { error: err } = await supabase.from('mcq_questions').insert(mcqRows)
      if (err) error = err
      else insertedCount += mcqRows.length
    }

    if (cqRows.length > 0) {
      const { error: err } = await supabase.from('cq_questions').insert(cqRows)
      if (err) error = err
      else insertedCount += cqRows.length
    }

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, inserted: insertedCount })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    )
  }
}
