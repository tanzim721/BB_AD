'use client'

import Link from 'next/link'
import { TOPICS } from '@/lib/topics'

export default function Home() {
  return (
    <div className="home">
      <div className="hero">
        <div className="hero-label">Bangladesh Bank AD(ICT) Exam</div>
        <h1 className="hero-title">Your question bank,<br />organized by topic</h1>
        <p className="hero-desc">
          Add MCQs and CQs manually, or upload a photo of any textbook page or question paper — Claude AI extracts the questions automatically.
        </p>
        <Link href={`/topics/1`} className="hero-cta">Start with C Programming →</Link>
      </div>

      <div className="topics-grid">
        {TOPICS.map((topic) => (
          <Link key={topic.id} href={`/topics/${topic.id}`} className="topic-card">
            <div className="card-num">{String(topic.id).padStart(2, '0')}</div>
            <div className="card-name">{topic.name}</div>
            <div className="card-sub">{topic.subtopics.length} subtopics</div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .home {
          padding: 48px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .hero {
          margin-bottom: 64px;
        }

        .hero-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--accent-primary);
          margin-bottom: 12px;
        }

        .hero-title {
          font-size: 42px;
          font-weight: 800;
          line-height: 1.1;
          color: var(--text-primary);
          margin-bottom: 16px;
          letter-spacing: -0.02em;
          text-wrap: balance;
        }

        .hero-desc {
          font-size: 16px;
          line-height: 1.7;
          color: var(--text-secondary);
          max-width: 520px;
          margin-bottom: 32px;
        }

        .hero-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 28px;
          background: var(--accent-primary);
          color: white;
          border: none;
          border-radius: var(--radius-lg);
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
          gap: 8px;
        }

        .hero-cta:hover {
          background: var(--accent-secondary);
          box-shadow: 0 8px 16px rgba(14, 165, 233, 0.4);
          transform: translateY(-1px);
        }

        .hero-cta:active {
          transform: translateY(0);
        }

        .topics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
        }

        .topic-card {
          display: flex;
          flex-direction: column;
          padding: 20px;
          background: var(--surface-elevated);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          text-decoration: none;
          color: inherit;
          box-shadow: var(--shadow-sm);
          transition: all 0.2s ease-in-out;
        }

        .topic-card:hover {
          border-color: var(--accent-primary);
          background: var(--surface-overlay);
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }

        .card-num {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-tertiary);
          margin-bottom: 8px;
          font-variant-numeric: tabular-nums;
          letter-spacing: 0.05em;
        }

        .card-name {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
          line-height: 1.4;
        }

        .card-sub {
          font-size: 13px;
          color: var(--text-tertiary);
          margin-top: auto;
        }
      `}</style>
    </div>
  )
}
