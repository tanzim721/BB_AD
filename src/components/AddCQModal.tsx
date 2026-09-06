'use client'

import { useState } from 'react'
import { Topic, CQuestion, CQPart } from '@/types'

interface AddCQModalProps {
  topic: Topic
  onSave: (q: Omit<CQuestion, 'id' | 'createdAt'>) => Promise<void>
  onClose: () => void
}

const PARTS = [
  { label: '(a) Knowledge', marks: 1 },
  { label: '(b) Understanding', marks: 2 },
  { label: '(c) Application', marks: 3 },
  { label: '(d) Higher ability', marks: 4 },
]

export default function AddCQModal({ topic, onSave, onClose }: AddCQModalProps) {
  const [subtopic, setSubtopic] = useState('')
  const [stem, setStem] = useState('')
  const [parts, setParts] = useState<CQPart[]>(PARTS.map(() => ({ question: '', answer: '' })))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const updatePart = (idx: number, field: keyof CQPart, value: string) => {
    setParts((prev) => prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p)))
    setErrors((p) => ({ ...p, parts: '' }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!stem.trim()) e.stem = 'Enter the stem or scenario.'
    if (!parts.some((p) => p.question.trim())) e.parts = 'Add at least one part question.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    await onSave({
      topicId: topic.id,
      type: 'cq',
      stem: stem.trim(),
      parts: parts.filter((p) => p.question.trim()),
      subtopic,
    })
    setSaving(false)
  }

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>Add CQ</h2>
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
            <label>Stem / Scenario *</label>
            <textarea
              rows={3}
              placeholder="Write the main scenario, passage, or context here…"
              value={stem}
              onChange={(e) => { setStem(e.target.value); setErrors((p) => ({ ...p, stem: '' })) }}
            />
            {errors.stem && <span className="err">{errors.stem}</span>}
          </div>

          {PARTS.map((meta, idx) => (
            <div key={idx} className="part-section">
              <div className="part-header">
                <span className="part-label">{meta.label}</span>
                <span className="marks-badge">{meta.marks} mark{meta.marks > 1 ? 's' : ''}</span>
              </div>
              <div className="field" style={{ marginBottom: 6 }}>
                <label>Question</label>
                <input
                  placeholder={`${meta.label} question`}
                  value={parts[idx].question}
                  onChange={(e) => updatePart(idx, 'question', e.target.value)}
                />
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Answer hint (optional)</label>
                <input
                  placeholder="Key answer points"
                  value={parts[idx].answer}
                  onChange={(e) => updatePart(idx, 'answer', e.target.value)}
                />
              </div>
            </div>
          ))}
          {errors.parts && <span className="err">{errors.parts}</span>}
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save btn-cq" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save CQ'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.35);
          display: flex; align-items: center; justify-content: center;
          z-index: 50; padding: 16px;
        }
        .modal {
          background: #fff; border-radius: 12px;
          width: 100%; max-width: 480px; max-height: 90vh;
          display: flex; flex-direction: column;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
        }
        .modal-header {
          display: flex; align-items: center; gap: 10px;
          padding: 16px 20px; border-bottom: 1px solid #e8e8e5;
        }
        .modal-header h2 { font-size: 15px; font-weight: 600; color: #1a1a1a; }
        .topic-chip {
          font-size: 11px; background: #dcfce7; color: #15803d;
          padding: 2px 8px; border-radius: 5px;
        }
        .close-btn {
          margin-left: auto; padding: 4px; border: none; background: none;
          cursor: pointer; color: #aaa; border-radius: 5px;
          display: flex; align-items: center;
        }
        .close-btn:hover { color: #555; background: #f0f0ee; }
        .modal-body { padding: 16px 20px; overflow-y: auto; flex: 1; }
        .field { margin-bottom: 12px; }
        .field label {
          display: block; font-size: 11px; font-weight: 600;
          color: #666; margin-bottom: 4px; letter-spacing: 0.02em;
        }
        .field input, .field textarea, .field select {
          width: 100%; padding: 8px 10px;
          border: 1px solid #e0e0dd; border-radius: 7px;
          font-size: 13px; color: #1a1a1a;
          background: #fafaf9; font-family: inherit;
          outline: none; resize: none; transition: border-color 0.1s;
        }
        .field input:focus, .field textarea:focus, .field select:focus {
          border-color: #22c55e; background: #fff;
        }
        .part-section {
          background: #f8fdf9; border: 1px solid #e2f5e8;
          border-radius: 8px; padding: 12px; margin-bottom: 8px;
        }
        .part-header {
          display: flex; align-items: center; gap: 8px; margin-bottom: 10px;
        }
        .part-label { font-size: 12px; font-weight: 600; color: #15803d; }
        .marks-badge {
          font-size: 10px; background: #dcfce7; color: #15803d;
          padding: 1px 6px; border-radius: 4px; margin-left: auto;
        }
        .err { font-size: 11px; color: #ef4444; margin-top: 3px; display: block; }
        .modal-footer {
          padding: 14px 20px; border-top: 1px solid #e8e8e5;
          display: flex; gap: 8px; justify-content: flex-end;
        }
        .btn-cancel {
          padding: 8px 16px; border-radius: 7px;
          border: 1px solid #e0e0dd; background: none;
          font-size: 13px; color: #555; cursor: pointer; font-family: inherit;
        }
        .btn-cancel:hover { background: #f5f5f3; }
        .btn-save {
          padding: 8px 18px; border-radius: 7px; border: none;
          font-size: 13px; color: #fff; cursor: pointer;
          font-weight: 500; font-family: inherit; transition: background 0.1s;
        }
        .btn-cq { background: #16a34a; }
        .btn-cq:hover:not(:disabled) { background: #15803d; }
        .btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>
    </div>
  )
}
