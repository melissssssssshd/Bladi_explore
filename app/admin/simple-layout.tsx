import type React from "react"

interface SimpleAdminLayoutProps {
  children: React.ReactNode
}

export default function SimpleAdminLayout({ children }: SimpleAdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">{children}</div>
    </div>
  )
}
