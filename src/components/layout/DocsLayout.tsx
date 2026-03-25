import { Sidebar } from "./Sidebar"

interface DocsLayoutProps {
  children: React.ReactNode
}

export function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 min-w-0">
        <div className="md:pl-0 pl-12">{children}</div>
      </main>
    </div>
  )
}
