import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { referenceCards } from "@/lib/site-content"

const guideGroups = [
  {
    title: "Start with Chronik",
    description: "Query UTXOs, broadcast transactions, and subscribe to chain events.",
    href: "/skills/references/chronik-client.md",
    level: "Core",
  },
  {
    title: "Build and sign transactions",
    description: "Use ecash-lib and wallet references for deterministic XEC and token flows.",
    href: "/skills/references/ecash-lib.md",
    level: "Core",
  },
  {
    title: "Integrate payments",
    description: "Choose PayButton, quicksend, Cashtab Connect, or a wallet-backed custom flow.",
    href: "/reference",
    level: "App",
  },
] as const

export default function GuidesPage() {
  return (
    <main className="container mx-auto flex max-w-5xl flex-col gap-8 px-4 py-12">
      <div className="flex flex-col gap-3">
        <Badge variant="secondary" className="w-fit">
          Guides
        </Badge>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Workflow-oriented reading paths</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            These paths point to maintained reference pages instead of stale placeholder tutorials.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {guideGroups.map((guide) => (
          <Card key={guide.href}>
            <CardHeader>
              <Badge variant="outline" className="w-fit">
                {guide.level}
              </Badge>
              <CardTitle>{guide.title}</CardTitle>
              <CardDescription>{guide.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={guide.href} className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                Read path
                <ArrowRight data-icon="inline-end" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {referenceCards.slice(0, 4).map((ref) => (
          <Link key={ref.href} href={ref.href} className="rounded-lg border bg-card p-4 transition-colors hover:bg-muted/40">
            <span className="flex items-center justify-between gap-3">
              <span className="font-medium">{ref.title}</span>
              <ref.icon className="text-muted-foreground" />
            </span>
            <span className="mt-2 block text-sm leading-6 text-muted-foreground">{ref.description}</span>
          </Link>
        ))}
      </div>
    </main>
  )
}
