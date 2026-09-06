import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, mediaType, prompt } = await req.json()

    if (!imageBase64 || !prompt) {
      return NextResponse.json({ error: 'Missing image or prompt' }, { status: 400 })
    }

    // Check if Anthropic API key is set
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({
        error: 'Anthropic API key not configured. Please set ANTHROPIC_API_KEY in environment variables.'
      }, { status: 500 })
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType || 'image/jpeg',
                  data: imageBase64,
                },
              },
              { type: 'text', text: prompt },
            ],
          },
        ],
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Anthropic API error:', data)
      return NextResponse.json({ error: 'AI extraction failed' }, { status: 500 })
    }

    const rawText = data.content?.find((b: { type: string }) => b.type === 'text')?.text || '[]'
    const clean = rawText.replace(/```json|```/g, '').trim()

    let questions = []
    try {
      questions = JSON.parse(clean)
    } catch {
      console.error('JSON parse error, raw:', clean)
      return NextResponse.json({ error: 'Failed to parse extracted questions' }, { status: 500 })
    }

    return NextResponse.json({ questions })
  } catch (err) {
    console.error('Extract route error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
