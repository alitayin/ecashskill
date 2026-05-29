import { marked } from "marked"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight, Download, File, Folder } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getBreadcrumbs, getDirectoryContents, getFileContent } from "@/lib/navigation"

interface PageProps {
  params: Promise<{ path?: string[] }>
}

function isFilePath(relativePath: string) {
  return relativePath.endsWith(".md") || relativePath.includes(".")
}

function BreadcrumbNav({ relativePath }: { relativePath: string }) {
  const breadcrumbs = getBreadcrumbs(relativePath)

  return (
    <nav className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
      <Link href="/skills" className="font-medium transition-colors hover:text-foreground">
        skills
      </Link>
      {breadcrumbs.slice(1).map((crumb) => (
        <span key={crumb.path} className="flex items-center gap-1">
          <ChevronRight className="text-muted-foreground/60" />
          <Link href={`/skills/${crumb.path}`} className="transition-colors hover:text-foreground">
            {crumb.name}
          </Link>
        </span>
      ))}
    </nav>
  )
}

export default async function SkillsPathPage({ params }: PageProps) {
  const { path } = await params
  const relativePath = path ? path.join("/") : ""

  if (relativePath && isFilePath(relativePath)) {
    const file = getFileContent(relativePath)
    if (!file) return notFound()

    const filename = relativePath.split("/").pop() || "document"
    const parentPath = relativePath.slice(0, relativePath.lastIndexOf("/"))
    const html = marked.parse(file.content)

    return (
      <main className="container mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8">
        <div className="flex flex-col gap-4 rounded-lg border bg-card p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <BreadcrumbNav relativePath={parentPath} />
            <Button size="sm" variant="outline" render={<a href={`/skills/${relativePath}`} download={filename} />}>
              <Download data-icon="inline-start" />
              Download
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            <Badge variant="secondary" className="w-fit">
              Markdown
            </Badge>
            <h1 className="text-3xl font-semibold tracking-tight">{filename}</h1>
          </div>
        </div>

        <article className="prose max-w-none rounded-lg border bg-card p-5">
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </article>
      </main>
    )
  }

  const items = getDirectoryContents(relativePath)
  if (relativePath && items.length === 0) return notFound()

  const title = relativePath ? relativePath.split("/").pop() : "eCash Skills"

  return (
    <main className="container mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8">
      <div className="flex flex-col gap-4 rounded-lg border bg-card p-4">
        <BreadcrumbNav relativePath={relativePath} />
        <div className="flex flex-col gap-2">
          <Badge variant="secondary" className="w-fit">
            Directory
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contents</CardTitle>
          <CardDescription>Skill files are served directly from the plugin package.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {items.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">Empty directory</div>
          ) : (
            <ul className="divide-y">
              {items.map((item) => (
                <li key={item.path}>
                  <Link
                    href={`/skills/${item.path}`}
                    className="flex items-center gap-3 p-4 transition-colors hover:bg-muted/60"
                  >
                    {item.type === "directory" ? (
                      <Folder className="text-primary" />
                    ) : (
                      <File className="text-muted-foreground" />
                    )}
                    <span className="min-w-0 flex-1 truncate">
                      <span className={item.type === "directory" ? "font-medium" : ""}>{item.name}</span>
                    </span>
                    <Badge variant="outline">{item.type}</Badge>
                    {item.type === "directory" && <ChevronRight className="text-muted-foreground" />}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
