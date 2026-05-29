import Link from "next/link"
import { BookOpen, Code, Library } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="border-b bg-background/85 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold transition-colors hover:text-primary">
          <BookOpen />
          ecashskill
        </Link>
        <nav className="flex items-center gap-1">
          <Button variant="ghost" render={<Link href="/reference" />}>
            <Library data-icon="inline-start" />
            Reference
          </Button>
          <Button render={<Link href="/skills" />}>
            <Code data-icon="inline-start" />
            Skills
          </Button>
        </nav>
      </div>
    </header>
  )
}
