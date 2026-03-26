import Link from "next/link"
import { BookOpen, Code } from "lucide-react"

export function Header() {
  return (
    <header className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:text-primary transition-colors">
          <BookOpen className="w-6 h-6" />
          ecashskill
        </Link>
        <nav className="flex gap-1">
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
