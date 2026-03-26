import Link from "next/link"
import { BookOpen, Code, FolderOpen, FileText } from "lucide-react"

export function Header() {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:text-primary transition-colors">
          <BookOpen className="w-6 h-6" />
          ecashskill
        </Link>
        <nav className="flex gap-1">
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-md hover:bg-muted transition-colors"
          >
            <FolderOpen className="w-4 h-4" />
            Guides
          </Link>
          <Link
            href="/reference"
            className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-md hover:bg-muted transition-colors"
          >
            <FileText className="w-4 h-4" />
            Reference
          </Link>
          <Link
            href="/skills"
            className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Code className="w-4 h-4" />
            Skills
          </Link>
        </nav>
      </div>
    </header>
  )
}
