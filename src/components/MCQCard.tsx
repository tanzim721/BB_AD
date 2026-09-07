'use client'

import { MCQuestion } from '@/types'

interface MCQCardProps {
  question: MCQuestion
  onDelete: (id: string) => void
}

const OPTIONS = ['a', 'b', 'c', 'd'] as const
const OPTION_LABELS = { a: 'A', b: 'B', c: 'C', d: 'D' }
const OPTION_KEYS = { a: 'optionA', b: 'optionB', c: 'optionC', d: 'optionD' } as const

export default function MCQCard({ question, onDelete }: MCQCardProps) {
  return (
    <div className="q-card">
      <div className="card-top">
        <span className="type-badge mcq-badge">MCQ</span>
        {question.subtopic && (
          <span className="subtopic-tag">{question.subtopic}</span>
        )}
      </div>

      <p className="q-text">{question.question}</p>

      <div className="options-grid">
        {OPTIONS.map((opt) => (
          <div
            key={opt}
            className={`option ${question.correct === opt ? 'correct' : ''}`}
          >
            <span className="opt-label">{OPTION_LABELS[opt]}</span>
            <span className="opt-text">{question[OPTION_KEYS[opt]]}</span>
            {question.correct === opt && (
              <svg className="check-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
        ))}
      </div>

      {question.explanation && (
        <div className="explanation">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {question.explanation}
        </div>
      )}

      <style jsx>{`
        .q-card {
          background: var(--surface-elevated);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 18px;
          margin-bottom: 12px;
          box-shadow: var(--shadow-sm);
          transition: all 0.2s;
        }

        .q-card:hover {
          border-color: var(--accent-primary);
          box-shadow: var(--shadow-md);
        }

        .card-top {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .type-badge {
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: var(--radius-sm);
          letter-spacing: 0.05em;
        }

        .mcq-badge {
          background: var(--accent-light);
          color: var(--accent-primary);
        }

        .subtopic-tag {
          font-size: 12px;
          color: var(--text-secondary);
          background: var(--surface-overlay);
          border: 1px solid var(--border-light);
          padding: 3px 10px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 240px;
          font-weight: 500;
        }

        .q-text {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.7;
          margin-bottom: 18px;
          letter-spacing: -0.01em;
        }

        .options-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 16px;
        }

        .option {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 14px;
          border-radius: var(--radius-md);
          border: 1.5px solid var(--border-light);
          font-size: 14px;
          color: var(--text-secondary);
          background: var(--surface-overlay);
          transition: all 0.2s;
          line-height: 1.6;
        }

        .option.correct {
          background: var(--accent-light);
          border-color: var(--accent-primary);
          color: var(--accent-primary);
        }

        .opt-label {
          font-size: 12px;
          font-weight: 800;
          min-width: 20px;
          color: var(--text-secondary);
          font-variant-numeric: tabular-nums;
          background: rgba(0, 0, 0, 0.05);
          padding: 2px 6px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .option.correct .opt-label {
          color: white;
          background: var(--accent-primary);
        }

        .opt-text {
          flex: 1;
          font-weight: 500;
        }

        .check-icon {
          margin-left: auto;
          color: var(--accent-primary);
          flex-shrink: 0;
        }

        .explanation {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 13px;
          color: var(--text-secondary);
          background: var(--accent-secondary-light);
          border: 1.5px solid var(--accent-secondary-color);
          border-radius: var(--radius-md);
          padding: 12px 14px;
          line-height: 1.7;
          font-weight: 500;
        }

        .explanation svg {
          margin-top: 3px;
          flex-shrink: 0;
          color: var(--accent-secondary-color);
          width: 14px;
          height: 14px;
        }
      `}</style>
    </div>
  )
}
