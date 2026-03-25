import { notFound } from "next/navigation"
import Link from "next/link"
import { File, Folder, Download, ChevronRight } from "lucide-react"
import { getDirectoryContents, getFileContent, getBreadcrumbs } from "@/lib/navigation"
import { Button } from "@/components/ui/button"
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
      <div className="min-h-screen bg-white">
        <div className="border-b">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <nav className="flex items-center gap-1 text-sm text-muted-foreground">
                <Link href="/skills" className="hover:text-foreground">ecash</Link>
                {breadcrumbs.slice(1).map((crumb) => (
                  <span key={crumb.path} className="flex items-center">
                    <ChevronRight className="w-4 h-4 mx-1" />
                    <span className="font-medium">{crumb.name}</span>
                  </span>
                ))}
              </nav>
            </div>
            <a href={`/skills/ecash/${relativePath}`} download={filename}>
              <Button size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </a>
          </div>
        </div>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <h1 className="text-3xl font-bold mb-6">{filename}</h1>
          <article className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: marked.parse(file.content) }} />
          </article>
        </main>
      </div>
    )
  }

  // It's a directory, show contents
  // If path starts with ecash/, strip it since skillsRoot already points to ecash/
  const adjustedPath = relativePath.startsWith("ecash/") || relativePath === "ecash"
    ? relativePath.replace(/^ecash\/?/, "")
    : relativePath
  const items = getDirectoryContents(adjustedPath || "")
  const breadcrumbs = getBreadcrumbs(relativePath)

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b">
        <div className="container mx-auto px-4 py-3">
          {breadcrumbs.length > 1 && (
            <nav className="flex items-center gap-1 text-sm text-muted-foreground">
              <span className="font-medium">ecash</span>
              {breadcrumbs.slice(1).map((crumb) => (
                <span key={crumb.path} className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <Link
                    href={`/skills/${crumb.path}`}
                    className="hover:text-foreground"
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
        <h1 className="text-2xl font-bold mb-6">
          {relativePath ? relativePath.split("/").pop() : "eCash Skills"}
        </h1>

        <div className="bg-muted/50 rounded-lg border">
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
                    {item.type === "directory" && (
                      <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}
