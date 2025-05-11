import type React from "react"
export default function BasicAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#344E41] text-white p-4">
        <h1 className="text-xl font-bold">Bladi Admin</h1>
      </header>
      <main className="p-6">{children}</main>
    </div>
  )
}
