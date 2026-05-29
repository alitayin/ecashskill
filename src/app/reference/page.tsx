import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { referenceCards } from "@/lib/site-content"

export default function ReferencePage() {
  return (
    <main className="container mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12">
      <div className="flex flex-col gap-3">
        <Badge variant="secondary" className="w-fit">
          Reference
        </Badge>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">eCash reference map</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Fast entry points into the maintained skill references. Each page is optimized
            for agent work: install hints, common methods, unit conventions, and pitfalls.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {referenceCards.map((ref) => (
          <Card key={ref.href} className="transition-colors hover:bg-muted/40">
            <CardHeader>
              <div className="mb-2 flex items-center justify-between gap-3">
                <Badge variant="outline">{ref.category}</Badge>
                <ref.icon className="text-muted-foreground" />
              </div>
              <CardTitle>{ref.title}</CardTitle>
              <CardDescription>{ref.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={ref.href} className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                Open reference
                <ArrowRight data-icon="inline-end" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}
