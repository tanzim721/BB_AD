'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { useSidebar } from '@/lib/SidebarContext'

export default function Header() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [searchFocused, setSearchFocused] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { toggleMobile } = useSidebar()
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setNotificationOpen(false)
        setSettingsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="app-header" ref={headerRef}>
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
                <div className="logo-title">BD  </div>
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
            <button
              className="hamburger-btn"
              onClick={toggleMobile}
              title="Toggle sidebar"
              aria-label="Toggle navigation"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>

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
          font-size: 16px;
          font-weight: 900;
          color: #0284c7;
          letter-spacing: -0.02em;
        }

        .logo-subtitle {
          font-size: 13px;
          color: #0284c7;
          font-weight: 800;
          letter-spacing: 0.06em;
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
          font-size: 14px;
          color: #1f2937;
          font-weight: 700;
        }

        .breadcrumb a {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #0284c7;
          text-decoration: none;
          font-weight: 800;
          transition: all 0.2s;
          padding: 6px 10px;
          border-radius: 6px;
        }

        .breadcrumb a:hover {
          background: #dbeafe;
          color: #0284c7;
        }

        .separator {
          color: #6b7280;
          font-weight: 400;
        }

        .current {
          color: #0284c7;
          font-weight: 900;
          background: #dbeafe;
          padding: 6px 12px;
          border-radius: 6px;
          letter-spacing: -0.01em;
        }

        .header-title {
          font-size: 18px;
          font-weight: 900;
          color: #1f2937;
          letter-spacing: -0.02em;
          display: flex;
          align-items: center;
          gap: 10px;
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

        .hamburger-btn {
          display: none !important;
          width: 38px;
          height: 38px;
          border: 1.5px solid #e5e7eb;
          background: white;
          color: #374151;
          border-radius: 12px;
          cursor: pointer;
          flex-direction: column;
          gap: 4px;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          font-family: inherit;
        }

        .hamburger-btn:hover {
          background: #dbeafe;
          border-color: #0284c7;
          color: #0284c7;
        }

        @media (max-width: 640px) {
          .hamburger-btn {
            display: flex !important;
          }
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
          color: #1f2937;
          width: 100%;
          font-family: inherit;
          font-weight: 600;
        }

        .search-bar input::placeholder {
          color: #6b7280;
          opacity: 1;
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
          border: 1.5px solid #e5e7eb;
          background: white;
          color: #374151;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: inherit;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          font-weight: 700;
        }

        .header-icon-btn:hover {
          background: #dbeafe;
          border-color: #0284c7;
          color: #0284c7;
          box-shadow: 0 4px 12px rgba(2, 132, 199, 0.15);
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
          justify-content: space-around;
          gap: 24px;
          padding: 20px 24px;
          background: linear-gradient(90deg, rgba(14, 165, 233, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%);
          border-top: 2px solid rgba(14, 165, 233, 0.1);
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          flex: 1;
          text-align: center;
          position: relative;
          transition: all 0.2s ease;
        }

        .stat-item:hover {
          transform: translateY(-2px);
        }

        .stat-label {
          font-size: 12px;
          font-weight: 900;
          color: #4b5563;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 900;
          color: #0284c7;
          font-variant-numeric: tabular-nums;
          letter-spacing: -0.02em;
        }

        .stat-divider {
          width: 1px;
          height: 40px;
          background: rgba(14, 165, 233, 0.2);
          display: none;
        }

        .progress-bar {
          width: 100px;
          height: 8px;
          background: rgba(14, 165, 233, 0.15);
          border-radius: 4px;
          overflow: hidden;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #0ea5e9, #06b6d4);
          border-radius: 4px;
          transition: width 0.3s ease-out;
          box-shadow: 0 2px 8px rgba(14, 165, 233, 0.3);
        }

        .notification-container,
        .settings-container {
          position: relative;
        }

        .notification-dropdown,
        .settings-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 8px;
          background: white;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
          z-index: 100;
          min-width: 280px;
          animation: slideDown 0.2s ease-out;
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

        .dropdown-header {
          padding: 12px 16px;
          font-weight: 700;
          font-size: 13px;
          color: var(--text-primary);
          border-bottom: 1px solid var(--border-light);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .notification-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 16px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          cursor: pointer;
          transition: background 0.2s;
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .notification-item:last-child {
          border-bottom: none;
        }

        .notification-item:hover {
          background: rgba(14, 165, 233, 0.05);
        }

        .notification-dot {
          width: 8px;
          height: 8px;
          background: #ef4444;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 4px;
        }

        .dropdown-item {
          display: block;
          width: 100%;
          text-align: left;
          padding: 12px 16px;
          border: none;
          background: none;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          cursor: pointer;
          font-size: 13px;
          color: var(--text-secondary);
          transition: all 0.2s;
          font-family: inherit;
        }

        .dropdown-item:last-child {
          border-bottom: none;
        }

        .dropdown-item:hover {
          background: rgba(14, 165, 233, 0.05);
          color: var(--accent-primary);
          padding-left: 20px;
        }

        .dropdown-divider {
          height: 1px;
          background: var(--border-light);
          margin: 4px 0;
        }

        .header-icon-btn.active {
          background: #dbeafe;
          border-color: #0284c7;
          color: #0284c7;
        }

        @media (max-width: 1024px) {
          .search-bar {
            min-width: 160px;
          }

          .header-stats {
            padding: 16px;
            gap: 16px;
          }

          .stat-item {
            padding: 10px 16px;
          }

          .stat-value {
            font-size: 18px;
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
            padding: 12px 16px;
            gap: 12px;
            flex-wrap: wrap;
            justify-content: space-between;
          }

          .stat-item {
            padding: 8px 12px;
            flex: 0 1 auto;
          }

          .stat-divider {
            display: none;
          }

          .stat-label {
            font-size: 9px;
          }

          .stat-value {
            font-size: 14px;
          }

          .progress-bar {
            width: 70px;
          }

          .notification-dropdown,
          .settings-dropdown {
            right: -50px;
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

          .header-right {
            gap: 6px;
          }

          .hamburger-btn {
            display: flex;
          }

          .search-bar {
            display: none;
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
            padding: 10px 12px;
            gap: 12px;
            justify-content: space-between;
            border-top: none;
          }

          .stat-item {
            padding: 4px 0;
            flex: 1;
            text-align: center;
            gap: 4px;
          }

          .stat-divider {
            display: none !important;
          }

          .stat-value {
            font-size: 14px;
          }

          .stat-label {
            font-size: 9px;
          }

          .progress-bar {
            width: 60px;
            height: 4px;
          }

          .notification-dropdown,
          .settings-dropdown {
            min-width: 250px;
            right: -80px;
          }
        }
      `}</style>
    </header>
  )
}
