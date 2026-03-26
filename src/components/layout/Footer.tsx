import { ExternalLink } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t mt-16 bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© 2026 ecashskill. Built with Next.js.</p>
          <nav className="flex gap-4 text-sm text-muted-foreground">
            <a
              href="https://github.com/alitayin/ecashskill"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              GitHub
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
