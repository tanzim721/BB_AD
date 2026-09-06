import { Topic } from '@/types'

// Keep a fallback but fetch from API in components
export const TOPICS: Topic[] = []

export async function fetchTopicsFromDB(): Promise<Topic[]> {
  try {
    const res = await fetch('/api/topics')
    if (!res.ok) throw new Error('Failed to fetch topics')
    const data = await res.json()
    return data.topics || []
  } catch (err) {
    console.error('Error fetching topics:', err)
    return []
  }
}
