import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!id) {
    return NextResponse.json(
      { error: 'Question ID is required' },
      { status: 400 }
    )
  }

  try {
    // Try to delete from MCQ table first
    const { error: mcqError } = await supabase
      .from('mcq_questions')
      .delete()
      .eq('id', id)

    if (!mcqError) {
      return NextResponse.json({ success: true })
    }

    // If not found in MCQ, try CQ table
    const { error: cqError } = await supabase
      .from('cq_questions')
      .delete()
      .eq('id', id)

    if (cqError) {
      return NextResponse.json(
        { error: 'Failed to delete question' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    )
  }
}
