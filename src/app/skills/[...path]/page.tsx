import { notFound } from "next/navigation"
import Link from "next/link"
import { File, Folder, Download, ChevronRight } from "lucide-react"
import { getDirectoryContents, getFileContent, getBreadcrumbs } from "@/lib/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { marked } from "marked"

interface PageProps {
  params: Promise<{ path?: string[] }>
}

export default async function SkillsPage({ params }: PageProps) {
  const { path } = await params
  const relativePath = path ? path.join("/") : ""

  // If it's a file, show content
  if (relativePath && (relativePath.endsWith(".md") || relativePath.includes("."))) {
    const file = getFileContent(relativePath)
    if (!file) return notFound()

    const filename = relativePath.split("/").pop() || ""
    const breadcrumbs = getBreadcrumbs(relativePath.slice(0, relativePath.lastIndexOf("/")))

    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-card">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <nav className="flex items-center gap-1 text-sm text-muted-foreground">
                <Link href="/skills" className="hover:text-foreground transition-colors">skills</Link>
                {breadcrumbs.slice(1).map((crumb) => (
                  <span key={crumb.path} className="flex items-center">
                    <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                    <span className="font-medium text-foreground">{crumb.name}</span>
                  </span>
                ))}
              </nav>
            </div>
            <a href={`/skills/${relativePath}`} download={filename}>
              <Button size="sm" variant="outline">
                <Download className="w-4 h-4 mr-2" data-icon="inline-start" />
                Download
              </Button>
            </a>
          </div>
        </div>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <h1 className="text-3xl font-bold tracking-tight mb-6">{filename}</h1>
          <article className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: marked.parse(file.content) }} />
          </article>
        </main>
      </div>
    )
  }

  // It's a directory, show contents
  const items = getDirectoryContents(relativePath || "")
  const breadcrumbs = getBreadcrumbs(relativePath)

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-3">
          {breadcrumbs.length > 1 && (
            <nav className="flex items-center gap-1 text-sm text-muted-foreground">
              <Link href="/skills" className="hover:text-foreground transition-colors font-medium">skills</Link>
              {breadcrumbs.slice(1).map((crumb) => (
                <span key={crumb.path} className="flex items-center">
                  <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                  <Link
                    href={`/skills/${crumb.path}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {crumb.name}
                  </Link>
                </span>
              ))}
            </nav>
          )}
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl font-bold tracking-tight mb-6">
          {relativePath ? relativePath.split("/").pop() : "eCash Skills"}
        </h1>

        <Card>
          <CardContent className="p-0">
            {items.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">Empty directory</div>
            ) : (
              <ul className="divide-y">
                {items.map((item) => (
                  <li key={item.path}>
                    <Link
                      href={item.type === "directory" ? `/skills/${item.path}` : `/skills/${item.path}`}
                      className="flex items-center gap-3 p-4 hover:bg-muted transition-colors"
                    >
                      {item.type === "directory" ? (
                        <Folder className="w-5 h-5 text-primary" />
                      ) : (
                        <File className="w-5 h-5 text-muted-foreground" />
                      )}
                      <span className={item.type === "directory" ? "font-medium" : ""}>
                        {item.name}
                      </span>
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {item.type}
                      </Badge>
                      {item.type === "directory" && (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
