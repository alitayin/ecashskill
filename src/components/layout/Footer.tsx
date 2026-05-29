import { ExternalLink } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="mt-16 border-t bg-muted/20">
      <div className="container mx-auto px-4 py-7">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© 2026 ecashskill. Maintained for eCash agent development.</p>
          <nav className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/reference" className="transition-colors hover:text-foreground">
              Reference
            </Link>
            <Link
              href="https://github.com/alitayin/ecashskill"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
            >
              GitHub
              <ExternalLink data-icon="inline-end" />
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
