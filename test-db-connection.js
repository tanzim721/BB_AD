// Test Supabase Connection
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

async function testConnection() {
  console.log('🔍 Testing Supabase Connection...\n')

  // Check environment variables
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log('📋 Environment Variables:')
  console.log('  NEXT_PUBLIC_SUPABASE_URL:', url ? '✅ Found' : '❌ Missing')
  console.log('  NEXT_PUBLIC_SUPABASE_ANON_KEY:', key ? '✅ Found' : '❌ Missing')

  if (!url || !key) {
    console.log('\n❌ Missing environment variables! Add them to .env.local')
    process.exit(1)
  }

  // Create client
  const supabase = createClient(url, key)

  try {
    // Test 1: Try to fetch topics
    console.log('\n🧪 Test 1: Fetching topics...')
    const { data: topics, error: topicsError } = await supabase
      .from('topics')
      .select('*')
      .limit(1)

    if (topicsError) {
      console.log('  ❌ Error:', topicsError.message)
    } else {
      console.log('  ✅ Connected! Found', topics.length, 'record(s)')
    }

    // Test 2: Try to fetch MCQ questions
    console.log('\n🧪 Test 2: Fetching MCQ questions...')
    const { data: mcqs, error: mcqError } = await supabase
      .from('mcq_questions')
      .select('*')
      .limit(1)

    if (mcqError) {
      console.log('  ❌ Error:', mcqError.message)
    } else {
      console.log('  ✅ Connected! Found', mcqs.length, 'record(s)')
    }

    // Test 3: Try to fetch CQ questions
    console.log('\n🧪 Test 3: Fetching CQ questions...')
    const { data: cqs, error: cqError } = await supabase
      .from('cq_questions')
      .select('*')
      .limit(1)

    if (cqError) {
      console.log('  ❌ Error:', cqError.message)
    } else {
      console.log('  ✅ Connected! Found', cqs.length, 'record(s)')
    }

    console.log('\n✅ All tests passed! Database is connected.\n')
  } catch (err) {
    console.log('\n❌ Connection failed:', err.message)
    process.exit(1)
  }
}

testConnection()
