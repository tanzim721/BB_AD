'use client'

import { CQuestion } from '@/types'

interface CQCardProps {
  question: CQuestion
  onDelete: (id: string) => void
}

const PART_LABELS = [
  { label: '(a) Knowledge', marks: 1 },
  { label: '(b) Understanding', marks: 2 },
  { label: '(c) Application', marks: 3 },
  { label: '(d) Higher ability', marks: 4 },
]

export default function CQCard({ question, onDelete }: CQCardProps) {
  return (
    <div className="q-card">
      <div className="card-top">
        <span className="type-badge cq-badge">CQ</span>
        {question.subtopic && (
          <span className="subtopic-tag">{question.subtopic}</span>
        )}
        <button
          className="del-btn"
          onClick={() => onDelete(question.id)}
          aria-label="Delete question"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4h6v2" />
          </svg>
        </button>
      </div>

      <div className="stem-box">
        <p className="stem-label">Stem / Scenario</p>
        <p className="stem-text">{question.stem}</p>
      </div>

      <div className="parts">
        {question.parts.map((part, idx) => (
          <div key={idx} className="part">
            <div className="part-header">
              <span className="part-label">{PART_LABELS[idx]?.label || `Part ${idx + 1}`}</span>
              <span className="marks-badge">{PART_LABELS[idx]?.marks || '?'} mark{(PART_LABELS[idx]?.marks || 0) > 1 ? 's' : ''}</span>
            </div>
            <p className="part-question">{part.question}</p>
            {part.answer && (
              <div className="part-answer">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
                {part.answer}
              </div>
            )}
          </div>
        ))}
      </div>

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
          font-size: 12px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: var(--radius-sm);
          letter-spacing: 0.05em;
        }

        .cq-badge {
          background: var(--accent-secondary-light);
          color: var(--accent-secondary-color);
        }

        .subtopic-tag {
          font-size: 13px;
          color: var(--text-secondary);
          background: var(--surface-overlay);
          border: 1.5px solid var(--border-light);
          padding: 4px 11px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 240px;
          font-weight: 600;
        }

        .del-btn {
          margin-left: auto;
          padding: 6px;
          border: none;
          background: none;
          cursor: pointer;
          color: var(--text-tertiary);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .del-btn:hover {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }

        .stem-box {
          background: var(--surface-overlay);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 12px;
          margin-bottom: 12px;
        }

        .stem-label {
          font-size: 12px;
          font-weight: 800;
          color: var(--text-secondary);
          margin-bottom: 8px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .stem-text {
          font-size: 15px;
          color: var(--text-primary);
          line-height: 1.7;
          font-weight: 600;
        }

        .parts {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .part {
          background: var(--surface-overlay);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 12px;
          transition: all 0.2s;
        }

        .part:hover {
          border-color: var(--accent-primary);
        }

        .part-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }

        .part-label {
          font-size: 13px;
          font-weight: 800;
          color: var(--accent-primary);
          letter-spacing: -0.01em;
        }

        .marks-badge {
          font-size: 12px;
          font-weight: 700;
          background: var(--accent-light);
          color: var(--accent-primary);
          padding: 3px 9px;
          border-radius: var(--radius-sm);
          margin-left: auto;
          font-variant-numeric: tabular-nums;
        }

        .part-question {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.7;
          margin-bottom: 6px;
          font-weight: 500;
        }

        .part-answer {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-top: 10px;
          font-size: 14px;
          color: var(--success);
          background: rgba(16, 185, 129, 0.1);
          border: 1.5px solid rgba(16, 185, 129, 0.3);
          border-radius: var(--radius-sm);
          padding: 10px 12px;
          line-height: 1.6;
          font-weight: 500;
        }

        .part-answer svg {
          margin-top: 2px;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  )
}
