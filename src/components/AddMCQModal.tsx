'use client'

import { useState } from 'react'
import { Topic, MCQuestion } from '@/types'

interface AddMCQModalProps {
  topic: Topic
  preselectedSubtopic?: string
  onSave: (q: Omit<MCQuestion, 'id' | 'createdAt'>) => Promise<void>
  onClose: () => void
}

export default function AddMCQModal({ topic, preselectedSubtopic = '', onSave, onClose }: AddMCQModalProps) {
  const [subtopic, setSubtopic] = useState(preselectedSubtopic)
  const [question, setQuestion] = useState('')
  const [optionA, setOptionA] = useState('')
  const [optionB, setOptionB] = useState('')
  const [optionC, setOptionC] = useState('')
  const [optionD, setOptionD] = useState('')
  const [correct, setCorrect] = useState<'a' | 'b' | 'c' | 'd' | ''>('')
  const [explanation, setExplanation] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!question.trim()) e.question = 'Enter the question.'
    if (!optionA.trim() || !optionB.trim() || !optionC.trim() || !optionD.trim()) e.options = 'Fill in all four options.'
    if (!correct) e.correct = 'Select the correct answer.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    await onSave({
      topicId: topic.id,
      type: 'mcq',
      question: question.trim(),
      optionA: optionA.trim(),
      optionB: optionB.trim(),
      optionC: optionC.trim(),
      optionD: optionD.trim(),
      correct: correct as 'a' | 'b' | 'c' | 'd',
      subtopic,
      explanation: explanation.trim(),
    })
    setSaving(false)
  }

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>Add MCQ</h2>
          <span className="topic-chip">{topic.name}</span>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="field">
            <label>Subtopic</label>
            <select value={subtopic} onChange={(e) => setSubtopic(e.target.value)}>
              <option value="">General</option>
              {topic.subtopics.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Question *</label>
            <textarea
              rows={2}
              placeholder="Enter your question here"
              value={question}
              onChange={(e) => { setQuestion(e.target.value); setErrors((p) => ({ ...p, question: '' })) }}
            />
            {errors.question && <span className="err">{errors.question}</span>}
          </div>

          <div className="opts-grid">
            {(['A', 'B', 'C', 'D'] as const).map((lbl) => {
              const val = lbl.toLowerCase() as 'a' | 'b' | 'c' | 'd'
              const setters = { A: setOptionA, B: setOptionB, C: setOptionC, D: setOptionD }
              const vals = { A: optionA, B: optionB, C: optionC, D: optionD }
              return (
                <div key={lbl} className="opt-field">
                  <span className={`opt-lbl ${correct === val ? 'correct' : ''}`}>{lbl}</span>
                  <input
                    placeholder={`Option ${lbl}`}
                    value={vals[lbl]}
                    onChange={(e) => { setters[lbl](e.target.value); setErrors((p) => ({ ...p, options: '' })) }}
                  />
                </div>
              )
            })}
          </div>
          {errors.options && <span className="err">{errors.options}</span>}

          <div className="field">
            <label>Correct answer *</label>
            <select
              value={correct}
              onChange={(e) => { setCorrect(e.target.value as 'a' | 'b' | 'c' | 'd'); setErrors((p) => ({ ...p, correct: '' })) }}
            >
              <option value="">Select correct answer</option>
              {(['A', 'B', 'C', 'D'] as const).map((l) => (
                <option key={l} value={l.toLowerCase()}>Option {l}</option>
              ))}
            </select>
            {errors.correct && <span className="err">{errors.correct}</span>}
          </div>

          <div className="field">
            <label>Explanation (optional)</label>
            <input
              placeholder="Brief explanation of the answer"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save MCQ'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          padding: 16px;
          backdrop-filter: blur(4px);
        }

        .modal {
          background: var(--surface-elevated);
          border-radius: var(--radius-xl);
          width: 100%;
          max-width: 520px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-xl);
          border: 1px solid var(--border-light);
        }

        .modal-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px 24px;
          border-bottom: 1px solid var(--border-light);
        }

        .modal-header h2 {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .topic-chip {
          font-size: 11px;
          background: var(--accent-light);
          color: var(--accent-primary);
          padding: 3px 10px;
          border-radius: var(--radius-sm);
          font-weight: 600;
        }

        .close-btn {
          margin-left: auto;
          padding: 6px;
          border: none;
          background: none;
          cursor: pointer;
          color: var(--text-tertiary);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          transition: all 0.2s;
        }

        .close-btn:hover {
          color: var(--text-secondary);
          background: var(--surface-overlay);
        }

        .modal-body {
          padding: 20px 24px;
          overflow-y: auto;
          flex: 1;
        }

        .field {
          margin-bottom: 14px;
        }

        .field label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: var(--text-secondary);
          margin-bottom: 6px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .field input,
        .field textarea,
        .field select {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          font-size: 13px;
          color: var(--text-primary);
          background: var(--surface-overlay);
          font-family: inherit;
          outline: none;
          resize: none;
          transition: all 0.2s;
        }

        .field input::placeholder,
        .field textarea::placeholder {
          color: var(--text-tertiary);
        }

        .field input:focus,
        .field textarea:focus,
        .field select:focus {
          border-color: var(--accent-primary);
          background: var(--surface-elevated);
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
        }

        .opts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 6px;
        }

        .opt-field {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .opt-lbl {
          font-size: 12px;
          font-weight: 700;
          min-width: 16px;
          color: var(--text-tertiary);
          transition: color 0.15s;
        }

        .opt-lbl.correct {
          color: var(--accent-primary);
        }

        .opt-field input {
          width: 100%;
          padding: 9px 11px;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          font-size: 13px;
          color: var(--text-primary);
          background: var(--surface-overlay);
          font-family: inherit;
          outline: none;
          transition: all 0.2s;
        }

        .opt-field input:focus {
          border-color: var(--accent-primary);
          background: var(--surface-elevated);
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
        }

        .err {
          font-size: 12px;
          color: #ef4444;
          margin-top: 5px;
          display: block;
          font-weight: 500;
        }

        .modal-footer {
          padding: 16px 24px;
          border-top: 1px solid var(--border-light);
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }

        .btn-cancel {
          padding: 10px 18px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-light);
          background: none;
          font-size: 13px;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }

        .btn-cancel:hover {
          background: var(--surface-overlay);
          border-color: var(--border-medium);
        }

        .btn-save {
          padding: 10px 20px;
          border-radius: var(--radius-lg);
          border: none;
          background: var(--accent-primary);
          font-size: 13px;
          font-weight: 600;
          color: white;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
        }

        .btn-save:hover:not(:disabled) {
          background: var(--accent-secondary);
          box-shadow: 0 6px 16px rgba(14, 165, 233, 0.4);
          transform: translateY(-1px);
        }

        .btn-save:active:not(:disabled) {
          transform: translateY(0);
        }

        .btn-save:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  )
}
