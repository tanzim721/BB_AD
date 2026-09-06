'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Header() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [searchFocused, setSearchFocused] = useState(false)

  return (
    <header className="app-header">
      <div className="header-top">
        <div className="header-container">
          <div className="header-left">
            <div className="logo-section">
              <div className="logo-badge">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9S3 19.2 3 12 4.8 3 12 3z" />
                  <path d="M12 7v5l3 2" />
                </svg>
              </div>
              <div className="logo-text">
                <div className="logo-title">BD Bank Prep</div>
                <div className="logo-subtitle">AD(ICT) Exam</div>
              </div>
            </div>
          </div>

          <div className="header-center">
            {!isHome && (
              <div className="breadcrumb">
                <a href="/">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  Dashboard
                </a>
                <span className="separator">•</span>
                <span className="current">Topics</span>
              </div>
            )}
            {isHome && (
              <div className="header-title">
                <span className="title-icon">📚</span>
                Question Bank
              </div>
            )}
          </div>

          <div className="header-right">
            <div className={`search-bar ${searchFocused ? 'focused' : ''}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder="Search topics..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>

            <div className="header-actions">
              <button className="header-icon-btn" title="Notifications">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                <span className="badge">3</span>
              </button>
              <button className="header-icon-btn" title="Help">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
              </button>
              <button className="header-icon-btn" title="Settings">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="header-stats">
        <div className="stat-item">
          <div className="stat-label">Topics</div>
          <div className="stat-value">13</div>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <div className="stat-label">MCQs</div>
          <div className="stat-value">156</div>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <div className="stat-label">CQs</div>
          <div className="stat-value">48</div>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <div className="stat-label">Completion</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '65%' }}></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .app-header {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-bottom: 1px solid var(--border-light);
          position: sticky;
          top: 0;
          z-index: 40;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .header-top {
          padding: 14px 0;
          border-bottom: 1px solid var(--border-light);
        }

        .header-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .header-left {
          display: flex;
          align-items: center;
          min-width: 0;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 14px;
          background: white;
          border-radius: var(--radius-lg);
          border: 1.5px solid var(--border-light);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .logo-section:hover {
          border-color: var(--accent-primary);
          background: var(--accent-light);
          box-shadow: 0 4px 12px rgba(14, 165, 233, 0.15);
        }

        .logo-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #0ea5e9, #06b6d4);
          border-radius: var(--radius-md);
          color: white;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
        }

        .logo-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .logo-title {
          font-size: 14px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }

        .logo-subtitle {
          font-size: 11px;
          color: var(--text-tertiary);
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .header-center {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 0;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .breadcrumb a {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--accent-primary);
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s;
          padding: 4px 8px;
          border-radius: 6px;
        }

        .breadcrumb a:hover {
          background: var(--accent-light);
          color: var(--accent-secondary);
        }

        .separator {
          color: var(--text-tertiary);
          font-weight: 300;
        }

        .current {
          color: var(--text-secondary);
          font-weight: 700;
          background: var(--accent-light);
          padding: 4px 10px;
          border-radius: 6px;
        }

        .header-title {
          font-size: 16px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.02em;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .title-icon {
          font-size: 20px;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .search-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 14px;
          background: white;
          border: 1.5px solid var(--border-light);
          border-radius: var(--radius-lg);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          color: var(--text-tertiary);
          min-width: 200px;
        }

        .search-bar:hover {
          border-color: var(--border-medium);
        }

        .search-bar.focused {
          border-color: var(--accent-primary);
          box-shadow: 0 4px 12px rgba(14, 165, 233, 0.15);
          color: var(--text-secondary);
        }

        .search-bar input {
          border: none;
          background: none;
          outline: none;
          font-size: 13px;
          color: var(--text-primary);
          width: 100%;
          font-family: inherit;
          font-weight: 500;
        }

        .search-bar input::placeholder {
          color: var(--text-tertiary);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .header-icon-btn {
          position: relative;
          width: 38px;
          height: 38px;
          border-radius: var(--radius-lg);
          border: 1.5px solid var(--border-light);
          background: white;
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: inherit;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .header-icon-btn:hover {
          background: var(--accent-light);
          border-color: var(--accent-primary);
          color: var(--accent-primary);
          box-shadow: 0 4px 12px rgba(14, 165, 233, 0.15);
        }

        .header-icon-btn:active {
          transform: scale(0.95);
        }

        .badge {
          position: absolute;
          top: -6px;
          right: -6px;
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          border-radius: 50%;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(239, 68, 68, 0.3);
        }

        .header-stats {
          display: flex;
          align-items: center;
          gap: 0;
          padding: 12px 24px;
          background: linear-gradient(90deg, rgba(14, 165, 233, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%);
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
        }

        .stat-label {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .stat-value {
          font-size: 16px;
          font-weight: 800;
          color: var(--accent-primary);
          font-variant-numeric: tabular-nums;
        }

        .stat-divider {
          width: 1px;
          height: 24px;
          background: var(--border-light);
        }

        .progress-bar {
          width: 80px;
          height: 6px;
          background: var(--border-light);
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #0ea5e9, #06b6d4);
          border-radius: 3px;
          transition: width 0.3s ease-out;
        }

        @media (max-width: 1024px) {
          .search-bar {
            min-width: 160px;
          }

          .header-stats {
            padding: 10px 16px;
          }

          .stat-item {
            padding: 4px 12px;
          }
        }

        @media (max-width: 768px) {
          .header-container {
            gap: 10px;
            padding: 0 16px;
          }

          .header-center {
            display: none;
          }

          .logo-text {
            display: none;
          }

          .logo-badge {
            width: 32px;
            height: 32px;
          }

          .search-bar {
            display: none;
          }

          .header-right {
            gap: 6px;
          }

          .header-icon-btn {
            width: 34px;
            height: 34px;
          }

          .header-stats {
            padding: 8px 16px;
            font-size: 12px;
            gap: 8px;
            flex-wrap: wrap;
          }

          .stat-item {
            padding: 4px 8px;
          }

          .stat-divider {
            display: none;
          }

          .stat-label {
            font-size: 10px;
          }

          .stat-value {
            font-size: 14px;
          }

          .progress-bar {
            width: 60px;
          }
        }

        @media (max-width: 640px) {
          .header-top {
            padding: 10px 0;
          }

          .header-container {
            gap: 8px;
            padding: 0 12px;
          }

          .logo-section {
            padding: 6px 10px;
          }

          .logo-title {
            font-size: 12px;
          }

          .header-actions {
            gap: 4px;
          }

          .header-icon-btn {
            width: 32px;
            height: 32px;
            font-size: 14px;
          }

          .badge {
            top: -8px;
            right: -8px;
            width: 18px;
            height: 18px;
            font-size: 9px;
          }

          .header-stats {
            padding: 8px 12px;
          }

          .stat-item {
            padding: 2px 6px;
          }

          .stat-value {
            font-size: 13px;
          }
        }
      `}</style>
    </header>
  )
}
