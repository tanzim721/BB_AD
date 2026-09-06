export interface Topic {
  id: number
  name: string
  icon: string
  subtopics: string[]
}

export interface MCQuestion {
  id: string
  topicId: number
  type: 'mcq'
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correct: 'a' | 'b' | 'c' | 'd'
  subtopic: string
  explanation: string
  createdAt: string
}

export interface CQPart {
  question: string
  answer: string
}

export interface CQuestion {
  id: string
  topicId: number
  type: 'cq'
  stem: string
  parts: CQPart[]
  subtopic: string
  createdAt: string
}

export type Question = MCQuestion | CQuestion
