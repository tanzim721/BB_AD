'use client'

import { useState, use, useEffect } from 'react'
import { useTopics } from '@/lib/useTopics'
import { useQuestions } from '@/lib/useQuestions'
import MCQCard from '@/components/MCQCard'
import CQCard from '@/components/CQCard'
import AddMCQModal from '@/components/AddMCQModal'
import AddCQModal from '@/components/AddCQModal'
import UploadModal from '@/components/UploadModal'
import { MCQuestion, CQuestion, Topic } from '@/types'
import { notFound } from 'next/navigation'

type Tab = 'overview' | 'mcq' | 'cq'

export default function TopicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const topicId = parseInt(id)

  // Call all hooks at the top, before any conditional logic
  const { topics, loading: topicsLoading, error: topicsError } = useTopics()
  const { questions, loading, addMCQ, addCQ, addBulk, deleteQuestion } = useQuestions(topicId)

  const [topic, setTopic] = useState<Topic | null>(null)
  const [topicLoaded, setTopicLoaded] = useState(false)
  const [tab, setTab] = useState<Tab>('overview')
  const [modal, setModal] = useState<'none' | 'mcq' | 'cq' | 'upload'>('none')
  const [preselectedSub, setPreselectedSub] = useState('')

  useEffect(() => {
    // Only try to find topic after topics are loaded
    if (!topicsLoading && topics && topics.length > 0) {
      const found = topics.find((t) => t.id === topicId)
      setTopic(found || null)
      setTopicLoaded(true) // Mark as loaded regardless of whether found
    }
  }, [topics, topicId, topicsLoading])

  // Show loading while topics are being fetched
  if (topicsLoading) {
    return <div className="page"><div className="loading">Loading topic data…</div></div>
  }

  // Show error if topics failed to load
  if (topicsError) {
    return <div className="page"><div className="error">Error: {topicsError}</div></div>
  }

  // Show notFound after topics are loaded but topic not found
  if (topicLoaded && !topic) {
    return notFound()
  }

  // Still waiting for topics to load
  if (!topicLoaded || !topic) {
    return <div className="page"><div className="loading">Loading…</div></div>
  }

  const mcqs = questions.filter((q) => q.type === 'mcq') as MCQuestion[]
  const cqs = questions.filter((q) => q.type === 'cq') as CQuestion[]

  const openMCQForSub = (sub: string) => {
    setPreselectedSub(sub)
    setModal('mcq')
  }

  const handleAddMCQ = async (q: Omit<MCQuestion, 'id' | 'createdAt'>) => {
    await addMCQ(q)
    setModal('none')
    setTab('mcq')
  }

  const handleAddCQ = async (q: Omit<CQuestion, 'id' | 'createdAt'>) => {
    await addCQ(q)
    setModal('none')
    setTab('cq')
  }

  const handleImport = async (qs: Omit<MCQuestion | CQuestion, 'id' | 'createdAt'>[]) => {
    await addBulk(qs)
    setModal('none')
    const hasMCQ = qs.some((q) => q.type === 'mcq')
    setTab(hasMCQ ? 'mcq' : 'cq')
  }

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <h1 className="topic-title">{topic.name}</h1>
          <span className="sub-count">{topic.subtopics.length} subtopics</span>
        </div>
        <div className="header-actions">
          <button className="btn btn-upload" onClick={() => setModal('upload')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            Upload image
          </button>
          <button className="btn btn-cq" onClick={() => setModal('cq')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add CQ
          </button>
          <button className="btn btn-mcq" onClick={() => { setPreselectedSub(''); setModal('mcq') }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add MCQ
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {(['overview', 'mcq', 'cq'] as Tab[]).map((t) => (
          <button
            key={t}
            className={`tab ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'overview' ? 'Overview' : t === 'mcq' ? `MCQ (${mcqs.length})` : `CQ (${cqs.length})`}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="content">
        {loading && <div className="loading">Loading questions…</div>}

        {!loading && tab === 'overview' && (
          <div className="overview">
            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-val">{topic.subtopics.length}</div>
                <div className="stat-lbl">Subtopics</div>
              </div>
              <div className="stat-card">
                <div className="stat-val">{mcqs.length}</div>
                <div className="stat-lbl">MCQ added</div>
              </div>
              <div className="stat-card">
                <div className="stat-val">{cqs.length}</div>
                <div className="stat-lbl">CQ added</div>
              </div>
            </div>

            <p className="section-label">Subtopics — tap to add an MCQ</p>
            <div className="chip-grid">
              {topic.subtopics.map((s) => (
                <button key={s} className="chip" onClick={() => openMCQForSub(s)}>
                  {s}
                </button>
              ))}
            </div>
            <p className="hint">Tap a subtopic to pre-fill it in the MCQ form, or use the buttons above.</p>
          </div>
        )}

        {!loading && tab === 'mcq' && (
          <div className="question-list">
            {!mcqs.length ? (
              <div className="empty">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p>No MCQs yet. Add one manually or upload an image.</p>
              </div>
            ) : (
              mcqs.map((q, idx) => <MCQCard key={q.id} question={q} onDelete={deleteQuestion} questionNumber={idx + 1} totalQuestions={mcqs.length} />)
            )}
          </div>
        )}

        {!loading && tab === 'cq' && (
          <div className="question-list">
            {!cqs.length ? (
              <div className="empty">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                <p>No CQs yet. Use the &quot;Add CQ&quot; button above.</p>
              </div>
            ) : (
              cqs.map((q, idx) => <CQCard key={q.id} question={q} onDelete={deleteQuestion} questionNumber={idx + 1} totalQuestions={cqs.length} />)
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {modal === 'mcq' && (
        <AddMCQModal
          topic={topic}
          preselectedSubtopic={preselectedSub}
          onSave={handleAddMCQ}
          onClose={() => setModal('none')}
        />
      )}
      {modal === 'cq' && (
        <AddCQModal
          topic={topic}
          onSave={handleAddCQ}
          onClose={() => setModal('none')}
        />
      )}
      {modal === 'upload' && (
        <UploadModal
          topic={topic}
          onImport={handleImport}
          onClose={() => setModal('none')}
        />
      )}

      <style jsx>{`
        .page {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .page-header {
          padding: 28px 32px 20px;
          border-bottom: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
          background: var(--surface-elevated);
        }

        .header-left {
          display: flex;
          align-items: baseline;
          gap: 14px;
        }

        .topic-title {
          font-size: 32px;
          font-weight: 900;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }

        .sub-count {
          font-size: 14px;
          color: var(--text-secondary);
          font-weight: 600;
          background: var(--accent-light);
          padding: 4px 10px;
          border-radius: 6px;
        }

        .header-actions {
          margin-left: auto;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 11px 18px;
          border-radius: var(--radius-lg);
          border: none;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
          letter-spacing: -0.01em;
        }

        .btn:hover {
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        .btn:active {
          transform: translateY(0);
        }

        .btn-upload {
          background: #dbeafe;
          color: #0284c7;
        }

        .btn-upload:hover {
          background: #bfdbfe;
        }

        .btn-cq {
          background: #dcfce7;
          color: #15803d;
        }

        .btn-cq:hover {
          background: #bbf7d0;
        }

        .btn-mcq {
          background: var(--accent-primary);
          color: white;
          box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
        }

        .btn-mcq:hover {
          background: var(--accent-secondary);
          box-shadow: 0 6px 16px rgba(14, 165, 233, 0.4);
        }

        .tabs {
          display: flex;
          padding: 0 32px;
          border-bottom: 1px solid var(--border-light);
          background: var(--surface-elevated);
          gap: 4px;
        }

        .tab {
          padding: 14px 18px;
          font-size: 14px;
          font-weight: 700;
          color: var(--text-secondary);
          border: none;
          background: none;
          cursor: pointer;
          border-bottom: 3px solid transparent;
          margin-bottom: -1px;
          font-family: inherit;
          transition: all 0.2s;
          letter-spacing: -0.01em;
        }

        .tab:hover {
          color: var(--text-primary);
        }

        .tab.active {
          color: var(--accent-primary);
          border-bottom-color: var(--accent-primary);
        }

        .content {
          flex: 1;
          overflow-y: auto;
          padding: 32px;
          background: var(--bg-secondary);
        }

        .loading {
          color: var(--text-tertiary);
          font-size: 14px;
          padding: 60px 0;
          text-align: center;
        }

        .overview {
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 16px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: var(--surface-elevated);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 20px;
          box-shadow: var(--shadow-sm);
          transition: all 0.2s;
        }

        .stat-card:hover {
          border-color: var(--accent-primary);
          box-shadow: var(--shadow-md);
        }

        .stat-val {
          font-size: 36px;
          font-weight: 900;
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.02em;
        }

        .stat-lbl {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-secondary);
          margin-top: 10px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .section-label {
          font-size: 13px;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .chip-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 16px;
        }

        .chip {
          padding: 10px 16px;
          border-radius: 20px;
          background: var(--surface-overlay);
          border: 1.5px solid var(--border-light);
          font-size: 14px;
          font-weight: 700;
          color: var(--text-secondary);
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
          letter-spacing: -0.01em;
        }

        .chip:hover {
          background: var(--accent-light);
          border-color: var(--accent-primary);
          color: var(--accent-primary);
        }

        .chip:active {
          transform: scale(0.98);
        }

        .hint {
          font-size: 13px;
          color: var(--text-secondary);
          margin-top: 14px;
          line-height: 1.6;
          font-weight: 500;
        }

        .question-list {
        }

        .empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 80px 20px;
          color: var(--text-tertiary);
          text-align: center;
        }

        .empty svg {
          color: var(--text-tertiary);
          opacity: 0.5;
        }

        .empty p {
          font-size: 15px;
          color: var(--text-secondary);
          max-width: 320px;
          line-height: 1.7;
          font-weight: 500;
        }

        /* Mobile Responsive Design */
        @media (max-width: 768px) {
          .page-header {
            padding: 20px 16px;
            flex-direction: column;
            align-items: flex-start;
            gap: 14px;
          }

          .header-left {
            width: 100%;
            flex-direction: column;
            gap: 8px;
          }

          .topic-title {
            font-size: 24px;
          }

          .header-actions {
            width: 100%;
            margin-left: 0;
            flex-direction: row;
            justify-content: space-between;
            gap: 8px;
          }

          .btn {
            padding: 10px 14px;
            font-size: 13px;
            flex: 1;
            min-width: 100px;
          }
        }

        @media (max-width: 640px) {
          .page {
            padding: 0;
            display: flex;
            flex-direction: column;
            height: 100%;
          }

          .page-header {
            padding: 14px 12px;
            gap: 10px;
            border-radius: 0;
            flex-direction: column;
            align-items: stretch;
            background: var(--surface-elevated);
            border-bottom: 2px solid var(--border-light);
          }

          .header-left {
            width: 100%;
            gap: 8px;
          }

          .topic-title {
            font-size: 18px;
            font-weight: 900;
            margin: 0;
          }

          .sub-count {
            font-size: 11px;
            padding: 2px 6px;
            width: fit-content;
          }

          .header-actions {
            width: 100%;
            flex-direction: row;
            gap: 6px;
            margin-left: 0;
          }

          .btn {
            padding: 10px 12px;
            font-size: 12px;
            flex: 1;
            justify-content: center;
            border-radius: 8px;
          }

          .btn svg {
            width: 14px;
            height: 14px;
          }

          .tabs {
            padding: 0 12px;
            gap: 0;
            border-bottom: 2px solid var(--border-light);
            background: var(--surface-elevated);
          }

          .tab {
            padding: 12px 0;
            font-size: 11px;
            flex: 1;
            text-align: center;
            border-radius: 0;
            margin-bottom: 0;
            border-bottom: 3px solid transparent;
          }

          .tab.active {
            border-bottom-color: #0284c7;
            color: #0284c7;
          }

          .content {
            padding: 12px;
            flex: 1;
            overflow-y: auto;
          }

          .stats-row {
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            margin-bottom: 16px;
          }

          .stat-card {
            padding: 12px 10px;
            text-align: center;
            border-radius: 8px;
          }

          .stat-val {
            font-size: 22px;
          }

          .stat-lbl {
            font-size: 10px;
          }

          .section-label {
            font-size: 11px;
            margin-bottom: 10px;
          }

          .chip {
            padding: 8px 12px;
            font-size: 12px;
            flex: 0 1 auto;
          }

          .chip-grid {
            gap: 6px;
            margin-bottom: 10px;
          }

          .hint {
            font-size: 11px;
            margin-top: 8px;
          }

          .overview {
            padding: 0;
          }

          .empty {
            padding: 40px 16px;
          }

          .empty svg {
            width: 32px;
            height: 32px;
          }

          .empty p {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  )
}
