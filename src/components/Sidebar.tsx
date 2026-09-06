'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { TOPICS } from '@/lib/topics'

interface TopicCounts {
  [topicId: number]: { mcq: number; cq: number }
}

interface SidebarProps {
  counts?: TopicCounts
}

// Icon mapping for topics with colors
const TOPIC_ICONS: Record<number, { icon: React.ReactElement; color: string }> = {
  1: { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>, color: '#0ea5e9' },
  2: { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>, color: '#8b5cf6' },
  3: { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>, color: '#ec4899' },
  4: { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>, color: '#f59e0b' },
  5: { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>, color: '#10b981' },
  6: { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5v14a9 3 0 0 0 18 0V5"></path></svg>, color: '#06b6d4' },
  7: { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"></rect><line x1="9" y1="9" x2="15" y2="9"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>, color: '#f97316' },
  8: { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z"></path><path d="m8 12 4-4 4 4"></path></svg>, color: '#6366f1' },
  9: { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.76 9.76 0 0 1-6.74-2.74L3 16"></path><path d="M3 21v-5h5"></path></svg>, color: '#14b8a6' },
  10: { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>, color: '#d946ef' },
  11: { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline><line x1="9" y1="13" x2="15" y2="13"></line><line x1="9" y1="17" x2="15" y2="17"></line></svg>, color: '#06b6d4' },
  12: { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>, color: '#ef4444' },
  13: { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>, color: '#0ea5e9' },
}

export default function Sidebar({ counts = {} }: SidebarProps) {
  const [search, setSearch] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Core')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid')
  const pathname = usePathname()

  const filtered = TOPICS.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  )

  const topicsByCategory = [
    { name: 'Core', ids: [1, 2, 3, 4, 5, 6], icon: '📚' },
    { name: 'Advanced', ids: [7, 8, 9, 10, 11, 12, 13], icon: '🚀' },
  ]

  const coreCount = TOPICS.filter(t => [1, 2, 3, 4, 5, 6].includes(t.id)).reduce((sum, t) => {
    const c = counts[t.id]
    return sum + (c?.mcq || 0) + (c?.cq || 0)
  }, 0)

  const advancedCount = TOPICS.filter(t => [7, 8, 9, 10, 11, 12, 13].includes(t.id)).reduce((sum, t) => {
    const c = counts[t.id]
    return sum + (c?.mcq || 0) + (c?.cq || 0)
  }, 0)

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-branding">
          <div className="brand-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9S3 19.2 3 12 4.8 3 12 3z" />
              <path d="M12 7v5l3 2" />
            </svg>
          </div>
          <div className="brand-text">
            <div className="brand-title">BD Bank Prep</div>
            <div className="brand-subtitle">AD(ICT) Exam</div>
          </div>
        </div>
        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="List view"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
          </button>
          <button
            className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid view"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          </button>
        </div>
      </div>

      <div className="sidebar-search">
        <div className={`search-wrap ${isSearchFocused ? 'focused' : ''}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            placeholder="Search topics…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          {search && (
            <button
              className="search-clear"
              onClick={() => setSearch('')}
              aria-label="Clear search"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <nav className="topic-nav">
        {search ? (
          // Search results view
          <>
            {filtered.length > 0 ? (
              <div className="search-results">
                <div className="results-label">🔍 Search Results</div>
                <div className="results-count">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</div>
                {filtered.map((topic) => {
                  const isActive = pathname === `/topics/${topic.id}`
                  const count = counts[topic.id]
                  const iconData = TOPIC_ICONS[topic.id]
                  return (
                    <Link
                      key={topic.id}
                      href={`/topics/${topic.id}`}
                      className={`topic-link ${isActive ? 'active' : ''}`}
                    >
                      <span className="topic-icon" style={{ '--icon-color': iconData.color } as React.CSSProperties}>
                        {iconData.icon}
                      </span>
                      <span className="topic-name">{topic.name}</span>
                      <div className="topic-pills">
                        {count?.mcq ? <span className="pill pill-mcq">{count.mcq}</span> : null}
                        {count?.cq ? <span className="pill pill-cq">{count.cq}</span> : null}
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="no-results">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p>No topics found</p>
              </div>
            )}
          </>
        ) : (
          // Normal categorized view
          <>
            {topicsByCategory.map((category) => {
              const categoryTopics = TOPICS.filter((t) => category.ids.includes(t.id))
              const isExpanded = expandedCategory === category.name
              const catCount = category.name === 'Core' ? coreCount : advancedCount
              return (
                <div key={category.name} className="topic-category">
                  <button
                    className="category-header"
                    onClick={() => setExpandedCategory(isExpanded ? null : category.name)}
                  >
                    <span className="category-icon">{category.icon}</span>
                    <span className="category-name">{category.name}</span>
                    <span className="category-count">{categoryTopics.length}</span>
                    <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </span>
                  </button>
                  {isExpanded && (
                    <div className={`category-items ${viewMode}`}>
                      {categoryTopics.map((topic) => {
                        const isActive = pathname === `/topics/${topic.id}`
                        const count = counts[topic.id]
                        const iconData = TOPIC_ICONS[topic.id]
                        return (
                          <Link
                            key={topic.id}
                            href={`/topics/${topic.id}`}
                            className={`topic-link ${viewMode} ${isActive ? 'active' : ''}`}
                          >
                            <span className="topic-icon" style={{ '--icon-color': iconData.color } as React.CSSProperties}>
                              {iconData.icon}
                            </span>
                            {viewMode === 'list' && (
                              <>
                                <span className="topic-name">{topic.name}</span>
                                <div className="topic-pills">
                                  {count?.mcq ? <span className="pill pill-mcq">{count.mcq}</span> : null}
                                  {count?.cq ? <span className="pill pill-cq">{count.cq}</span> : null}
                                </div>
                              </>
                            )}
                            {viewMode === 'grid' && (
                              <div className="topic-card-content">
                                <div className="topic-title">{topic.name}</div>
                                <div className="topic-meta">
                                  {count?.mcq ? <span className="meta-item mcq">M:{count.mcq}</span> : null}
                                  {count?.cq ? <span className="meta-item cq">C:{count.cq}</span> : null}
                                </div>
                              </div>
                            )}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="footer-stats">
          <div className="stat">
            <div className="stat-value">{TOPICS.length}</div>
            <div className="stat-label">Topics</div>
          </div>
          <div className="stat">
            <div className="stat-value">{Object.values(counts).reduce((sum, c) => sum + (c.mcq || 0), 0)}</div>
            <div className="stat-label">MCQs</div>
          </div>
          <div className="stat">
            <div className="stat-value">{Object.values(counts).reduce((sum, c) => sum + (c.cq || 0), 0)}</div>
            <div className="stat-label">CQs</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .sidebar {
          width: 320px;
          flex-shrink: 0;
          background: linear-gradient(180deg, #1e1b4b 0%, #312e81 50%, #1e3a8a 100%);
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          flex-direction: column;
          height: calc(100vh - 60px);
          overflow: hidden;
          color: white;
          position: relative;
        }

        .sidebar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .sidebar-header {
          padding: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .sidebar-branding {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .view-toggle {
          display: flex;
          gap: 4px;
          background: rgba(255, 255, 255, 0.08);
          padding: 4px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .toggle-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border: none;
          background: transparent;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.2s;
          font-family: inherit;
        }

        .toggle-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.8);
        }

        .toggle-btn.active {
          background: linear-gradient(135deg, rgba(96, 165, 250, 0.3), rgba(59, 130, 246, 0.2));
          color: white;
          border: 1px solid rgba(96, 165, 250, 0.4);
        }

        .brand-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #60a5fa, #3b82f6);
          border-radius: var(--radius-lg);
          color: white;
          flex-shrink: 0;
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
        }

        .brand-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .brand-title {
          font-size: 14px;
          font-weight: 800;
          color: white;
          letter-spacing: -0.02em;
        }

        .brand-subtitle {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 600;
          letter-spacing: 0.03em;
        }

        .sidebar-search {
          padding: 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.03);
          position: relative;
          z-index: 1;
        }

        .search-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255, 255, 255, 0.1);
          border: 1.5px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-lg);
          padding: 10px 14px;
          color: rgba(255, 255, 255, 0.7);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          backdrop-filter: blur(10px);
        }

        .search-wrap:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .search-wrap.focused {
          border-color: rgba(96, 165, 250, 0.8);
          background: rgba(255, 255, 255, 0.2);
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2), inset 0 0 0 1px rgba(96, 165, 250, 0.3);
        }

        .search-wrap input {
          border: none;
          outline: none;
          background: none;
          font-size: 13px;
          color: white;
          width: 100%;
          font-family: inherit;
          font-weight: 500;
        }

        .search-wrap input::placeholder {
          color: rgba(255, 255, 255, 0.6);
          font-weight: 400;
        }

        .search-clear {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border: none;
          background: none;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .search-clear:hover {
          background: rgba(96, 165, 250, 0.2);
          color: white;
        }

        .topic-nav {
          flex: 1;
          overflow-y: auto;
          padding: 12px;
          position: relative;
          z-index: 1;
        }

        .topic-nav::-webkit-scrollbar {
          width: 6px;
        }

        .topic-nav::-webkit-scrollbar-track {
          background: transparent;
        }

        .topic-nav::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }

        .topic-nav::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.4);
        }

        .search-results {
          padding-top: 4px;
        }

        .results-label {
          font-size: 11px;
          font-weight: 800;
          color: white;
          padding: 10px 14px 4px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 2px;
        }

        .results-count {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          padding: 0 14px 10px;
          margin-bottom: 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .no-results {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 40px 20px;
          color: rgba(255, 255, 255, 0.6);
          text-align: center;
        }

        .no-results svg {
          opacity: 0.4;
          color: rgba(255, 255, 255, 0.5);
        }

        .no-results p {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
        }

        .topic-category {
          margin-bottom: 8px;
        }

        .category-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
          color: white;
          font-weight: 700;
          font-size: 13px;
          width: 100%;
          text-align: left;
          margin-bottom: 8px;
          position: relative;
          overflow: hidden;
        }

        .category-header::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(96, 165, 250, 0.1) 0%, transparent 100%);
          opacity: 0;
          transition: opacity 0.2s;
        }

        .category-header:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .category-header:hover::before {
          opacity: 1;
        }

        .category-icon {
          font-size: 16px;
          width: 24px;
          text-align: center;
        }

        .category-name {
          flex: 1;
          position: relative;
          z-index: 1;
        }

        .category-count {
          font-size: 11px;
          background: rgba(96, 165, 250, 0.3);
          color: rgba(255, 255, 255, 0.9);
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 700;
          position: relative;
          z-index: 1;
        }

        .expand-icon {
          display: flex;
          align-items: center;
          transition: transform 0.2s;
          color: rgba(255, 255, 255, 0.7);
          position: relative;
          z-index: 1;
        }

        .expand-icon.expanded {
          transform: rotate(180deg);
        }

        .category-items {
          margin-bottom: 8px;
          animation: slideDown 0.2s ease-out;
        }

        .category-items.list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding-left: 8px;
        }

        .category-items.grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 6px;
          padding: 0 2px;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .topic-link.grid {
          display: grid;
          grid-template-columns: 26px 1fr;
          grid-template-rows: auto auto;
          gap: 8px 10px;
          padding: 10px 10px;
          text-align: left;
          background: linear-gradient(135deg, rgba(96, 165, 250, 0.12), rgba(59, 130, 246, 0.06));
          border: 1.5px solid rgba(96, 165, 250, 0.25);
          align-items: flex-start;
        }

        .topic-link.grid:hover {
          background: linear-gradient(135deg, rgba(96, 165, 250, 0.2), rgba(59, 130, 246, 0.12));
          border-color: rgba(96, 165, 250, 0.45);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
        }

        .topic-link.grid.active {
          background: linear-gradient(135deg, rgba(96, 165, 250, 0.35), rgba(59, 130, 246, 0.25));
          border-color: rgba(96, 165, 250, 0.6);
          box-shadow: 0 0 16px rgba(59, 130, 246, 0.3), inset 0 0 0 1px rgba(96, 165, 250, 0.3);
        }

        .topic-link.grid .topic-icon {
          grid-column: 1;
          grid-row: 1 / 3;
          width: 26px;
          height: 26px;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .topic-card-content {
          grid-column: 2;
          grid-row: 1 / 3;
          display: flex;
          flex-direction: column;
          gap: 4px;
          width: 100%;
          min-width: 0;
        }

        .topic-title {
          font-size: 12px;
          font-weight: 700;
          color: white;
          line-height: 1.3;
          word-wrap: break-word;
          overflow-wrap: break-word;
          letter-spacing: -0.01em;
          width: 100%;
        }

        .topic-meta {
          display: flex;
          gap: 3px;
          font-size: 9px;
          font-weight: 600;
          flex-wrap: wrap;
        }

        .meta-item {
          padding: 1px 4px;
          border-radius: 3px;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }

        .meta-item.mcq {
          background: rgba(96, 165, 250, 0.3);
          color: rgba(255, 255, 255, 0.9);
        }

        .meta-item.cq {
          background: rgba(167, 139, 250, 0.3);
          color: rgba(255, 255, 255, 0.9);
        }

        .topic-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 12px;
          border-radius: var(--radius-lg);
          text-decoration: none;
          color: rgba(255, 255, 255, 0.85);
          font-size: 13px;
          font-weight: 600;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .topic-link::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: transparent;
          border-radius: 0 3px 3px 0;
          transition: all 0.2s;
        }

        .topic-link:hover {
          background: rgba(96, 165, 250, 0.15);
          color: white;
          border: 1px solid rgba(96, 165, 250, 0.3);
          transform: translateX(2px);
        }

        .topic-link:hover .topic-icon {
          transform: scale(1.15) rotate(3deg);
        }

        .topic-link.active {
          background: linear-gradient(135deg, rgba(96, 165, 250, 0.3), rgba(59, 130, 246, 0.2));
          color: white;
          border: 1px solid rgba(96, 165, 250, 0.5);
          box-shadow: inset 0 0 0 1px rgba(96, 165, 250, 0.3);
        }

        .topic-link.active::before {
          background: linear-gradient(180deg, #60a5fa, #3b82f6);
        }

        .topic-link.active .topic-icon {
          transform: scale(1.2);
        }

        .topic-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          color: var(--icon-color, #60a5fa);
          flex-shrink: 0;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .topic-link:hover .topic-icon {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .topic-name {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          letter-spacing: -0.01em;
        }

        .topic-pills {
          display: flex;
          gap: 5px;
          flex-shrink: 0;
        }

        .pill {
          font-size: 10px;
          padding: 3px 7px;
          border-radius: 5px;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
          min-width: 22px;
          text-align: center;
          letter-spacing: 0.02em;
        }

        .pill-mcq {
          background: rgba(96, 165, 250, 0.3);
          color: rgba(255, 255, 255, 0.9);
        }

        .pill-cq {
          background: rgba(167, 139, 250, 0.3);
          color: rgba(255, 255, 255, 0.9);
        }

        .sidebar-footer {
          padding: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          position: relative;
          z-index: 1;
        }

        .footer-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .stat {
          text-align: center;
          padding: 10px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-md);
          transition: all 0.2s;
        }

        .stat:hover {
          background: rgba(96, 165, 250, 0.15);
          border-color: rgba(96, 165, 250, 0.3);
        }

        .stat-value {
          font-size: 16px;
          font-weight: 800;
          color: white;
          margin-bottom: 2px;
        }

        .stat-label {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .sidebar {
            width: 280px;
          }

          .brand-text {
            display: none;
          }

          .brand-icon {
            width: 36px;
            height: 36px;
          }

          .view-toggle {
            display: none;
          }

          .topic-pills {
            display: none;
          }

          .category-count {
            display: none;
          }

          .category-items.grid {
            grid-template-columns: 1fr;
            gap: 6px;
          }

          .topic-link.grid {
            padding: 9px 8px;
          }

          .topic-title {
            font-size: 11px;
          }

          .sidebar-footer {
            padding: 12px;
          }

          .footer-stats {
            gap: 8px;
          }

          .stat {
            padding: 8px;
          }

          .stat-value {
            font-size: 14px;
          }

          .stat-label {
            font-size: 9px;
          }
        }

        @media (max-width: 640px) {
          .sidebar {
            width: 100%;
            height: auto;
            max-height: 400px;
            border-right: none;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }

          .sidebar-header {
            padding: 12px;
          }

          .sidebar-search {
            padding: 10px;
          }

          .search-wrap {
            padding: 8px 10px;
          }

          .topic-link.list {
            padding: 9px 10px;
            font-size: 12px;
          }

          .topic-link.grid {
            min-height: 80px;
            padding: 10px 6px;
          }

          .topic-icon {
            width: 24px;
            height: 24px;
          }

          .category-header {
            padding: 10px 12px;
            font-size: 12px;
          }

          .category-items.grid {
            grid-template-columns: 1fr;
            gap: 6px;
          }

          .topic-link.grid {
            padding: 8px 8px;
            gap: 8px;
          }

          .topic-name {
            font-size: 12px;
          }

          .topic-title {
            font-size: 11px;
          }

          .topic-icon {
            width: 22px;
            height: 22px;
          }

          .meta-item {
            font-size: 8px;
            padding: 1px 4px;
          }
        }
      `}</style>
    </aside>
  )
}
