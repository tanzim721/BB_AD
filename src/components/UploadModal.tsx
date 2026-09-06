'use client'

import { useState, useRef } from 'react'
import { Topic, MCQuestion, CQuestion } from '@/types'

interface UploadModalProps {
  topic: Topic
  onImport: (questions: Omit<MCQuestion | CQuestion, 'id' | 'createdAt'>[]) => Promise<void>
  onClose: () => void
}

type ExtractedMCQ = {
  type: 'mcq'; q: string; a: string; b: string; c: string; d: string; correct: string; exp: string
}
type ExtractedCQ = {
  type: 'cq'; stem: string; parts: { q: string; ans: string }[]
}
type Extracted = ExtractedMCQ | ExtractedCQ

export default function UploadModal({ topic, onImport, onClose }: UploadModalProps) {
  const [uploadType, setUploadType] = useState<'mcq' | 'cq'>('mcq')
  const [subtopic, setSubtopic] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'extracting' | 'done' | 'error'>('idle')
  const [extracted, setExtracted] = useState<Extracted[]>([])
  const [selected, setSelected] = useState<boolean[]>([])
  const [importing, setImporting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    setImageFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setStatus('idle')
    setExtracted([])
    setSelected([])
    setErrorMsg('')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) handleFile(file)
  }

  const toBase64 = (file: File): Promise<string> =>
    new Promise((res, rej) => {
      const r = new FileReader()
      r.onload = () => res((r.result as string).split(',')[1])
      r.onerror = rej
      r.readAsDataURL(file)
    })

  const extract = async () => {
    if (!imageFile) { setErrorMsg('Upload an image first.'); return }
    setStatus('extracting')
    setErrorMsg('')

    try {
      const b64 = await toBase64(imageFile)
      const mediaType = imageFile.type || 'image/jpeg'

      const prompt = uploadType === 'mcq'
        ? `Extract ALL multiple choice questions from this image. Return ONLY a valid JSON array with no markdown fences. Format: [{"type":"mcq","q":"question","a":"option A","b":"option B","c":"option C","d":"option D","correct":"a","exp":"brief explanation"}]. correct must be lowercase a, b, c, or d. Write a short explanation if not shown.`
        : `Extract ALL creative questions (CQ) from this image. Return ONLY a valid JSON array with no markdown fences. Format: [{"type":"cq","stem":"main scenario or passage","parts":[{"q":"part a question","ans":"key answer"},{"q":"part b question","ans":"key answer"},{"q":"part c question","ans":"key answer"},{"q":"part d question","ans":"key answer"}]}]. Fill ans with a short answer if not shown.`

      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: b64, mediaType, prompt }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Extraction failed')

      const items: Extracted[] = data.questions
      if (!items.length) { setErrorMsg('No questions found. Try a clearer image.'); setStatus('idle'); return }

      setExtracted(items)
      setSelected(items.map(() => true))
      setStatus('done')
    } catch {
      setStatus('error')
      setErrorMsg('Could not extract questions. Try a clearer image.')
    }
  }

  const toggleSelect = (idx: number) => {
    setSelected((prev) => prev.map((v, i) => (i === idx ? !v : v)))
  }
  const selectAll = (v: boolean) => setSelected(extracted.map(() => v))

  const handleImport = async () => {
    const toImport = extracted.filter((_, i) => selected[i])
    if (!toImport.length) { setErrorMsg('Select at least one question.'); return }
    setImporting(true)

    const questions = toImport.map((item): Omit<MCQuestion | CQuestion, 'id' | 'createdAt'> => {
      if (item.type === 'mcq') {
        return {
          topicId: topic.id, type: 'mcq',
          question: item.q, optionA: item.a, optionB: item.b, optionC: item.c, optionD: item.d,
          correct: (item.correct?.toLowerCase() || 'a') as 'a' | 'b' | 'c' | 'd',
          subtopic, explanation: item.exp || '',
        }
      } else {
        return {
          topicId: topic.id, type: 'cq',
          stem: item.stem,
          parts: item.parts.map((p) => ({ question: p.q, answer: p.ans })),
          subtopic,
        }
      }
    })

    await onImport(questions)
    setImporting(false)
  }

  const selCount = selected.filter(Boolean).length

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>Upload image</h2>
          <span className="topic-chip">{topic.name}</span>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="type-toggle">
            <button className={`type-btn ${uploadType === 'mcq' ? 'on' : ''}`} onClick={() => setUploadType('mcq')}>MCQ</button>
            <button className={`type-btn ${uploadType === 'cq' ? 'on-cq' : ''}`} onClick={() => setUploadType('cq')}>CQ</button>
          </div>

          <div className="field">
            <label>Subtopic (applied to all imported questions)</label>
            <select value={subtopic} onChange={(e) => setSubtopic(e.target.value)}>
              <option value="">General</option>
              {topic.subtopics.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {!previewUrl ? (
            <div
              className="drop-zone"
              onClick={() => fileRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <p>Click or drag an image here</p>
              <small>JPG, PNG, WEBP — textbook pages, question papers, screenshots</small>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            </div>
          ) : (
            <>
              <div className="preview-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt="Uploaded" className="preview-img" />
                <button className="change-img" onClick={() => { setPreviewUrl(null); setImageFile(null); setStatus('idle'); setExtracted([]); }}>
                  Change image
                </button>
              </div>

              {status === 'extracting' && (
                <div className="ai-status">
                  <div className="spinner" />
                  <span>Claude AI is reading the image…</span>
                </div>
              )}

              {status === 'done' && (
                <>
                  <div className="extracted-header">
                    <span className="extracted-title">Extracted {extracted.length} question{extracted.length !== 1 ? 's' : ''}</span>
                    <button className="link-btn" onClick={() => selectAll(true)}>Select all</button>
                    <button className="link-btn" onClick={() => selectAll(false)}>None</button>
                    <span className="sel-count">{selCount} selected</span>
                  </div>
                  <div className="extracted-list">
                    {extracted.map((item, idx) => (
                      <div key={idx} className={`ex-item ${selected[idx] ? 'sel' : ''}`} onClick={() => toggleSelect(idx)}>
                        <input type="checkbox" checked={selected[idx]} onChange={() => toggleSelect(idx)} onClick={(e) => e.stopPropagation()} />
                        <div className="ex-content">
                          <p className="ex-text">{item.type === 'mcq' ? item.q : item.stem}</p>
                          {item.type === 'mcq' && <p className="ex-ans">Correct: {item.correct?.toUpperCase()} — {item[item.correct as 'a'|'b'|'c'|'d']}</p>}
                          {item.type === 'cq' && <p className="ex-ans">{item.parts?.length || 0} parts</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {errorMsg && <p className="err">{errorMsg}</p>}
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          {previewUrl && status !== 'done' && (
            <button className="btn-extract" onClick={extract} disabled={status === 'extracting'}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              {status === 'extracting' ? 'Extracting…' : 'Extract with AI'}
            </button>
          )}
          {status === 'done' && (
            <button className="btn-import" onClick={handleImport} disabled={importing || selCount === 0}>
              {importing ? 'Importing…' : `Import ${selCount} question${selCount !== 1 ? 's' : ''}`}
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.35);
          display: flex; align-items: center; justify-content: center;
          z-index: 50; padding: 16px;
        }
        .modal {
          background: #fff; border-radius: 12px;
          width: 100%; max-width: 500px; max-height: 90vh;
          display: flex; flex-direction: column;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
        }
        .modal-header {
          display: flex; align-items: center; gap: 10px;
          padding: 16px 20px; border-bottom: 1px solid #e8e8e5;
        }
        .modal-header h2 { font-size: 15px; font-weight: 600; color: #1a1a1a; }
        .topic-chip { font-size: 11px; background: #ede9fe; color: #6d28d9; padding: 2px 8px; border-radius: 5px; }
        .close-btn {
          margin-left: auto; padding: 4px; border: none; background: none;
          cursor: pointer; color: #aaa; border-radius: 5px; display: flex; align-items: center;
        }
        .close-btn:hover { color: #555; background: #f0f0ee; }
        .modal-body { padding: 16px 20px; overflow-y: auto; flex: 1; }
        .type-toggle {
          display: flex; border: 1px solid #e0e0dd; border-radius: 7px;
          overflow: hidden; margin-bottom: 12px;
        }
        .type-btn {
          flex: 1; padding: 7px; font-size: 12.5px; font-weight: 500;
          border: none; background: none; cursor: pointer;
          color: #888; font-family: inherit; transition: all 0.1s;
        }
        .type-btn.on { background: #1a56db; color: #fff; }
        .type-btn.on-cq { background: #16a34a; color: #fff; }
        .field { margin-bottom: 12px; }
        .field label {
          display: block; font-size: 11px; font-weight: 600;
          color: #666; margin-bottom: 4px;
        }
        .field select {
          width: 100%; padding: 8px 10px;
          border: 1px solid #e0e0dd; border-radius: 7px;
          font-size: 13px; color: #1a1a1a; background: #fafaf9;
          font-family: inherit; outline: none;
        }
        .drop-zone {
          border: 2px dashed #d0d0cd; border-radius: 10px;
          padding: 28px 20px; text-align: center; cursor: pointer;
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          color: #aaa; transition: border-color 0.1s, background 0.1s;
        }
        .drop-zone:hover { border-color: #6b8ef5; background: #f5f8ff; color: #6b8ef5; }
        .drop-zone p { font-size: 13px; color: #555; }
        .drop-zone small { font-size: 11px; color: #aaa; }
        .preview-wrap { position: relative; margin-bottom: 12px; }
        .preview-img {
          width: 100%; max-height: 180px; object-fit: contain;
          border-radius: 8px; border: 1px solid #e8e8e5;
        }
        .change-img {
          position: absolute; top: 8px; right: 8px;
          padding: 4px 10px; border-radius: 5px;
          border: 1px solid #e0e0dd; background: #fff;
          font-size: 11px; color: #555; cursor: pointer; font-family: inherit;
        }
        .change-img:hover { background: #f5f5f3; }
        .ai-status {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 8px;
          background: #f3f0ff; border: 1px solid #ddd6fe;
          font-size: 12px; color: #6d28d9; margin-bottom: 10px;
        }
        .spinner {
          width: 14px; height: 14px; border-radius: 50%;
          border: 2px solid #c4b5fd; border-top-color: #6d28d9;
          animation: spin 0.7s linear infinite; flex-shrink: 0;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .extracted-header {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 8px;
        }
        .extracted-title { font-size: 12px; font-weight: 600; color: #333; }
        .link-btn {
          font-size: 11px; color: #1a56db; background: none; border: none;
          cursor: pointer; padding: 0; font-family: inherit;
          text-decoration: underline;
        }
        .sel-count { font-size: 11px; color: #888; margin-left: auto; }
        .extracted-list { display: flex; flex-direction: column; gap: 5px; max-height: 220px; overflow-y: auto; }
        .ex-item {
          display: flex; align-items: flex-start; gap: 8px;
          padding: 8px 10px; border-radius: 7px;
          border: 1px solid #e8e8e5; cursor: pointer; transition: background 0.1s;
        }
        .ex-item:hover { background: #fafaf9; }
        .ex-item.sel { background: #f0f6ff; border-color: #c7d9f8; }
        .ex-item input[type=checkbox] { margin-top: 2px; flex-shrink: 0; }
        .ex-content { flex: 1; min-width: 0; }
        .ex-text { font-size: 12px; color: #1a1a1a; line-height: 1.45; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
        .ex-ans { font-size: 11px; color: #16a34a; margin-top: 2px; }
        .err { font-size: 11px; color: #ef4444; margin-top: 6px; }
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
        .btn-extract {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 16px; border-radius: 7px; border: none;
          background: #6d28d9; color: #fff;
          font-size: 13px; font-weight: 500; cursor: pointer; font-family: inherit;
        }
        .btn-extract:hover:not(:disabled) { background: #5b21b6; }
        .btn-extract:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-import {
          padding: 8px 18px; border-radius: 7px; border: none;
          background: #1a56db; color: #fff;
          font-size: 13px; font-weight: 500; cursor: pointer; font-family: inherit;
        }
        .btn-import:hover:not(:disabled) { background: #1648c4; }
        .btn-import:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </div>
  )
}
