import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('🔍 Debug: Testing Supabase connection...')
    console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...')

    // Test 1: Try to fetch from topics
    console.log('🧪 Test 1: Fetching from topics table...')
    const { data, error, status, statusText } = await supabase
      .from('topics')
      .select('*')

    console.log('Response status:', status, statusText)
    console.log('Error:', error)
    console.log('Data:', data)
    console.log('Data length:', data?.length)

    // Test 2: Try raw query
    console.log('🧪 Test 2: Checking table structure...')
    const { data: tables, error: tablesError } = await supabase
      .from('topics')
      .select('id, name')
      .limit(1)

    console.log('Tables error:', tablesError)
    console.log('Tables data:', tables)

    return NextResponse.json(
      {
        message: 'Debug info below',
        connection: {
          url: process.env.NEXT_PUBLIC_SUPABASE_URL,
          keySet: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        },
        topicsTest: {
          status,
          statusText,
          error: error?.message,
          dataLength: data?.length,
          firstRecord: data?.[0],
        },
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('❌ Error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    )
  }
}
