import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const topicId = req.nextUrl.searchParams.get('topicId')
  const subtopic = req.nextUrl.searchParams.get('subtopic')
  const page = parseInt(req.nextUrl.searchParams.get('page') || '1')
  const pageSize = parseInt(req.nextUrl.searchParams.get('pageSize') || '20')

  if (!topicId) {
    return NextResponse.json(
      { error: 'topicId is required' },
      { status: 400 }
    )
  }

  if (page < 1 || pageSize < 1) {
    return NextResponse.json(
      { error: 'page and pageSize must be greater than 0' },
      { status: 400 }
    )
  }

  try {
    // Get total count for MCQ questions
    let mcqCountQuery = supabase
      .from('mcq_questions')
      .select('*', { count: 'exact', head: true })
      .eq('topic_id', parseInt(topicId))

    if (subtopic) {
      mcqCountQuery = mcqCountQuery.eq('subtopic', subtopic)
    }

    const { count: mcqCount, error: mcqCountError } = await mcqCountQuery

    // Get total count for CQ questions
    let cqCountQuery = supabase
      .from('cq_questions')
      .select('*', { count: 'exact', head: true })
      .eq('topic_id', parseInt(topicId))

    if (subtopic) {
      cqCountQuery = cqCountQuery.eq('subtopic', subtopic)
    }

    const { count: cqCount, error: cqCountError } = await cqCountQuery

    const totalCount = (mcqCount || 0) + (cqCount || 0)

    // Calculate offset and limits for MCQ and CQ
    const offset = (page - 1) * pageSize
    const mcqLimit = pageSize
    const mcqOffset = offset

    // Fetch paginated MCQ questions
    let mcqQuery = supabase
      .from('mcq_questions')
      .select('*')
      .eq('topic_id', parseInt(topicId))
      .order('created_at', { ascending: false })
      .range(mcqOffset, mcqOffset + mcqLimit - 1)

    if (subtopic) {
      mcqQuery = mcqQuery.eq('subtopic', subtopic)
    }

    const { data: mcqs, error: mcqError } = await mcqQuery

    // Fetch CQ questions (if needed - if MCQ doesn't fill the page)
    let cqs = []
    if ((mcqs?.length || 0) < pageSize) {
      const cqNeeded = pageSize - (mcqs?.length || 0)
      let cqQuery = supabase
        .from('cq_questions')
        .select('*')
        .eq('topic_id', parseInt(topicId))
        .order('created_at', { ascending: false })
        .range(0, cqNeeded - 1)

      if (subtopic) {
        cqQuery = cqQuery.eq('subtopic', subtopic)
      }

      const { data: cqData, error: cqError } = await cqQuery
      if (cqError) {
        return NextResponse.json(
          { error: cqError.message },
          { status: 500 }
        )
      }
      cqs = cqData || []
    }

    if (mcqError) {
      return NextResponse.json(
        { error: mcqError.message },
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

    const totalPages = Math.ceil(totalCount / pageSize)

    return NextResponse.json({
      questions: allQuestions,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    })
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
