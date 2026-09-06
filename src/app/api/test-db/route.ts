import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const results: {
    environment: Record<string, string>
    tests: Record<string, string | null>
    error: string | null
  } = {
    environment: {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing',
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
      // anthropicKey: process.env.ANTHROPIC_API_KEY ? '✅ Set' : '❌ Missing',
    },
    tests: {
      topics: null,
      mcqQuestions: null,
      cqQuestions: null,
    },
    error: null,
  }

  try {
    // Test 1: Fetch topics
    const { data: topics, error: topicsError } = await supabase
      .from('topics')
      .select('*')
      .limit(1)

    results.tests.topics = topicsError
      ? `❌ ${topicsError.message}`
      : `✅ Found ${topics?.length || 0} record(s)`

    // Test 2: Fetch MCQ questions
    const { data: mcqs, error: mcqError } = await supabase
      .from('mcq_questions')
      .select('*')
      .limit(1)

    results.tests.mcqQuestions = mcqError
      ? `❌ ${mcqError.message}`
      : `✅ Found ${mcqs?.length || 0} record(s)`

    // Test 3: Fetch CQ questions
    const { data: cqs, error: cqError } = await supabase
      .from('cq_questions')
      .select('*')
      .limit(1)

    results.tests.cqQuestions = cqError
      ? `❌ ${cqError.message}`
      : `✅ Found ${cqs?.length || 0} record(s)`

    return NextResponse.json(results, { status: 200 })
  } catch (error) {
    results.error = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(results, { status: 500 })
  }
}
