import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { SidebarProvider } from '@/lib/SidebarContext'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BD Bank AD(ICT) Prep',
  description: 'MCQ and CQ organizer for Bangladesh Bank AD(ICT) exam preparation',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SidebarProvider>
          <div className="app-layout">
            <Header />
            <div className="app-shell">
              <Sidebar />
              <main className="main-content">{children}</main>
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  )
}
