# Database Setup & Usage Guide

## Overview
Your app now fetches all data from Supabase instead of hardcoded values. Topics, MCQ questions, and CQ questions are all stored in Supabase.

## API Endpoints Created

### 1. **Fetch Topics**
```
GET /api/topics
```
Returns all topics with their subtopics.

**Response:**
```json
{
  "topics": [
    {
      "id": 1,
      "name": "C Programming",
      "icon": "code",
      "subtopics": ["Basic structure", "Data types", ...]
    }
  ]
}
```

### 2. **Fetch Questions by Topic**
```
GET /api/questions?topicId=1&subtopic=Optional
```
Fetches all MCQ and CQ questions for a topic, optionally filtered by subtopic.

**Query Parameters:**
- `topicId` (required): Topic ID
- `subtopic` (optional): Filter by specific subtopic

**Response:**
```json
{
  "questions": [
    {
      "id": "uuid",
      "topicId": 1,
      "type": "mcq",
      "question": "Question text",
      "optionA": "Option A",
      "optionB": "Option B",
      "optionC": "Option C",
      "optionD": "Option D",
      "correct": "a",
      "subtopic": "Data types",
      "explanation": "Explanation",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### 3. **Add Questions (Bulk)**
```
POST /api/questions
```
Add multiple MCQ/CQ questions to a topic.

**Request Body:**
```json
{
  "topicId": 1,
  "questions": [
    {
      "type": "mcq",
      "question": "Question text",
      "optionA": "Option A",
      "optionB": "Option B",
      "optionC": "Option C",
      "optionD": "Option D",
      "correct": "a",
      "subtopic": "Data types",
      "explanation": "Explanation"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "inserted": 1
}
```

### 4. **Delete Question**
```
DELETE /api/questions/{id}
```
Delete a question by ID.

**Response:**
```json
{
  "success": true
}
```

## React Hooks

### useTopics()
Fetches all topics from Supabase.

```typescript
import { useTopics } from '@/lib/useTopics'

export function MyComponent() {
  const { topics, loading, error } = useTopics()
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return (
    <ul>
      {topics.map(topic => (
        <li key={topic.id}>{topic.name}</li>
      ))}
    </ul>
  )
}
```

### useQuestions(topicId, subtopic?)
Fetches questions for a specific topic.

```typescript
import { useQuestions } from '@/lib/useQuestions'

export function TopicPage() {
  const { 
    questions, 
    loading, 
    error,
    addMCQ,
    addCQ,
    addBulk,
    deleteQuestion,
    refetch 
  } = useQuestions(1, 'Data types')
  
  const handleAddQuestion = async (q) => {
    const { error } = await addMCQ(q)
    if (!error) console.log('Added!')
  }
  
  const handleDelete = async (id) => {
    const { error } = await deleteQuestion(id)
    if (!error) console.log('Deleted!')
  }
  
  return (
    // Your component
  )
}
```

## Database Tables

### topics
- `id` (int, PK): Topic ID
- `name` (text): Topic name
- `icon` (text): Icon identifier
- `subtopics` (text[]): Array of subtopic names
- `created_at` (timestamp): Creation date

### mcq_questions
- `id` (uuid, PK): Question ID
- `topic_id` (int, FK): Reference to topics
- `type` (varchar): Always 'mcq'
- `question` (text): Question text
- `option_a` (text): Option A
- `option_b` (text): Option B
- `option_c` (text): Option C
- `option_d` (text): Option D
- `correct` (varchar): Correct answer (a/b/c/d)
- `subtopic` (varchar): Subtopic name
- `explanation` (text): Explanation
- `created_at` (timestamp): Creation date

### cq_questions
- `id` (uuid, PK): Question ID
- `topic_id` (int, FK): Reference to topics
- `type` (varchar): Always 'cq'
- `stem` (text): Question stem/passage
- `parts` (jsonb): Array of {q: string, ans: string}
- `subtopic` (varchar): Subtopic name
- `created_at` (timestamp): Creation date

## Adding Topics to Database

Run this SQL in Supabase SQL Editor:

```sql
INSERT INTO topics (id, name, icon, subtopics) VALUES
(1, 'C Programming', 'code', ARRAY['Basic structure of C program', 'Data types, variables and constants', ...]),
(2, 'OOP', 'layers', ARRAY['Class and object', 'Abstraction', ...]),
-- ... more topics
```

## Image Extraction

The `/api/extract` endpoint requires Anthropic API key. To enable:

1. Add to `.env.local`:
   ```
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```

2. The UI will automatically use it to extract questions from images.

## Testing

Check database connection:
```
GET /api/test-db
```

Should show:
```json
{
  "environment": {
    "supabaseUrl": "✅ Set",
    "supabaseKey": "✅ Set"
  },
  "tests": {
    "topics": "✅ Found X record(s)",
    "mcqQuestions": "✅ Found X record(s)",
    "cqQuestions": "✅ Found X record(s)"
  }
}
```
